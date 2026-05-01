import { Preferences } from "../models/Preferences.js";

// GET — fetch all faculty preferences for a specific term
export const getPreferencesByTerm = async (req, res) => {
  try {
    const { termId } = req.params;

    const preferences = await Preferences.find({ termId })
      .sort({ facultyName: 1, order: 1 });

    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch preferences",
      error: error.message,
    });
  }
};