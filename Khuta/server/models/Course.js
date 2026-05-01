
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: [true, "Course code is required"], 
    unique: true, 
    uppercase: true 
  },
  name: { 
    type: String, 
    required: [true, "Course name is required"] 
  },
  credit_hours: { 
    type: Number, 
    min: [0, "Credits cannot be negative"],
    max: [10, "Credits seem too high"] 
  },
  level: { 
    type: String, 
    enum: ["undegraduate", "Graduate"], 
    default: "undegraduate"
  },
  has_lab: {
    type: Boolean,
    default: false
  }
}, { collection: 'ICS-courses' });

export const Course = mongoose.model("Course", courseSchema);