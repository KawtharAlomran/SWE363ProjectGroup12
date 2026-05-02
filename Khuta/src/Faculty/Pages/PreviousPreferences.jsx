import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// API base URL for backend requests
const API = 'http://localhost:5174';

function PreviousPreferences() {
  const navigate = useNavigate();

  // State for terms fetched from backend
  const [terms, setTerms] = useState([]);

  // State for preferences fetched from backend
  const [preferences, setPreferences] = useState([]);

  // Loading state while fetching data
  const [isLoading, setIsLoading] = useState(true);

  // State for selected term and current page and courses
  const [selectedTerm, setSelectedTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);

  // fetch terms + courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const termsRes = await fetch(`${API}/api/terms`);
        const termsData = await termsRes.json();

        const coursesRes = await fetch(`${API}/api/courses`);
        const coursesData = await coursesRes.json();

        setTerms(termsData);
        setCourses(coursesData);

        if (termsData.length > 0) {
          setSelectedTerm(termsData[0].termId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // fetch preferences for the selected term
  useEffect(() => {
    if (!selectedTerm) return;

    const fetchPreferences = async () => {
      try {
        setIsLoading(true);

        // get logged-in faculty name
        const facultyName = sessionStorage.getItem('UserName');

        const res = await fetch(
          `${API}/api/preferences/term/${selectedTerm}`
        );

        const data = await res.json();

        // filter only current user's preferences
        const filtered = data.filter(p => p.facultyName === facultyName);

        setPreferences(filtered);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching preferences:", error);
        setPreferences([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [selectedTerm]);


  // Check if selected term is the current term
  const isCurrentTerm = selectedTerm === terms[0]?.termId; // assuming terms are sorted with current term first

  // Pagination logic
  const preferencesPerPage = 4;
  const startIndex = (currentPage - 1) * preferencesPerPage;
  const endIndex = startIndex + preferencesPerPage;
  const currentPreferences = preferences.slice(startIndex, endIndex);
  const totalPages = Math.ceil(preferences.length / preferencesPerPage) || 1;

  // helper function to get course name from code
  const getCourseName = (code) => {
    const course = courses.find(c => c.code === code);
    return course ? course.name : code;
  };

  return (
    <div className="container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <h3 className="mt-title">Submitted Preferences</h3>

        {/* Show modify button only for current term */}
        {isCurrentTerm && preferences.length > 0 && (
          <button
            className="addBtn"
            onClick={() => navigate('/faculty/set-preferences')}
          >
            Modify Submitted Preferences
          </button>
        )}
      </div>

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
            setCurrentPage(1);
          }}
        >
          {terms.map(term => (
            <option key={term.termId} value={term.termId}>
              {term.termId}
            </option>
          ))}
        </select>
      </div>

      <table className="an-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Course number</th>
            <th>Course name</th>
          </tr>
        </thead>
        <tbody>
          {/* Show preferences if available */}
          {isLoading ? (
              <tr>
                <td colSpan="3" className="textCenter">
                  Loading preferences...
                </td>
              </tr>
            ) : preferences.length > 0 ? (
              currentPreferences.map((course) => (
                <tr key={course._id || course.courseId + course.order}>
                  <td>{course.order}</td>
                  <td className="an-course-name">{course.courseId}</td>
                  <td>{getCourseName(course.courseId)}</td>
                </tr>
              ))
            ) : (
            // Show message if no preferences exist
            <tr>
              <td colSpan="3" className="textCenter">
                No preferences found for this term.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Page numbering */}
      {preferences.length > 0 && (
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

export default PreviousPreferences;