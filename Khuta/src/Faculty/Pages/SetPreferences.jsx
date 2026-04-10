import { useMemo, useState } from 'react';
import { getAllIcsCourses, getAllOfferedCourses } from '../../data';
//import '../../styles/ManageTerms.css';
import ConfirmModal from '../../shared/ConfirmModal';
//import '../../styles/FacultyPreferences.css';

function SetPreferences() {
  // Get all courses and current term
  const allCourses = getAllIcsCourses();
  const terms = getAllOfferedCourses();
  const currentTerm = terms[0];

  // Filter only courses offered in the current term
  const availableCourses = useMemo(() => {
    return allCourses.filter((course) =>
      currentTerm.courses.includes(course.code)
    );
  }, [allCourses, currentTerm]);

  // Number of preference slots (same as number of courses)
  const MAX_SLOTS = availableCourses.length;

  // State for ranked courses, dragged course, and confirmation modal
  const [rankedCourses, setRankedCourses] = useState(Array(MAX_SLOTS).fill(null));
  const [draggedCourse, setDraggedCourse] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Get codes of selected courses (to avoid duplicates)
  const selectedCodes = rankedCourses.filter(Boolean).map((course) => course.code);

  // Courses still available on the left side
  const leftCourses = availableCourses.filter(
    (course) => !selectedCodes.includes(course.code)
  );

  // Start dragging from left side
  const handleDragStartFromLeft = (course) => {
    setDraggedCourse(course);
  };

  // Start dragging from right (ranked list)
  const handleDragStartFromRight = (course, fromIndex) => {
    setDraggedCourse({ ...course, fromIndex });
  };

  // Drop course into a ranking slot
  const handleDropToSlot = (slotIndex) => {
    if (!draggedCourse) return;

    setRankedCourses((prev) => {
      const updated = [...prev];

      // If dragging from ranked list, remove it from old position
      if (draggedCourse.fromIndex !== undefined) {
        updated[draggedCourse.fromIndex] = null;
      }

      // Place the course in the selected slot
      updated[slotIndex] = {
        code: draggedCourse.code,
        name: draggedCourse.name,
      };

      return updated;
    });

    setDraggedCourse(null);
  };

  // Drop course back to left side (remove from ranking)
  const handleDropBackToLeft = () => {
    if (!draggedCourse || draggedCourse.fromIndex === undefined) return;

    setRankedCourses((prev) => {
      const updated = [...prev];
      updated[draggedCourse.fromIndex] = null;
      return updated;
    });

    setDraggedCourse(null);
  };

  // Allow dropping
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle submit (just shows confirmation for now)
  const handleSubmit = () => {
    const selected = rankedCourses.filter(Boolean);
    if (selected.length === 0) return;
    setShowConfirm(true);
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
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit your preferences?"
          onConfirm={() => setShowConfirm(false)}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default SetPreferences;