/**
 * AssignCourses.jsx
 *
 * DATA SOURCES:
 * - Faculty list: /api/faculty — all instructors (rows in By Instructor view)
 * - Sections: /api/assignments/:termId/sections — courses offered this term (rows in By Course view)
 * - Preferences by instructor: /api/preferences/term/:termId/instructor — small cards inside each instructor row
 * - Preferences by course: /api/preferences/term/:termId/course — small cards inside each course row
 * - Existing assignments: /api/assignments/:termId — pre-check previously assigned instructors
 *
 * RED HIGHLIGHT LOGIC:
 * - By Instructor: instructor row is red if they have NO preferences for this term
 * - By Course: course row is red if NO instructor selected it in preferences
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ByInstructor from './ByInstructor';
import ByCourse from './ByCourse';
import ConfirmModal from '../../shared/ConfirmModal';

const API = 'http://localhost:5174';

export default function AssignCourses() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('instructor');
  const [showConfirm, setShowConfirm] = useState(false);
  const [sectionError, setSectionError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [terms, setTerms] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState('');
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // All faculty from Faculty collection — rows in By Instructor view
  const [facultyList, setFacultyList] = useState([]);

  // All courses offered this term from Sections collection — rows in By Course view
  const [termCourses, setTermCourses] = useState([]);

  // Preferences grouped by instructor — small cards in By Instructor view
  const [prefByInstructor, setPrefByInstructor] = useState([]);

  // Preferences grouped by course — small cards in By Course view
  const [prefByCourse, setPrefByCourse] = useState([]);

  // Section numbers for dropdown (01, 02... F01, F02...)
  const [sectionNumbers, setSectionNumbers] = useState([]);

  // Assignments from DB — pre-check previously assigned instructors
  const [existingAssignments, setExistingAssignments] = useState([]);

  // Assignments added this session — filter dropdown options
  const [newAssignments, setNewAssignments] = useState([]);

  // Fetch terms and faculty on mount
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [termsRes, facultyRes] = await Promise.all([
          fetch(`${API}/api/terms`),
          fetch(`${API}/api/faculty`),
        ]);
        const [termsData, facultyData] = await Promise.all([
          termsRes.json(),
          facultyRes.json(),
        ]);
        setTerms(termsData);
        setFacultyList(facultyData);
        if (termsData.length > 0) setSelectedTermId(termsData[0].termId);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setLoadingTerms(false);
      }
    };
    fetchInitial();
  }, []);

  // Fetch term-specific data when selected term changes
  useEffect(() => {
    if (!selectedTermId) return;

    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [prefInstRes, prefCourseRes, sectionsRes, sectionNumsRes, assignmentsRes] = await Promise.all([
          fetch(`${API}/api/preferences/term/${selectedTermId}/instructor`),
          fetch(`${API}/api/preferences/term/${selectedTermId}/course`),
          fetch(`${API}/api/sections/${selectedTermId}`),           // raw sections for course list
          fetch(`${API}/api/assignments/${selectedTermId}/sections`), // generated section numbers
          fetch(`${API}/api/assignments/${selectedTermId}`),
        ]);

        const [prefInst, prefCourse, sections, sectionNums, existing] = await Promise.all([
          prefInstRes.json(),
          prefCourseRes.json(),
          sectionsRes.json(),
          sectionNumsRes.json(),
          assignmentsRes.json(),
        ]);

        // Get unique course IDs from Sections collection
        const uniqueCourseIds = [...new Set(sections.map(s => s.courseId))];
        setTermCourses(uniqueCourseIds);

        setPrefByInstructor(prefInst);
        setPrefByCourse(prefCourse);
        setSectionNumbers(sectionNums);
        setExistingAssignments(existing);
        setNewAssignments([]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [selectedTermId]);

  // Add section — conflict check in newAssignments only
  const addAssignment = (courseId, type, section, instructorName) => {
    const conflict = newAssignments.find(a =>
      a.courseId === courseId && a.type === type && a.section === section
    );
    if (conflict) {
      setSectionError({ message: `Section ${section} is already assigned to ${conflict.instructorName}` });
      return;
    }
    setSectionError(null);
    setSaveSuccess(false);
    setNewAssignments(prev => [...prev, { courseId, type, section, instructorName }]);
  };

  // Remove section from newAssignments only
  const removeAssignment = (courseId, type, section, instructorName) => {
    setSaveSuccess(false);
    setNewAssignments(prev => prev.filter(a =>
      !(a.courseId === courseId && a.type === type && a.section === section && a.instructorName === instructorName)
    ));
  };

  // Save — saves to DB without navigating away
  const handleSave = async () => {
    try {
      const allAssignments = [...existingAssignments, ...newAssignments];
      await fetch(`${API}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termId: selectedTermId, assignments: allAssignments }),
      });
      setExistingAssignments(allAssignments);
      setNewAssignments([]);
      setSaveSuccess(true);
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  // Submit — saves and navigates away
  const handleSubmit = async () => {
    try {
      const allAssignments = [...existingAssignments, ...newAssignments];
      await fetch(`${API}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termId: selectedTermId, assignments: allAssignments }),
      });
      setShowConfirm(false);
      navigate(-1);
    } catch (err) {
      console.error("Error submitting:", err);
    }
  };

  // Courses in Sections with no preferences — highlight red in By Course view
  const coursesWithNoPreference = termCourses.filter(courseId =>
    !prefByCourse.some(p => p.courseId === courseId)
  );

  // Instructors with no preferences for this term — highlight red in By Instructor view
  const instructorsWithNoPreference = facultyList.filter(f =>
    !prefByInstructor.some(p => p.facultyName === f.name)
  );

  if (loadingTerms) return <div className="container">Loading terms...</div>;

  return (
    <>
      <div className="container">
        <h3 className="header h2">Assign Courses</h3>

        {/* Term selector */}
        <div className="ac-view-toggle">
          <span className="ac-view-label">Term:</span>
          <select
            className="an-select"
            value={selectedTermId}
            onChange={e => { setSelectedTermId(e.target.value); setSectionError(null); setSaveSuccess(false); }}
          >
            {terms.map(t => <option key={t._id} value={t.termId}>{t.termId}</option>)}
          </select>
        </div>

        {/* View toggle */}
        <div className="ac-view-toggle">
          <span className="ac-view-label">View type:</span>
          <button
            className={`ac-toggle-btn${viewType === 'instructor' ? ' ac-toggle-btn--active' : ''}`}
            onClick={() => { setViewType('instructor'); setSectionError(null); }}
          >
            By instructor
          </button>
          <button
            className={`ac-toggle-btn${viewType === 'course' ? ' ac-toggle-btn--active' : ''}`}
            onClick={() => { setViewType('course'); setSectionError(null); }}
          >
            By course
          </button>
        </div>

        {/* Section conflict error */}
        {sectionError && (
          <div style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>
            * {sectionError.message}
          </div>
        )}

        {loadingData && <p>Loading...</p>}

        {/* By Instructor view — rows from Faculty, cards from Preferences */}
        {!loadingData && viewType === 'instructor' && (
          <ByInstructor
            facultyList={facultyList}
            prefByInstructor={prefByInstructor}
            sectionNumbers={sectionNumbers}
            existingAssignments={existingAssignments}
            newAssignments={newAssignments}
            instructorsWithNoPreference={instructorsWithNoPreference}
            onAdd={addAssignment}
            onRemove={removeAssignment}
          />
        )}

        {/* By Course view — rows from Sections, cards from Preferences */}
        {!loadingData && viewType === 'course' && (
          <ByCourse
            termCourses={termCourses}
            prefByCourse={prefByCourse}
            sectionNumbers={sectionNumbers}
            existingAssignments={existingAssignments}
            newAssignments={newAssignments}
            coursesWithNoPreference={coursesWithNoPreference}
            onAdd={addAssignment}
            onRemove={removeAssignment}
          />
        )}

        {saveSuccess && (
          <div style={{ color: 'green', fontSize: 13, marginTop: 8 }}>✓ Saved successfully</div>
        )}

        <div className="an-actions" style={{ marginTop: 24 }}>
          <button className="ac-toggle-btn" onClick={handleSave} style={{ marginRight: 8 }}>Save</button>
          <button className="an-btn-submit" onClick={() => setShowConfirm(true)}>Submit</button>
          <span className="an-note">*Note: Submitting will publish the assignments and notify all assigned faculty via email.</span>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit the changes?"
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}