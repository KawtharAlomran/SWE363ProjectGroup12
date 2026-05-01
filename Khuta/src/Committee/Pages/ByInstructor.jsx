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

export default function ByInstructor({ instructors, onToggle, onUpdateSection, termNum, sectionError }) {
  const termSections = getTermSections(termNum);

  // pages logic 
  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 4;
  const startIndex = (currentPage - 1) * instructorsPerPage;
  const currentInstructors = instructors.slice(startIndex, startIndex + instructorsPerPage);
  const totalPages = Math.ceil(instructors.length / instructorsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      }
    }
     const withEllipsis = [];
    let prev = null;
    for (const page of pages) {
      if (prev && page - prev > 1) withEllipsis.push('...');
      withEllipsis.push(page);
      prev = page;
    }
    return withEllipsis;
  }

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
                    {inst.courses.map((course, index) => {
                      const termCourse = termSections.find(t => t.code === course.code);
                      return (
                        <div key={course.id} className={`ac-course-tag${course.assigned ? ' ac-course-tag--assigned' : ''}`}>
                          <div className="ac-tag-top">
                            <span className="ac-course-rank">{index + 1}</span>
                            <span className="ac-tag-code">{course.code}</span>
                            <div
                              className={`an-checkbox${course.assigned ? ' an-checkbox-checked' : ''}`}
                              onClick={() => onToggle(inst.id, course.id)}
                            >
                              {course.assigned && '✓'}
                            </div>
                          </div>

                          {course.assigned && termCourse && (
                            <div className="ac-sections">
                              <div className="an-section-row">
                                <span>M: Lec</span>
                                <SectionSelect
                                  value={course.maleLec || 0}
                                  hasError={sectionError?.instructorId === inst.id && sectionError?.courseId === course.id && sectionError?.field === 'maleLec'}
                                  onChange={v => onUpdateSection(inst.id, course.id, 'maleLec', v)}
                                />
                                {termCourse.hasLab && <>
                                  <span>, Lab</span>
                                  <SectionSelect
                                    value={course.maleLab || 0}
                                    hasError={sectionError?.instructorId === inst.id && sectionError?.courseId === course.id && sectionError?.field === 'maleLab'}
                                    onChange={v => onUpdateSection(inst.id, course.id, 'maleLab', v)}
                                  />
                                </>}
                              </div>
                              <div className="an-section-row">
                                <span>F: Lec</span>
                                <SectionSelect
                                  value={course.femaleLec || 0}
                                  hasError={sectionError?.instructorId === inst.id && sectionError?.courseId === course.id && sectionError?.field === 'femaleLec'}
                                  onChange={v => onUpdateSection(inst.id, course.id, 'femaleLec', v)}
                                />
                                {termCourse.hasLab && <>
                                  <span>, Lab</span>
                                  <SectionSelect
                                    value={course.femaleLab || 0}
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
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Smart pagination */}
        {totalPages > 1 && (
          <div className="pageNumbers">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
            {getPageNumbers().map((page, i) =>
              page === '...'
                ? <span key={`ellipsis-${i}`} style={{ margin: '0 4px' }}>...</span>
                : <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>{page}</button>
            )}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
          </div>
        )}
    </>
  );
}