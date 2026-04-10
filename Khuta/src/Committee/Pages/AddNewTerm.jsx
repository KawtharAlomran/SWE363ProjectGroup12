import { useState } from 'react';
//import '../../styles/ManageTerms.css';
import ConfirmModal from '../../shared/ConfirmModal';
import { getAllIcsCourses } from '../../data';

export default function AddNewTerm({ onBack, onSubmit }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [termNumber, setTermNumber] = useState('');
  const [courses, setCourses] = useState(
    // Load courses from shared data instead of hardcoded list
    getAllIcsCourses().map(c => ({
      ...c,
      id: c.code,
      checked: false,
      maleDemand: 0,
      femaleDemand: 0,
      maleLec: 1,
      maleLab: 1,
      femaleLec: 1,
      femaleLab: 1,
    }))
  );

  const toggleCourse = (id) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));

  const updateSection = (id, field, value) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: Number(value) } : c));

  const handleSubmit = () => {
    if (!termNumber) return;
    onSubmit({
      id: Date.now(),
      name: `Academic Terms ${termNumber}`,
      year: new Date().getFullYear(),
      termNum: termNumber,
      // Save only checked courses with their section counts
      courses: courses
        .filter(c => c.checked)
        .map(c => ({
          code: c.code,
          hasLab: c.hasLab ?? false,
          maleLec: c.maleLec,
          maleLab: c.maleLab,
          femaleLec: c.femaleLec,
          femaleLab: c.femaleLab,
        })),
    });
  };

  const SectionSelect = ({ value, field, courseId }) => (
    <select className="an-select" value={value} onChange={e => updateSection(courseId, field, e.target.value)}>
      {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
    </select>
  );

  // to handle pages 
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;
  const startIndex = (currentPage - 1) * coursesPerPage; // to find the start index 
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courses.slice(startIndex, endIndex); // to display the courses in the specified page 
  const totalPages = Math.ceil(courses.length / coursesPerPage); // to find the total pages 
  

  return (
    <>
      <div className="mt-card">
        <button className="td-back-btn" onClick={onBack}>← Back</button>
        <div className="an-term-row">
          <label className="an-term-label">Enter Term number:</label>
          <input className="an-term-input" type="text" placeholder="251"
            value={termNumber} onChange={e => setTermNumber(e.target.value)} />
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
                      Male: {course.maleDemand}<br />Female: {course.femaleDemand}
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
          <button className="an-btn-save">Save</button>
          <button className="an-btn-submit" onClick={() => setShowConfirm(true)}>Submit</button>
          <span className="an-note">*Note: by submitting the form, a notification will be send to faculty to set their preferences</span>
        </div>
        <div className="pageNumbers">
          {Array.from({ length: totalPages }, (_, index) => (
            <button className={currentPage === index + 1 ? "active" : ""} key={index + 1}
              onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
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