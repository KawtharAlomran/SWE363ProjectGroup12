import express from "express";
import {
  getAllCourses,
  addCourse,
  deleteCourse
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getAllCourses);
router.post("/", addCourse);
router.delete("/:code", deleteCourse);

export default router;