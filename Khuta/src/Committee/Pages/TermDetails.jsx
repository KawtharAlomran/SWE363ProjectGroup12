// Updated: replaced local data.js calls with API fetch calls
// Shows all ICS courses, pre-checks ones already in Sections for this term
// Added: search bar, show selected only toggle, saves changes to Sections on submit
import { useState, useEffect } from 'react';
import ConfirmModal from '../../shared/ConfirmModal';

const API = 'http://localhost:5174';

export default function TermDetails({ term, onBack, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false); // toggle selected courses

  // Removed: useState(() => { getTermCourses, getCourseDemand, getAllIcsCourses })
  const [courses, setCourses] = useState([]);

  // Fetch all ICS courses, existing sections for this term, and demand
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all courses from ICS-courses collection
        const coursesRes = await fetch(`${API}/api/courses`);
        const allCourses = await coursesRes.json();

        // Fetch existing sections for this term from Sections collection
        const sectionsRes = await fetch(`${API}/api/sections/${term.termId}`);
        const sectionsData = await sectionsRes.json();

        // Fetch student demand from Plans collection
        const demandRes = await fetch(`${API}/api/plans/${term.termId}`);
        const demandData = await demandRes.json();

        setCourses(allCourses.map(c => {
          // Find existing LEC and LAB sections for this course in this term
          const lec = sectionsData.find(s => s.courseId === c.code && s.type === 'LEC');
          const lab = sectionsData.find(s => s.courseId === c.code && s.type === 'LAB');
          const d = demandData.find(d => d.courseCode === c.code);

          return {
            code: c.code,
            hasLab: c.has_lab ?? false,
            checked: !!lec, // pre-check if course already has sections in this term
            maleLec: lec?.maleSections ?? 0,
            maleLab: lab?.maleSections ?? 0,
            femaleLec: lec?.femaleSections ?? 0,
            femaleLab: lab?.femaleSections ?? 0,
            maleDemand: d?.mDemand ?? '-',
            femaleDemand: d?.fDemand ?? '-',
          };
        }));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [term.termId]);

  // Toggle course in/out of the term
  const toggleCourse = (code) =>
    setCourses(prev => prev.map(c => c.code === code ? { ...c, checked: !c.checked } : c));

  // Update section count
  const updateSection = (courseCode, field, value) =>
    setCourses(prev => prev.map(c =>
      c.code === courseCode ? { ...c, [field]: Number(value) } : c
    ));

  // Submit — update Sections collection (add new, remove unchecked, update counts)
  const handleSubmit = async () => {
    try {
      await fetch(`${API}/api/sections/${term.termId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
      onBack();
    } catch (err) {
      console.error("Error submitting changes:", err);
    }
  };

  // Search — normalize removes spaces and converts to uppercase for flexible matching
  const normalize = (str) => str.replace(/\s/g, '').toUpperCase();

  // Apply search and showSelectedOnly filters
  const filteredCourses = courses.filter(c => {
    const matchesSearch = normalize(c.code).includes(normalize(searchQuery));
    const matchesSelected = showSelectedOnly ? c.checked : true;
    return matchesSearch && matchesSelected;
  });

  // Pagination — 3 courses per page
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Reusable section select (0–29)
  const SectionSelect = ({ value, courseCode, field }) => (
    <select className="an-select" value={value} onChange={e => updateSection(courseCode, field, e.target.value)}>
      {[...Array(30)].map((_, i) => <option key={i} value={i}>{i}</option>)}
    </select>
  );

  return (
    <>
      <div className="container">

        <button className="td-back-btn" onClick={onBack}>← Back</button>
        <h3 className="header h2" style={{ marginBottom: 4 }}>All Offered Courses</h3>
        {/* Use termId from MongoDB instead of term.name */}
        <div className="td-term-badge">Term {term.termId}</div>

        {/* Search bar — case insensitive, ignores spaces */}
        <div className="an-term-row" style={{ marginTop: 16 }}>
          <label className="an-term-label">Search course:</label>
          <input
            className="an-term-input"
            type="text"
            placeholder="ICS 104"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset to first page on new search
            }}
          />
          {/* Toggle to show selected courses only */}
          <button
            className={`an-btn-submit${showSelectedOnly ? '' : ' an-btn-outline'}`}
            style={{ marginLeft: 12 }}
            onClick={() => {
              setShowSelectedOnly(prev => !prev);
              setCurrentPage(1);
            }}
          >
            {showSelectedOnly ? 'Show All' : 'Show Selected'}
          </button>
        </div>

        <div className="an-table-wrap">
          <table className="an-table" style={{ marginTop: 16 }}>
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
                <tr key={course.code}>
                  <td>
                    <div
                      className={`an-checkbox${course.checked ? ' an-checkbox-checked' : ''}`}
                      onClick={() => toggleCourse(course.code)}
                    >
                      {course.checked && '✓'}
                    </div>
                  </td>
                  <td><span className="an-course-name">{course.code}</span></td>
                  <td>
                    <div className="an-demand">
                      Male: {course.maleDemand}<br />
                      Female: {course.femaleDemand}
                    </div>
                  </td>
                  <td>
                    {/* Show sections only when course is checked */}
                    {course.checked && (
                      <div className="an-sections">
                        <div className="an-section-row">
                          <span>Male: Lec</span>
                          <SectionSelect value={course.maleLec} courseCode={course.code} field="maleLec" />
                          {course.hasLab && <>
                            <span>, Lab</span>
                            <SectionSelect value={course.maleLab} courseCode={course.code} field="maleLab" />
                          </>}
                        </div>
                        <div className="an-section-row">
                          <span>Female: Lec</span>
                          <SectionSelect value={course.femaleLec} courseCode={course.code} field="femaleLec" />
                          {course.hasLab && <>
                            <span>, Lab</span>
                            <SectionSelect value={course.femaleLab} courseCode={course.code} field="femaleLab" />
                          </>}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pageNumbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i+1} className={currentPage === i+1 ? 'active' : ''} onClick={() => setCurrentPage(i+1)}>
                {i+1}
              </button>
            ))}
          </div>
        )}

        <div className="an-actions">
          <button className="tr-deleteBtn" onClick={() => setShowDeleteConfirm(true)}>Delete Term</button>
          <button className="an-btn-submit" onClick={() => setShowConfirm(true)}>Submit</button>
        </div>

      </div>

      {/* Submit confirmation — saves changes to Sections collection then goes back */}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit the changes?"
          onConfirm={() => { handleSubmit(); setShowConfirm(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Delete term confirmation */}
      {showDeleteConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this term?"
          confirmText="Delete"
          cancelText="Cancel"
          // Use _id from MongoDB instead of term.id
          onConfirm={() => { onDelete(term._id); setShowDeleteConfirm(false); }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}