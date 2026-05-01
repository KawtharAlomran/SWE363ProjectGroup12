import express from "express";
import { getTeachingLoadByTerm } from "../controllers/teachingLoad.js";

const router = express.Router();

router.get("/:termId", getTeachingLoadByTerm);


export default router;