import { Assignment } from "../models/Assignment.js";
import { Section } from "../models/Sections.js";

// GET — fetch all assignments for a specific term
export const getAssignmentsByTerm = async (req, res) => {
  try {
    const assignments = await Assignment.find({ term: req.params.termId });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments", error: error.message });
  }
};

// GET — fetch sections for a term with generated section numbers
// Returns: { courseId, type, sections: ["01","02",...] } for male
//      and { courseId, type, sections: ["F01","F02",...] } for female
export const getSectionNumbers = async (req, res) => {
  try {
    const sectionsData = await Section.find({ term: req.params.termId });

    const result = [];

    for (const s of sectionsData) {
      // Generate male section numbers: 01, 02, ...
      const maleSections = Array.from({ length: s.maleSections }, (_, i) =>
        String(i + 1).padStart(2, '0')
      );

      // Generate female section numbers: F01, F02, ...
      const femaleSections = Array.from({ length: s.femaleSections }, (_, i) =>
        `F${String(i + 1).padStart(2, '0')}`
      );

      result.push({
        courseId: s.courseId,
        type: s.type,
        maleSections,
        femaleSections,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch section numbers", error: error.message });
  }
};

// POST — save assignments for a term (replaces existing ones)
export const saveAssignments = async (req, res) => {
  try {
    const { termId, assignments } = req.body;

    // Delete existing assignments for this term then insert new ones
    await Assignment.deleteMany({ term: termId });

    if (assignments.length > 0) {
      await Assignment.insertMany(assignments.map(a => ({
        term: termId,
        courseId: a.courseId,
        type: a.type,
        section: a.section,
        instructorName: a.instructorName,
      })));
    }

    res.status(200).json({ message: "Assignments saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save assignments", error: error.message });
  }
};