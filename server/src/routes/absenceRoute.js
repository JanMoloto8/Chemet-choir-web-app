import express from "express";
import {getAbsences, getMyAbsences, submitAbsence, updateAbsenceStatus } from "../controllers/absenceController.js";

const router = express.Router();

// POST /api/absences/submit
router.post("/submit", submitAbsence);
// PUT /api/absences/update-status
router.put("/update-status", updateAbsenceStatus);
//GET /api/absences/mine
router.get("/mine", getMyAbsences);
//GET /api/absences/
router.get("/", getAbsences);
export default router;
