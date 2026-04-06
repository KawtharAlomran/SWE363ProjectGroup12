export default function ByInstructor({ instructors, onToggle }) {
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
                {inst.courses.map(course => (
                  <div key={course.id} className="ac-course-tag">
                    <span className="ac-course-rank">{course.rank}</span>
                    <span>{course.code}</span>
                    <div
                      className={`an-checkbox${course.assigned ? ' an-checkbox-checked' : ''}`}
                      onClick={() => onToggle(inst.id, course.id)}
                    >
                      {course.assigned && '✓'}
                    </div>
                  </div>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}