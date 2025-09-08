// routes/repertoireRoutes.js
import { Router } from 'express';
import { addSong ,getSongs } from '../controllers/repertoireController.js';

const router = Router();

router.post('/add', addSong);
router.get('/list', getSongs);

export default router;
