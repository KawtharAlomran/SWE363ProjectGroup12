import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../../styles/ManageTerms.css';

function PreviousPreferences() {
  const navigate = useNavigate();

  // Temporary data for submitted preferences per term
  const submittedPreferences = {
    '261': [
      { rank: 1, code: 'ICS 202', name: 'Data Structures and Algorithms' },
      { rank: 2, code: 'ICS 253', name: 'Discrete Structures' },
      { rank: 3, code: 'ICS 343', name: 'Fund. of Computer Networks' },
    ],
    '252': [
      { rank: 1, code: 'ICS 104', name: 'Intro. to Prog. in Python & C' },
      { rank: 2, code: 'ICS 108', name: 'Object-Oriented Programming' },
      { rank: 3, code: 'ICS 202', name: 'Data Structures and Algorithms' },
    ],
    '251': [
      { rank: 1, code: 'ICS 253', name: 'Discrete Structures' },
      { rank: 2, code: 'ICS 321', name: 'Database Systems' },
    ],
    '242': [],
  };

  // State for selected term and pagination
  const [selectedTerm, setSelectedTerm] = useState('261');
  const [currentPage, setCurrentPage] = useState(1);

  // Get preferences for the selected term
  const preferences = submittedPreferences[selectedTerm] || [];

  // Check if the selected term is the current term
  const isCurrentTerm = selectedTerm === '261';

  // Pagination logic
  const preferencesPerPage = 4;
  const startIndex = (currentPage - 1) * preferencesPerPage;
  const endIndex = startIndex + preferencesPerPage;
  const currentPreferences = preferences.slice(startIndex, endIndex);

  // Total number of pages (at least 1)
  const totalPages = Math.ceil(preferences.length / preferencesPerPage) || 1;

  return (
    <div className="mt-card">
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
            className="mt-btn-add"
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
            setCurrentPage(1); // reset page when term changes
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
          {/* If preferences exist, show paginated list */}
          {preferences.length > 0 ? (
            currentPreferences.map((course) => (
              <tr key={course.rank + course.code}>
                <td>{course.rank}</td>
                <td className="an-course-name">{course.code}</td>
                <td>{course.name}</td>
              </tr>
            ))
          ) : (
            // If no preferences exist, show message
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
              onClick={() => setCurrentPage(index + 1)} // change page
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