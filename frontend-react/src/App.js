import React, { useEffect, useState } from 'react';

function App() {
  const [localeCookie, setLocaleCookie] = useState('');
  const [newLoginSession, setNewLoginSession] = useState(false);
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
  useEffect(() => {
    if (newLoginSession) {
      fetchUser();
      setNewLoginSession(false);
    }
  }, [newLoginSession]);

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
        setNewLoginSession(true);
        console.log('server response: ', text);
      })
      .catch((err) => {
        console.log(`couldn't login ${username}: ${err}`);
      });
  };
  const logout = () => {
    fetch('/logout', {
      method: 'DELETE',
    })
      .then((res) => res.text())
      .then((text) => {
        setNewLoginSession(true);
        console.log('server response: ', text);
      })
      .catch((err) => {
        console.log(`couldn't logout: ${err}`);
      });
  };
  return (
    <div className="App">
      <div id="requestCookies">
        <button onClick={sendRequest}>Fetch '/cookies'</button>
        <p>
          <span style={{ fontWeight: 'bold' }}>Locale Cookie based on browser preference:</span>
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
          <span style={{ fontWeight: 'bold' }}>LoggedIn:</span> {user?.username}
        </p>
        <p>
          {' '}
          <span style={{ fontWeight: 'bold' }}>Currency:</span> {user?.currency}
        </p>
      </div>
    </div>
  );
}

export default App;
