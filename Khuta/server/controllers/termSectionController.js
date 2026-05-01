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