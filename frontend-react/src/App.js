import React, { useEffect, useState } from 'react';

function App() {
  const [localeCookie, setLocaleCookie] = useState('');
  const [user, setUser] = useState(null);

  const fetchUser = () => {
    fetch('/users/current')
      .then((res) => {
        if (res.status === 204) return null;
        return res.json();
      })
      .then((user) => {
        setUser(user);
      });
  };

  useEffect(fetchUser, []);

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
    // fetch(`/shop/${shopID}`)
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setNewLoginSession(true);
    //     console.log('server response: ', text);
    //   })
    //   .catch((err) => {
    //     console.log(`couldn't login ${username}: ${err}`);
    //   });
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
        <p>
          <b>LoggedIn:</b> {user?.username}
        </p>
        <p>
          <b>Currency:</b> {user?.currency}
        </p>
      </div>
      <div id="shop">
        <button>Drake's Shop</button>
        <button>Miley's Shop</button>
        <button>Elizabeth's Shop</button>
        <hr></hr>
        <h3>Flower Shop</h3>
        <p>Hi {user?.username}! Thank for visiting the flower shop!</p>
        <p>
          <b>Roses:</b> $40
        </p>
      </div>
    </div>
  );
}

export default App;
