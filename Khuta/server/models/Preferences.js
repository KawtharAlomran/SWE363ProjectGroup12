import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
  termId: {
    type: String,
    required: [true, "Term ID is required"]
  },
  facultyName: {
    type: String,
    required: [true, "Faculty name is required"]
  },
  courseId: {
    type: String,
    required: [true, "Course ID is required"],
    uppercase: true
  },
  order: {
    type: Number,
    required: [true, "Order is required"],
    min: [1, "Order must be at least 1"]
  }
}, { collection: 'Preferences' });

export const Preferences = mongoose.model("Preferences", preferenceSchema);
