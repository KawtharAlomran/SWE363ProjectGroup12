import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
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
      required: [true, "Type is required"]
    },

    section: {
      type: String,
      required: [true, "Section is required"]
    },

    instructorName: {
      type: String,
      required: [true, "Instructor name is required"]
    }
  },
  {
    collection: "Assignment"
  }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);