import express from "express";
import {
  getAllCourses,
  addCourse,
  deleteCourse
} from "../controllers/courseController.js";

const router = express.Router();
 
router.get("/", getAllCourses); // GET request to fetch all courses from database
router.post("/", addCourse); // POST request to add a new course to database
router.delete("/:code", deleteCourse); // DELETE request to delete a course by its code

export default router;