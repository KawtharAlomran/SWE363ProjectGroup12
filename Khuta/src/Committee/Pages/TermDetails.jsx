import { useState } from 'react';
import ConfirmModal from '../../shared/ConfirmModal';
import { getTermCourses, updateTermCourses, getCourseDemand, getAllIcsCourses } from '../../data';

export default function TermDetails({ term, onBack, onDelete }) {
  // Only current year terms can be edited
  const canEdit = term.year === new Date().getFullYear();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load ALL ICS courses, mark ones already in the term as checked
  const [courses, setCourses] = useState(() => {
    const termCourses = getTermCourses(term.id);
    const demand = getCourseDemand(term.termNum);
    const allCourses = getAllIcsCourses();

    return allCourses.map(c => {
      const termCourse = termCourses.find(tc => tc.code === c.code);
      const d = demand.find(d => d.code === c.code);
      return {
        code: c.code,
        hasLab: c.lab ?? false,
        checked: !!termCourse, // pre-check if already in term
        maleLec: termCourse?.maleLec ?? 0,
        maleLab: termCourse?.maleLab ?? 0,
        femaleLec: termCourse?.femaleLec ?? 0,
        femaleLab: termCourse?.femaleLab ?? 0,
        maleDemand: d?.maleDemand ?? '-',
        femaleDemand: d?.femaleDemand ?? '-',
      };
    });
  });

  // Toggle course in/out of the term and auto-save
  const toggleCourse = (code) => {
    const updated = courses.map(c => c.code === code ? { ...c, checked: !c.checked } : c);
    setCourses(updated);
    saveToTerm(updated);
  };

  // Update section count and auto-save
  const updateSection = (courseCode, field, value) => {
    const updated = courses.map(c =>
      c.code === courseCode ? { ...c, [field]: Number(value) } : c
    );
    setCourses(updated);
    saveToTerm(updated);
  };

  // Save only checked courses to the term data
  const saveToTerm = (updatedCourses) => {
    const termCourses = updatedCourses
      .filter(c => c.checked)
      .map(c => ({
        code: c.code,
        hasLab: c.hasLab,
        maleLec: c.maleLec,
        maleLab: c.maleLab,
        femaleLec: c.femaleLec,
        femaleLab: c.femaleLab,
      }));
    updateTermCourses(term.id, termCourses);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = canEdit ? 3 : 5;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

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
        <div className="td-term-badge">Term {term?.name?.replace('Academic Terms ', '') ?? ''}</div>

        <div className="an-table-wrap">
          <table className="an-table" style={{ marginTop: 24 }}>
            <thead>
              <tr>
                {canEdit && <th></th>}
                <th>Course number</th>
                <th>Student Demand</th>
                <th>Number of sections</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map(course => (
                <tr key={course.code}>
                  {canEdit && (
                    <td>
                      <div
                        className={`an-checkbox${course.checked ? ' an-checkbox-checked' : ''}`}
                        onClick={() => toggleCourse(course.code)}
                      >
                        {course.checked && '✓'}
                      </div>
                    </td>
                  )}
                  <td><span className="an-course-name">{course.code}</span></td>
                  <td>
                    <div className="an-demand">
                      Male: {course.maleDemand}<br />
                      Female: {course.femaleDemand}
                    </div>
                  </td>
                  <td>
                    {/* Show sections only when course is checked (in term) */}
                    {course.checked && (
                      <div className="an-sections">
                        <div className="an-section-row">
                          <span>Male: Lec</span>
                          {canEdit
                            ? <SectionSelect value={course.maleLec} courseCode={course.code} field="maleLec" />
                            : <span>{course.maleLec}</span>
                          }
                          {course.hasLab && <>
                            <span>, Lab</span>
                            {canEdit
                              ? <SectionSelect value={course.maleLab} courseCode={course.code} field="maleLab" />
                              : <span>{course.maleLab}</span>
                            }
                          </>}
                        </div>
                        <div className="an-section-row">
                          <span>Female: Lec</span>
                          {canEdit
                            ? <SectionSelect value={course.femaleLec} courseCode={course.code} field="femaleLec" />
                            : <span>{course.femaleLec}</span>
                          }
                          {course.hasLab && <>
                            <span>, Lab</span>
                            {canEdit
                              ? <SectionSelect value={course.femaleLab} courseCode={course.code} field="femaleLab" />
                              : <span>{course.femaleLab}</span>
                            }
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

        {canEdit && (
          <div className="an-actions">
            <button className="tr-deleteBtn" onClick={() => setShowDeleteConfirm(true)}>Delete Term</button>
            <button className="an-btn-submit" onClick={() => setShowConfirm(true)}>Submit</button>
          </div>
        )}

      </div>

      {/* Submit confirmation — goes back to main page after confirm */}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit the changes?"
          onConfirm={() => { setShowConfirm(false); onBack(); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Delete term confirmation */}
      {showDeleteConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this term?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => { onDelete(term.id); setShowDeleteConfirm(false); }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}