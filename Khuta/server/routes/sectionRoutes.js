import express from "express";
import { addSections } from "../controllers/termSectionController.js"; 
const router = express.Router();
 
// POST — save sections and term after submit
router.post("/", addSections);
 
export default router;
 