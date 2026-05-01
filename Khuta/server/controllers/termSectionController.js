import { Section } from "../models/Sections.js";
import { Term } from "../models/Term.js";

// POST — save sections for a new term (also saves term to Terms collection)
export const addSections = async (req, res) => {
  try {
    const { termId, courses } = req.body;

    // Check if term already exists — prevent duplicate terms
    const existingTerm = await Term.findOne({ termId });
    if (existingTerm) {
      return res.status(409).json({ message: `Term ${termId} already exists` });
    }

    // Save the new term to Terms collection
    await Term.create({ termId });

    // Delete any existing sections for this term before inserting (safety check)
    await Section.deleteMany({ term: termId });

    // Build section documents from selected courses
    const sectionDocs = [];
    for (const course of courses) {
      // Always add LEC section
      sectionDocs.push({
        term: termId,
        courseId: course.code,
        type: "LEC",
        maleSections: course.maleLec,
        femaleSections: course.femaleLec,
      });

      // Add LAB section only if course has a lab
      if (course.hasLab) {
        sectionDocs.push({
          term: termId,
          courseId: course.code,
          type: "LAB",
          maleSections: course.maleLab,
          femaleSections: course.femaleLab,
        });
      }
    }

    await Section.insertMany(sectionDocs);
    res.status(201).json({ message: "Term and sections saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save sections", error: error.message });
  }
};

// GET — fetch all sections for a specific term
export const getSectionsByTerm = async (req, res) => {
  try {
    const sections = await Section.find({ term: req.params.termId });
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sections", error: error.message });
  }
};

// PUT — update sections for an existing term (delete old, insert new)
export const updateSections = async (req, res) => {
  try {
    const { termId } = req.params;
    const { courses } = req.body;

    // Delete old sections for this term then re-insert updated ones
    await Section.deleteMany({ term: termId });

    const sectionDocs = [];
    for (const course of courses) {
      sectionDocs.push({
        term: termId,
        courseId: course.code,
        type: "LEC",
        maleSections: course.maleLec,
        femaleSections: course.femaleLec,
      });

      if (course.hasLab) {
        sectionDocs.push({
          term: termId,
          courseId: course.code,
          type: "LAB",
          maleSections: course.maleLab,
          femaleSections: course.femaleLab,
        });
      }
    }

    if (sectionDocs.length > 0) {
      await Section.insertMany(sectionDocs);
    }

    res.status(200).json({ message: "Sections updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update sections", error: error.message });
  }
};