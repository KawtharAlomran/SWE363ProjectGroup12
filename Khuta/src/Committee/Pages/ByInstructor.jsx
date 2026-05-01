// Updated: replaced local data.js with API props
// Added: section number dropdown + tags UI
// Fixed: optional chaining on inst.preferences to prevent undefined map error
import { useState } from "react";

export default function ByInstructor({ instructors, sectionNumbers, assignments, onAdd, onRemove }) {

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

  const SectionPicker = ({ courseId, type, gender, instructorName }) => {
    const available = getAvailableSections(courseId, type, gender);
    const assigned = getAssignedSections(courseId, type, instructorName)
      .filter(s => gender === 'male' ? !s.startsWith('F') : s.startsWith('F'));

    return (
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12 }}>{gender === 'male' ? 'M' : 'F'}:</span>
          {assigned.map(sec => (
            <span key={sec} style={{
              background: '#e0f0ff', borderRadius: 4, padding: '2px 6px',
              fontSize: 12, display: 'flex', alignItems: 'center', gap: 4
            }}>
              {sec}
              <span style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
                onClick={() => onRemove(courseId, type, sec, instructorName)}>×</span>
            </span>
          ))}
          {available.filter(s => gender === 'male' ? !s.startsWith('F') : s.startsWith('F')).length > 0 && (
            <select className="an-select" value=""
              onChange={e => { if (e.target.value) onAdd(courseId, type, e.target.value, instructorName); }}>
              <option value="">+ Add</option>
              {available
                .filter(s => gender === 'male' ? !s.startsWith('F') : s.startsWith('F'))
                .map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>
          )}
        </div>
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
            {currentInstructors.map(inst => (
              <tr key={inst.facultyName}>
                <td><span className="an-course-name">{inst.facultyName}</span></td>
                <td>
                  <div className="ac-courses-grid">
                    {/* Fixed: optional chaining to prevent undefined map error */}
                    {inst.preferences?.map((pref) => (
                      <div key={pref.courseId} className="ac-course-tag">
                        <div className="ac-tag-top">
                          <span className="ac-course-rank">{pref.order}</span>
                          <span className="ac-tag-code">{pref.courseId}</span>
                        </div>
                        <SectionPicker courseId={pref.courseId} type="LEC" gender="male" instructorName={inst.facultyName} />
                        <SectionPicker courseId={pref.courseId} type="LEC" gender="female" instructorName={inst.facultyName} />
                        {hasLab(pref.courseId) && <>
                          <SectionPicker courseId={pref.courseId} type="LAB" gender="male" instructorName={inst.facultyName} />
                          <SectionPicker courseId={pref.courseId} type="LAB" gender="female" instructorName={inst.facultyName} />
                        </>}
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