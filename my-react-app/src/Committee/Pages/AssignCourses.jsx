import { useState } from 'react';
import '../../styles/ManageTerms.css';
import ByInstructor from './ByInstructor';
import ByCourse from './ByCourse';
import '../../styles/AssignCourses.css';
import ConfirmModal from '../../shared/ConfirmModal';


// Temporary data — will be replaced by API call later
const INSTRUCTORS = [
  {
    id: 1, name: 'Mufti Mahmud',
    courses: [
      { id: 1, code: 'ICS 202', rank: 1, assigned: false },
      { id: 2, code: 'ICS 343', rank: 2, assigned: true  },
      { id: 3, code: 'ICS 344', rank: 3, assigned: false },
      { id: 4, code: 'ICS 353', rank: 4, assigned: false },
      { id: 5, code: 'ICS 108', rank: 5, assigned: false },
      { id: 6, code: 'ICS 104', rank: 6, assigned: false },
    ]
  },
  {
    id: 2, name: 'Tarek El-Bassuny',
    courses: [
      { id: 1, code: 'ICS 474', rank: 1, assigned: true  },
      { id: 2, code: 'ICS 343', rank: 2, assigned: false },
      { id: 3, code: 'ICS 344', rank: 3, assigned: false },
    ]
  },
  {
    id: 3, name: 'Mohammad Alshayeb',
    courses: [
      { id: 1, code: 'SWE 439', rank: 1, assigned: false },
      { id: 2, code: 'SWE 422', rank: 2, assigned: false },
    ]
  },
  {
    id: 4, name: 'Mahmood Niazi',
    courses: [
      { id: 1, code: 'SWE 455', rank: 1, assigned: false },
      { id: 2, code: 'SWE 439', rank: 2, assigned: false },
      { id: 3, code: 'SWE 463', rank: 3, assigned: true  },
      { id: 4, code: 'ICS 353', rank: 4, assigned: false },
    ]
  },
];

const COURSES_BY_COURSE = [
  {
    id: 1, code: 'ICS 104',
    instructors: [
      { id: 1, name: 'Mohammed Balah',  rank: 1, assigned: true  },
      { id: 2, name: 'Mohammed Aslam',  rank: 1, assigned: false },
      { id: 3, name: 'Alawi Alsaggaf',  rank: 3, assigned: true  },
      { id: 4, name: 'Rashad Othman',   rank: 4, assigned: false },
    ]
  },
  {
    id: 2, code: 'ICS 108',
    instructors: [
      { id: 1, name: 'Yahya Garout',  rank: 1, assigned: true  },
      { id: 2, name: 'Nuha Albadi',   rank: 3, assigned: false },
      { id: 3, name: 'Putu Raharja',  rank: 5, assigned: false },
      { id: 4, name: 'Rashad Othman', rank: 1, assigned: true  },
    ]
  },
  {
    id: 3, code: 'ICS 343',
    instructors: [
      { id: 1, name: 'Hani Almohair', rank: 1, assigned: true },
    ]
  },
  {
    id: 4, code: 'ICS 344',
    instructors: [
      { id: 1, name: 'Fakhri Khan',    rank: 2, assigned: true  },
      { id: 2, name: 'Waleed Al Gobi', rank: 4, assigned: false },
    ]
  },
];

export default function AssignCourses() {
  const [viewType, setViewType] = useState('instructor');
  const [instructors, setInstructors] = useState(INSTRUCTORS);
  const [coursesList, setCoursesList] = useState(COURSES_BY_COURSE);
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