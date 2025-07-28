import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import watchlistRoutes from './routes/watchlist';
import priceRoutes from './routes/prices';
import alertsRoutes from './routes/alerts';
import { startPriceCron } from './cron';

const app = express();

// Add CORS headers
app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

app.use('/watchlist', watchlistRoutes);
app.use('/', priceRoutes);
app.use('/alerts', alertsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  startPriceCron();
});
