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

// GET — group preferences by instructor
export const getPreferencesByInstructor = async (req, res) => {
  try {
    const { termId } = req.params;

    // fetch all preferences for the term
    const data = await Preferences.find({ termId })
      .sort({ facultyName: 1, order: 1 });

    const result = {};

    // group preferences under each instructor
    data.forEach(p => {
      if (!result[p.facultyName]) {
        result[p.facultyName] = [];
      }

      result[p.facultyName].push({
        courseId: p.courseId,
        order: p.order
      });
    });

    // convert object into array format
    const formatted = Object.keys(result).map(name => ({
      facultyName: name,
      preferences: result[name]
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch preferences by instructor",
      error: error.message
    });
  }
};

// GET — group preferences by course
export const getPreferencesByCourse = async (req, res) => {
  try {
    const { termId } = req.params;

    // fetch all preferences for the term
    const data = await Preferences.find({ termId })
      .sort({ courseId: 1, order: 1 });

    const result = {};

    // group instructors under each course
    data.forEach(p => {
      if (!result[p.courseId]) {
        result[p.courseId] = [];
      }

      result[p.courseId].push({
        facultyName: p.facultyName,
        order: p.order
      });
    });

    // convert object into array format
    const formatted = Object.keys(result).map(course => ({
      courseId: course,
      instructors: result[course]
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch preferences by course",
      error: error.message
    });
  }
};

// POST — save submitted preferences for a faculty member
export const submitPreferences = async (req, res) => {
  try {
    const { termId, facultyName, preferences } = req.body;

    if (!termId || !facultyName) {
      return res.status(400).json({
        message: "Term ID and faculty name are required",
      });
    }

    if (!preferences || preferences.length === 0) {
      return res.status(400).json({
        message: "At least one course must be selected",
      });
    }

    // remove old preferences for the same faculty and term
    await Preferences.deleteMany({ termId, facultyName });

    // create new ranked preferences
    const docs = preferences.map((pref, index) => ({
      termId,
      facultyName,
      courseId: pref.courseId,
      order: pref.order ?? index + 1,
    }));

    await Preferences.insertMany(docs);

    res.status(201).json({
      message: "Preferences submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit preferences",
      error: error.message,
    });
  }
};