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

  // State for selected term and current page
  const [selectedTerm, setSelectedTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // fetch terms from backend
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch(`${API}/api/terms`);
        const data = await res.json();

        setTerms(data);

        // set default term
        if (data.length > 0) {
          setSelectedTerm(data[0].termId);
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };

    fetchTerms();
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
  const isCurrentTerm = selectedTerm === '261';

  // Pagination logic
  const preferencesPerPage = 4;
  const startIndex = (currentPage - 1) * preferencesPerPage;
  const endIndex = startIndex + preferencesPerPage;
  const currentPreferences = preferences.slice(startIndex, endIndex);
  const totalPages = Math.ceil(preferences.length / preferencesPerPage) || 1;

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
          <option value="261">261</option>
          <option value="252">252</option>
          <option value="251">251</option>
          <option value="242">242</option>
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
          {preferences.length > 0 ? (
            currentPreferences.map((course) => (
              <tr key={course.rank + course.code}>
                <td>{course.rank}</td>
                <td className="an-course-name">{course.code}</td>
                <td>{course.name}</td>
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