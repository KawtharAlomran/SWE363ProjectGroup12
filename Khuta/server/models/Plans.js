import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  termId: {
    type: String,
    required: [true, "Term ID is required"]
  },
  courseCode: {
    type: String,
    required: [true, "Course code is required"],
    uppercase: true
  },
  mDemand: {
    type: Number,
    min: [0, "Demand cannot be negative"]
  },
  fDemand: {
    type: Number,
    min: [0, "Demand cannot be negative"]
  }
}, { collection: 'Plans' });

export const Plan = mongoose.model("Plan", planSchema);