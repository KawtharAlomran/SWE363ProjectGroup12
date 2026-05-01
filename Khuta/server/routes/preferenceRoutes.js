import express from "express";
import { getPreferencesByTerm } from "../controllers/preferenceController.js";

const router = express.Router();

// GET preferences by term
router.get("/term/:termId", getPreferencesByTerm);
// GET preferences grouped by instructor (used in "By Instructor" view)
router.get("/term/:termId/instructor", getPreferencesByInstructor);

export default router;