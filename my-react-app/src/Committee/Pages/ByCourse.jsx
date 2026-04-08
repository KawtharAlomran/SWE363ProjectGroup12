export default function ByCourse({ courses, onToggle }) {
  return (
    <table className="an-table" style={{ marginTop: 16 }}>
      <thead>
        <tr>
          <th>Course number</th>
          <th>Interested instructors</th>
        </tr>
      </thead>
      <tbody>
        {courses.map(course => (
          <tr key={course.id}>
            <td><span className="an-course-name">{course.code}</span></td>
            <td>
              <div className="ac-courses-grid">
                {course.instructors.map(inst => (
                  <div key={inst.id} className="ac-course-tag">
                    <span className="ac-course-rank">{inst.rank}</span>
                    <span>{inst.name}</span>
                    <div
                      className={`an-checkbox${inst.assigned ? ' an-checkbox-checked' : ''}`}
                      onClick={() => onToggle(inst.id, course.id)}
                    >
                      {inst.assigned && '✓'}
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