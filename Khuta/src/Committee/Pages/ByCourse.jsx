import { getTermSections } from '../../data';
import { useState } from "react";

function SectionSelect({ value, onChange, hasError }) {
  return (
    <select
      className="an-select"
      value={value}
      style={hasError ? { border: '1.5px solid red', borderRadius: 4 } : {}}
      onChange={e => onChange(Number(e.target.value))}
    >
      {[...Array(16)].map((_, i) => <option key={i} value={i}>{i}</option>)}
    </select>
  );
}

export default function ByCourse({ courses, onToggle, onUpdateSection, termNum, sectionError }) {
  const termSections = getTermSections(termNum);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  return (
    <>
      <div className="ac-table-wrap">
        <table className="an-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Course number</th>
              <th>Interested instructors</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map(course => {
              const termCourse = termSections.find(t => t.code === course.code);
              return (
                <tr key={course.id}>
                  <td><span className="an-course-name">{course.code}</span></td>
                  <td>
                    <div className="ac-courses-grid">
                      {course.instructors.map((inst, index) => (
                        <div key={inst.id} className={`ac-course-tag${inst.assigned ? ' ac-course-tag--assigned' : ''}`}>
                          <div className="ac-tag-top">
                            <span className="ac-course-rank">{index + 1}</span>
                            <span className="ac-tag-code">{inst.name}</span>
                            <div
                              className={`an-checkbox${inst.assigned ? ' an-checkbox-checked' : ''}`}
                              onClick={() => onToggle(inst.id, course.id)}
                            >
                              {inst.assigned && '✓'}
                            </div>
                          </div>

                          {inst.assigned && termCourse && (
                            <div className="ac-sections">
                              <div className="an-section-row">
                                <span>M: Lec</span>
                                <SectionSelect
                                  value={inst.maleLec || 0}
                                  hasError={sectionError?.instructorId === inst.id && sectionError?.courseId === course.id && sectionError?.field === 'maleLec'}
                                  onChange={v => onUpdateSection(inst.id, course.id, 'maleLec', v)}
                                />
                                {termCourse.hasLab && <>
                                  <span>, Lab</span>
                                  <SectionSelect
                                    value={inst.maleLab || 0}
                                    hasError={sectionError?.instructorId === inst.id && sectionError?.courseId === course.id && sectionError?.field === 'maleLab'}
                                    onChange={v => onUpdateSection(inst.id, course.id, 'maleLab', v)}
                                  />
                                </>}
                              </div>
                              <div className="an-section-row">
                                <span>F: Lec</span>
                                <SectionSelect
                                  value={inst.femaleLec || 0}
                                  hasError={sectionError?.instructorId === inst.id && sectionError?.courseId === course.id && sectionError?.field === 'femaleLec'}
                                  onChange={v => onUpdateSection(inst.id, course.id, 'femaleLec', v)}
                                />
                                {termCourse.hasLab && <>
                                  <span>, Lab</span>
                                  <SectionSelect
                                    value={inst.femaleLab || 0}
                                    hasError={sectionError?.instructorId === inst.id && sectionError?.courseId === course.id && sectionError?.field === 'femaleLab'}
                                    onChange={v => onUpdateSection(inst.id, course.id, 'femaleLab', v)}
                                  />
                                </>}
                              </div>
                              {/* Inline error message below the selects */}
                              {sectionError?.instructorId === inst.id && sectionError?.courseId === course.id && (
                                <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                  Max {sectionError.max} sections for {sectionError.code}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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