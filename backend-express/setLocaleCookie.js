const getPreferredLocale = (acceptLanguageHeader) => {
  const locales = acceptLanguageHeader
    .split(/(\b, \b|\b,\b|\b;q=\b)/g)
    .filter((el) => el !== ',' && el !== ', ' && el !== ';q=')
    .reduce(
      (a, c, i, arr) =>
        Number.isNaN(Number(c))
          ? [...a, { locale: c, q: Number.isNaN(Number(arr[i + 1])) ? '1' : arr[i + 1] }]
          : a,
      []
    )
    .sort((a, b) => (a.q > b.q ? -1 : 1));
  return (
    locales.find((el) => el.locale.match(/-[A-Z]{2}/g) && el.locale.match(/-[A-Z]{2}/g).locale) ||
    locales[0].locale
  );
};

const makeLocaleObj = (locale) => ({
  locale,
  countryCode: locale.match(/(?<=\-)[A-Z]*/g)[0],
  languageCode: locale.match(/[^-]*/)[0],
});

const setLocaleCookie = (req, res, next) => {
  const cookieLocale = req.cookies.locale;
  if (!cookieLocale) {
    const locale = getPreferredLocale(req.headers['accept-language']);
    const localeObj = makeLocaleObj(locale);
    res.cookie('locale', JSON.stringify(localeObj), { maxAge: new Date() * 0.001 + 300 });
  }
  next();
};

module.exports = setLocaleCookie;
