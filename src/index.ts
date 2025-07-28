import express from 'express';
import watchlistRoutes from './routes/watchlist';
import priceRoutes from './routes/prices';

const app = express();
app.use(express.json());

app.use('/watchlist', watchlistRoutes);
app.use('/', priceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
