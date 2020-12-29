import React, { useEffect, useState } from 'react';
import getCurrencies from './scripts/getCurrencies';
function App() {
  const [localeCookie, setLocaleCookie] = useState('');
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const parsedCookies = () => {
    const str = decodeURIComponent(document.cookie).split('; ');
    const result = {};
    for (let i = 0; i < str.length; i++) {
      const cur = str[i].split('=');
      result[cur[0]] = cur[1];
    }
    return result;
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

  const fetchUser = () => {
    return fetch('/users/current')
      .then((res) => {
        if (res.status === 204) return null;
        return res.json();
      })
      .then((user) => {
        setUser(user);
        return user;
      });
  };

  const clientCurrency = () => {
    const cookies = parsedCookies();
    return user ? user?.currency : cookies.currency;
  };

  useEffect(() => {
    fetchUser().then((usr) => {
      if (!clientCurrency()) chooseCurrency(JSON.parse(parsedCookies().locale));
    });
  }, [clientCurrency]);

  const sendRequest = () => {
    fetch('/cookies', { credentials: 'same-origin' })
      .then((r) => {
        return r.text();
      })
      .then((text) => {
        setLocaleCookie(text);
        console.log(`proxy request: ${text}`);
      })
      .catch((err) => {
        console.log(`proxy request: ${err}`);
      });
  };
  const login = (username) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers,
    })
      .then((res) => res.text())
      .then((text) => {
        fetchUser();
        console.log('server response: ', text);
      })
      .catch((err) => {
        console.log(`couldn't login ${username}: ${err}`);
      });
  };
  const getShop = (shopID) => {
    fetch(`/shops/${shopID}`)
      .then((res) => res.json())
      .then((json) => {
        setShop(json);
      })
      .catch((err) => {
        console.log(`couldn't get shop: ${err}`);
      });
  };
  const logout = () => {
    fetch('/logout', {
      method: 'DELETE',
    })
      .then((res) => res.text())
      .then((text) => {
        setUser(null);
        console.log('server response: ', text);
      })
      .catch((err) => {
        console.log(`couldn't logout: ${err}`);
      });
  };
  const convertCurreny = (originalPrice, initiallyCurrency, finalCurrency) => {
    //get conversion rates
  };
  return (
    <div className="App">
      <div id="requestCookies">
        <button onClick={sendRequest}>Fetch '/cookies'</button>
        <p>
          <b>Locale Cookie based on browser preference:</b>
          <span style={{ fontSize: '.6rem' }}>{localeCookie}</span>
        </p>
      </div>
      <div id="login-logout">
        <button onClick={() => login('Miley')}>Login Miley (USD account)</button>
        <br />
        <button onClick={() => login('Drake')}>Login Drake (CAD account)</button>
        <br />
        <button onClick={() => login('Elizabeth')}>Login Elizabeth (GBP account)</button>
        <br />
        <button onClick={logout}>Logout</button>
      </div>
      <div id="account">
        <b>Client Currency:</b> {clientCurrency()}
        <p>
          <b>LoggedIn:</b> {user?.username}
        </p>
        <p>
          <b>Currency:</b> {user?.currency}
        </p>
      </div>
      <div id="shop">
        <button onClick={() => getShop(1)}>Miley's Shop</button>
        <button onClick={() => getShop(2)}>Drake's Shop</button>
        <button onClick={() => getShop(3)}>Elizabeth's Shop</button>
        <hr></hr>
        <h3>{shop?.owner}'s Shop</h3>
        <p>Hi {user?.username}! Thank for visiting the my shop!</p>
        <p>
          <b>Some item:</b> {shop?.price}
        </p>
      </div>
    </div>
  );
}

export default App;
