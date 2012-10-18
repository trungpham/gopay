NS.Logger = {
    /**
     * Only log to the client console output
     * @param {String} message
     */
    info: function(message){
        window.console && window.console.log('INFO: ' + message);
    },
    /**
     * dump the error message to the server
     * @param {String} message
     */
    error: function(message){
        window.console && window.console.log('ERROR: ' + message);
    }
}