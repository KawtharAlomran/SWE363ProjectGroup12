import { useMemo, useState } from 'react';
import {
  getAllIcsCourses,
  getAllOfferedCourses,
  getFacultySubmittedPreferences,
  setFacultySubmittedPreferences
} from '../../data';
//import '../../styles/ManageTerms.css';
import ConfirmModal from '../../shared/ConfirmModal';
//import '../../styles/FacultyPreferences.css';

function SetPreferences() {
  // Get all courses and current term
  const allCourses = getAllIcsCourses();
  const terms = getAllOfferedCourses();
  const currentTerm = terms[0];

  // Get saved submitted preferences from data file
  const submittedPreferences = getFacultySubmittedPreferences();

  // Filter only courses offered in the current term
  const availableCourses = useMemo(() => {
    return allCourses.filter((course) =>
      currentTerm.courses.includes(course.code)
    );
  }, [allCourses, currentTerm]);

  // Number of preference slots
  const maxSlots = availableCourses.length;

  // Load saved preferences for current term if they exist
  const savedPreferences = submittedPreferences[currentTerm.termNum] || [];
  const initialRankedCourses = Array(maxSlots).fill(null);

  savedPreferences.forEach((course, index) => {
    if (index < maxSlots) {
      initialRankedCourses[index] = {
        code: course.code,
        name: course.name,
      };
    }
  });

  // State for ranked courses, dragged course, confirmation modal, and error message
  const [rankedCourses, setRankedCourses] = useState(initialRankedCourses);
  const [draggedCourse, setDraggedCourse] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  // Get selected course codes to avoid duplicates
  const selectedCodes = rankedCourses.filter(Boolean).map((course) => course.code);

  // Courses still available on the left side
  const leftCourses = availableCourses.filter(
    (course) => !selectedCodes.includes(course.code)
  );

  // Start dragging a course from the left side
  const handleDragStartFromLeft = (course) => {
    setDraggedCourse(course);
  };

  // Start dragging a course from the ranked list
  const handleDragStartFromRight = (course, fromIndex) => {
    setDraggedCourse({ ...course, fromIndex });
  };

  // Drop course into a selected slot
  const handleDropToSlot = (slotIndex) => {
    if (!draggedCourse) return;

    setRankedCourses((prev) => {
      const updated = [...prev];

      // If dragging from ranked list, remove it from old position first
      if (draggedCourse.fromIndex !== undefined) {
        updated[draggedCourse.fromIndex] = null;
      }

      // Place the course in the new slot
      updated[slotIndex] = {
        code: draggedCourse.code,
        name: draggedCourse.name,
      };

      return updated;
    });

    setDraggedCourse(null);
    setError('');
  };

  // Drop course back to the left side to remove it from preferences
  const handleDropBackToLeft = () => {
    if (!draggedCourse || draggedCourse.fromIndex === undefined) return;

    setRankedCourses((prev) => {
      const updated = [...prev];
      updated[draggedCourse.fromIndex] = null;
      return updated;
    });

    setDraggedCourse(null);
  };

  // Allow drop event
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Validate before opening confirmation modal
  const handleSubmit = () => {
    const selected = rankedCourses.filter(Boolean);

    // At least one course must be selected
    if (selected.length === 0) {
      setError('Please select at least one course before submitting.');
      return;
    }

    setError('');
    setShowConfirm(true);
  };

  // Save submitted preferences into data file
  const confirmSubmit = () => {
    const selected = rankedCourses.filter(Boolean);

    const formattedPreferences = selected.map((course, index) => ({
      rank: index + 1,
      code: course.code,
      name: course.name,
    }));

    const updatedPreferences = {
      ...submittedPreferences,
      [currentTerm.termNum]: formattedPreferences,
    };

    setFacultySubmittedPreferences(updatedPreferences);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="fp-page">
        <div className="fp-card">
          <h3 className="mt-title">Set preferences</h3>
          <div className="td-term-badge">Current Term {currentTerm.termNum}</div>

          <div className="fp-board">
            {/* Left side: available courses */}
            <div
              className="fp-column"
              onDragOver={handleDragOver}
              onDrop={handleDropBackToLeft}
            >
              <div className="fp-column-title">Courses</div>

              <div className="fp-list">
                {leftCourses.map((course) => (
                  <div
                    key={course.code}
                    className="fp-course-card"
                    draggable
                    onDragStart={() => handleDragStartFromLeft(course)}
                  >
                    <div className="fp-dots">⋮⋮</div>
                    <div>
                      <span className="fp-course-code">{course.code}</span>{' '}
                      <span className="fp-course-name">{course.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: ranked preferences */}
            <div className="fp-column">
              <div className="fp-column-title">Preferences</div>

              <div className="fp-list">
                {rankedCourses.map((course, index) => (
                  <div key={index} className="fp-rank-row">
                    <div className="fp-rank-number">{index + 1}</div>

                    <div
                      className={`fp-slot ${course ? 'fp-slot-filled' : 'fp-slot-empty'}`}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDropToSlot(index)}
                    >
                      {course ? (
                        <div
                          className="fp-selected-card"
                          draggable
                          onDragStart={() => handleDragStartFromRight(course, index)}
                        >
                          <div className="fp-rank-badge">{index + 1}</div>
                          <div>
                            <span className="fp-course-code">{course.code}</span>{' '}
                            <span className="fp-course-name">{course.name}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="fp-actions">
            <button className="an-btn-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>

          {/* Validation message */}
          {error && (
            <p style={{ color: 'red', marginTop: '10px', textAlign: 'left' }}>
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit your preferences?"
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default SetPreferences;