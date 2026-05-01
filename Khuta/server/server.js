import express from "express";
import cors from "cors";


import dotenv  from "dotenv";
import { connectDB } from "./db.js";
import { Faculty } from "./models/Faculty.js";
import { Course } from "./models/Course.js";
import { Plan } from "./models/Plans.js";
import { Term } from "./models/Term.js";
import courseRoutes from "./routes/courseRoutes.js";
import termRoutes from "./routes/termRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js";
//test
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());              
app.use(express.json());
app.use("/api/courses", courseRoutes);
app.use("/api/terms", termRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/sections", sectionRoutes);

await connectDB(process.env.MONGO_URL);

// get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving courses", 
      error: error.message 
    });
  }
});

// get faculty
app.get("/api/faculty", async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    
    if (role) {
      query.role = role;
    }

    const facultyList = await Faculty.find(query).select("-__v");
    
    res.status(200).json(facultyList);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching faculty data", 
      error: error.message 
    });
  }
});

app.get("/api/faculty/:email", async (req, res) => {
  try {
    const member = await Faculty.findOne({ email: req.params.email.toLowerCase() });
    
    if (!member) {
      return res.status(404).json({ message: "Faculty member not found" });
    }
    
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

// DELETE a faculty member
app.delete("/api/faculty/:email", async (req, res) => {
  try {
    await Faculty.findOneAndDelete({ email: req.params.email });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove committee
app.patch("/api/faculty/:email", async (req, res) => {
  try {
    const updatedMember = await Faculty.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { $set: { role: req.body.role } }, // This changes "committee" to "faculty"
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));