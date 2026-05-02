/**
 * AssignCourses.jsx
 *
 * WHAT CHANGED:
 * - Added recommendations panel — suggests instructors based on:
 *   1. Only one instructor interested → auto recommend
 *   2. Instructor taught course in previous terms → preferred
 *   3. Highest preference order → fallback
 * - Added teaching load warning when instructor exceeds max hours
 * - Added Save button (saves without submitting/navigating away)
 * - Red highlight for courses with no instructor assigned
 * - Red highlight for instructors with no courses assigned
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ByInstructor from './ByInstructor';
import ByCourse from './ByCourse';
import ConfirmModal from '../../shared/ConfirmModal';

const API = 'http://localhost:5174';

// Max teaching hours per rank
const facultyHours = {
  "Professor": 6,
  "Associate Professor": 9,
  "Assistant Professor": 9,
  "Chair Professor": 9,
  "Instructor": 12,
  "Senior Lecturer": 12,
  "Lecturer": 12
};

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

  const [byInstructor, setByInstructor] = useState([]);
  const [byCourse, setByCourse] = useState([]);
  const [sectionNumbers, setSectionNumbers] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  // Assignments from DB — used to pre-check instructors
  const [existingAssignments, setExistingAssignments] = useState([]);

  // Assignments added this session — used to filter dropdown
  const [newAssignments, setNewAssignments] = useState([]);

  // Recommendations from backend
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Teaching load warnings — computed locally
  const [loadWarnings, setLoadWarnings] = useState([]);

  // Fetch terms on mount
  useEffect(() => {
    const fetchTerms = async () => {
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
        console.error("Error fetching terms:", err);
      } finally {
        setLoadingTerms(false);
      }
    };
    fetchTerms();
  }, []);

  // Fetch all data when term changes
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
        setExistingAssignments(existing);
        setNewAssignments([]);
        setByInstructor(prefInst);
        setByCourse(prefCourse);
        setRecommendations([]);
        setShowRecommendations(false);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [selectedTermId]);

  // Recompute teaching load warnings when assignments change
  useEffect(() => {
    const allAssignments = [...existingAssignments, ...newAssignments];
    const warnings = [];

    // Group assignments by instructor
    const byInst = {};
    allAssignments.forEach(a => {
      if (!byInst[a.instructorName]) byInst[a.instructorName] = [];
      byInst[a.instructorName].push(a);
    });

    Object.entries(byInst).forEach(([name, asms]) => {
      const faculty = facultyList.find(f => f.name === name);
      const maxHours = facultyHours[faculty?.rank] ?? 12;

      // Count unique courses and their credit hours
      const courseIds = [...new Set(asms.map(a => a.courseId))];
      // We can't get credit hours here without course data — use sectionNumbers as proxy
      // Each section = 1 credit hour estimation (simplified)
      const totalSections = asms.length;

      if (totalSections > maxHours) {
        warnings.push({
          name,
          totalSections,
          maxHours,
          message: `${name} has ${totalSections} sections assigned (max ~${maxHours}h)`
        });
      }
    });

    setLoadWarnings(warnings);
  }, [newAssignments, existingAssignments, facultyList]);

  // Fetch recommendations from backend
  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`${API}/api/assignments/${selectedTermId}/recommendations`);
      const data = await res.json();
      setRecommendations(data);
      setShowRecommendations(true);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  };

  // Add section assignment — conflict check in newAssignments only
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

  // Remove section from newAssignments
  const removeAssignment = (courseId, type, section, instructorName) => {
    setSaveSuccess(false);
    setNewAssignments(prev => prev.filter(a =>
      !(a.courseId === courseId && a.type === type && a.section === section && a.instructorName === instructorName)
    ));
  };

  // Save — saves current state to DB without navigating away
  const handleSave = async () => {
    try {
      const allAssignments = [...existingAssignments, ...newAssignments];
      await fetch(`${API}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termId: selectedTermId, assignments: allAssignments }),
      });
      // After save, existing = all, new = []
      setExistingAssignments(allAssignments);
      setNewAssignments([]);
      setSaveSuccess(true);
    } catch (err) {
      console.error("Error saving assignments:", err);
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
      console.error("Error submitting assignments:", err);
    }
  };

  // Courses with no assignments yet (red flag)
  const allAssignments = [...existingAssignments, ...newAssignments];
  const assignedCourseIds = new Set(allAssignments.map(a => a.courseId));
  const termCourseIds = new Set(sectionNumbers.map(s => s.courseId));
  const unassignedCourses = [...termCourseIds].filter(id => !assignedCourseIds.has(id));

  // Instructors with no assignments (red flag)
  const assignedInstructors = new Set(allAssignments.map(a => a.instructorName));
  const allInstructorNames = new Set(byInstructor.map(i => i.facultyName));
  const unassignedInstructors = [...allInstructorNames].filter(n => !assignedInstructors.has(n));

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

        {/* Recommend button */}
        <div style={{ marginBottom: 12 }}>
          <button className="ac-toggle-btn" onClick={fetchRecommendations}>
            ✨ Show Recommendations
          </button>
        </div>

        {/* Recommendations panel */}
        {showRecommendations && recommendations.length > 0 && (
          <div style={{ background: '#f0f8ff', border: '1px solid #cce0ff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Recommendations</div>
            {recommendations.map(rec => (
              <div key={rec.courseId} style={{
                marginBottom: 8, padding: '8px 12px', borderRadius: 6,
                background: rec.recommended ? '#fff' : '#fff0f0',
                border: `1px solid ${rec.recommended ? '#ddd' : '#ffaaaa'}`
              }}>
                <span style={{ fontWeight: 600 }}>{rec.courseId}</span>
                {rec.recommended ? (
                  <span style={{ marginLeft: 8, color: '#2d7a2d' }}>
                    → {rec.recommended}
                    {rec.reason === 'only_one' && ' (only interested instructor)'}
                    {rec.reason === 'taught_before' && ' (taught this course before)'}
                    {rec.reason === 'highest_preference' && ' (highest preference)'}
                  </span>
                ) : (
                  <span style={{ marginLeft: 8, color: 'red' }}>⚠ {rec.warning}</span>
                )}
                {rec.loadWarning && (
                  <div style={{ color: 'orange', fontSize: 12, marginTop: 4 }}>
                    ⚠ {rec.loadWarning}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Teaching load warnings */}
        {loadWarnings.length > 0 && (
          <div style={{ background: '#fff8e0', border: '1px solid #ffcc00', borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>⚠ Teaching Load Warnings</div>
            {loadWarnings.map(w => (
              <div key={w.name} style={{ fontSize: 13, color: '#856404' }}>{w.message}</div>
            ))}
          </div>
        )}

        {/* Unassigned courses warning */}
        {unassignedCourses.length > 0 && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffaaaa', borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'red' }}>Courses with no instructor assigned:</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {unassignedCourses.map(id => (
                <span key={id} style={{ background: '#ffdddd', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>{id}</span>
              ))}
            </div>
          </div>
        )}

        {/* Unassigned instructors warning */}
        {unassignedInstructors.length > 0 && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffaaaa', borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'red' }}>Instructors with no courses assigned:</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {unassignedInstructors.map(name => (
                <span key={name} style={{ background: '#ffdddd', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>{name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Section conflict error */}
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
            existingAssignments={existingAssignments}
            newAssignments={newAssignments}
            unassignedInstructors={unassignedInstructors}
            onAdd={addAssignment}
            onRemove={removeAssignment}
          />
        )}

        {!loadingData && viewType === 'course' && (
          <ByCourse
            courses={byCourse}
            sectionNumbers={sectionNumbers}
            existingAssignments={existingAssignments}
            newAssignments={newAssignments}
            unassignedCourses={unassignedCourses}
            onAdd={addAssignment}
            onRemove={removeAssignment}
          />
        )}

        {/* Save success message */}
        {saveSuccess && (
          <div style={{ color: 'green', fontSize: 13, marginTop: 8 }}>✓ Saved successfully</div>
        )}

        <div className="an-actions" style={{ marginTop: 24 }}>
          {/* Save button — saves without navigating */}
          <button className="ac-toggle-btn" onClick={handleSave} style={{ marginRight: 8 }}>
            Save
          </button>
          {/* Submit button — saves and navigates away */}
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