import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import ChairmanHomePage from './Pages/ChairmanHomePage';
import Load from './Pages/teachingLoad';
import IcsFaculty from './Pages/icsFaculty';
import SchedulingCommittee from './Pages/schedulingCommittee';
import './App.css';
/* To run the proggram
1- cd my-react-app
2- npm install
3- npm i react-router-dom 
4- npm run dev


*/
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
