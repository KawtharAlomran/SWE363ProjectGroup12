
import { useNavigate,NavLink} from 'react-router-dom';

// sample courses
const courses = [
  { id: 'ICS 104', name: 'Intro. to Prog. in Python & C' },
  { id: 'ICS 108', name: 'Object-Oriented Programming' },
  { id: 'ICS 202', name: 'Data Structures and Algorithms' },
];


export default function ChairmanHomePage() {
  const navigate = useNavigate();

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
          <h3 style={{ margin: 0 ,}}>All Offered Courses</h3>
          <p style={{ color: '#0d9488', fontWeight: 'bold', fontSize: '14px',textAlign:'left' }}>Current Term 261 ▾</p>

          <table>
            <thead>
              <tr>
                <th>Course number</th>
                <th>Course Name</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
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