import { Router } from 'express';
import { addEvent, getUpcomingEvents,getAllEvents ,  deleteEvent,  getNextUpcomingEvent  } from '../controllers/eventController.js';

const router = Router();

router.post('/add', addEvent);
router.get('/list', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.delete('/:id', deleteEvent);
router.get('/next', getNextUpcomingEvent); 

export default router;
