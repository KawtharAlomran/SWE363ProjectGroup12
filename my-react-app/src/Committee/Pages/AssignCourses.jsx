import { useState } from 'react';
import '../../styles/ManageTerms.css';
import ByInstructor from './ByInstructor';
import ByCourse from './ByCourse';
import '../../styles/AssignCourses.css';
import ConfirmModal from '../../shared/ConfirmModal';
import {getInstructorsPrefrences, getCoursePrefrences} from "../../data";


export default function AssignCourses() {
  const [viewType, setViewType] = useState('instructor');
  const [instructors, setInstructors] = useState(getInstructorsPrefrences());
  const [coursesList, setCoursesList] = useState(getCoursePrefrences());
  const [showConfirm, setShowConfirm] = useState(false);


  const toggleByInstructor = (instructorId, courseId) => {
    setInstructors(prev => prev.map(inst =>
      inst.id === instructorId
        ? { ...inst, courses: inst.courses.map(c => c.id === courseId ? { ...c, assigned: !c.assigned } : c) }
        : inst
    ));
  };

  const toggleByCourse = (courseId, instructorId) => {
    setCoursesList(prev => prev.map(course =>
      course.id === courseId
        ? { ...course, instructors: course.instructors.map(i => i.id === instructorId ? { ...i, assigned: !i.assigned } : i) }
        : course
    ));
  };

  return (
    <>
      <div className="mt-card">

        <h3 className="mt-title">Assign Courses</h3>
        <div className="td-term-badge">Current Term 261</div>

        <div className="ac-view-toggle">
          <span className="ac-view-label">View type:</span>
          <button
            className={`ac-toggle-btn${viewType === 'instructor' ? ' ac-toggle-btn--active' : ''}`}
            onClick={() => setViewType('instructor')}
          >
            By instructor
          </button>
          <button
            className={`ac-toggle-btn${viewType === 'course' ? ' ac-toggle-btn--active' : ''}`}
            onClick={() => setViewType('course')}
          >
            By course
          </button>
        </div>

        {viewType === 'instructor' && (
          <ByInstructor instructors={instructors} onToggle={toggleByInstructor} />
        )}

        {viewType === 'course' && (
          <ByCourse courses={coursesList} onToggle={toggleByCourse} />
        )}

        <div className="an-actions" style={{ marginTop: 24 }}>
          <button className="an-btn-save">Save</button>
          <button className="an-btn-submit" onClick={() => setShowConfirm(true)}>Submit</button>
          <span className="an-note">*Note: Submitting will publish the assignments and notify all assigned faculty via email.</span>
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