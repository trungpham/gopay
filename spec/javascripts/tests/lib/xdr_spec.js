describe("lib.xdr", function(){
    beforeEach(function(){
        NS.XDR.init({
            allowableDomains: ['http://localhost:2000']
        })
    });
    it('should make a jsonp get request', function(){
        var data;
        NS.XDR.request({
            method: 'GET',
            url: 'http://localhost:2000/mock/jsonp/get',
            params: {
                key: 'value'
            },
            done: function(_data){
                data = _data;
            }

        });
        waitsFor(function(){
            return data;
        }, 'JSONP did not work');
    });

    it('should make a jsonp post request', function(){
        var data;
        NS.XDR.request({
            method: 'POST',
            url: 'http://localhost:2000/mock/jsonp/post',
            params: {
                key: 'value'
            },
            done: function(_data){
                data = _data;
            }

        });
        waitsFor(function(){
            return data;
        }, 'JSONP did not work')
    })
});