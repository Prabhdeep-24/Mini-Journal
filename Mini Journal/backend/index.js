// index.js
import express from 'express';
import connectDB from './database/db.js';
import authRoute from './routes/authRoute.js'; // Updated import
import entries from './routes/entries.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is listening....');
});

app.use('/api/users', authRoute); // Matches your route prefix
app.use('/api/entries', entries);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`API has started on port ${PORT}...`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

startServer();

export default app;