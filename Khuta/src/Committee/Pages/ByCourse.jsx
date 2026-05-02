/**
 * ByCourse.jsx
 *
 * PROPS:
 * @param {Array} termCourses             - course IDs from Sections (table rows)
 * @param {Array} prefByCourse            - [{ courseId, instructors: [{ facultyName, order }] }]
 * @param {Array} sectionNumbers          - [{ courseId, type, maleSections, femaleSections }]
 * @param {Array} existingAssignments     - from DB, pre-check assigned instructors
 * @param {Array} newAssignments          - added this session, filter dropdown
 * @param {Array} coursesWithNoPreference - highlight red if no instructor selected this course
 * @param {Array} facultyList             - all faculty (for search/add)
 * @param {Function} onAdd
 * @param {Function} onRemove
 * @param {Function} onRemoveExisting     - remove from existing assignments
 */
import { useState } from "react";

export default function ByCourse({ termCourses, prefByCourse, sectionNumbers, existingAssignments, newAssignments, coursesWithNoPreference, facultyList, onAdd, onRemove, onRemoveExisting }) {

  const [selected, setSelected] = useState({});

  // Search state per course — to add instructors manually
  const [searchQuery, setSearchQuery] = useState({});
  // Manually added instructor cards per course
  const [manualCards, setManualCards] = useState({});

  const toggleInstructor = (courseId, instructorName) => {
    const key = `${courseId}-${instructorName}`;
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSelected = (courseId, instructorName) => !!selected[`${courseId}-${instructorName}`];

  const wasAssigned = (instructorName, courseId) =>
    existingAssignments.some(a => a.instructorName === instructorName && a.courseId === courseId);

  // Add an instructor card manually to a course
  const addManualCard = (courseId, instructorName) => {
    setManualCards(prev => {
      const existing = prev[courseId] || [];
      if (existing.includes(instructorName)) return prev;
      return { ...prev, [courseId]: [...existing, instructorName] };
    });
    setSearchQuery(prev => ({ ...prev, [courseId]: '' }));
    // Auto-expand
    const key = `${courseId}-${instructorName}`;
    setSelected(prev => ({ ...prev, [key]: true }));
  };

  // Get search results for a specific course
  const getSearchResults = (courseId) => {
    const query = searchQuery[courseId] || '';
    if (!query) return [];
    const normalize = (s) => s.replace(/\s/g, '').toUpperCase();
    const coursePref = prefByCourse.find(p => p.courseId === courseId);
    const prefNames = coursePref?.instructors?.map(i => i.facultyName) || [];
    const manuals = manualCards[courseId] || [];
    return facultyList.filter(f =>
      normalize(f.name).includes(normalize(query)) &&
      !prefNames.includes(f.name) &&
      !manuals.includes(f.name)
    ).map(f => f.name);
  };

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
  const coursesPerPage = 4;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = termCourses.slice(startIndex, startIndex + coursesPerPage);
  const totalPages = Math.ceil(termCourses.length / coursesPerPage);

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
        {/* Existing sections — now removable */}
        {existingSecs.map(sec => (
          <span key={sec} style={{ background: '#d0d0d0', borderRadius: 4, padding: '2px 6px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            {sec}
            <span style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
              onClick={() => onRemoveExisting(courseId, type, sec, instructorName)}>×</span>
          </span>
        ))}
        {/* New sections */}
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

  // Reusable instructor card
  const InstructorCard = ({ courseId, instructorName, rank }) => {
    const expanded = isSelected(courseId, instructorName) || wasAssigned(instructorName, courseId);
    return (
      <div className={`ac-course-tag${expanded ? ' ac-course-tag--assigned' : ''}`}>
        <div className="ac-tag-top">
          {rank && <span className="ac-course-rank">{rank}</span>}
          <span className="ac-tag-code">{instructorName}</span>
          <div
            className={`an-checkbox${expanded ? ' an-checkbox-checked' : ''}`}
            onClick={() => toggleInstructor(courseId, instructorName)}
          >
            {expanded && '✓'}
          </div>
        </div>
        {expanded && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: '#555' }}>LEC</div>
            <SectionRow courseId={courseId} type="LEC" gender="male" instructorName={instructorName} />
            <SectionRow courseId={courseId} type="LEC" gender="female" instructorName={instructorName} />
            {hasLab(courseId) && (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 8, marginBottom: 4, color: '#555' }}>LAB</div>
                <SectionRow courseId={courseId} type="LAB" gender="male" instructorName={instructorName} />
                <SectionRow courseId={courseId} type="LAB" gender="female" instructorName={instructorName} />
              </>
            )}
          </div>
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
            {currentCourses.map(courseId => {
              const hasNoPreference = coursesWithNoPreference.includes(courseId);
              const coursePref = prefByCourse.find(p => p.courseId === courseId);
              const manuals = manualCards[courseId] || [];
              const searchResults = getSearchResults(courseId);

              return (
                <tr key={courseId} style={hasNoPreference ? { background: '#fff0f0' } : {}}>
                  <td>
                    <span className="an-course-name" style={hasNoPreference ? { color: 'red' } : {}}>
                      {courseId}
                      {hasNoPreference && <span style={{ fontSize: 11, marginLeft: 6 }}>⚠ no preferences</span>}
                    </span>
                  </td>
                  <td>
                    <div className="ac-courses-grid">
                      {/* Preference cards */}
                      {coursePref?.instructors?.map((inst) => (
                        <InstructorCard key={inst.facultyName} courseId={courseId} instructorName={inst.facultyName} rank={inst.order} />
                      ))}
                      {/* Manually added cards */}
                      {manuals.map(instructorName => (
                        <InstructorCard key={instructorName} courseId={courseId} instructorName={instructorName} />
                      ))}
                    </div>

                    {/* Search to add instructor manually */}
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        className="an-term-input"
                        type="text"
                        placeholder="Search instructor to add..."
                        value={searchQuery[courseId] || ''}
                        onChange={e => setSearchQuery(prev => ({ ...prev, [courseId]: e.target.value }))}
                        style={{ fontSize: 12, padding: '4px 8px', width: 200 }}
                      />
                    </div>
                    {searchResults.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        {searchResults.map(name => (
                          <button
                            key={name}
                            style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, border: '1px solid #aaa', cursor: 'pointer', background: '#f5f5f5' }}
                            onClick={() => addManualCard(courseId, name)}
                          >
                            + {name}
                          </button>
                        ))}
                      </div>
                    )}
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