import { useState } from 'react';
//import '../../styles/ManageTerms.css';
//import '../../styles/ManageCourses.css';

function AssignedCourses() {
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

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = assignedCourses.slice(startIndex, endIndex);
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
                Assignments have not been published yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {assignedCourses.length > 0  && (
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