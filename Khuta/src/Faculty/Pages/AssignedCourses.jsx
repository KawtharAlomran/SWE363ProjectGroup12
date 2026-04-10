import { useState } from 'react';


function AssignedCourses() {
  // Temporary assigned courses grouped by term
  const assignedCoursesByTerm = {
    '261': [
      { code: 'ICS 202', name: 'Data Structures and Algorithms', section: 'Lec 1' },
      { code: 'ICS 343', name: 'Fund. of Computer Networks', section: 'Lec 2' },
      { code: 'ICS 253', name: 'Discrete Structures', section: 'Lec 1' },
      { code: 'ICS 321', name: 'Database Systems', section: 'Lec 2' },
      { code: 'ICS 104', name: 'Intro. to Prog. in Python & C', section: 'Lec 3' },
      { code: 'ICS 108', name: 'Object-Oriented Programming', section: 'Lec 1' },
      { code: 'ICS 381', name: 'Principles of Artificial Intelligence', section: 'Lec 1' },
      { code: 'ICS 410', name: 'Programming Languages', section: 'Lec 1' },
      { code: 'ICS 344', name: 'Information Security', section: 'Lec 2' },
    ],
    '252': [
      { code: 'ICS 104', name: 'Intro. to Prog. in Python & C', section: 'Lec 1' },
      { code: 'ICS 108', name: 'Object-Oriented Programming', section: 'Lec 2' },
      { code: 'ICS 202', name: 'Data Structures and Algorithms', section: 'Lec 1' },
      { code: 'ICS 253', name: 'Discrete Structures', section: 'Lec 2' },
      { code: 'ICS 321', name: 'Database Systems', section: 'Lec 1' },
    ],
    '251': [
      { code: 'ICS 253', name: 'Discrete Structures', section: 'Lec 1' },
      { code: 'ICS 321', name: 'Database Systems', section: 'Lec 1' },
    ],
    '242': [],
  };

  // State for selected term and current page
  const [selectedTerm, setSelectedTerm] = useState('261');
  const [currentPage, setCurrentPage] = useState(1);

  // Get courses for the selected term
  const assignedCourses = assignedCoursesByTerm[selectedTerm] || [];

  // Number of courses shown per page
  const coursesPerPage = 4;

  // Pagination logic
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = assignedCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(assignedCourses.length / coursesPerPage) || 1;

  return (
    <div className="mt-card">
      <h3 className="mt-title">Assigned Courses</h3>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '12px',
          marginBottom: '20px',
        }}
      >
        <label className="td-term-badge">Select Term:</label>
        <select
          className="an-select"
          value={selectedTerm}
          onChange={(e) => {
            setSelectedTerm(e.target.value);
            setCurrentPage(1); // reset page when term changes
          }}
        >
          <option value="261">261</option>
          <option value="252">252</option>
          <option value="251">251</option>
          <option value="242">242</option>
        </select>
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
            currentCourses.map((course) => (
              <tr key={course.code + course.section}>
                <td className="an-course-name">{course.code}</td>
                <td>{course.name}</td>
                <td>{course.section}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="textCenter">
                No courses assigned for term {selectedTerm}.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {assignedCourses.length > 0 && (
        <div className="pageNumbers">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssignedCourses;