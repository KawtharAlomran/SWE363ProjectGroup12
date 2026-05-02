import express from "express";
import { getPreferencesByTerm } from "../controllers/preferenceController.js";
import { getPreferencesByInstructor } from "../controllers/preferenceController.js";
import { getPreferencesByCourse } from "../controllers/preferenceController.js";
import { submitPreferences } from "../controllers/preferenceController.js";

const router = express.Router();

// GET preferences by term
router.get("/term/:termId", getPreferencesByTerm);
// GET preferences grouped by instructor (used in "By Instructor" view)
router.get("/term/:termId/instructor", getPreferencesByInstructor);
// return preferences grouped by course (used in "By Course" view)
router.get("/term/:termId/course", getPreferencesByCourse);
// post submitted preferences (used in SetPreferences.jsx)
router.post("/", submitPreferences);

export default router;