import { useState } from 'react';
import ConfirmModal from '../../shared/ConfirmModal';
import { getTermCourses, updateTermCourses, getCourseDemand, getAllIcsCourses } from '../../data';

export default function TermDetails({ term, onBack, onDelete }) {
  // Only current year terms can be edited
  const canEdit = term.year === new Date().getFullYear();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load ALL courses and merge with term section data and demand for this term
  const [courses, setCourses] = useState(() => {
    const termCourses = getTermCourses(term.id);
    const demand = getCourseDemand(term.termNum);

    return getAllIcsCourses().map(c => {
      const termCourse = termCourses.find(t => t.code === c.code);
      const d = demand.find(d => d.code === c.code);
      return {
        code: c.code,
        hasLab: c.lab ?? false,
        maleLec: termCourse?.maleLec ?? 0,
        maleLab: termCourse?.maleLab ?? 0,
        femaleLec: termCourse?.femaleLec ?? 0,
        femaleLab: termCourse?.femaleLab ?? 0,
        maleDemand: d?.maleDemand ?? '-',
        femaleDemand: d?.femaleDemand ?? '-',
      };
    });
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = canEdit ? 3 : 5;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  // Auto-save on every section change — no need for Save button
  const updateSection = (courseCode, field, value) => {
    const updated = courses.map(c => c.code === courseCode ? { ...c, [field]: Number(value) } : c);
    setCourses(updated);
    updateTermCourses(term.id, updated);
  };

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
                <th>Course number</th>
                <th>Student Demand</th>
                <th>Number of sections</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map(course => (
                <tr key={course.code}>
                  <td><span className="an-course-name">{course.code}</span></td>
                  <td>
                    <div className="an-demand">
                      Male: {course.maleDemand}<br />
                      Female: {course.femaleDemand}
                    </div>
                  </td>
                  <td>
                    <div className="an-sections">
                      <div className="an-section-row">
                        <span>Male:</span>
                        {canEdit
                          ? <select className="an-select" value={course.maleLec} onChange={e => updateSection(course.code, 'maleLec', e.target.value)}>
                              {[...Array(30)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                            </select>
                          : <span>{course.maleLec}</span>
                        }
                        {course.hasLab && <>
                          <span>, Lab</span>
                          {canEdit
                            ? <select className="an-select" value={course.maleLab} onChange={e => updateSection(course.code, 'maleLab', e.target.value)}>
                                {[...Array(30)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                              </select>
                            : <span>{course.maleLab}</span>
                          }
                        </>}
                      </div>
                      <div className="an-section-row">
                        <span>Female:</span>
                        {canEdit
                          ? <select className="an-select" value={course.femaleLec} onChange={e => updateSection(course.code, 'femaleLec', e.target.value)}>
                              {[...Array(30)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                            </select>
                          : <span>{course.femaleLec}</span>
                        }
                        {course.hasLab && <>
                          <span>, Lab</span>
                          {canEdit
                            ? <select className="an-select" value={course.femaleLab} onChange={e => updateSection(course.code, 'femaleLab', e.target.value)}>
                                {[...Array(30)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                              </select>
                            : <span>{course.femaleLab}</span>
                          }
                        </>}
                      </div>
                    </div>
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
            {/* Delete term with confirmation */}
            <button className="tr-deleteBtn" onClick={() => setShowDeleteConfirm(true)}>Delete Term</button>
            {/* Submit notifies faculty */}
            <button className="an-btn-submit" onClick={() => setShowConfirm(true)}>Submit</button>
          </div>
        )}

      </div>

      {/* Submit confirmation */}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit the changes?"
          onConfirm={() => setShowConfirm(false)}
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