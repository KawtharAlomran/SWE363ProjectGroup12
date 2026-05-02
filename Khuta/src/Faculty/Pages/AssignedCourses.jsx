import { useEffect, useState } from 'react';

// API base URL for backend requests
const API = '';

function AssignedCourses() {

  // State for selected term and current page
  const [selectedTerm, setSelectedTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // state to store assigned courses from API
  const [assignedCourses, setAssignedCourses] = useState([]);

  //state to store available terms for dropdown
  const [terms, setTerms] = useState([]);

  // loading state while fetching data
  const [isLoading, setIsLoading] = useState(true);

  const facultyName = sessionStorage.getItem('UserName');

  // fetch assigned courses from backend
  const fetchAssignedCourses = async () => {
    if (!selectedTerm || !facultyName) return;
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
  }, [selectedTerm, facultyName]);

// fetch available terms for dropdown on component mount
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch(`${API}/api/terms`);
        const data = await res.json();
        setTerms(data);

        if (data.length > 0) {
          setSelectedTerm(data[0].termId);
        }
      } catch (err) {
        console.error("Error fetching terms:", err);
      }
    };

    fetchTerms();
  }, []);

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
          {terms.map(term => (
            <option key={term.termId} value={term.termId}>
              {term.termId}
            </option>
          ))}
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