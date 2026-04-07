import { useMemo, useState } from 'react';
import { getAllIcsCourses, getAllOfferedCourses } from '../../data';
import '../../styles/ManageTerms.css';
import ConfirmModal from '../../shared/ConfirmModal';
import '../../styles/FacultyPreferences.css';

function SetPreferences() {
  const allCourses = getAllIcsCourses();
  const terms = getAllOfferedCourses();
  const currentTerm = terms[0];

  const availableCourses = useMemo(() => {
    return allCourses.filter((course) =>
      currentTerm.courses.includes(course.code)
    );
  }, [allCourses, currentTerm]);

  const MAX_SLOTS = availableCourses.length;

  const [rankedCourses, setRankedCourses] = useState(Array(MAX_SLOTS).fill(null));
  const [draggedCourse, setDraggedCourse] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedCodes = rankedCourses.filter(Boolean).map((course) => course.code);

  const leftCourses = availableCourses.filter(
    (course) => !selectedCodes.includes(course.code)
  );

  const handleDragStartFromLeft = (course) => {
    setDraggedCourse(course);
  };

  const handleDragStartFromRight = (course, fromIndex) => {
    setDraggedCourse({ ...course, fromIndex });
  };

  const handleDropToSlot = (slotIndex) => {
    if (!draggedCourse) return;

    setRankedCourses((prev) => {
      const updated = [...prev];

      // if dragging from ranked list, remove from old position first
      if (draggedCourse.fromIndex !== undefined) {
        updated[draggedCourse.fromIndex] = null;
      }

      // if target slot already has a course, move it back only when dragging from left
      // for now we simply replace it
      updated[slotIndex] = {
        code: draggedCourse.code,
        name: draggedCourse.name,
      };

      return updated;
    });

    setDraggedCourse(null);
  };

  const handleDropBackToLeft = () => {
    if (!draggedCourse || draggedCourse.fromIndex === undefined) return;

    setRankedCourses((prev) => {
      const updated = [...prev];
      updated[draggedCourse.fromIndex] = null;
      return updated;
    });

    setDraggedCourse(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    const selected = rankedCourses.filter(Boolean);
    if (selected.length === 0) return;
    setShowConfirm(true);
  };

  return (
    <>
      <div className="fp-page">
        <div className="fp-header">
          <h2 className="fp-greeting">Hello Dr. Khadija 👋🏻,</h2>
        </div>

        <div className="fp-card">
          <h3 className="fp-title">Set preferences</h3>
          <div className="td-term-badge">Current Term {currentTerm.termNum}</div>

          <div className="fp-board">
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

          <div className="fp-actions">
            <button className="an-btn-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

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