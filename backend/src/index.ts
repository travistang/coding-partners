import cors from 'cors';
import express from 'express';
import path from 'path';
import { createHabitsRouter } from './features/habits/router';

const port = 3000;

const createApp = async () => {
    const habitsRouter = await createHabitsRouter();

    const app = express();
    app.use(express.json());
    app.use(cors());

    app.use('/api/habits', habitsRouter);

    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, '../public')));

    // Serve index.html for all other routes (SPA support)
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    return app;
}

createApp().then((app) => {
    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });
});