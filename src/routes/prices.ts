import express from 'express';
import { fetchPrice, getPrices } from '../controllers/prices';

const router = express.Router();

router.post('/fetch-price', fetchPrice);
router.get('/prices/:cardId', getPrices);

export default router;
