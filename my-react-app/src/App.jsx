import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import ChairmanHomePage from './Pages/ChairmanHomePage';
import Load from './Pages/teachingLoad';
import IcsFaculty from './Pages/icsFaculty';
import SchedulingCommittee from './Pages/schedulingCommittee';
//import Layout from './layout/layout';
import './App.css';

// Committee pages
import CommitteeLayout from './Committee/layout/CommitteeLayout';
import AssignCourses from './Committee/Pages/AssignCourses';
import ManageTerms from './Committee/Pages/ManageTerms';
import ManageCourses from './Committee/Pages/ManageCourses';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
       {/* <Route element={<Layout />}>
          <Route path="/ics-committee" element={<SchedulingCommittee />} />
          <Route path="/ics-faculty"   element={<IcsFaculty />} />
          <Route path="/chairman-home" element={<ChairmanHomePage />} />
          <Route path="/teaching-load" element={<Load />} />
        </Route> */}

        {/* Committee pages */}
        <Route path="/committee" element={<CommitteeLayout />}>
          <Route path="assign-courses" element={<AssignCourses />} />
          <Route path="manage-terms"   element={<ManageTerms />} />
          <Route path="manage-courses" element={<ManageCourses />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;