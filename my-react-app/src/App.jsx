import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import ChairmanHomePage from './Pages/ChairmanHomePage';
import Load from './Pages/teachingLoad';
import IcsFaculty from './Pages/icsFaculty';
import SchedulingCommittee from './Pages/schedulingCommittee';
import './App.css';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chairman-home" element={<ChairmanHomePage />} > 
          
        </Route>
        <Route path="/teaching-load" element={<Load />} />
        <Route path="/ics-faculty" element={<IcsFaculty />} />
        <Route path="/ics-committee" element={<SchedulingCommittee />} />
        
      </Routes>
    </Router>
    
  );
}

export default App
