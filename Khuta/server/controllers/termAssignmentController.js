import { Assignment } from "../models/Assignment.js";
import { Section } from "../models/Sections.js";
import { Term } from "../models/Term.js";
import { Course } from "../models/Course.js";
import { Faculty } from "../models/Faculty.js";

// Teaching load max hours per rank
const facultyHours = {
  "Professor": 6,
  "Associate Professor": 9,
  "Assistant Professor": 9,
  "Chair Professor": 9,
  "Instructor": 12,
  "Senior Lecturer": 12,
  "Lecturer": 12
};

// POST — save sections for a new term (also saves term to Terms collection)
export const addSections = async (req, res) => {
  try {
    const { termId, courses } = req.body;

    // Check if term already exists — prevent duplicate terms
    const existingTerm = await Term.findOne({ termId });
    if (existingTerm) {
      return res.status(409).json({ message: `Term ${termId} already exists` });
    }

    await Term.create({ termId });
    await Section.deleteMany({ term: termId });

    const sectionDocs = [];
    for (const course of courses) {
      sectionDocs.push({
        term: termId, courseId: course.code, type: "LEC",
        maleSections: course.maleLec, femaleSections: course.femaleLec,
      });
      if (course.hasLab) {
        sectionDocs.push({
          term: termId, courseId: course.code, type: "LAB",
          maleSections: course.maleLab, femaleSections: course.femaleLab,
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

// PUT — update sections for an existing term
export const updateSections = async (req, res) => {
  try {
    const { termId } = req.params;
    const { courses } = req.body;

    await Section.deleteMany({ term: termId });

    const sectionDocs = [];
    for (const course of courses) {
      sectionDocs.push({
        term: termId, courseId: course.code, type: "LEC",
        maleSections: course.maleLec, femaleSections: course.femaleLec,
      });
      if (course.hasLab) {
        sectionDocs.push({
          term: termId, courseId: course.code, type: "LAB",
          maleSections: course.maleLab, femaleSections: course.femaleLab,
        });
      }
    }

    if (sectionDocs.length > 0) await Section.insertMany(sectionDocs);
    res.status(200).json({ message: "Sections updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update sections", error: error.message });
  }
};

// GET — fetch existing assignments for a term
export const getAssignmentsByTerm = async (req, res) => {
  try {
    const assignments = await Assignment.find({ term: req.params.termId });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments", error: error.message });
  }
};

// GET — generate section numbers from Sections collection
// male: ["01","02"...] female: ["F01","F02"...]
export const getSectionNumbers = async (req, res) => {
  try {
    const sectionsData = await Section.find({ term: req.params.termId });

    const result = sectionsData.map(s => ({
      courseId: s.courseId,
      type: s.type,
      maleSections: Array.from({ length: s.maleSections }, (_, i) =>
        String(i + 1).padStart(2, '0')
      ),
      femaleSections: Array.from({ length: s.femaleSections }, (_, i) =>
        `F${String(i + 1).padStart(2, '0')}`
      ),
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch section numbers", error: error.message });
  }
};

// POST — save assignments (replaces existing ones for this term)
export const saveAssignments = async (req, res) => {
  try {
    const { termId, assignments } = req.body;

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

// GET — generate recommendations for assigning instructors to courses
// Logic:
// 1. Courses with only one interested instructor → assign automatically
// 2. Courses with multiple instructors → prefer who taught it in previous terms
// 3. Respect teaching load max hours per rank
export const getRecommendations = async (req, res) => {
  try {
    const { termId } = req.params;

    const [sections, preferences, allAssignments, allCourses, allFaculty] = await Promise.all([
      Section.find({ term: termId }),
      // Get preferences for this term from Preferences collection
      import("../models/Preferences.js").then(m => m.Preferences.find({ termId })),
      Assignment.find(), // all past assignments
      Course.find(),
      Faculty.find(),
    ]);

    // Get unique course IDs for this term
    const termCourseIds = [...new Set(sections.map(s => s.courseId))];

    // Group preferences by course
    const prefByCourse = {};
    preferences.forEach(p => {
      if (!prefByCourse[p.courseId]) prefByCourse[p.courseId] = [];
      prefByCourse[p.courseId].push({ name: p.facultyName, order: p.order });
    });

    // Track estimated teaching hours per instructor
    const instructorHours = {};

    const recommendations = [];

    for (const courseId of termCourseIds) {
      const interested = prefByCourse[courseId] || [];
      const courseInfo = allCourses.find(c => c.code === courseId);
      const creditHours = courseInfo?.credit_hours ?? 3;

      // Get section counts for this course
      const lecSection = sections.find(s => s.courseId === courseId && s.type === 'LEC');
      const totalSections = lecSection ? (lecSection.maleSections + lecSection.femaleSections) : 0;

      let recommended = null;
      let reason = '';

      if (interested.length === 0) {
        // No one wants this course — flag it red
        recommendations.push({
          courseId,
          recommended: null,
          reason: 'no_preference',
          warning: 'No instructor has selected this course',
          interested: []
        });
        continue;
      }

      if (interested.length === 1) {
        // Only one instructor interested — auto recommend
        recommended = interested[0].name;
        reason = 'only_one';
      } else {
        // Multiple instructors — prefer who taught it before
        const taughtBefore = interested.find(inst =>
          allAssignments.some(a => a.instructorName === inst.name && a.courseId === courseId)
        );

        if (taughtBefore) {
          recommended = taughtBefore.name;
          reason = 'taught_before';
        } else {
          // Pick highest preference (lowest order number)
          const sorted = [...interested].sort((a, b) => a.order - b.order);
          recommended = sorted[0].name;
          reason = 'highest_preference';
        }
      }

      // Check teaching load for recommended instructor
      if (recommended) {
        const faculty = allFaculty.find(f => f.name === recommended);
        const maxHours = facultyHours[faculty?.rank] ?? 12;
        const currentHours = instructorHours[recommended] ?? 0;
        const addedHours = creditHours * totalSections;

        let loadWarning = null;
        if (currentHours + addedHours > maxHours) {
          loadWarning = `${recommended} will exceed max load (${maxHours}h)`;
        }

        instructorHours[recommended] = currentHours + addedHours;

        recommendations.push({
          courseId,
          recommended,
          reason,
          loadWarning,
          currentHours: currentHours + addedHours,
          maxHours,
          interested: interested.sort((a, b) => a.order - b.order)
        });
      }
    }

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate recommendations", error: error.message });
  }
};

// GET — calculate teaching load for all instructors in a term
export const getTeachingLoad = async (req, res) => {
  try {
    const { termId } = req.params;

    const [assignments, allCourses, allFaculty] = await Promise.all([
      Assignment.find({ term: termId }),
      Course.find(),
      Faculty.find(),
    ]);

    const loadData = allFaculty.map(member => {
      const instructorAsm = assignments.filter(a => a.instructorName === member.name);
      const courseMap = {};
      let totalHours = 0;

      instructorAsm.forEach(asm => {
        const courseInfo = allCourses.find(c => c.code === asm.courseId);
        const creditHours = courseInfo?.credit_hours ?? 0;
        totalHours += creditHours;

        if (!courseMap[asm.courseId]) {
          courseMap[asm.courseId] = {
            courseId: asm.courseId,
            name: courseInfo?.name ?? "Unknown",
            creditHours,
            sections: 0
          };
        }
        courseMap[asm.courseId].sections += 1;
      });

      const maxHours = facultyHours[member.rank] ?? 12;

      return {
        name: member.name,
        email: member.email,
        rank: member.rank,
        courses: Object.values(courseMap),
        teachingHours: totalHours,
        maxHours,
        overloaded: totalHours > maxHours
      };
    }).filter(m => m.courses.length > 0); // only show instructors with assignments

    res.status(200).json(loadData);
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate teaching load", error: error.message });
  }
};