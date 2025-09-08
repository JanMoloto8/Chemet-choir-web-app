import express from 'express';
import {  registerPresence,getUsersByPart,getPresenceByVoicePart } from '../controllers/presenceController.js';

const router = express.Router();

// Define route to get users by part
router.get('/users', getUsersByPart);
router.post("/submit", registerPresence); // Add a new record
router.get('/register', getPresenceByVoicePart);
export default router;
