// models/Faculty.js
import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"] 
  },
  rank: { 
    type: String, 
    required: [true, "Rank is required"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true,
    lowercase: true
  },
  role: { 
    type: String, 
    enum: ["faculty", "chairman", "committee"],
    required: true 
  },
  pass: { 
    type: String, 
    required: true 
  }
}, { collection: 'ICS-faculty' });

export const Faculty = mongoose.model("Faculty", facultySchema);