NS.Utils.CreditCard = {
    /**
     * Verify if the card number is valid
     * @param {Number} cardNumber
     * @return {Boolean}
     *
     * Usage:
     * isValid('4444 4444 4444 4448') => true
     * isValid('4444 4444 4444 4444') => false
     */
    isValid: function(cardNumber){

    },
    /**
     *
     * Returns the type of the card as a string.
     * The possible types are "Visa", "MasterCard",
     * "American Express", "Discover", "Diners Club", and "JCB".
     * If a card isn't recognized, the return value is "Unknown".
     *
     * @param {Number} cardNumber
     * @return {String} The type of credit card.
     *
     * Usage:
     * getCardType('4444 4444 4444 4448') => 'Visa'
     */
    getCardType: function(cardNumber){

    },
    /**
     * Returns the URL to the credit card logo
     * @param {Number} cardNumber
     * @param {String} size
     *
     * Usage:
     * getCardLogo('4444 4444 4444 4448', 'small') => http://www.host.com/path/to/small/visa/logo.png
     */
    getCardLogo: function(cardNumber, size){

    }

};

/**
 Make developer friendly version of the helper function
 */
NS['validateCardNumber'] = NS.Utils.CreditCard.isValid;
NS['getCardType'] = NS.Utils.CreditCard.getCardType;
NS['getCardLogo'] = NS.Utils.CreditCard.getCardLogo;