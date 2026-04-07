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

// Faculty
import FacultyLayout from './Faculty/layout/FacultyLayout';
import OfferedCourses from './Faculty/Pages/OfferedCourses';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Chairman */}
        <Route path="/ics-committee" element={<SchedulingCommittee />} />
        <Route path="/ics-faculty" element={<IcsFaculty />} />
        <Route path="/chairman-home" element={<ChairmanHomePage />} />
        <Route path="/teaching-load" element={<Load />} />

        {/* Committee */}
        <Route path="/committee" element={<CommitteeLayout />}>
          <Route path="assign-courses" element={<AssignCourses />} />
          <Route path="manage-terms" element={<ManageTerms />} />
          <Route path="manage-courses" element={<ManageCourses />} />
        </Route>

        {/* Faculty */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route path="offered-courses" element={<OfferedCourses />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;