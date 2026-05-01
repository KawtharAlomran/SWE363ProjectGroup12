import express from "express";
import { getPreferencesByTerm } from "../controllers/preferenceController.js";

const router = express.Router();

// GET preferences by term
router.get("/term/:termId", getPreferencesByTerm);

export default router;