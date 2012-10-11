/**
 * Setup the environment
 * @param {{apikey: String}} options
 *
 * Usage:
 *
 * init({apikey: 'ABC123'});
 *
 */
NS.init = function(options){
    this.options = options;
};

//export init
NS['init'] = NS.init;