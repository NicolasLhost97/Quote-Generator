import React, { useEffect, useState } from 'react';
import './App.css';

type Quote = {
  content: String, 
  author : String 
}

type ButtonProps = {
  onClick: () => void;
  label: string;
}

// Composant Quote
function QuoteComponent({ content, author } : Quote) {
  return (
    <div>
      <div id='quote'>❝ {content} ❞</div>
      <div id='author'>{author}</div>
    </div>
  );
}

// Composant QuoteButton
function QuoteButton({ onClick, label }: ButtonProps) {
  return (
    <button onClick={onClick}>{label}</button>
  );
}


function App() {
  const API_URL = 'http://localhost:3000/';
  const API_KEY = process.env.REACT_APP_API_KEY;
  
  const [quote, setQuote] = useState<{ content: String, author: String } | null>(null);

  const [leftCirclePosition, setleftCirclePosition] = useState<{ top: string, left: string }>({ top: '-100%', left: '-100%' });
  const [rightCirclePosition, setrightCirclePosition] = useState<{ top: string, left: string }>({ top: '-100%', left: '-100%' });
  const getRandomPositionForLeftCircle = () => {
    let top = Math.floor(Math.random() * 100); // entre 0% et 100%
    let left = Math.floor(Math.random() * 40); // entre 0% et 40%
    return { top: `${top}%`, left: `${left}%` };
  };
  const getRandomPositionForRightCircle = () => {
    let top = Math.floor(Math.random() * 100); // entre 0% et 100%
    let left = 60 + Math.floor(Math.random() * 40); // entre 60% et 100%
    return { top: `${top}%`, left: `${left}%` };
  };

  const displayError = (message: string) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'Error show';
    errorDiv.innerText = message;
  
    // Déplacer toutes les erreurs existantes vers le bas
    const existingErrors = document.querySelectorAll('.Error');
    existingErrors.forEach((err) => {
      if (err instanceof HTMLElement) {
        const currentTop = parseInt(window.getComputedStyle(err).top, 10);
        err.style.top = `${currentTop + 50}px`;
      }
    });
  
    document.body.appendChild(errorDiv);
  
    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 3000);
  };
  


  const getQuote = async () => {
    try {
      const response = await fetch(API_URL + 'api/quote', { headers: { 'Authorization': `Bearer ${API_KEY}` } });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error: Something went wrong!");
      }

      setQuote(data);

      setleftCirclePosition(getRandomPositionForLeftCircle());
      setrightCirclePosition(getRandomPositionForRightCircle());
    } catch (error) {
      const err = error as Error
      displayError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <div className="circle" style={leftCirclePosition}></div>
      <div className="circle" style={rightCirclePosition}></div>
      <div className="Content">
        <h3>Quote Generator</h3>
        {!quote && <div>Click on the button to get a quote</div>}
        {quote && <QuoteComponent content={quote.content} author={quote.author} />}
        <QuoteButton label="New Quote" onClick={getQuote} />
      </div>
    </div>
  );
}

export default App;
