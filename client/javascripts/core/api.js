/**
 *
 * Usage:
 * NS.api('/path', {method: 'post',
 *                 params: {key:value},
 *                 callback: function(response){}
 *                 });
 *
 * @param {String} path the path of the api
 * @param {{method: String, callback: Function, params: Object}} options
 */

NS.api = function(path, options){
    //default the method to get
    var method = (options && options['method']  && options['method'].toLowerCase()) ||  'get';
    var callback = (options && options['callback']) || function(response){
        NS.Logger.info('Calling '+path+' without a callback function');
    };
    var params = (options && options['params']);
    NS.XDR.request({
        url: path,
        method: method,
        params: params,
        done: callback
    });
}

NS['api'] = NS.api;