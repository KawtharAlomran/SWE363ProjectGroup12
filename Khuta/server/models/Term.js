import mongoose from "mongoose";
 
const termSchema = new mongoose.Schema({
  termId: {
    type: String,
    required: [true, "Term ID is required"],
    unique: true
  },
  
  assigned: {
      type: Boolean,
      default: false
    }
  }, { collection: 'Terms' });
 
export const Term = mongoose.model("Term", termSchema);
