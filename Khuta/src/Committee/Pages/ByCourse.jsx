// Updated: replaced local data.js with API props
// Added: section number dropdown + tags UI
// Fixed: optional chaining, checkbox, LEC/LAB labels, rank, layout alignment
import { useState } from "react";

export default function ByCourse({ courses, sectionNumbers, assignments, onAdd, onRemove }) {

  const [selected, setSelected] = useState({});

  const toggleInstructor = (courseId, instructorName) => {
    const key = `${courseId}-${instructorName}`;
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSelected = (courseId, instructorName) => !!selected[`${courseId}-${instructorName}`];

  const getAvailableSections = (courseId, type, gender) => {
    const sectionData = sectionNumbers.find(s => s.courseId === courseId && s.type === type);
    if (!sectionData) return [];
    const allSections = gender === 'male' ? sectionData.maleSections : sectionData.femaleSections;
    const assigned = assignments.filter(a => a.courseId === courseId && a.type === type).map(a => a.section);
    return allSections.filter(s => !assigned.includes(s));
  };

  const getAssignedSections = (courseId, type, instructorName) => {
    return assignments.filter(a =>
      a.courseId === courseId && a.type === type && a.instructorName === instructorName
    ).map(a => a.section);
  };

  const hasLab = (courseId) => sectionNumbers.some(s => s.courseId === courseId && s.type === 'LAB');

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) pages.push(i);
    }
    const withEllipsis = [];
    let prev = null;
    for (const page of pages) {
      if (prev && page - prev > 1) withEllipsis.push('...');
      withEllipsis.push(page);
      prev = page;
    }
    return withEllipsis;
  };

  // One row: label + tags + add dropdown
  const SectionRow = ({ courseId, type, gender, instructorName }) => {
    const allAvailable = getAvailableSections(courseId, type, gender);
    const allAssigned = getAssignedSections(courseId, type, instructorName)
      .filter(s => gender === 'male' ? !s.startsWith('F') : s.startsWith('F'));
    const available = allAvailable.filter(s => gender === 'male' ? !s.startsWith('F') : s.startsWith('F'));

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
        <span style={{ fontSize: 12, width: 16, flexShrink: 0 }}>{gender === 'male' ? 'M:' : 'F:'}</span>
        {allAssigned.map(sec => (
          <span key={sec} style={{
            background: '#e0f0ff', borderRadius: 4, padding: '2px 6px',
            fontSize: 12, display: 'flex', alignItems: 'center', gap: 4
          }}>
            {sec}
            <span style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
              onClick={() => onRemove(courseId, type, sec, instructorName)}>×</span>
          </span>
        ))}
        {available.length > 0 && (
          <select className="an-select" value=""
            onChange={e => { if (e.target.value) onAdd(courseId, type, e.target.value, instructorName); }}>
            <option value="">+ Add</option>
            {available.map(sec => <option key={sec} value={sec}>{sec}</option>)}
          </select>
        )}
      </div>
    );
  };

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
            {currentCourses.map(course => (
              <tr key={course.courseId}>
                <td><span className="an-course-name">{course.courseId}</span></td>
                <td>
                  <div className="ac-courses-grid">
                    {course.instructors?.map((inst) => (
                      <div key={inst.facultyName} className={`ac-course-tag${isSelected(course.courseId, inst.facultyName) ? ' ac-course-tag--assigned' : ''}`}>

                        {/* Header: rank + name + checkbox */}
                        <div className="ac-tag-top">
                          <span className="ac-course-rank">{inst.order}</span>
                          <span className="ac-tag-code">{inst.facultyName}</span>
                          <div
                            className={`an-checkbox${isSelected(course.courseId, inst.facultyName) ? ' an-checkbox-checked' : ''}`}
                            onClick={() => toggleInstructor(course.courseId, inst.facultyName)}
                          >
                            {isSelected(course.courseId, inst.facultyName) && '✓'}
                          </div>
                        </div>

                        {/* Section pickers — shown only when instructor is selected */}
                        {isSelected(course.courseId, inst.facultyName) && (
                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: '#555' }}>LEC</div>
                            <SectionRow courseId={course.courseId} type="LEC" gender="male" instructorName={inst.facultyName} />
                            <SectionRow courseId={course.courseId} type="LEC" gender="female" instructorName={inst.facultyName} />

                            {hasLab(course.courseId) && (
                              <>
                                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 8, marginBottom: 4, color: '#555' }}>LAB</div>
                                <SectionRow courseId={course.courseId} type="LAB" gender="male" instructorName={inst.facultyName} />
                                <SectionRow courseId={course.courseId} type="LAB" gender="female" instructorName={inst.facultyName} />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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