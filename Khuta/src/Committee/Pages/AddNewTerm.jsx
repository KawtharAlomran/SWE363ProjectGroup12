import { useState } from 'react';
import ConfirmModal from '../../shared/ConfirmModal';
import { getAllIcsCourses, getCourseDemand } from '../../data';

export default function AddNewTerm({ onBack, onSubmit }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [termNumber, setTermNumber] = useState('');

  // Load all ICS courses from shared data — no hardcoded list
  const [courses, setCourses] = useState(() =>
    getAllIcsCourses().map(c => ({
      ...c,
      id: c.code,
      hasLab: c.lab ?? false, // coursesList uses 'lab', we normalize to 'hasLab'
      checked: false,
      maleLec: 1, maleLab: 1, femaleLec: 1, femaleLab: 1,
    }))
  );

  // Search demand for the entered term number — only triggers when 3 digits are entered
  const termDemand = termNumber.length === 3 ? getCourseDemand(termNumber) : [];

  // Returns demand value for a course field, or '-' if not found
  const getDemand = (code, field) => {
    const d = termDemand.find(d => d.code === code);
    return d ? d[field] : '-';
  };

  // Toggle course selection
  const toggleCourse = (id) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));

  // Update section count for a specific course and field
  const updateSection = (id, field, value) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: Number(value) } : c));

  // Build and submit the new term object
  const handleSubmit = () => {
    if (!termNumber) return;
    onSubmit({
      id: Date.now(),
      name: `Academic Terms ${termNumber}`,
      year: new Date().getFullYear(),
      termNum: termNumber,
      // Only include checked courses with their section counts
      courses: courses.filter(c => c.checked).map(c => ({
        code: c.code, hasLab: c.hasLab,
        maleLec: c.maleLec, maleLab: c.maleLab,
        femaleLec: c.femaleLec, femaleLab: c.femaleLab,
      })),
    });
  };

  // Reusable select for choosing number of sections (1–15)
  const SectionSelect = ({ value, field, courseId }) => (
    <select className="an-select" value={value} onChange={e => updateSection(courseId, field, e.target.value)}>
      {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
    </select>
  );

  // Pagination — 4 courses per page
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  return (
    <>
      <div className="container">
        <button className="td-back-btn" onClick={onBack}>← Back</button>

        <div className="an-term-row">
          <label className="an-term-label">Enter Term number:</label>
          <div>
            {/* Only allows 3 digits — triggers demand lookup automatically */}
            <input
              className="an-term-input"
              type="text"
              placeholder="251"
              maxLength={3}
              value={termNumber}
              onChange={e => setTermNumber(e.target.value.replace(/\D/g, ''))}
            />
            {/* Prompt user to enter term number before demand is shown */}
            {termNumber.length < 3 && (
                <span className="an-note">* Enter term number first to see student demand</span>

            )}
          </div>
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
                    {/* Demand is fetched dynamically based on entered term number */}
                    <div className="an-demand">
                      Male: {getDemand(course.code, 'maleDemand')}<br />
                      Female: {getDemand(course.code, 'femaleDemand')}
                    </div>
                  </td>
                  <td>
                    {/* Section selects only appear when course is checked */}
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
          <button className="an-btn-submit" onClick={() => setShowConfirm(true)}>Submit</button>
          <span className="an-note">*Note: by submitting the form, a notification will be send to faculty to set their preferences</span>
        </div>

        {/* Pagination controls */}
        <div className="pageNumbers">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i+1} className={currentPage === i+1 ? 'active' : ''} onClick={() => setCurrentPage(i+1)}>
              {i+1}
            </button>
          ))}
        </div>

      </div>

      {/* Submit confirmation modal */}
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