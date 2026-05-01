/**
 * AssignCourses.jsx
 * 
 * This component allows the committee to assign instructors to course sections.
 * 
 * WHAT CHANGED FROM OLD VERSION:
 * - Removed all imports from data.js (getInstructorsPrefrences, getCoursePrefrences, etc.)
 * - Data is now fetched from the backend API instead of local static data
 * - Added section number selection (01, 02... for male / F01, F02... for female)
 *   instead of selecting a count of sections
 * - Existing assignments are loaded from the database when the page opens
 * - Assignments are saved to the Assignment collection in MongoDB on Submit
 * 
 * HOW IT WORKS:
 * 1. On mount → fetches all terms from /api/terms
 * 2. When a term is selected → fetches 4 things in parallel:
 *    - Preferences by instructor: /api/preferences/term/:termId/instructor
 *    - Preferences by course:     /api/preferences/term/:termId/course
 *    - Section numbers:           /api/assignments/:termId/sections
 *      (converts maleSections count → ["01","02"...] and femaleSections → ["F01","F02"...])
 *    - Existing assignments:      /api/assignments/:termId
 * 3. User selects sections for each instructor from dropdowns
 * 4. On Submit → saves all assignments to /api/assignments (POST)
 * 
 * PROPS PASSED DOWN:
 * - ByInstructor: instructors, sectionNumbers, assignments, onAdd, onRemove
 * - ByCourse:     courses, sectionNumbers, assignments, onAdd, onRemove
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ByInstructor from './ByInstructor';
import ByCourse from './ByCourse';
import ConfirmModal from '../../shared/ConfirmModal';

const API = 'http://localhost:5174';

export default function AssignCourses() {
  const navigate = useNavigate();

  // Controls which view is shown: 'instructor' or 'course'
  const [viewType, setViewType] = useState('instructor');
  const [showConfirm, setShowConfirm] = useState(false);

  // Error shown when a section is already assigned to another instructor
  const [sectionError, setSectionError] = useState(null);

  // All available terms fetched from /api/terms
  const [terms, setTerms] = useState([]);

  // The currently selected term ID (e.g. "253")
  const [selectedTermId, setSelectedTermId] = useState('');

  // Loading states
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // Preferences grouped by instructor — used in ByInstructor view
  // Format: [{ facultyName, preferences: [{ courseId, order }] }]
  const [byInstructor, setByInstructor] = useState([]);

  // Preferences grouped by course — used in ByCourse view
  // Format: [{ courseId, instructors: [{ facultyName, order }] }]
  const [byCourse, setByCourse] = useState([]);

  // Generated section numbers from Sections collection
  // Format: [{ courseId, type: "LEC"|"LAB", maleSections: ["01","02"...], femaleSections: ["F01","F02"...] }]
  const [sectionNumbers, setSectionNumbers] = useState([]);

  // All current assignments (local state, saved to DB on Submit)
  // Format: [{ courseId, type, section, instructorName }]
  const [assignments, setAssignments] = useState([]);

  // Fetch all terms on component mount
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch(`${API}/api/terms`);
        const data = await res.json();
        setTerms(data);
        // Auto-select the first term
        if (data.length > 0) setSelectedTermId(data[0].termId);
      } catch (err) {
        console.error("Error fetching terms:", err);
      } finally {
        setLoadingTerms(false);
      }
    };
    fetchTerms();
  }, []);

  // Fetch all data when selected term changes
  useEffect(() => {
    if (!selectedTermId) return;

    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Fetch all 4 sources at the same time for better performance
        const [prefInstRes, prefCourseRes, sectionsRes, assignmentsRes] = await Promise.all([
          fetch(`${API}/api/preferences/term/${selectedTermId}/instructor`),
          fetch(`${API}/api/preferences/term/${selectedTermId}/course`),
          fetch(`${API}/api/assignments/${selectedTermId}/sections`),
          fetch(`${API}/api/assignments/${selectedTermId}`),
        ]);

        const [prefInst, prefCourse, sections, existingAssignments] = await Promise.all([
          prefInstRes.json(),
          prefCourseRes.json(),
          sectionsRes.json(),
          assignmentsRes.json(),
        ]);

        setSectionNumbers(sections);
        setAssignments(existingAssignments); // pre-load existing assignments from DB
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

  /**
   * addAssignment — called when user picks a section from the dropdown
   * Checks if section is already taken before adding
   * @param {string} courseId - e.g. "ICS 104"
   * @param {string} type - "LEC" or "LAB"
   * @param {string} section - e.g. "01" or "F02"
   * @param {string} instructorName - faculty name
   */
  const addAssignment = (courseId, type, section, instructorName) => {
    // Prevent assigning same section to two instructors
    const conflict = assignments.find(a =>
      a.courseId === courseId && a.type === type && a.section === section
    );
    if (conflict) {
      setSectionError({ message: `Section ${section} is already assigned to ${conflict.instructorName}` });
      return;
    }
    setSectionError(null);
    setAssignments(prev => [...prev, { courseId, type, section, instructorName }]);
  };

  /**
   * removeAssignment — called when user clicks × on a section tag
   */
  const removeAssignment = (courseId, type, section, instructorName) => {
    setAssignments(prev => prev.filter(a =>
      !(a.courseId === courseId && a.type === type && a.section === section && a.instructorName === instructorName)
    ));
  };

  /**
   * handleSubmit — saves all assignments to Assignment collection in MongoDB
   * Replaces existing assignments for this term (delete + insert in backend)
   */
  const handleSubmit = async () => {
    try {
      await fetch(`${API}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termId: selectedTermId, assignments }),
      });
      setShowConfirm(false);
      navigate(-1);
    } catch (err) {
      console.error("Error saving assignments:", err);
    }
  };

  // Show loading screen while fetching terms
  if (loadingTerms) return <div className="container">Loading terms...</div>;

  return (
    <>
      <div className="container">
        <h3 className="header h2">Assign Courses</h3>

        {/* Term selector — changing term re-fetches all data */}
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

        {/* View type toggle */}
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

        {/* Conflict error — shown when a section is already assigned */}
        {sectionError && (
          <div style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>
            * {sectionError.message}
          </div>
        )}

        {loadingData && <p>Loading preferences...</p>}

        {/* By Instructor view */}
        {!loadingData && viewType === 'instructor' && (
          <ByInstructor
            instructors={byInstructor}       // [{ facultyName, preferences }]
            sectionNumbers={sectionNumbers}   // [{ courseId, type, maleSections, femaleSections }]
            assignments={assignments}          // [{ courseId, type, section, instructorName }]
            onAdd={addAssignment}
            onRemove={removeAssignment}
          />
        )}

        {/* By Course view */}
        {!loadingData && viewType === 'course' && (
          <ByCourse
            courses={byCourse}               // [{ courseId, instructors }]
            sectionNumbers={sectionNumbers}   // [{ courseId, type, maleSections, femaleSections }]
            assignments={assignments}          // [{ courseId, type, section, instructorName }]
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