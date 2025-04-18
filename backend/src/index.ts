import express from 'express';
import habitsRouter from './features/habits/router';

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use('/api/habits', habitsRouter);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});