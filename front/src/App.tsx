import React, { useState } from 'react';
import './App.css';


/*****************
*** Components ***
******************/

// Component Quote
type Quote = {
  content: String, 
  author : String 
}

function QuoteComponent({ content, author } : Quote) {
  return (
    <div>
      <div id='quote'>❝ {content} ❞</div>
      <div id='author'>{author}</div>
    </div>
  );
}

// Component QuoteButton
type ButtonProps = {
  onClick: () => void;
  label: string;
}

function QuoteButton({ onClick, label }: ButtonProps) {
  return (
    <button onClick={onClick}>{label}</button>
  );
}

// Component ErrorMessage
type ErrorMessagesProps = {
  messages: string[];
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} className="Error show" style={{top: `${index * 50}px`}}>
          {message}
        </div>
      ))}
    </div>
  );
}





function App() {
  const API_URL = 'http://localhost:3000/';
  const API_KEY = process.env.REACT_APP_API_KEY;


  /******************************
  *** Background Circle Logic ***
  *******************************/

  // Two Circles: One will be on the left part of the screen and the other on the right part
  const [leftCirclePosition, setleftCirclePosition] = useState<{ top: string, left: string }>({ top: '-100%', left: '-100%' }); //outside by default
  const [rightCirclePosition, setrightCirclePosition] = useState<{ top: string, left: string }>({ top: '-100%', left: '-100%' });

  // Random position for the left circle
  const getRandomPositionForLeftCircle = () => {
    let top = Math.floor(Math.random() * 100); // between 0% and 100%
    let left = Math.floor(Math.random() * 40); // between 0% and 40%
    return { top: `${top}%`, left: `${left}%` };
  };
  // Random position for the right circle
  const getRandomPositionForRightCircle = () => {
    let top = Math.floor(Math.random() * 100); // between 0% and 100%
    let left = 60 + Math.floor(Math.random() * 40); // between 60% and 100%
    return { top: `${top}%`, left: `${left}%` };
  };


  /********************************
  *** Error Messages Management ***
  *********************************/

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // Add new error to the list to be displayed
  const displayError = (message: string) => {
    // Add the message to the errorMessages
    setErrorMessages((prevMessages) => [message, ...prevMessages]);
    // Delete message after 3 seconds
    setTimeout(() => {
      setErrorMessages((prevMessages) => prevMessages.slice(0, -1));
    }, 3000);
};

  
  /************************
  *** Quotes Management ***
  *************************/

  const [quote, setQuote] = useState<{ content: String, author: String } | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<string[]>([]);

  const getQuote = async () => {
    try {
      const response = await fetch(API_URL+'api/quote', {headers: {'Authorization': `Bearer ${API_KEY}`}});
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error: Something went wrong!");
      }
      
      // Check if the quote is recent
      if (recentQuotes.includes(data.content)) {
        // Make another request
        console.log("Quote seen recently. Fetching another...");
        getQuote();
        return;
      }
  
      // Update current quote
      setQuote(data);
  
      // Add new quote to recent quotes
      if (recentQuotes.length >= 100) {
        setRecentQuotes(prevQuotes => [...prevQuotes.slice(1), data.content]);  // Remove the first element and add the new one at the end
      } else {
        setRecentQuotes(prevQuotes => [...prevQuotes, data.content]);  // Add the new one at the end
      }

      // Move circles in background
      setleftCirclePosition(getRandomPositionForLeftCircle());
      setrightCirclePosition(getRandomPositionForRightCircle());
    } catch (error) {
      const err = error as Error
      displayError(`Error: ${err.message}`);
    }
  };


  /*****************
  *** DOM Render ***
  ******************/

  return (
    <div className="App">
      <div className="circle" style={leftCirclePosition}></div>
      <div className="circle" style={rightCirclePosition}></div>
      <ErrorMessages messages={errorMessages} />
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
