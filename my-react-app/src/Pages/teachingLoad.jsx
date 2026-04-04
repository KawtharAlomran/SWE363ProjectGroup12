
import { useNavigate,NavLink } from 'react-router-dom';

export default function Load(){
    const navigate = useNavigate();
    return(
        <>
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
            </div>
            <main className="main-content">
                <h2 style={{ marginBottom: '30px' }}>Hello Dr. Malak 👋,</h2>
                <div className="course-card"></div>
            </main>
        </>
    );
}