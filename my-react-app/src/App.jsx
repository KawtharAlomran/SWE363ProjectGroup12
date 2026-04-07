import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Login
import Login from './login';

// Chairman
import ChairmanLayout from './Chairman/layout/ChairmanLayout';
import ChairmanHomePage from './Chairman/Pages/ChairmanHomePage';
import Load from './Chairman/Pages/teachingLoad';
import IcsFaculty from './Chairman/Pages/icsFaculty';
import SchedulingCommittee from './Chairman/Pages/schedulingCommittee';

// Committee
import CommitteeLayout from './Committee/layout/CommitteeLayout';
import AssignCourses from './Committee/Pages/AssignCourses';
import ManageTerms from './Committee/Pages/ManageTerms';
import ManageCourses from './Committee/Pages/ManageCourses';

// Faculty
import FacultyLayout from './Faculty/layout/FacultyLayout';
import OfferedCourses from './Faculty/Pages/OfferedCourses';
import SetPreferences from './Faculty/Pages/SetPreferences';
import AssignedCourses from './Faculty/Pages/AssignedCourses';

//import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Chairman */}
        <Route path="/chairman" element={<ChairmanLayout />}>
          <Route path="ics-committee" element={<SchedulingCommittee />} />
          <Route path="ics-faculty" element={<IcsFaculty />} />
          <Route path="ics-courses" element={<ChairmanHomePage />} />
          <Route path="teaching-load" element={<Load />} />
        </Route>

        {/* Committee */}
        <Route path="/committee" element={<CommitteeLayout />}>
          <Route path="assign-courses" element={<AssignCourses />} />
          <Route path="manage-terms" element={<ManageTerms />} />
          <Route path="manage-courses" element={<ManageCourses />} />
        </Route>

        {/* Faculty */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route path="offered-courses" element={<OfferedCourses />} />
          <Route path="set-preferences" element={<SetPreferences />} />
          <Route path="assigned-courses" element={<AssignedCourses />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;