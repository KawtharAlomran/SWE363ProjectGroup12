import express from "express";
import { addSections, getSectionsByTerm, updateSections } from "../controllers/termSectionController.js";

const router = express.Router();

// POST — save sections and term after submit
router.post("/", addSections);

// GET — fetch sections by termId
router.get("/:termId", getSectionsByTerm);

// PUT — update sections for existing term
router.put("/:termId", updateSections);

export default router;