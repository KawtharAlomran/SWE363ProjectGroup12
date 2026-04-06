import { useState } from 'react';
import '../../styles/ManageTerms.css';

const COURSES = [
  { id: 1, code: 'ICS 104', maleDemand: 120, femaleDemand: 105, hasLab: true  },
  { id: 2, code: 'ICS 108', maleDemand: 35,  femaleDemand: 30,  hasLab: true  },
  { id: 3, code: 'ICS 202', maleDemand: 52,  femaleDemand: 50,  hasLab: true  },
  { id: 4, code: 'ICS 253', maleDemand: 34,  femaleDemand: 20,  hasLab: false },
  { id: 5, code: 'ICS 321', maleDemand: 57,  femaleDemand: 55,  hasLab: false },
  { id: 6, code: 'ICS 343', maleDemand: 57,  femaleDemand: 51,  hasLab: true  },
  { id: 7, code: 'ICS 344', maleDemand: 10,  femaleDemand: 5,   hasLab: false },
  { id: 8, code: 'ICS 353', maleDemand: 5,   femaleDemand: 0,   hasLab: false },
];

export default function AddNewTerm({ onBack, onSubmit }) {
  const [termNumber, setTermNumber] = useState('');
  const [courses, setCourses] = useState(
    COURSES.map(c => ({ ...c, checked: false, maleLec: 1, maleLab: 1, femaleLec: 1, femaleLab: 1 }))
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
      courses: courses.filter(c => c.checked),
    });
  };

  const SectionSelect = ({ value, field, courseId }) => (
    <select className="an-select" value={value} onChange={e => updateSection(courseId, field, e.target.value)}>
      {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
    </select>
  );

  return (
    <>
      <div className="mt-card">

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
            {courses.map(course => (
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
          <button className="an-btn-submit" onClick={handleSubmit}>Submit</button>
          <span className="an-note">*Note: by submitting the form, a notification will be send to faculty to set their preferences</span>
        </div>

      </div>
    </>
  );
}