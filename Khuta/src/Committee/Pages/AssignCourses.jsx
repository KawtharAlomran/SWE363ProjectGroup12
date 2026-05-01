import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ByInstructor from './ByInstructor';
import ByCourse from './ByCourse';
import ConfirmModal from '../../shared/ConfirmModal';
import { getInstructorsPrefrences, getCoursePrefrences, setInstructorsPrefrences, setCoursePrefrences, getTermSections } from "../../data";

export default function AssignCourses() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('instructor');
  const [instructors, setInstructors] = useState(getInstructorsPrefrences());
  const [coursesList, setCoursesList] = useState(getCoursePrefrences());
  const [showConfirm, setShowConfirm] = useState(false);

  // { instructorId, courseId, field } — which select exceeded the limit
  const [sectionError, setSectionError] = useState(null);

  // Term logic 
  const [currentTerms, setCurrentTerms] = useState([]);
  const [selectedTermID, setSelectedTermID] = useState('');

  // Loading states to inform the user of the state of the website 
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [loadingPreferences, setLoadingPreferences] = useState(false);

  useEffect(() => {
    // Fetch terms from backend API
    fetch("http://localhost:5174/api/terms")
      .then(res => res.json())
      .then(data => {
        // Store terms in state
        setCurrentTerms(data);

        // Set default selected term (first one)
        if (data.length > 0) {
          setSelectedTermID(data[0].termID);
        }

        // Stop loading
        setLoadingTerms(false);
      })
      .catch(err => {
        console.error("Error fetching terms:", err);
        setLoadingTerms(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedTermID) return;

    setLoadingPreferences(true);

    fetch(`http://localhost:5174/api/preferences/term/${selectedTermID}/instructor`)
      .then(res => res.json())
      .then(data => {
        const formattedInstructors = data.map((inst, index) => ({
          id: index + 1,
          name: inst.facultyName,
          courses: inst.preferences.map(pref => ({
            id: pref.courseId,
            code: pref.courseId,
            rank: pref.order,
            assigned: false
          }))
        }));

        setInstructors(formattedInstructors);
        setLoadingPreferences(false);
      })
      .catch(err => {
        console.error("Error fetching instructor preferences:", err);
        setLoadingPreferences(false);
      });
  }, [selectedTermID]);

  const toggle = (instructorId, courseId) => {
    const updatedInstructorsList = instructors.map((inst) =>
      inst.id === instructorId ? {...inst, courses: inst.courses.map((c) => c.id === courseId ? { ...c, assigned: !c.assigned } : c)} : inst);

    const updatedCourseList = coursesList.map((course) =>
      course.id === courseId ? {...course, instructors: course.instructors.map((i) => i.id === instructorId ? { ...i, assigned: !i.assigned } : i)} : course);

    setInstructorsPrefrences(updatedInstructorsList);
    setCoursePrefrences(updatedCourseList);
    setInstructors(updatedInstructorsList);
    setCoursesList(updatedCourseList);
  };

  const updateSection = (instructorId, courseId, field, value) => {
    const termSections = getTermSections(selectedTermID);

    const courseCode = coursesList.find(c => c.id === courseId)?.code
      ?? instructors.find(i => i.id === instructorId)?.courses.find(c => c.id === courseId)?.code;

    const termCourse = termSections.find(t => t.code === courseCode);

    if (termCourse) {
      const maxAllowed = termCourse[field] ?? 99;

      const coursePref = coursesList.find(c => c.id === courseId);
      const currentTotal = coursePref?.instructors
        .filter(i => i.assigned && i.id !== instructorId)
        .reduce((sum, i) => sum + (i[field] || 0), 0) ?? 0;

      if (currentTotal + value > maxAllowed) {
        // Set error instead of alert — points to the specific select
        setSectionError({ instructorId, courseId, field, max: maxAllowed, code: courseCode });
        return;
      }
    }

    // Clear error on valid input
    setSectionError(null);

    const updatedInstructors = instructors.map(i =>
      i.id === instructorId ? { ...i, courses: i.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c) } : i);

    const updatedCourses = coursesList.map(c =>
      c.id === courseId ? {
        ...c,
        instructors: c.instructors.map(i => i.id === instructorId ? { ...i, [field]: value } : i)
      } : c);

    setInstructors(updatedInstructors);
    setInstructorsPrefrences(updatedInstructors);
    setCoursesList(updatedCourses);
    setCoursePrefrences(updatedCourses);
  };

  const termCourses = getTermSections(selectedTermID);
  const termCourseCodes = termCourses.map(c => c.code);
  const filteredInstructors = instructors.map(inst => ({
    ...inst,
    courses: inst.courses.filter(c => termCourseCodes.includes(c.code))
  }));

  const filteredCourses = termCourses.map(tc => {
    const existing = coursesList.find(c => c.code === tc.code);
    return existing ?? { id: tc.code, code: tc.code, instructors: [] };
  });

  // Show loading message while fetching terms
  if (loadingTerms) {
    return <div className="container">Loading terms...</div>;
  }
  return (
    <>
      <div className="container">

        <h3 className="header h2">Assign Courses</h3>

        <div className="ac-view-toggle">
          <span className="ac-view-label">Term:</span>
          <select className="an-select" value={selectedTermID} onChange={e => { setSelectedTermID(e.target.value); setSectionError(null); }}>
            {currentTerms.map(t => <option key={t._id} value={t.termId}>{t.termId}</option>)}
          </select>
        </div>

        <div className="ac-view-toggle">
          <span className="ac-view-label">View type:</span>
          <button className={`ac-toggle-btn${viewType === 'instructor' ? ' ac-toggle-btn--active' : ''}`} onClick={() => { setViewType('instructor'); setSectionError(null); }}>By instructor</button>
          <button className={`ac-toggle-btn${viewType === 'course' ? ' ac-toggle-btn--active' : ''}`} onClick={() => { setViewType('course'); setSectionError(null); }}>By course</button>
        </div>

        {loadingPreferences && <p>Loading preferences...</p>}
        {!loadingPreferences && viewType === 'instructor' && (
          <ByInstructor
            instructors={filteredInstructors}
            onToggle={toggle}
            onUpdateSection={updateSection}
            termNum={selectedTermID}
            sectionError={sectionError}
          />
        )}

        {viewType === 'course' && (
          <ByCourse
            courses={filteredCourses}
            onToggle={toggle}
            onUpdateSection={updateSection}
            termNum={selectedTermID}
            sectionError={sectionError}
          />
        )}

        <div className="an-actions" style={{ marginTop: 24 }}>
          <button className="an-btn-submit" onClick={() => setShowConfirm(true)}>Submit</button>
          <span className="an-note">*Note: Changes are saved automaticaly. Submitting will publish the assignments and notify all assigned faculty via email.</span>
        </div>

      </div>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit the changes?"
          onConfirm={() => { setShowConfirm(false); navigate(-1); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}