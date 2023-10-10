import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const API_URL = 'http://localhost:3000/'
  const [quote, setQuote] = useState<{content: String, author: String} | null>(null);

  const getQuote = async () => {
    try {
      const response = await fetch(API_URL+'api/quote');
      const data = await response.json();
      console.log(data)
      setQuote(data);
    } catch (error) {
      console.error("Quotation retrieval error:", error);
    }
  };

  return (
    <div className="App">
      <div className="Content">
        {!quote && <p>Click on the button to get a quote :</p>}
        {quote && <div><p>❝{quote.content}❞</p><p>{quote.author}</p></div>}
        <button onClick={getQuote}>Get a quote</button>
      </div>
    </div>
  );
}

export default App;
