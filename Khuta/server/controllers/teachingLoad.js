import { Assignment } from "../models/Assignment.js";
import { Course } from "../models/Course.js";
import { Faculty } from "../models/Faculty.js";

const facultyHours = {
  "Professor": 6,
  "Associate Professor": 9,
  "Assistant Professor": 9,
  "Chair Professor": 9,
  "Instructor": 12,
  "Senior Lecturer": 12,
  "Lecturer": 12
};

export const getTeachingLoadByTerm = async (req, res) => {
  try {
    const { termId } = req.params;

    const [assignments, allCourses, facultyList] = await Promise.all([
      Assignment.find({ term: termId }),
      Course.find(),
      Faculty.find()
    ]);

    const loadData = facultyList.map(member => {
      const instructorAsm = assignments.filter(a => a.instructorName === member.name);
      const courseMap = {};
      let totalHours = 0;

      instructorAsm.forEach(asm => {
        const courseInfo = allCourses.find(c => c.code === asm.courseId);
        const creditHours = courseInfo ? courseInfo.credit_hours : 0;
        // Each section counts as creditHours (original correct logic)
        totalHours += creditHours;

        if (!courseMap[asm.courseId]) {
          courseMap[asm.courseId] = {
            courseId: asm.courseId,
            name: courseInfo ? courseInfo.name : "Unknown Course",
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
    });

    res.status(200).json(loadData);
  } catch (error) {
    res.status(500).json({ message: "Error calculating load", error: error.message });
  }
};