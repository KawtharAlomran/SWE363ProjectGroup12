import { useState } from 'react';
//import '../../styles/ManageTerms.css';
import ConfirmModal from '../../shared/ConfirmModal';
import { getTermCourses, updateTermCourses } from '../../data';
export default function TermDetails({ term, onBack, onDelete }) {
  // Only current year terms can be edited
  const canEdit = term.year === new Date().getFullYear();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load courses from shared data based on term id
  const [courses, setCourses] = useState(getTermCourses(term.id));

  // Auto-save on every section change — no need for Save button
  const updateSection = (courseCode, field, value) => {
    const updated = courses.map(c => c.code === courseCode ? { ...c, [field]: Number(value) } : c);
    setCourses(updated);
    updateTermCourses(term.id, updated);
  };

  return (
    <>
      <div className="mt-card">

        <button className="td-back-btn" onClick={onBack}>← Back</button>
        <h3 className="mt-title" style={{ marginBottom: 4 }}>All Offered Courses</h3>
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
              {courses.map(course => (
                <tr key={course.code}>
                  <td><span className="an-course-name">{course.code}</span></td>
                  <td>
                    <div className="an-demand">
                      Male: {course.maleDemand ?? '-'}<br />
                      Female: {course.femaleDemand ?? '-'}
                    </div>
                  </td>
                  <td>
                    <div className="an-sections">
                      <div className="an-section-row">
                        <span>Male:</span>
                        {canEdit
                          ? <select className="an-select" value={course.maleLec} onChange={e => updateSection(course.code, 'maleLec', e.target.value)}>
                              {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                            </select>
                          : <span>{course.maleLec}</span>
                        }
                        {course.hasLab && <>
                          <span>, Lab</span>
                          {canEdit
                            ? <select className="an-select" value={course.maleLab} onChange={e => updateSection(course.code, 'maleLab', e.target.value)}>
                                {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                              </select>
                            : <span>{course.maleLab}</span>
                          }
                        </>}
                      </div>
                      <div className="an-section-row">
                        <span>Female:</span>
                        {canEdit
                          ? <select className="an-select" value={course.femaleLec} onChange={e => updateSection(course.code, 'femaleLec', e.target.value)}>
                              {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                            </select>
                          : <span>{course.femaleLec}</span>
                        }
                        {course.hasLab && <>
                          <span>, Lab</span>
                          {canEdit
                            ? <select className="an-select" value={course.femaleLab} onChange={e => updateSection(course.code, 'femaleLab', e.target.value)}>
                                {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
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

        {canEdit && (
          <div className="an-actions">
            {/* Delete term with confirmation */}
            <button className="tr-deleteBtn" onClick={() => setShowDeleteConfirm(true)}>
              Delete Term
            </button>
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