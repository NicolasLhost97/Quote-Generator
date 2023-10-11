import express from 'express';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = 3000;
const QUOTE_API = 'https://api.quotable.io/quotes/random';
const API_KEY = 'azerty123'

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


/******************
*** Middelwares ***
*******************/

//Handle cross-origin requests (CORS)
app.use(cors({
    origin: 'http://localhost:8000', // Adresse du front-end
    credentials: true
}));

//Checking API Token (Morgan)
app.use(morgan('combined'));
app.use((req: Request, res: Response, next: NextFunction) => {
    const apiToken = req.header('Authorization');

    // API Token checking
    if (!apiToken || apiToken !== `Bearer ${API_KEY}`) {
        return res.status(401).json({ success: false, message: 'Invalid or missing API token.' });
    }

    next();
});



/*************
*** Routes ***
**************/

app.get('/api/quote', (req: Request, res: Response) => {
    axios.get(QUOTE_API)
    .then(response => {
        if(response.data && response.data.length > 0) {
            // Send Content and Author only (hiding data)
            const quote = {
                content: response.data[0].content,
                author: response.data[0].author
            };
            res.json(quote);
        } else {
            // Vizualise real error (can be later integrated into a Logger system)
            console.log('Unexpected data format from Quotable API : ', response.data);
            // Send a generic and normalized error
            res.status(500).json({ success: false, error: 'Error during data recovery.' });
        }
    })
    .catch(function (error) {
        // If the request was made and the server responded with a status outside of the 2xx range
        if (error.response) {
            console.log('Quotable API error : ', error.response.status, error.response.data);
            res.status(500).json({ success: false, error: 'Error during data recovery.' });

        // If the request was made but no response was received (possible network issues or endpoint is down)
        } else if (error.request) {
            console.log('Quotable API not responding in time : ', error.request);
            res.status(504).json({ success: false, error: 'The server did not receive a response in time.' });
        
        // For errors that occur while setting up the request and are triggered before the request is sent  
        } else {
            console.log('Error in query configuration : ', error.message);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    })
});



/********************************
*** Error Handling Middleware ***
*********************************/

// Catch-all handler for unknown routes
app.use('*', (req: Request, res: Response) => {
    console.log('ICI')
    res.status(404).json({ success: false, error: 'Route not found.' });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log('Là')
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'An unexpected error occurred.' });
  });


export default server;