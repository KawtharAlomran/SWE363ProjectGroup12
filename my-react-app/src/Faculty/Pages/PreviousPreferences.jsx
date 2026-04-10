import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../../styles/ManageTerms.css';

function PreviousPreferences() {
  const navigate = useNavigate();

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

  const [selectedTerm, setSelectedTerm] = useState('261');

  const preferences = submittedPreferences[selectedTerm] || [];
  const isCurrentTerm = selectedTerm === '261';

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
        <label className="an-term-label">Select Term:</label>
        <select
          className="an-select"
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
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
          {preferences.length > 0 ? (
            preferences.map((course) => (
              <tr key={course.rank + course.code}>
                <td>{course.rank}</td>
                <td className="an-course-name">{course.code}</td>
                <td>{course.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="textCenter">
                No preferences found for this term.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PreviousPreferences;