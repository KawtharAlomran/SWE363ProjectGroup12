import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import ChairmanHomePage from './Pages/ChairmanHomePage';
import Load from './Pages/teachingLoad';
import IcsFaculty from './Pages/icsFaculty';
import SchedulingCommittee from './Pages/schedulingCommittee';
import Layout from './Committee/layout/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/ics-committee" element={<SchedulingCommittee />} />
          <Route path="/ics-faculty"   element={<IcsFaculty />} />
          <Route path="/chairman-home" element={<ChairmanHomePage />} />
          <Route path="/teaching-load" element={<Load />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;