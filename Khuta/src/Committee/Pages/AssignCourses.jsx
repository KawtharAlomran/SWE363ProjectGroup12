import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ByInstructor from './ByInstructor';
import ByCourse from './ByCourse';
import ConfirmModal from '../../shared/ConfirmModal';

const API = 'http://localhost:5174';

const facultyHours = {
  "Professor": 6,
  "Associate Professor": 9,
  "Assistant Professor": 9,
  "Chair Professor": 9,
  "Instructor": 12,
  "Senior Lecturer": 12,
  "Lecturer": 12
};

const currentYearPrefix = String(new Date().getFullYear()).slice(-2);
const lastYearPrefix = String(new Date().getFullYear() - 1).slice(-2);

const canEdit = (termId) => {
  const prefix = termId.slice(0, 2);
  const semester = termId.slice(2);
  return Number(prefix) >= Number(currentYearPrefix) || (prefix === lastYearPrefix && semester === '3');
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

  const [facultyList, setFacultyList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [termCourses, setTermCourses] = useState([]);
  const [prefByInstructor, setPrefByInstructor] = useState([]);
  const [prefByCourse, setPrefByCourse] = useState([]);
  const [sectionNumbers, setSectionNumbers] = useState([]);
  const [existingAssignments, setExistingAssignments] = useState([]);
  const [newAssignments, setNewAssignments] = useState([]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [termsRes, facultyRes, coursesRes] = await Promise.all([
          fetch(`${API}/api/terms`),
          fetch(`${API}/api/faculty`),
          fetch(`${API}/api/courses`),
        ]);
        const [termsData, facultyData, coursesData] = await Promise.all([
          termsRes.json(),
          facultyRes.json(),
          coursesRes.json(),
        ]);
        const editableTerms = termsData.filter(t => canEdit(t.termId));
        setTerms(editableTerms);
        setFacultyList(facultyData);
        setCoursesList(Array.isArray(coursesData) ? coursesData : coursesData.courses ?? []);
        if (editableTerms.length > 0) setSelectedTermId(editableTerms[0].termId);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setLoadingTerms(false);
      }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    if (!selectedTermId) return;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [prefInstRes, prefCourseRes, sectionsRes, sectionNumsRes, assignmentsRes] = await Promise.all([
          fetch(`${API}/api/preferences/term/${selectedTermId}/instructor`),
          fetch(`${API}/api/preferences/term/${selectedTermId}/course`),
          fetch(`${API}/api/sections/${selectedTermId}`),
          fetch(`${API}/api/assignments/${selectedTermId}/sections`),
          fetch(`${API}/api/assignments/${selectedTermId}`),
        ]);
        const [prefInst, prefCourse, sections, sectionNums, existing] = await Promise.all([
          prefInstRes.json(),
          prefCourseRes.json(),
          sectionsRes.json(),
          sectionNumsRes.json(),
          assignmentsRes.json(),
        ]);
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

  const calcHours = (assignments, instructorName) => {
    let total = 0;
    assignments.filter(a => a.instructorName === instructorName).forEach(asm => {
      const courseInfo = coursesList.find(c => c.code === asm.courseId);
      total += courseInfo?.credit_hours ?? 0;
    });
    return total;
  };

  const loadWarnings = useMemo(() => {
    if (newAssignments.length === 0) return [];
    const warnings = [];
    facultyList.forEach(member => {
      const maxHours = facultyHours[member.rank] ?? 12;
      const existingHours = calcHours(existingAssignments, member.name);
      const totalHours = existingHours + calcHours(newAssignments, member.name);
      if (totalHours > maxHours && existingHours <= maxHours) {
        warnings.push({ name: member.name, teachingHours: totalHours, maxHours });
      } else if (existingHours > maxHours && calcHours(newAssignments, member.name) > 0) {
        warnings.push({ name: member.name, teachingHours: totalHours, maxHours });
      }
    });
    return warnings;
  }, [existingAssignments, newAssignments, facultyList, coursesList]);

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

  const removeAssignment = (courseId, type, section, instructorName) => {
    setSaveSuccess(false);
    setNewAssignments(prev => prev.filter(a =>
      !(a.courseId === courseId && a.type === type && a.section === section && a.instructorName === instructorName)
    ));
  };

  const removeExistingAssignment = (courseId, type, section, instructorName) => {
    setSaveSuccess(false);
    setExistingAssignments(prev => prev.filter(a =>
      !(a.courseId === courseId && a.type === type && a.section === section && a.instructorName === instructorName)
    ));
  };

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

  const coursesWithNoPreference = termCourses.filter(courseId =>
    !prefByCourse.some(p => p.courseId === courseId)
  );

  // Red only if no preferences AND no existing assignments for this term
  const instructorsWithNoPreference = facultyList.filter(f =>
    !prefByInstructor.some(p => p.facultyName === f.name) &&
    !existingAssignments.some(a => a.instructorName === f.name)
  );

  if (loadingTerms) return <div className="container">Loading terms...</div>;

  if (terms.length === 0) return (
    <div className="container">
      <h3 className="header h2">Assign Courses</h3>
      <p style={{ color: '#888', marginTop: 24 }}>No terms available for assignment at this time.</p>
    </div>
  );

  return (
    <>
      <div className="container">
        <h3 className="header h2">Assign Courses</h3>

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

        {loadingData && <p>Loading...</p>}

        {!loadingData && viewType === 'instructor' && (
          <ByInstructor
            facultyList={facultyList}
            prefByInstructor={prefByInstructor}
            sectionNumbers={sectionNumbers}
            existingAssignments={existingAssignments}
            newAssignments={newAssignments}
            instructorsWithNoPreference={instructorsWithNoPreference}
            termCourses={termCourses}
            loadWarnings={loadWarnings}
            termId={selectedTermId}
            onAdd={addAssignment}
            onRemove={removeAssignment}
            onRemoveExisting={removeExistingAssignment}
          />
        )}

        {!loadingData && viewType === 'course' && (
          <ByCourse
            termCourses={termCourses}
            prefByCourse={prefByCourse}
            sectionNumbers={sectionNumbers}
            existingAssignments={existingAssignments}
            newAssignments={newAssignments}
            coursesWithNoPreference={coursesWithNoPreference}
            facultyList={facultyList}
            termId={selectedTermId}
            onAdd={addAssignment}
            onRemove={removeAssignment}
            onRemoveExisting={removeExistingAssignment}
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