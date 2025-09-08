// routes/dashboardRoutes.js
import { Router } from 'express';
import { getUserCount,getSongComplete,getUpcomingEventCount} from '../controllers/dashboardController.js';

const router = Router();

router.get('/user-count', getUserCount);
router.get('/songs-complete', getSongComplete);
router.get('/upcoming-events/count', getUpcomingEventCount);
export default router;