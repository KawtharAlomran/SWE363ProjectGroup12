import express from "express";
import {
  getPreferencesByTerm,
  getPreferencesByInstructor,
  getPreferencesByCourse,
  submitPreferences,
  addManualPreference,
} from "../controllers/preferenceController.js";

const router = express.Router();

router.get("/term/:termId", getPreferencesByTerm);
router.get("/term/:termId/instructor", getPreferencesByInstructor);
router.get("/term/:termId/course", getPreferencesByCourse);
router.post("/", submitPreferences);
// POST — committee adds a course manually for an instructor (order = 0)
router.post("/manual", addManualPreference);

export default router;