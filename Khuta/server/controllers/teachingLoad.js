import { Assignment } from "../models/Assignment.js";
import { Course } from "../models/Course.js";
import { Faculty } from "../models/Faculty.js";

export const getTeachingLoadByTerm = async (req, res) => {
  try {
    const { termId } = req.params;

    const [assignments, allCourses, facultyList] = await Promise.all([
      Assignment.find({ term: termId }),
      Course.find(),
      Faculty.find()
    ]);

    const loadData = facultyList.map(member => {
      // find assignments where instructorName matches Faculty name
      const instructorAsm = assignments.filter(a => a.instructorName === member.name);
      const courseMap = {};
      let totalHours = 0;

      instructorAsm.forEach(asm => {
        const courseInfo = allCourses.find(c => c.code === asm.courseId);
        
        const creditHours = courseInfo ? courseInfo.credit_hours : 0; 
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

      return {
        name: member.name,
        email: member.email,
        rank: member.rank, 
        courses: Object.values(courseMap),
        teachingHours: totalHours
      };
    });

    res.status(200).json(loadData);
  } catch (error) {
    res.status(500).json({ message: "Error calculating load", error: error.message });
  }
};