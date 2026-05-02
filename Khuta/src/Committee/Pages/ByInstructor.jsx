/**
 * ByInstructor.jsx
 *
 * PROPS:
 * @param {Array} facultyList               - all faculty from Faculty collection (table rows)
 * @param {Array} prefByInstructor          - [{ facultyName, preferences: [{ courseId, order }] }]
 * @param {Array} sectionNumbers            - [{ courseId, type, maleSections, femaleSections }]
 * @param {Array} existingAssignments       - from DB, pre-check assigned instructors
 * @param {Array} newAssignments            - added this session, filter dropdown
 * @param {Array} instructorsWithNoPreference - highlight red if no preferences and no existing assignments
 * @param {Array} termCourses               - all course IDs in this term (for search/add)
 * @param {Array} loadWarnings              - overloaded faculty [{ name, teachingHours, maxHours }]
 * @param {Function} onAdd
 * @param {Function} onRemove
 * @param {Function} onRemoveExisting       - remove from existing assignments
 */
import { useState } from "react";

export default function ByInstructor({ facultyList, prefByInstructor, sectionNumbers, existingAssignments, newAssignments, instructorsWithNoPreference, termCourses, loadWarnings, termId, onAdd, onRemove, onRemoveExisting }) {

  const [selected, setSelected] = useState({});
  const [searchQuery, setSearchQuery] = useState({});
  const [manualCards, setManualCards] = useState({});

  const toggleCourse = (instructorName, courseId) => {
    const key = `${instructorName}-${courseId}`;
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSelected = (instructorName, courseId) => !!selected[`${instructorName}-${courseId}`];

  const wasAssigned = (instructorName, courseId) =>
    existingAssignments.some(a => a.instructorName === instructorName && a.courseId === courseId);

  const addManualCard = async (instructorName, courseId, termId) => {
    setManualCards(prev => {
      const existing = prev[instructorName] || [];
      if (existing.includes(courseId)) return prev;
      return { ...prev, [instructorName]: [...existing, courseId] };
    });
    setSearchQuery(prev => ({ ...prev, [instructorName]: '' }));
    const key = `${instructorName}-${courseId}`;
    setSelected(prev => ({ ...prev, [key]: true }));

    // Save to Preferences collection with order 0
    try {
      await fetch('/api/preferences/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termId, facultyName: instructorName, courseId }),
      });
    } catch (err) {
      console.error("Error saving manual preference:", err);
    }
  };

  const getSearchResults = (instructorName) => {
    const query = searchQuery[instructorName] || '';
    if (!query) return [];
    const normalize = (s) => s.replace(/\s/g, '').toUpperCase();
    const instPref = prefByInstructor.find(p => p.facultyName === instructorName);
    const prefCourseIds = instPref?.preferences?.map(p => p.courseId) || [];
    const manuals = manualCards[instructorName] || [];
    return termCourses.filter(courseId =>
      normalize(courseId).includes(normalize(query)) &&
      !prefCourseIds.includes(courseId) &&
      !manuals.includes(courseId)
    );
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
  const instructorsPerPage = 4;
  const startIndex = (currentPage - 1) * instructorsPerPage;
  const currentFaculty = facultyList.slice(startIndex, startIndex + instructorsPerPage);
  const totalPages = Math.ceil(facultyList.length / instructorsPerPage);

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
          <span key={sec} style={{ background: '#d0d0d0', borderRadius: 4, padding: '2px 6px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            {sec}
            <span style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
              onClick={() => onRemoveExisting(courseId, type, sec, instructorName)}>×</span>
          </span>
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

  const CourseCard = ({ courseId, instructorName, rank }) => {
    const expanded = isSelected(instructorName, courseId) || wasAssigned(instructorName, courseId);
    return (
      <div className={`ac-course-tag${expanded ? ' ac-course-tag--assigned' : ''}`}>
        <div className="ac-tag-top">
          {/* Show rank — 0 for manually added courses */}
          <span className="ac-course-rank">{rank ?? 0}</span>
          <span className="ac-tag-code">{courseId}</span>
          <div
            className={`an-checkbox${expanded ? ' an-checkbox-checked' : ''}`}
            onClick={() => toggleCourse(instructorName, courseId)}
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
              <th>Instructor</th>
              <th>Preferences</th>
            </tr>
          </thead>
          <tbody>
            {currentFaculty.map(member => {
              const hasNoPreference = instructorsWithNoPreference.some(f => f.name === member.name);
              const loadWarning = loadWarnings?.find(w => w.name === member.name);
              const instPref = prefByInstructor.find(p => p.facultyName === member.name);
              const manuals = manualCards[member.name] || [];
              const searchResults = getSearchResults(member.name);

              // Get existing assigned courses not in preferences (to show as cards)
              const existingCourseIds = [...new Set(
                existingAssignments
                  .filter(a => a.instructorName === member.name)
                  .map(a => a.courseId)
              )];
              const prefCourseIds = instPref?.preferences?.map(p => p.courseId) || [];
              const existingOnlyCards = existingCourseIds.filter(id =>
                !prefCourseIds.includes(id) && !manuals.includes(id)
              );

              return (
                <tr key={member.name} style={hasNoPreference ? { background: '#fff0f0' } : {}}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="an-course-name" style={hasNoPreference ? { color: 'red' } : {}}>
                        {member.name}
                        {hasNoPreference && <span style={{ fontSize: 11, marginLeft: 6 }}>⚠ no preferences</span>}
                      </span>
                      {/* Teaching load warning shown under instructor name */}
                      {loadWarning && (
                        <span style={{
                          fontSize: 11, color: '#856404',
                          background: '#fff8e0', border: '1px solid #ffcc00',
                          borderRadius: 4, padding: '2px 6px', width: 'fit-content'
                        }}>
                          ⚠ {loadWarning.teachingHours}h / {loadWarning.maxHours}h max
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="ac-courses-grid">
                      {/* Preference cards */}
                      {instPref?.preferences?.map((pref) => (
                        <CourseCard key={pref.courseId} courseId={pref.courseId} instructorName={member.name} rank={pref.order} />
                      ))}
                      {/* Existing assignment cards not in preferences — shown with rank 0 */}
                      {existingOnlyCards.map(courseId => (
                        <CourseCard key={courseId} courseId={courseId} instructorName={member.name} rank={0} />
                      ))}
                      {/* Manually added cards this session — shown with rank 0 */}
                      {manuals.map(courseId => (
                        <CourseCard key={courseId} courseId={courseId} instructorName={member.name} rank={0} />
                      ))}
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <input
                        className="an-term-input"
                        type="text"
                        placeholder="Search course to add..."
                        value={searchQuery[member.name] || ''}
                        onChange={e => setSearchQuery(prev => ({ ...prev, [member.name]: e.target.value }))}
                        style={{ fontSize: 12, padding: '4px 8px', width: 180 }}
                      />
                    </div>
                    {searchResults.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        {searchResults.map(courseId => (
                          <button
                            key={courseId}
                            style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, border: '1px solid #aaa', cursor: 'pointer', background: '#f5f5f5' }}
                            onClick={() => addManualCard(member.name, courseId, termId)}
                          >
                            + {courseId}
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