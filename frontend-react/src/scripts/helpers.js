import getCurrencies from './getCurrencies';
const logout = (callback) => {
  fetch('/logout', {
    method: 'DELETE',
  })
    .then((res) => res.text())
    .then((text) => {
      callback();
      console.log('server response: ', text);
    })
    .catch((err) => {
      console.log(`couldn't logout: ${err}`);
    });
};

const login = (username, callback) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username }),
    headers,
  })
    .then((res) => res.text())
    .then((text) => {
      callback();
      console.log('server response: ', text);
    })
    .catch((err) => {
      console.log(`couldn't login ${username}: ${err}`);
    });
};

const fetchUser = (callback) => {
  return fetch('/users/current')
    .then((res) => {
      if (res.status === 204) return null;
      return res.json();
    })
    .then((user) => {
      callback(user);
      return user;
    });
};

const cookieRequest = (callback) => {
  fetch('/cookies', { credentials: 'same-origin' })
    .then((r) => {
      return r.text();
    })
    .then((text) => {
      callback(text);
      console.log(`proxy request: ${text}`);
    })
    .catch(console.log);
};

const parsedCookies = () => {
  const str = decodeURIComponent(document.cookie).split('; ');
  const result = {};
  for (let i = 0; i < str.length; i++) {
    const cur = str[i].split('=');
    result[cur[0]] = cur[1];
  }
  return result;
};

const getShop = (shopID, callback) => {
  fetch(`/shops/${shopID}`)
    .then((res) => res.json())
    .then((json) => {
      callback(json);
    })
    .catch((err) => {
      console.log(`couldn't get shop: ${err}`);
    });
};

const displayCurrency = (price, currency, locale) => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);
};
const chooseCurrency = (locale) => {
  if (locale.countryCode) {
    const currencies = getCurrencies(locale.countryCode);
    //replace with form to select currency and set document.cookie
    if (currencies.length > 1)
      return alert('Here we would ask the user to pick currency: ' + currencies.join(', '));

    document.cookie = `currency= ${currencies[0]}`; // we need to give the user a way to change the currency later
  } else {
    //replace with form to select currency based on language and set document.cookie
    alert(
      `Here the user would pick currency from list of currencies. Currencies used in countries where people speak languageCode: "${locale.languageCode}" could be at top of list`
    );
  }
};

const clientLocale = (user) => {
  const cookies = parsedCookies();
  return user ? user?.locale : cookies.locale.locale;
};

const clientCurrency = (user) => {
  const cookies = parsedCookies();
  return user ? user?.currency : cookies.currency;
};

export {
  clientCurrency,
  clientLocale,
  displayCurrency,
  getShop,
  parsedCookies,
  logout,
  login,
  fetchUser,
  chooseCurrency,
  cookieRequest,
};
