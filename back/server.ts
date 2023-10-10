import express from 'express';

const app = express();
const PORT = 3000;

app.get('/api/quote', (req, res) => {
    res.send("Test");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
