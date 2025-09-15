import express from 'express';
import db from '../database/db.js';
import route from './routes/authRoute.js';
import entries from './routes/entries.js';

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send("API is listening....");
})

app.use('/api/users', route); 
app.use('/api/entries', entries);

const startServer = async () => {
    try {
        await db(); // Wait for the database connection to succeed
        app.listen(8000, () => {
            console.log("API has started on port 8000...");
        });
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
};

startServer();

export default app;