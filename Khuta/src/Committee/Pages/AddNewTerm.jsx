// Updated: replaced local data.js calls with API fetch calls
// Added: duplicate term error, search bar, saves to Sections + Terms on submit
// Added: real-time term existence check when 3 digits are entered
// Added: smart pagination (1 ... 4 5 6 ... 68)
import { useState, useEffect } from 'react';
import ConfirmModal from '../../shared/ConfirmModal';

const API = 'http://localhost:5174';

export default function AddNewTerm({ onBack, onSubmit }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [termNumber, setTermNumber] = useState('');
  const [termError, setTermError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Removed: useState(() => getAllIcsCourses().map(...))
  const [courses, setCourses] = useState([]);
  const [termDemand, setTermDemand] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);

  // Fetch all ICS courses from ICS-courses collection
  useEffect(() => {
    const fetchCourses = async () => {
        setLoadingCourses(true);

      try {
        const res = await fetch(`${API}/api/courses`);
        const data = await res.json();
        setCourses(data.map(c => ({
          ...c,
          id: c.code,
          hasLab: c.has_lab ?? false,
          checked: false,
          maleLec: 0, maleLab: 0, femaleLec: 0, femaleLab: 0,
        })));
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // When term number is 3 digits: check if it exists + fetch demand
  useEffect(() => {
    if (termNumber.length === 3) {

      // Check if term already exists in Terms collection — give immediate feedback
      const checkTerm = async () => {
        try {
          const res = await fetch(`${API}/api/terms/check/${termNumber}`);
          const data = await res.json();
          setDuplicateError(data.exists);
        } catch (err) {
          console.error("Error checking term:", err);
        }
      };
      checkTerm();

      // Fetch student demand from Plans collection
      const fetchDemand = async () => {
        try {
          const res = await fetch(`${API}/api/plans/${termNumber}`);
          const data = await res.json();
          setTermDemand(data);
        } catch (err) {
          console.error("Error fetching demand:", err);
        }
      };
      fetchDemand();

    } else {
      setTermDemand([]);
      setDuplicateError(false);
    }
  }, [termNumber]);

  // Removed: getCourseDemand() — now reads mDemand/fDemand from Plans collection
  const getDemand = (code, field) => {
    const d = termDemand.find(d => d.courseCode === code);
    if (!d) return '-';
    return field === 'maleDemand' ? d.mDemand : d.fDemand;
  };

  const toggleCourse = (id) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));

  const updateSection = (id, field, value) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: Number(value) } : c));

  // Submit — saves term to Terms collection and sections to Sections collection
  const handleSubmit = async () => {
    if (!termNumber) return;
    try {
      const res = await fetch(`${API}/api/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          termId: termNumber,
          courses: courses.filter(c => c.checked).map(c => ({
            code: c.code,
            hasLab: c.hasLab,
            maleLec: c.maleLec,
            maleLab: c.maleLab,
            femaleLec: c.femaleLec,
            femaleLab: c.femaleLab,
          })),
        }),
      });

      // Handle duplicate term — show error to user instead of confirm
      if (res.status === 409) {
        setDuplicateError(true);
        return;
      }

      if (!res.ok) throw new Error("Failed to save");

      onSubmit({ termNum: termNumber });

    } catch (err) {
      console.error("Error submitting term:", err);
    }
  };

  const handleSubmitClick = () => {
    if (!termNumber) {
      setTermError(true);
      return;
    }
    // Block submit if term already exists — show error instead of confirm
    if (duplicateError) return;
    setTermError(false);
    setShowConfirm(true);
  };

  const SectionSelect = ({ value, field, courseId }) => (
    <select className="an-select" value={value} onChange={e => updateSection(courseId, field, e.target.value)}>
      {[...Array(16)].map((_, i) => <option key={i} value={i}>{i}</option>)}
    </select>
  );

  // Search — normalize removes spaces and converts to uppercase for flexible matching
  const normalize = (str) => str.replace(/\s/g, '').toUpperCase();
  const filteredCourses = courses.filter(c =>
    normalize(c.code).includes(normalize(searchQuery))
  );

  // Pagination — 3 courses per page with smart page numbers
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Smart pagination — shows first, last, and 1 page around current
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
  };

  return (
    <>
      <div className="container">
        <button className="td-back-btn" onClick={onBack}>← Back</button>

        <div className="an-term-row">
          <label className="an-term-label">Enter Term number:</label>
          <div>
            <input
              className="an-term-input"
              type="text"
              placeholder="251"
              maxLength={3}
              value={termNumber}
              style={termError || duplicateError ? { border: '2px solid red', borderRadius: 6 } : {}}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                setTermNumber(val);
                if (val) setTermError(false);
              }}
            />
            {termError && (
              <span style={{ color: 'red', fontSize: 13, marginLeft: 8 }}>
                * Please enter a term number
              </span>
            )}
            {/* Real-time error when term already exists in Terms collection */}
            {duplicateError && (
              <span style={{ color: 'red', fontSize: 13, marginLeft: 8 }}>
                * Term {termNumber} already exists
              </span>
            )}
            {!termError && !duplicateError && termNumber.length < 3 && (
              <span className="an-note">* Enter term number first to see student demand</span>
            )}
          </div>
        </div>
        {loadingCourses && <p style={{ marginTop: 10 }}>Loading courses...</p>}
      {!loadingCourses && (
        <>
        {/* Search bar — case insensitive, ignores spaces e.g. "ics104" matches "ICS 104" */}
        <div className="an-term-row">
          <label className="an-term-label">Search course:</label>
          <input
            className="an-term-input"
            type="text"
            placeholder="ICS 104"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="an-section-label">Select courses to offer in the term:</div>
        <div className="an-table-wrap">
          <table className="an-table">
            <thead>
              <tr>
                <th></th>
                <th>Course number</th>
                <th>Student Demand</th>
                <th>Number of sections</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map(course => (
                <tr key={course.id}>
                  <td>
                    <div className={`an-checkbox${course.checked ? ' an-checkbox-checked' : ''}`}
                      onClick={() => toggleCourse(course.id)}>
                      {course.checked && '✓'}
                    </div>
                  </td>
                  <td><span className="an-course-name">{course.code}</span></td>
                  <td>
                    <div className="an-demand">
                      Male: {getDemand(course.code, 'maleDemand')}<br />
                      Female: {getDemand(course.code, 'femaleDemand')}
                    </div>
                  </td>
                  <td>
                    {course.checked && (
                      <div className="an-sections">
                        <div className="an-section-row">
                          <span>Male: Lec</span>
                          <SectionSelect value={course.maleLec} field="maleLec" courseId={course.id} />
                          {course.hasLab && <><span>, Lab</span><SectionSelect value={course.maleLab} field="maleLab" courseId={course.id} /></>}
                        </div>
                        <div className="an-section-row">
                          <span>Female: Lec</span>
                          <SectionSelect value={course.femaleLec} field="femaleLec" courseId={course.id} />
                          {course.hasLab && <><span>, Lab</span><SectionSelect value={course.femaleLab} field="femaleLab" courseId={course.id} /></>}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="an-actions">
          <button className="an-btn-submit" onClick={handleSubmitClick}>Submit</button>
          <span className="an-note">*Note: by submitting the form, a notification will be send to faculty to set their preferences</span>
        </div>

        {/* Smart pagination — 1 ... 4 5 6 ... 68 */}
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
      )}

      </div>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit the term courses?"
          onConfirm={() => { handleSubmit(); setShowConfirm(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}