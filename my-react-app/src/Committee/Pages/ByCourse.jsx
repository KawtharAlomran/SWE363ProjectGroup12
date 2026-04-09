import { getTermSections } from '../../data';

// Reusable select component for choosing number of sections
function SectionSelect({ value, onChange }) {
  return (
    <select className="an-select" value={value} onChange={e => onChange(Number(e.target.value))}>
      {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
    </select>
  );
}

// Displays instructors grouped by course
// Each instructor shows a checkbox, and if assigned shows Lec/Lab section selects
export default function ByCourse({ courses, onToggle, onUpdateSection, termNum }) {
  // Get section limits for selected term
  const termSections = getTermSections(termNum);

  return (
    <table className="an-table" style={{ marginTop: 16 }}>
      <thead>
        <tr>
          <th>Course number</th>
          <th>Interested instructors</th>
        </tr>
      </thead>
      <tbody>
        {courses.map(course => {
          // Find section limits for this course from term data
          const termCourse = termSections.find(t => t.code === course.code);
          return (
            <tr key={course.id}>
              <td><span className="an-course-name">{course.code}</span></td>
              <td>
                <div className="ac-courses-grid">
                  {course.instructors.map(inst => (
                    <div key={inst.id} className={`ac-course-tag${inst.assigned ? ' ac-course-tag--assigned' : ''}`}>

                      {/* Instructor tag header — rank, name, checkbox */}
                      <div className="ac-tag-top">
                        <span className="ac-course-rank">{inst.rank}</span>
                        <span className="ac-tag-code">{inst.name}</span>
                        <div
                          className={`an-checkbox${inst.assigned ? ' an-checkbox-checked' : ''}`}
                          onClick={() => onToggle(inst.id, course.id)}
                        >
                          {inst.assigned && '✓'}
                        </div>
                      </div>

                      {/* Show section selects only when instructor is assigned and course exists in term */}
                      {inst.assigned && termCourse && (
                        <div className="ac-sections">
                          <div className="an-section-row">
                            <span>M: Lec</span>
                            <SectionSelect value={inst.maleLec || 1} onChange={v => onUpdateSection(course.id, inst.id, 'maleLec', v)} />
                            {termCourse.hasLab && <>
                              <span>, Lab</span>
                              <SectionSelect value={inst.maleLab || 1} onChange={v => onUpdateSection(course.id, inst.id, 'maleLab', v)} />
                            </>}
                          </div>
                          <div className="an-section-row">
                            <span>F: Lec</span>
                            <SectionSelect value={inst.femaleLec || 1} onChange={v => onUpdateSection(course.id, inst.id, 'femaleLec', v)} />
                            {termCourse.hasLab && <>
                              <span>, Lab</span>
                              <SectionSelect value={inst.femaleLab || 1} onChange={v => onUpdateSection(course.id, inst.id, 'femaleLab', v)} />
                            </>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}