import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;
const QUOTE_API = 'https://api.quotable.io/quotes/random';


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/api/quote', (req, res) => {
    axios.get(QUOTE_API)
    .then(response => {
        if(response.data && response.data.length > 0) {
            const quote = {
                content: response.data[0].content,
                author: response.data[0].author
            };
            res.json(quote);
        } else {
            // Vizualise real error (could be added to a Logger file)
            console.log('Unexpected data format from Quotable API : ', response.data);
            // Send a generic and normalized error
            res.status(500).json({ success: false, error: 'Error during data recovery.' });
        }
    })
    .catch(function (error) {
        if (error.response) {
            console.log('Quotable API error : ', error.response.status, error.response.data);
            res.status(500).json({ success: false, error: 'Error during data recovery.' });
        } else if (error.request) {
            console.log('Quotable API not responding in time : ', error.request);
            res.status(504).json({ success: false, error: 'The server did not receive a response in time.' });
        } else {
            console.log('Error in query configuration : ', error.message);
            res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
        }
    })
});
