import cors from 'cors';
import express from 'express';
import path from 'path';
import habitsRouter from './features/habits/router';

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

app.use('/api/habits', habitsRouter);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html for all other routes (SPA support)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});