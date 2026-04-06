import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Login
import Login from './Pages/login';

// Chairman
import ChairmanHomePage from './Pages/ChairmanHomePage';
import Load from './Pages/teachingLoad';
import IcsFaculty from './Pages/icsFaculty';
import SchedulingCommittee from './Pages/schedulingCommittee';

// Committee
import CommitteeLayout from './Committee/layout/CommitteeLayout';
import AssignCourses from './Committee/Pages/AssignCourses';
import ManageTerms from './Committee/Pages/ManageTerms';
import ManageCourses from './Committee/Pages/ManageCourses';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Chairman */}
        {/*<Route element={<ChairmanLayout />}> */}
          <Route path="/ics-committee" element={<SchedulingCommittee />} />
          <Route path="/ics-faculty"   element={<IcsFaculty />} />
          <Route path="/chairman-home" element={<ChairmanHomePage />} />
          <Route path="/teaching-load" element={<Load />} />
        {/*</Route> */}

        {/* Committee */}
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