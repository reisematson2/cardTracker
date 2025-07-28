import express from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlist } from '../controllers/watchlist';

const router = express.Router();

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.put('/:id', updateWatchlist);
router.delete('/:id', removeFromWatchlist);

export default router;

