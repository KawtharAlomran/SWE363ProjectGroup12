import express from "express";
import {
  addSections,
  getSectionsByTerm,
  updateSections,
  getAssignmentsByTerm,
  getSectionNumbers,
  saveAssignments,
  getRecommendations,
  getTeachingLoad,
  deleteAssignmentsByTerm,
} from "../controllers/termAssignmentController.js";

const router = express.Router();

// Section routes
router.post("/sections", addSections);
router.get("/sections/:termId", getSectionsByTerm);
router.put("/sections/:termId", updateSections);

// Assignment routes
router.get("/:termId", getAssignmentsByTerm);
router.get("/:termId/sections", getSectionNumbers);
router.get("/:termId/recommendations", getRecommendations);
router.get("/:termId/load", getTeachingLoad);
router.post("/", saveAssignments);
router.delete("/:termId", deleteAssignmentsByTerm);

export default router;