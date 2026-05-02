import { Preferences } from "../models/Preferences.js";

// GET — fetch all faculty preferences for a specific term
export const getPreferencesByTerm = async (req, res) => {
  try {
    const { termId } = req.params;
    const preferences = await Preferences.find({ termId }).sort({ facultyName: 1, order: 1 });
    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch preferences", error: error.message });
  }
};

// GET — group preferences by instructor
export const getPreferencesByInstructor = async (req, res) => {
  try {
    const { termId } = req.params;
    const data = await Preferences.find({ termId }).sort({ facultyName: 1, order: 1 });
    const result = {};
    data.forEach(p => {
      if (!result[p.facultyName]) result[p.facultyName] = [];
      result[p.facultyName].push({ courseId: p.courseId, order: p.order });
    });
    const formatted = Object.keys(result).map(name => ({
      facultyName: name,
      preferences: result[name]
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch preferences by instructor", error: error.message });
  }
};

// GET — group preferences by course
export const getPreferencesByCourse = async (req, res) => {
  try {
    const { termId } = req.params;
    const data = await Preferences.find({ termId }).sort({ courseId: 1, order: 1 });
    const result = {};
    data.forEach(p => {
      if (!result[p.courseId]) result[p.courseId] = [];
      result[p.courseId].push({ facultyName: p.facultyName, order: p.order });
    });
    const formatted = Object.keys(result).map(course => ({
      courseId: course,
      instructors: result[course]
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch preferences by course", error: error.message });
  }
};

// POST — save submitted preferences for a faculty member
export const submitPreferences = async (req, res) => {
  try {
    const { termId, facultyName, preferences } = req.body;
    if (!termId || !facultyName) {
      return res.status(400).json({ message: "Term ID and faculty name are required" });
    }
    if (!preferences || preferences.length === 0) {
      return res.status(400).json({ message: "At least one course must be selected" });
    }
    await Preferences.deleteMany({ termId, facultyName });
    const docs = preferences.map((pref, index) => ({
      termId,
      facultyName,
      courseId: pref.courseId,
      order: pref.order ?? index + 1,
    }));
    await Preferences.insertMany(docs);
    res.status(201).json({ message: "Preferences submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit preferences", error: error.message });
  }
};

// POST — manually add a course preference with order 0 (added by committee)
export const addManualPreference = async (req, res) => {
  try {
    const { termId, facultyName, courseId } = req.body;
    if (!termId || !facultyName || !courseId) {
      return res.status(400).json({ message: "termId, facultyName, and courseId are required" });
    }

    // Check if already exists — avoid duplicates
    const existing = await Preferences.findOne({ termId, facultyName, courseId });
    if (existing) {
      return res.status(409).json({ message: "Preference already exists" });
    }

    await Preferences.create({ termId, facultyName, courseId, order: 0 });
    res.status(201).json({ message: "Manual preference added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add manual preference", error: error.message });
  }
};