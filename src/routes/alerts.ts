import express from 'express';
import { getAlerts } from '../controllers/alerts';

const router = express.Router();

router.get('/', getAlerts);

export default router;

