NS.XDR = {
    _callbackPrefix: namespace + '.XDR',
    _getUrlLimit: 2000,
    _done: {}, //done callbacks
    _xdPath: null,
    _idCounter:1,
    /**
     *
     * @param {{allowableDomains: Array, xdPath: String}} opts
     */
    init: function(opts){
        this._allowableDomains = opts.allowableDomains;
        this._xdPath = opts.xdPath;
        var _this = this;
        //setup postMessage listener
        var onMessage = function(message){
            var i;
            var acceptable = false;
            for (i=0; i<_this._allowableDomains.length; i++){
                if (message.origin === _this._allowableDomains[i]){
                    acceptable = true;
                    break;
                }
            }
            //this message is safe to process
            if (acceptable){
                var splitIndex = message.data.indexOf('-');
                var callbackParts = message.data.substr(0, splitIndex).split('.');
                var response = message.data.substr(splitIndex+1);

                //get around having eval the callback, more secure this way
                var callback = window; //start out at the window level
                for (i=0; i<callbackParts.length; i++){
                    callback = callback[callbackParts[i]];
                }

                callback && callback(response); //this is the real callback, it looks like this now window.App.XDR._scb
            }
        };

        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('message', onMessage, false);
        } else if (typeof window.attachEvent != 'undefined') {
            window.attachEvent('onmessage', onMessage);
        }
    },
    /**
     *
     * @param {{method: String, url: String, done: Function, params: Object}} opts
     */
    request: function(opts){
        //clean up the params, remove anything that is undefined
        var params = {};
        var k;
        for (k in opts.params){
            if (typeof opts.params[k] != 'undefined'){
                params[k] = opts.params[k];
            }
        }
        if (!opts.method || opts.method.toUpperCase() == 'GET'){
            this._jsonp(opts.url, params, opts.done);
        }else{
            this._iframe(opts.url, params, opts.done);
        }
    },
    _processJsonp: function(scriptTag, callbackId, callback, response){
        callback && callback(response); //call the callback with the data
        scriptTag.parentNode.removeChild(scriptTag); //clean up
        this._cleanUpCB(callbackId);
    },
    _cleanUpCB: function(callbackId){
        delete this._scbs[callbackId];
        delete this._ecbs[callbackId];
    },
    _prepUrl: function(url, params){
        return url + (url.indexOf('?') == -1 ? '?' : '&') + this._encode_params(params);
    },
    _jsonp: function(url, params, success){
        var callbackId = this._guid();
        var jsonpSrc = this._prepUrl(url, params);
        jsonpSrc = this._prepUrl(jsonpSrc, {
            '_transport': 'jsonp',
            '_done': this._callbackPrefix+'._done.'+callbackId
        });

        if (jsonpSrc.length > this._getUrlLimit){ //fallback to POST to iframe
            this._iframe(url, params, success);
        }else{
            var scriptTag = document.createElement('script');
            scriptTag.async = true;
            var _this = this;
            this._done[callbackId] = function(response){
                _this._processJsonp(scriptTag, callbackId, success, response);
            };
            scriptTag.src = jsonpSrc;

            document.getElementsByTagName('head')[0].appendChild(scriptTag);
        }
    },
    _processIframe: function(doc, iframe, callbackId, callback, response, usedActiveX){
        callback && callback(JSON.parse(response)); //parse the response
        iframe.src = "about:blank"; //setting the src to blank again help avoid firefox from showing the resubmit alert window.
        window.setTimeout(function(){
            var iframeContainer = iframe.parentNode;
            iframeContainer.removeChild(iframe);
            //remove the iframe container too
            iframeContainer.parentNode.removeChild(iframeContainer);
            if (usedActiveX){
                delete doc; //free up ActiveXObject in IE6
            }
        }, 1000);
        this._cleanUpCB(callbackId);
    },
    _iframe: function(url, params, doneCB, error){

        var doc, iframe, iframeName = this._guid(), iframeContainer;

        var useActiveX = ("ActiveXObject" in window) && (typeof window.postMessage === "undefined");

        if (useActiveX) {

            // IE: we could just append an iframe element but the click and spinner
            // would make it unbearable. spin up a disconnected browser and use it
            // setting src to javascript:false instead of about blank to prevent https complaining
            doc = new ActiveXObject("htmlfile");
            doc.open();
            doc.write("<html><body><iframe id='iframe' name='" + iframeName + "' src='javascript:false' style='position:absolute;top:-1000px;'></iframe></body></html>");
            doc.close();
            iframe = doc.getElementById('iframe');
            doc.parentWindow[namespace] = window[namespace];
        } else {
            // for nice browsers, this is easy
            doc = document;

            iframeContainer = doc.createElement('div');
            doc.body.appendChild(iframeContainer);

            iframeContainer.innerHTML = '<iframe name="' + iframeName + '" src="javascript:false" style="position:absolute; top:-1000px"></iframe>';
            iframe = iframeContainer.firstChild;
        }

        var callbackId = this._guid();
        var _this = this;
        this._done[callbackId] = function(response){
            _this._processIframe(doc, iframe, callbackId, doneCB, response, useActiveX);
        };

        var form = doc.createElement('form');
        var xdUrl = window.location.protocol+'//'+ window.location.host + (this._xdPath ? this._xdPath : (window.location.pathname + window.location.search + (window.location.search ? '&' : '?') + 'xdrId=' + callbackId));
        form.action = this._prepUrl(url,{'_done': this._callbackPrefix+'._done.'+callbackId,
            '_xdUrl': xdUrl,
            '_transport': 'jsonp'
        });
        form.target = iframeName;
        form.method = 'POST';
        doc.body.appendChild(form);
        this._addFormData(doc, form, params);
        form.submit();

        form.parentNode.removeChild(form);

    },
    _addFormData: function(doc, form, data){
        for (var key in data){
            var input = doc.createElement('input');
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
        };
    },
    /**
     * Encode parameters to a query string.
     *
     * @access private
     * @param   params {Object}  the parameters to encode
     * @param   sep    {String}  the separator string (defaults to '&')
     * @param   encode {Boolean} indicate if the key/value should be URI encoded
     * @return        {String}  the query string
     */
    _encode_params: function(params, sep, encode) {
        sep    = sep === undefined ? '&' : sep;
        encode = encode === false ? function(s) { return s; } : encodeURIComponent;

        var pairs = [];
        for (var key in params) {
            if (params[key] !== null && typeof key != 'undefined') {
                pairs.push(encode(key) + '=' + encode(params[key]));
            }
        };
        return pairs.join(sep);
    },


    /**
     * Generates a weak random ID.
     *
     * @access private
     * @return {String} a random ID
     */
    _guid: function() {
        var guid = 'f' + this._idCounter;
        this._idCounter++;
        return guid;
    }
};