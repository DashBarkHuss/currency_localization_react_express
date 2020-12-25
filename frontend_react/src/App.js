import React, { useEffect, useState } from 'react';

function App() {
  const [displayText, setDisplayText] = useState('');

  const sendRequest = () =>
    fetch('/cookies', { credentials: 'same-origin' })
      .then((r) => {
        return r.text();
      })
      .then((text) => {
        setDisplayText(text);
        console.log(`proxy request: ${text}`);
      })
      .catch((err) => {
        console.log(`proxy request: ${err}`);
      });

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={sendRequest}>Fetch '/cookies'</button>
        <p>Locale Cookie: {displayText}</p>
      </header>
    </div>
  );
}

export default App;
