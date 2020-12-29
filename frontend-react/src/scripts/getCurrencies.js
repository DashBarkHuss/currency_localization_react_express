const countryData = require('country-data');
/**
 * Get currencies
 * @param {String} country code
 */
module.exports = (countryCode) => countryData.countries[countryCode].currencies;
