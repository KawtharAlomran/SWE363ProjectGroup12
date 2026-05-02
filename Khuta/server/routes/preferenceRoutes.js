import express from "express";
import {
  getPreferencesByTerm,
  getPreferencesByInstructor,
  getPreferencesByCourse,
  submitPreferences,
  addManualPreference,
  deletePreferencesByTerm,
} from "../controllers/preferenceController.js";

const router = express.Router();

router.get("/term/:termId", getPreferencesByTerm);
router.get("/term/:termId/instructor", getPreferencesByInstructor);
router.get("/term/:termId/course", getPreferencesByCourse);
router.post("/", submitPreferences);
router.post("/manual", addManualPreference);
// DELETE all preferences for a term (called when deleting a term)
router.delete("/term/:termId", deletePreferencesByTerm);

export default router;