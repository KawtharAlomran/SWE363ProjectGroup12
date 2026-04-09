import { getTermSections } from '../../data';

// Reusable select component for choosing number of sections
function SectionSelect({ value, onChange }) {
  return (
    <select className="an-select" value={value} onChange={e => onChange(Number(e.target.value))}>
      {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
    </select>
  );
}

// Displays courses grouped by instructor
// Each course shows a checkbox, and if assigned shows Lec/Lab section selects
export default function ByInstructor({ instructors, onToggle, onUpdateSection, termNum }) {
  // Get section limits for selected term
  const termSections = getTermSections(termNum);

  return (
    <table className="an-table" style={{ marginTop: 16 }}>
      <thead>
        <tr>
          <th>Instructor</th>
          <th>Preferences</th>
        </tr>
      </thead>
      <tbody>
        {instructors.map(inst => (
          <tr key={inst.id}>
            <td><span className="an-course-name">{inst.name}</span></td>
            <td>
              <div className="ac-courses-grid">
                {inst.courses.map(course => {
                  // Find section limits for this course from term data
                  const termCourse = termSections.find(t => t.code === course.code);
                  return (
                    <div key={course.id} className={`ac-course-tag${course.assigned ? ' ac-course-tag--assigned' : ''}`}>

                      {/* Course tag header — rank, code, checkbox */}
                      <div className="ac-tag-top">
                        <span className="ac-course-rank">{course.rank}</span>
                        <span className="ac-tag-code">{course.code}</span>
                        <div
                          className={`an-checkbox${course.assigned ? ' an-checkbox-checked' : ''}`}
                          onClick={() => onToggle(inst.id, course.id)}
                        >
                          {course.assigned && '✓'}
                        </div>
                      </div>

                      {/* Show section selects only when course is assigned and exists in term */}
                      {course.assigned && termCourse && (
                        <div className="ac-sections">
                          <div className="an-section-row">
                            <span>M: Lec</span>
                            <SectionSelect value={course.maleLec || 1} onChange={v => onUpdateSection(inst.id, course.id, 'maleLec', v)} />
                            {termCourse.hasLab && <>
                              <span>, Lab</span>
                              <SectionSelect value={course.maleLab || 1} onChange={v => onUpdateSection(inst.id, course.id, 'maleLab', v)} />
                            </>}
                          </div>
                          <div className="an-section-row">
                            <span>F: Lec</span>
                            <SectionSelect value={course.femaleLec || 1} onChange={v => onUpdateSection(inst.id, course.id, 'femaleLec', v)} />
                            {termCourse.hasLab && <>
                              <span>, Lab</span>
                              <SectionSelect value={course.femaleLab || 1} onChange={v => onUpdateSection(inst.id, course.id, 'femaleLab', v)} />
                            </>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}