
import { useNavigate,NavLink } from 'react-router-dom';
import {getFaculty} from "../data";



export default function IcsFaculty(){
    const navigate = useNavigate();
    let faculty=getFaculty();
    return(
        <>
        <div className="dashboard-container">
              
              <aside className="sidebar">
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>Khuta</h1>
                
                <nav style={{ flex: 1 }}>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li ><NavLink to="/ics-committee">🗓 Scheduling Committee</NavLink></li>
                    <li ><NavLink to="/ics-faculty">👥 ICS Faculty</NavLink></li>
                    <li ><NavLink to="/chairman-home">📋 ICS Courses</NavLink></li>
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
                <h2 >Hello Dr. Malak 👋,</h2>
                <div className="course-card">
                    <h3 style={{ margin: 0, display: 'inline'}}>All ICS Faculty</h3>
                    <button style={{background: '#008767', color: 'white', margin: 10, borderRadius:10}}>Add new faclty</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Faculty Name</th>
                                <th>Faculty Email</th>
                                <th>Faculty Level</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculty.map((member) => (
                                <tr key={member.email}>
                                  <td style={{ fontWeight: '500' }}>{member.name}</td>
                                  <td>{member.email}</td>
                                  <td>{member.level}</td>
                                  <td><button style={{background: '#e11d48', color: 'white', borderRadius:10}}>Remove</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </main>

            </div>
        </>
    )
}