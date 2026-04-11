import { getTermSections } from '../../data';
import { useState } from "react";

// Reusable select component for choosing number of sections (0–15)
function SectionSelect({ value, onChange }) {
  return (
    <select className="an-select" value={value} onChange={e => onChange(Number(e.target.value))}>
      {[...Array(16)].map((_, i) => <option key={i} value={i}>{i}</option>)}
    </select>
  );
}

// Displays courses grouped by instructor
// Each course shows a checkbox, and if assigned shows Lec/Lab section selects
export default function ByInstructor({ instructors, onToggle, onUpdateSection, termNum }) {
  // Get section limits for selected term
  const termSections = getTermSections(termNum);

  // Pagination — 4 instructors per page
  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 4;
  const startIndex = (currentPage - 1) * instructorsPerPage;
  const currentInstructors = instructors.slice(startIndex, startIndex + instructorsPerPage);
  const totalPages = Math.ceil(instructors.length / instructorsPerPage);

  return (
    <>
      <div className="ac-table-wrap">
        <table className="an-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Instructor</th>
              <th>Preferences</th>
            </tr>
          </thead>
          <tbody>
            {currentInstructors.map(inst => (
              <tr key={inst.id}>
                <td><span className="an-course-name">{inst.name}</span></td>
                <td>
                  <div className="ac-courses-grid">
                    {inst.courses.map(course => {
                      const termCourse = termSections.find(t => t.code === course.code);
                      return (
                        <div key={course.id} className={`ac-course-tag${course.assigned ? ' ac-course-tag--assigned' : ''}`}>
                          <div className="ac-tag-top">
                            <span className="ac-course-rank">{course.rank}</span>
                            <span className="ac-tag-code">{course.code}</span>
                            <div
                              className={`an-checkbox${course.assigned ? ' an-checkbox-checked' : ''}`}
                              onClick={() => onToggle(inst.id, course.id)}
                            >
                              {course.assigned && '✓'}
                            </div>
                          </div>

                          {/* Show section selects only when course is assigned and exists in term */}
                          {course.assigned && termCourse && (
                            <div className="ac-sections">
                              <div className="an-section-row">
                                <span>M: Lec</span>
                                <SectionSelect value={course.maleLec || 0} onChange={v => onUpdateSection(inst.id, course.id, 'maleLec', v)} />
                                {termCourse.hasLab && <>
                                  <span>, Lab</span>
                                  <SectionSelect value={course.maleLab || 0} onChange={v => onUpdateSection(inst.id, course.id, 'maleLab', v)} />
                                </>}
                              </div>
                              <div className="an-section-row">
                                <span>F: Lec</span>
                                <SectionSelect value={course.femaleLec || 0} onChange={v => onUpdateSection(inst.id, course.id, 'femaleLec', v)} />
                                {termCourse.hasLab && <>
                                  <span>, Lab</span>
                                  <SectionSelect value={course.femaleLab || 0} onChange={v => onUpdateSection(inst.id, course.id, 'femaleLab', v)} />
                                </>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="pageNumbers">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i+1} className={currentPage === i+1 ? 'active' : ''} onClick={() => setCurrentPage(i+1)}>
            {i+1}
          </button>
        ))}
      </div>
    </>
  );
}