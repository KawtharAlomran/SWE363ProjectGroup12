import { useState } from 'react';
import '../../styles/ManageTerms.css';
import ByInstructor from './ByInstructor';
import ByCourse from './ByCourse';
import '../../styles/AssignCourses.css';
import ConfirmModal from '../../shared/ConfirmModal';
import { getInstructorsPrefrences, getCoursePrefrences, setInstructorsPrefrences, setCoursePrefrences, getCurrentTerms, getTermSections } from "../../data";

export default function AssignCourses() {
  const [viewType, setViewType] = useState('instructor');
  const [instructors, setInstructors] = useState(getInstructorsPrefrences());
  const [coursesList, setCoursesList] = useState(getCoursePrefrences());
  const [showConfirm, setShowConfirm] = useState(false);


  // Only show terms that have Modify button 
  const currentTerms = getCurrentTerms();
  const [selectedTermNum, setSelectedTermNum] = useState(currentTerms[0]?.termNum ?? '261');

  // Toggle assignment for both instructor and course views simultaneously
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

  // Update section count with validation against term limits
  const updateSection = (instructorId, courseId, field, value) => {
    const termSections = getTermSections(selectedTermNum);
    const inst = instructors.find(i => i.id === instructorId);
    const course = inst?.courses.find(c => c.id === courseId);
    const termCourse = termSections.find(t => t.code === course?.code);

    if (termCourse) {
      const maxAllowed = termCourse[field] ?? 99;

      // Calculate total sections already assigned across all instructors for this course
      const currentTotal = instructors.reduce((sum, i) => {
        const c = i.courses.find(c => c.code === course.code && c.assigned);
        return sum + (c?.[field] || 0);
      }, 0);

      const oldValue = course[field] || 0;

      // Block if new total exceeds max allowed
      if (currentTotal - oldValue + value > maxAllowed) {
        alert(`Cannot exceed ${maxAllowed} sections for ${course.code}`);
        return;
      }
    }

    // Apply update and save to db
    const updated = instructors.map(i =>
      i.id === instructorId ? { ...i, courses: i.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c) } : i);
    setInstructors(updated);
    setInstructorsPrefrences(updated);
  };

  // Filter instructors preferences to only show courses in selected term
  const termCourses = getTermSections(selectedTermNum);
  const termCourseCodes = termCourses.map(c => c.code);
  const filteredInstructors = instructors.map(inst => ({
    ...inst,
    courses: inst.courses.filter(c => termCourseCodes.includes(c.code))
  }));
  const filteredCourses = coursesList.filter(c => termCourseCodes.includes(c.code));

  return (
    <>
      <div className="mt-card">

        <h3 className="mt-title">Assign Courses</h3>

        {/* Term selector — only shows current year terms */}
        <div className="ac-view-toggle">
          <span className="ac-view-label">Term:</span>
          <select className="an-select" value={selectedTermNum} onChange={e => setSelectedTermNum(e.target.value)}>
            {currentTerms.map(t => <option key={t.termNum} value={t.termNum}>{t.name}</option>)}
          </select>
        </div>

        <div className="ac-view-toggle">
          <span className="ac-view-label">View type:</span>
          <button className={`ac-toggle-btn${viewType === 'instructor' ? ' ac-toggle-btn--active' : ''}`} onClick={() => setViewType('instructor')}>By instructor</button>
          <button className={`ac-toggle-btn${viewType === 'course' ? ' ac-toggle-btn--active' : ''}`} onClick={() => setViewType('course')}>By course</button>
        </div>

        {viewType === 'instructor' && (
          <ByInstructor instructors={filteredInstructors} onToggle={toggle} onUpdateSection={updateSection} termNum={selectedTermNum} />
        )}

        {viewType === 'course' && (
          <ByCourse courses={filteredCourses} onToggle={toggle} onUpdateSection={updateSection} termNum={selectedTermNum} />
        )}

        <div className="an-actions" style={{ marginTop: 24 }}>
          <button className="an-btn-submit" onClick={() => setShowConfirm(true)}>Submit</button>
          <span className="an-note">*Note: Changes are saved automaticaly. Submitting will publish the assignments and notify all assigned faculty via email.</span>
        </div>

      </div>
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit the changes?"
          onConfirm={() => setShowConfirm(false)}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}