import express from "express";
import { getAssignmentsByTerm, getSectionNumbers, saveAssignments } from "../controllers/termAssignmentController.js";
const router = express.Router();

// GET — fetch existing assignments for a term
router.get("/:termId", getAssignmentsByTerm);

// GET — fetch generated section numbers for a term
router.get("/:termId/sections", getSectionNumbers);

// POST — save assignments
router.post("/", saveAssignments);

export default router;