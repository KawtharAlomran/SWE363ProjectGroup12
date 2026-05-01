import { Course } from "../models/Course.js";

// get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};

// add new course
export const addCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: "Failed to add course", error: error.message });
  }
};

// delete course by code
export const deleteCourse = async (req, res) => {
  try {
    const code = decodeURIComponent(req.params.code).toUpperCase();

    const course = await Course.findOneAndDelete({ code });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error: error.message });
  }
};