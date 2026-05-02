/**
 * AssignCourses.jsx
 * 
 * WHAT CHANGED:
 * - Separated existing assignments (from DB) from new assignments (added in current session)
 * - existingAssignments: loaded from DB, used to pre-check instructors who were previously assigned
 * - newAssignments: what user adds/removes in this session, used to filter available sections in dropdown
 * - Available sections are filtered only from newAssignments (not existingAssignments)
 *   so the full section list from Sections collection always shows correctly
 * - On Submit: saves both existing + new assignments to DB
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

  const [terms, setTerms] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState('');
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const [byInstructor, setByInstructor] = useState([]);
  const [byCourse, setByCourse] = useState([]);
  const [sectionNumbers, setSectionNumbers] = useState([]);

  // Assignments already saved in DB — used to pre-check instructors
  const [existingAssignments, setExistingAssignments] = useState([]);

  // Assignments added/removed in current session — used to filter dropdown options
  const [newAssignments, setNewAssignments] = useState([]);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch(`${API}/api/terms`);
        const data = await res.json();
        const filteredTerms = data.filter(t => t.assigned === false);
        setTerms(filteredTerms);
        if (data.length > 0) setSelectedTermId(data[0].termId);
      } catch (err) {
        console.error("Error fetching terms:", err);
      } finally {
        setLoadingTerms(false);
      }
    };
    fetchTerms();
  }, []);

  useEffect(() => {
    if (!selectedTermId) return;

    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [prefInstRes, prefCourseRes, sectionsRes, assignmentsRes] = await Promise.all([
          fetch(`${API}/api/preferences/term/${selectedTermId}/instructor`),
          fetch(`${API}/api/preferences/term/${selectedTermId}/course`),
          fetch(`${API}/api/assignments/${selectedTermId}/sections`),
          fetch(`${API}/api/assignments/${selectedTermId}`),
        ]);

        const [prefInst, prefCourse, sections, existing] = await Promise.all([
          prefInstRes.json(),
          prefCourseRes.json(),
          sectionsRes.json(),
          assignmentsRes.json(),
        ]);

        setSectionNumbers(sections);
        setExistingAssignments(existing); // pre-check previously assigned instructors
        setNewAssignments([]); // reset new assignments when term changes
        setByInstructor(prefInst);
        setByCourse(prefCourse);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [selectedTermId]);

  // Add section — checks conflict only in newAssignments (current session)
  const addAssignment = (courseId, type, section, instructorName) => {
    const conflict = newAssignments.find(a =>
      a.courseId === courseId && a.type === type && a.section === section
    );
    if (conflict) {
      setSectionError({ message: `Section ${section} is already assigned to ${conflict.instructorName}` });
      return;
    }
    setSectionError(null);
    setNewAssignments(prev => [...prev, { courseId, type, section, instructorName }]);
  };

  // Remove section from newAssignments
  const removeAssignment = (courseId, type, section, instructorName) => {
    setNewAssignments(prev => prev.filter(a =>
      !(a.courseId === courseId && a.type === type && a.section === section && a.instructorName === instructorName)
    ));
  };

  // Submit — merges existing + new assignments and saves to DB
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
      console.error("Error saving assignments:", err);
    }
  };

  if (loadingTerms) return <div className="container">Loading terms...</div>;

  return (
    <>
      <div className="container">
        <h3 className="header h2">Assign Courses</h3>

        <div className="ac-view-toggle">
          <span className="ac-view-label">Term:</span>
          <select
            className="an-select"
            value={selectedTermId}
            onChange={e => { setSelectedTermId(e.target.value); setSectionError(null); }}
          >
            {terms.map(t => <option key={t._id} value={t.termId}>{t.termId}</option>)}
          </select>
        </div>

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

        {sectionError && (
          <div style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>
            * {sectionError.message}
          </div>
        )}

        {loadingData && <p>Loading preferences...</p>}

        {!loadingData && viewType === 'instructor' && (
          <ByInstructor
            instructors={byInstructor}
            sectionNumbers={sectionNumbers}
            existingAssignments={existingAssignments}  // to pre-check instructors
            newAssignments={newAssignments}             // to filter dropdown options
            onAdd={addAssignment}
            onRemove={removeAssignment}
          />
        )}

        {!loadingData && viewType === 'course' && (
          <ByCourse
            courses={byCourse}
            sectionNumbers={sectionNumbers}
            existingAssignments={existingAssignments}  // to pre-check instructors
            newAssignments={newAssignments}             // to filter dropdown options
            onAdd={addAssignment}
            onRemove={removeAssignment}
          />
        )}

        <div className="an-actions" style={{ marginTop: 24 }}>
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