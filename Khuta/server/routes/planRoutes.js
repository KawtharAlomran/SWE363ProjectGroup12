import express from "express";
import { Plan } from "../models/Plans.js";

const router = express.Router();

// GET plans by termId
router.get("/:termId", async (req, res) => {
  try {
    const plans = await Plan.find({ termId: req.params.termId });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving plans", error: error.message });
  }
});

export default router;