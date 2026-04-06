
import { useNavigate,NavLink} from 'react-router-dom';
import { useState } from 'react';

// sample courses
let courses = [
  { id: 'ICS 104', name: 'Intro. to Prog. in Python & C' },
  { id: 'ICS 108', name: 'Object-Oriented Programming' },
  { id: 'ICS 202', name: 'Data Structures and Algorithms' },
  { id: 'ICS 253', name: 'Discrete Structures' },
  { id: 'ICS 321', name: 'Database Systems' },
  { id: 'ICS 343', name: 'Fund. of Computer Networks' }
];

let terms=[
  {termNum:"261", courses:['ICS 104','ICS 202','ICS 253','ICS 343']},
  {termNum:"252", courses:['ICS 104',"ICS 108",'ICS 202','ICS 253','ICS 321','ICS 343']}
]


export default function ChairmanHomePage() {
  const navigate = useNavigate();

  const [selectedTerm, setSelectedTerm] = useState(terms[0].termNum);
  const currentTermData = terms.find(t => t.termNum === selectedTerm);
  const filteredCourses = courses.filter(course => 
    currentTermData?.courses.includes(course.id)
  );


  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>Khuta</h1>
        
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><NavLink to="/ics-committee">🗓 Scheduling Committee</NavLink></li>
            <li><NavLink to="/ics-faculty">👥 ICS Faculty</NavLink></li>
            <li><NavLink to="/chairman-home">📋 ICS Courses</NavLink></li>
            <li><NavLink to="/teaching-load">⏳ Teaching Load</NavLink></li>
          </ul>
        </nav>

        <div className="user-profile">
          <p style={{textAlign:'left'}}><strong>Malak</strong></p>
          <p style={{textAlign:'left', fontSize: '12px', color: 'gray' }}>ICS Chairman</p>
          <button 
            onClick={() => navigate('/')} 
            style={{ width: '100%', background: '#e11d48', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Log Out
          </button>
        </div>
      </aside>


      <main className="main-content">
        <h2>Hello Dr. Malak 👋,</h2>

        <div className="course-card">
          <h3 style={{ margin: 0 }}>All Offered Courses</h3>
          <div className="term-selection">
            <p style={{ color: '#0d9488', fontWeight: 'bold', fontSize: '14px',textAlign:'left' }}>Select Term </p>

            <select value={selectedTerm} 
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              {terms.map((term) => (
                <option key={term.termNum} value={term.termNum}>
                  {term.termNum}
                </option>
              ))}
            </select>
          </div>
          

          <table>
            <thead>
              <tr>
                <th>Course number</th>
                <th>Course Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td style={{ fontWeight: '500' }}>{course.id}</td>
                  <td>{course.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </main>
    </div>
  );
}