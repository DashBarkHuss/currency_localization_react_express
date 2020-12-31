import React, { useEffect, useState } from 'react';

import {
  clientLocale,
  clientCurrency,
  logout,
  getShop,
  login,
  fetchUser,
  chooseCurrency,
  cookieRequest,
  parsedCookies,
  displayCurrency,
} from './scripts/helpers';

import ExchangeRateApiInterface from './scripts/ExchangeRatesApiInterface';
function App() {
  const [localeCookie, setLocaleCookie] = useState('');
  const [user, setUser] = useState(null);
  const [rate, setRate] = useState(null);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    fetchUser(setUser).then((usr) => {
      if (!clientCurrency(usr)) {
        chooseCurrency(JSON.parse(parsedCookies().locale));
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (shop) {
        if (shop) {
          const rt = await new ExchangeRateApiInterface().getExchangeRate(
            shop.currency,
            clientCurrency(user)
          );
          return setRate(rt);
        }
      }
    })();
  }, [shop, user]);

  return (
    <div className="App" style={{ margin: '10px' }}>
      <div id="requestCookies">
        <button onClick={() => cookieRequest(setLocaleCookie)}>Fetch '/cookies'</button>
        <p>
          <b>Locale Cookie based on browser preference:</b>
          <span style={{ fontSize: '.6rem' }}>{localeCookie}</span>
        </p>
      </div>
      <div id="login-logout">
        <button onClick={() => login('Miley', () => fetchUser(setUser))}>
          Login Miley (USD account)
        </button>
        <br />
        <button onClick={() => login('Drake', () => fetchUser(setUser))}>
          Login Drake (CAD account)
        </button>
        <br />
        <button onClick={() => login('Elizabeth', () => fetchUser(setUser))}>
          Login Elizabeth (GBP account)
        </button>
        <br />
        <button onClick={() => logout(() => setUser(null))}>Logout</button>
      </div>
      <div id="account">
        <b>Client Currency:</b> {clientCurrency(user)}
        <p>
          <b>LoggedIn:</b> {user?.username}
        </p>
        <p>
          <b>Currency:</b> {user?.currency}
        </p>
      </div>
      <div id="shop">
        <button onClick={() => getShop(1, setShop)}>Miley's Shop</button>
        <button onClick={() => getShop(2, setShop)}>Drake's Shop</button>
        <button onClick={() => getShop(3, setShop)}>Elizabeth's Shop</button>
        <hr></hr>
        <h3>{shop?.owner}'s Shop</h3>
        <p>Hi {user?.username}! Thanks for visiting the my shop!</p>
        <p>
          {clientCurrency(user) && shop?.currency !== clientCurrency(user) ? (
            <>
              <b>Some item: </b>
              {shop
                ? `estimated price: ${displayCurrency(
                    shop?.price * rate,
                    clientCurrency(user),
                    clientLocale(user)
                  )} converted from ${displayCurrency(
                    shop?.price,
                    shop?.currency,
                    clientLocale(user)
                  )}
                    `
                : null}
            </>
          ) : (
            <>
              <b>Some item:</b>{' '}
              {shop ? displayCurrency(shop?.price, shop?.currency, clientLocale(user)) : null}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default App;
