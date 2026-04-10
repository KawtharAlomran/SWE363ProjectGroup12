//import '../../styles/ManageTerms.css';

function AssignedCourses() {
  const assignedCourses = [
    { code: 'ICS 202', name: 'Data Structures and Algorithms', section: 'Lec 1' },
    { code: 'ICS 343', name: 'Fund. of Computer Networks', section: 'Lec 2' },
  ];

  return (
    <div className="mt-card">
      <h3 className="mt-title">Assigned Courses</h3>

      <div className="td-term-badge">
        Current Term 261
      </div>

      <table className="an-table" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Course number</th>
            <th>Course name</th>
            <th>Section</th>
          </tr>
        </thead>
        <tbody>
          {assignedCourses.length > 0 ? (
            assignedCourses.map((course) => (
              <tr key={course.code + course.section}>
                <td className="an-course-name">{course.code}</td>
                <td>{course.name}</td>
                <td>{course.section}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="textCenter">
                Assignments have not been published yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AssignedCourses;