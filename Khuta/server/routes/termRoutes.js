import express from "express";
import { Term } from "../models/Term.js";

const router = express.Router();

// GET all terms
router.get("/", async (req, res) => {
  try {
    const terms = await Term.find();
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving terms", error: error.message });
  }
});

// POST a new term
router.post("/", async (req, res) => {
  try {
    const newTerm = new Term({ termId: req.body.termId });
    await newTerm.save();
    res.status(201).json(newTerm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a term
router.delete("/:id", async (req, res) => {
  try {
    await Term.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;