import React, { useState } from 'react';
import './App.css';

function App() {
  const API_URL = 'http://localhost:3000/'
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [quote, setQuote] = useState<{content: String, author: String} | null>(null);

  const getQuote = async () => {
    try {
      const response = await fetch(API_URL+'api/quote', {headers: {'Authorization': `Bearer${API_KEY}`}});
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error: Something went wrong!");
      }
      setQuote(data);
    } catch (error) {
      console.error(error);
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
