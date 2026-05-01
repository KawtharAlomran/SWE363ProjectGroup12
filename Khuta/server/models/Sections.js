import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    term: {
      type: String,
      required: [true, "Term is required"]
    },

    courseId: {
      type: String,
      required: [true, "Course ID is required"]
    },

    type: {
      type: String,
      enum: ["LEC", "LAB"],
      required: [true, "Section type is required"]
    },

    maleSections: {
      type: Number,
      required: [true, "Male sections count is required"],
      min: [0, "Cannot be negative"]
    },

    femaleSections: {
      type: Number,
      required: [true, "Female sections count is required"],
      min: [0, "Cannot be negative"]
    }
  },
  {
    collection: "Sections" 
  }
);

export const Section = mongoose.model("Section", sectionSchema);