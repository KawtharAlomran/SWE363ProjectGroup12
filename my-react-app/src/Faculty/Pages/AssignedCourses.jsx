import { useState } from 'react';
//import '../../styles/ManageTerms.css';
//import '../../styles/ManageCourses.css';

function AssignedCourses() {
  // Temporary data for assigned courses (will be replaced with backend later)
  const assignedCourses = [
    { code: 'ICS 202', name: 'Data Structures and Algorithms', section: 'Lec 1' },
    { code: 'ICS 343', name: 'Fund. of Computer Networks', section: 'Lec 2' },
    { code: 'ICS 253', name: 'Discrete Structures', section: 'Lec 1' },
    { code: 'ICS 321', name: 'Database Systems', section: 'Lec 2' },
    { code: 'ICS 104', name: 'Intro. to Prog. in Python & C', section: 'Lec 3' },
    { code: 'ICS 108', name: 'Object-Oriented Programming', section: 'Lec 1' },
    { code: 'ICS 381', name: 'Principles of Artificial Intelligence', section: 'Lec 1' },
    { code: 'ICS 410', name: 'Programming Languages', section: 'Lec 1' },
    { code: 'ICS 344', name: 'Information Security', section: 'Lec 2' },
  ];

  // State to track the current page number
  const [currentPage, setCurrentPage] = useState(1);

  // Number of courses shown per page
  const coursesPerPage = 4;

  // Calculate start and end index for slicing the data
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;

  // Get only the courses for the current page
  const currentCourses = assignedCourses.slice(startIndex, endIndex);

  // Calculate total number of pages
  const totalPages = Math.ceil(assignedCourses.length / coursesPerPage);

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
          {/* If there are assigned courses, display them */}
          {assignedCourses.length > 0 ? (
            currentCourses.map((course) => (
              <tr key={course.code + course.section}>
                <td className="an-course-name">{course.code}</td>
                <td>{course.name}</td>
                <td>{course.section}</td>
              </tr>
            ))
          ) : (
            // If no assignments exist, show message
            <tr>
              <td colSpan="3" className="textCenter">
                Assignments have not been published yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Page numbering (pagination) */}
      {assignedCourses.length > 0 && (
        <div className="pageNumbers">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(index + 1)} // change page on click
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