const countryData = require('country-data');
module.exports = (req, res, next) => {
  if (req.cookies.currency) return next();
  const countryCode =
    req.countryCode || (req.cookies.locale && res.cookies.locale.countryCode) || null;
  if (countryCode) {
    res.cookie('currency', getCurrency(countryCode), { maxAge: new Date() * 0.001 + 300 });
  } else {
    // what if we don't have any country code?
  }
  return next();
};
