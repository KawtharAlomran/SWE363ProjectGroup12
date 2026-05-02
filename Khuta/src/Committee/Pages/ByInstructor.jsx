/**
 * ByInstructor.jsx
 * WHAT CHANGED:
 * - Added unassignedInstructors prop — highlights instructors with no assignments in red
 * - Existing sections shown as grey tags (not removable)
 * - New sections shown as blue tags (removable)
 * - Available sections filtered only from newAssignments
 */
import { useState } from "react";

export default function ByInstructor({ instructors, sectionNumbers, existingAssignments, newAssignments, unassignedInstructors, onAdd, onRemove }) {

  const [selected, setSelected] = useState({});

  const toggleCourse = (instructorName, courseId) => {
    const key = `${instructorName}-${courseId}`;
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSelected = (instructorName, courseId) => !!selected[`${instructorName}-${courseId}`];
  const wasAssigned = (instructorName, courseId) =>
    existingAssignments.some(a => a.instructorName === instructorName && a.courseId === courseId);

  const getAvailableSections = (courseId, type, gender) => {
    const sectionData = sectionNumbers.find(s => s.courseId === courseId && s.type === type);
    if (!sectionData) return [];
    const allSections = gender === 'male' ? sectionData.maleSections : sectionData.femaleSections;
    const takenThisSession = newAssignments
      .filter(a => a.courseId === courseId && a.type === type).map(a => a.section);
    return allSections.filter(s => !takenThisSession.includes(s));
  };

  const getNewSections = (courseId, type, instructorName) =>
    newAssignments.filter(a =>
      a.courseId === courseId && a.type === type && a.instructorName === instructorName
    ).map(a => a.section);

  const getExistingSections = (courseId, type, instructorName) =>
    existingAssignments.filter(a =>
      a.courseId === courseId && a.type === type && a.instructorName === instructorName
    ).map(a => a.section);

  const hasLab = (courseId) => sectionNumbers.some(s => s.courseId === courseId && s.type === 'LAB');

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

  const SectionRow = ({ courseId, type, gender, instructorName }) => {
    const available = getAvailableSections(courseId, type, gender)
      .filter(s => gender === 'male' ? !s.startsWith('F') : s.startsWith('F'));
    const existingSecs = getExistingSections(courseId, type, instructorName)
      .filter(s => gender === 'male' ? !s.startsWith('F') : s.startsWith('F'));
    const newSecs = getNewSections(courseId, type, instructorName)
      .filter(s => gender === 'male' ? !s.startsWith('F') : s.startsWith('F'));

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
        <span style={{ fontSize: 12, width: 16, flexShrink: 0 }}>{gender === 'male' ? 'M:' : 'F:'}</span>
        {existingSecs.map(sec => (
          <span key={sec} style={{ background: '#d0d0d0', borderRadius: 4, padding: '2px 6px', fontSize: 12 }}>{sec}</span>
        ))}
        {newSecs.map(sec => (
          <span key={sec} style={{ background: '#e0f0ff', borderRadius: 4, padding: '2px 6px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
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
              <th>Instructor</th>
              <th>Preferences</th>
            </tr>
          </thead>
          <tbody>
            {currentInstructors.map(inst => {
              // Highlight instructor row in red if no courses assigned
              const isUnassigned = unassignedInstructors?.includes(inst.facultyName);
              return (
                <tr key={inst.facultyName} style={isUnassigned ? { background: '#fff0f0' } : {}}>
                  <td>
                    <span className="an-course-name" style={isUnassigned ? { color: 'red' } : {}}>
                      {inst.facultyName}
                      {isUnassigned && <span style={{ fontSize: 11, marginLeft: 6 }}>⚠ unassigned</span>}
                    </span>
                  </td>
                  <td>
                    <div className="ac-courses-grid">
                      {inst.preferences?.map((pref) => (
                        <div
                          key={pref.courseId}
                          className={`ac-course-tag${isSelected(inst.facultyName, pref.courseId) || wasAssigned(inst.facultyName, pref.courseId) ? ' ac-course-tag--assigned' : ''}`}
                        >
                          <div className="ac-tag-top">
                            <span className="ac-course-rank">{pref.order}</span>
                            <span className="ac-tag-code">{pref.courseId}</span>
                            <div
                              className={`an-checkbox${isSelected(inst.facultyName, pref.courseId) || wasAssigned(inst.facultyName, pref.courseId) ? ' an-checkbox-checked' : ''}`}
                              onClick={() => toggleCourse(inst.facultyName, pref.courseId)}
                            >
                              {(isSelected(inst.facultyName, pref.courseId) || wasAssigned(inst.facultyName, pref.courseId)) && '✓'}
                            </div>
                          </div>
                          {(isSelected(inst.facultyName, pref.courseId) || wasAssigned(inst.facultyName, pref.courseId)) && (
                            <div style={{ marginTop: 8 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: '#555' }}>LEC</div>
                              <SectionRow courseId={pref.courseId} type="LEC" gender="male" instructorName={inst.facultyName} />
                              <SectionRow courseId={pref.courseId} type="LEC" gender="female" instructorName={inst.facultyName} />
                              {hasLab(pref.courseId) && (
                                <>
                                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 8, marginBottom: 4, color: '#555' }}>LAB</div>
                                  <SectionRow courseId={pref.courseId} type="LAB" gender="male" instructorName={inst.facultyName} />
                                  <SectionRow courseId={pref.courseId} type="LAB" gender="female" instructorName={inst.facultyName} />
                                </>
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