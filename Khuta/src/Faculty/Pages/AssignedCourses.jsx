import { useEffect, useState } from 'react';

// API base URL for backend requests
const API = 'http://localhost:5174';

function AssignedCourses() {

  // State for selected term and current page
  const [selectedTerm, setSelectedTerm] = useState('261');
  const [currentPage, setCurrentPage] = useState(1);

  // state to store assigned courses from API
  const [assignedCourses, setAssignedCourses] = useState([]);

  // loading state while fetching data
  const [isLoading, setIsLoading] = useState(true);

  const facultyName = sessionStorage.getItem('UserName');

  // fetch assigned courses from backend
  const fetchAssignedCourses = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `${API}/api/assignments/${selectedTerm}/${encodeURIComponent(facultyName)}`
      );

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();

      setAssignedCourses(data);
    } catch (error) {
      console.error('Error fetching assigned courses:', error);
      setAssignedCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // call fetch when component loads or term changes
  useEffect(() => {
    fetchAssignedCourses();
  }, [selectedTerm]);

  // Number of courses shown per page
  const coursesPerPage = 4;

  // Pagination logic
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = assignedCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(assignedCourses.length / coursesPerPage) || 1;

  return (
    <div className="container">
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
          {isLoading ? (
            <tr>
              <td colSpan="3" className="textCenter">
                Loading...
              </td>
            </tr>
          ) : assignedCourses.length > 0 ? (
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