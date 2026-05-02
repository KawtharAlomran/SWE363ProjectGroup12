import express from "express";
import { addSections, getSectionsByTerm, updateSections, getUniqueCoursesByTerm, deleteSectionsByTerm } from "../controllers/termSectionController.js";

const router = express.Router();

// POST — save sections and term after submit
router.post("/", addSections);

router.get("/unique/:termId", getUniqueCoursesByTerm);
// GET — fetch sections by termId
router.get("/:termId", getSectionsByTerm);

// PUT — update sections for existing term
router.put("/:termId", updateSections);

// DELETE — delete all sections for a term
router.delete("/:termId", deleteSectionsByTerm);

export default router;