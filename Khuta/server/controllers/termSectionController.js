import { Section } from "../models/Sections.js";
import { Term } from "../models/Term.js";
import { Course } from "../models/Course.js";

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

export const getUniqueCoursesByTerm = async (req, res) => {
  try {
    const { termId } = req.params;
    
    const sections = await Section.find({ term: termId });
    const allCourses = await Course.find();

    const uniqueList = [];
    const seen = new Set();

    sections.forEach(section => {
      if (!seen.has(section.courseId)) {
        seen.add(section.courseId);
        
        const courseDetails = allCourses.find(c => c.code === section.courseId);
        
        uniqueList.push({
          _id: section._id,
          courseId: section.courseId,
          name: courseDetails ? courseDetails.name : "Name not found"
        });
      }
    });

    // --- ADD SORTING LOGIC HERE ---
    uniqueList.sort((a, b) => {
      // Split "ICS 353" into ["ICS", "353"]
      const [prefixA, numA] = a.courseId.split(" ");
      const [prefixB, numB] = b.courseId.split(" ");

      // 1. Sort by Prefix
      if (prefixA !== prefixB) {
        // If prefixA is ICS, it should come first (-1)
        return prefixA === "ICS" ? -1 : 1;
      }

      // 2. Sort by Number (Smallest to Largest)
      return parseInt(numA) - parseInt(numB);
    });

    res.status(200).json(uniqueList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unique courses", error: error.message });
  }
};