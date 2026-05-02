import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db.js";
import { Faculty } from "./models/Faculty.js";
import { Course } from "./models/Course.js";
import { Plan } from "./models/Plans.js";
import { Term } from "./models/Term.js";
import { Assignment } from "./models/Assignment.js";
import { Preferences } from "./models/Preferences.js";
import courseRoutes from "./routes/courseRoutes.js";
import termRoutes from "./routes/termRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js";
import teachingLoadRoutes from "./routes/loadRoute.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

dotenv.config();

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: process.env.Client_URL || 'http://localhost:5173',
  methods: 'GET,POST,PATCH,DELETE,PUT',
  credentials: true,
};

const app = express();
const PORT = process.env.PORT || 5174;

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/courses", courseRoutes);
app.use("/api/terms", termRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/assignments/load", teachingLoadRoutes);
app.use("/api/assignments", assignmentRoutes);

await connectDB(process.env.MONGO_URL);

// get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving courses", error: error.message });
  }
});

// get faculty
app.get("/api/faculty", async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;
    const facultyList = await Faculty.find(query).select("-__v");
    res.status(200).json(facultyList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty data", error: error.message });
  }
});

app.get("/api/faculty/:email", async (req, res) => {
  try {
    const member = await Faculty.findOne({ email: req.params.email.toLowerCase() });
    if (!member) return res.status(404).json({ message: "Faculty member not found" });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new faculty member
app.post("/api/faculty", async (req, res) => {
  try {
    const newFaculty = new Faculty(req.body);
    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a faculty member — also deletes their Preferences and Assignments
app.delete("/api/faculty/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Find faculty first to get their name (needed for Preferences and Assignment)
    const member = await Faculty.findOne({ email });
    if (!member) return res.status(404).json({ message: "Faculty member not found" });

    const facultyName = member.name;

    // Delete from all related collections in parallel
    await Promise.all([
      Faculty.findOneAndDelete({ email }),
      Preferences.deleteMany({ facultyName }),
      Assignment.deleteMany({ instructorName: facultyName }),
    ]);

    res.status(200).json({ message: "Faculty and all related data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove committee role
app.patch("/api/faculty/:email", async (req, res) => {
  try {
    const updatedMember = await Faculty.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { $set: { role: req.body.role } },
      { new: true }
    );
    if (!updatedMember) return res.status(404).json({ message: "Member not found" });
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get assigned courses for a faculty member in a specific term
app.get("/api/assignments/:term/:facultyName", async (req, res) => {
  try {
    const { term, facultyName } = req.params;
    const assignments = await Assignment.find({
      term,
      instructorName: decodeURIComponent(facultyName),
    });
    const result = await Promise.all(
      assignments.map(async (assignment) => {
        const course = await Course.findOne({ code: assignment.courseId });
        return {
          code: assignment.courseId,
          name: course ? course.name : assignment.courseId,
          section: `${assignment.type} ${assignment.section}`,
        };
      })
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assigned courses", error: error.message });
  }
});

// Serve frontend build files
app.use(express.static(path.join(__dirname, '../dist')));

// Handle all non-API routes — send to React app (Express 5 compatible)
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));