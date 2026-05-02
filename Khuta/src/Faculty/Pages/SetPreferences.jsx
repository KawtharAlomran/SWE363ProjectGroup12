import { useEffect, useState } from 'react';
import ConfirmModal from '../../shared/ConfirmModal';

const API = 'http://localhost:5174';

function SetPreferences() {
  const [allowedTerms, setAllowedTerms] = useState([]);
  const [currentTerm, setCurrentTerm] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [savedPreferences, setSavedPreferences] = useState([]);
  const [rankedCourses, setRankedCourses] = useState([]);
  const [draggedCourse, setDraggedCourse] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // determine the terms that faculty can submit/modify preferences for
  const getAllowedPreferenceTerms = () => {
  const now = new Date();
  const year = Number(now.getFullYear().toString().slice(-2));
  const month = now.getMonth() + 1;

  // Jan - May → allowed terms: Summer of previous academic year + next First semester
  // Example: May 2026 → 253 and 261
  if (month >= 1 && month <= 5) {
    return [`${year - 1}3`, `${year}1`];
  }

  // Jun - Aug → allowed terms: First semester + Second semester
  // Example: July 2025 → 251 and 252
  if (month >= 6 && month <= 8) {
    return [`${year}1`, `${year}2`];
  }

  // Sep - Dec → allowed terms: Second semester + Summer
  // Example: October 2025 → 252 and 253
  return [`${year}2`, `${year}3`];
};

  // Set allowed terms and choose the first one as default
  useEffect(() => {
    const allowed = getAllowedPreferenceTerms();
    setAllowedTerms(allowed);
    if (allowed.length > 0) {
      setCurrentTerm(allowed[0]);
    }
  }, []);

// fetch offered courses for the selected term from Sections collection
useEffect(() => {

  const fetchOfferedCourses = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${API}/api/sections/unique/${currentTerm}`);
      const data = await res.json();

      // convert backend data to the same format used by drag and drop
      const formattedCourses = data.map(course => ({
        code: course.courseId,
        name: course.name,
      }));

      setAvailableCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching offered courses:', error);
      setAvailableCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchOfferedCourses();
}, [currentTerm]);

  // Fetch previously submitted preferences for the logged-in faculty
  useEffect(() => {
    if (!currentTerm) return;

    const fetchSavedPreferences = async () => {
      try {
        const facultyName = sessionStorage.getItem('UserName');

        const res = await fetch(`${API}/api/preferences/term/${currentTerm}`);
        const data = await res.json();

        // Keep only preferences for the logged-in faculty member
        const filtered = data.filter(pref => pref.facultyName === facultyName);

        setSavedPreferences(filtered);
      } catch (error) {
        console.error('Error fetching saved preferences:', error);
        setSavedPreferences([]);
      }
    };

    fetchSavedPreferences();
  }, [currentTerm]);

  // Load saved preferences into the ranking slots
  useEffect(() => {
    if (!availableCourses.length) return;

    const maxSlots = availableCourses.length;
    const initialSlots = Array(maxSlots).fill(null);

    savedPreferences.forEach((pref) => {
      const course = availableCourses.find(c => c.code === pref.courseId);
      const slotIndex = pref.order - 1;

      if (course && slotIndex >= 0 && slotIndex < maxSlots) {
        initialSlots[slotIndex] = course;
      }
    });

    setRankedCourses(initialSlots);
  }, [availableCourses, savedPreferences]);

  // Get selected course codes to avoid duplicates
  const selectedCodes = rankedCourses.filter(Boolean).map(course => course.code);

  // Courses that are not selected yet stay on the left side
  const leftCourses = availableCourses.filter(
    course => !selectedCodes.includes(course.code)
  );

  // Start dragging a course from the available courses list
  const handleDragStartFromLeft = (course) => {
    setDraggedCourse(course);
  };

  // Start dragging a course from the ranked preferences list
  const handleDragStartFromRight = (course, fromIndex) => {
    setDraggedCourse({ ...course, fromIndex });
  };

  // Drop a course into a preference slot
  const handleDropToSlot = (slotIndex) => {
    if (!draggedCourse) return;

    setRankedCourses(prev => {
      const updated = [...prev];

      // If the course was dragged from the ranked list, remove it from old slot
      if (draggedCourse.fromIndex !== undefined) {
        updated[draggedCourse.fromIndex] = null;
      }

      // Place course in the new slot
      updated[slotIndex] = {
        code: draggedCourse.code,
        name: draggedCourse.name,
      };

      return updated;
    });

    setDraggedCourse(null);
    setError('');
  };

  // Drop a course back to the left side to remove it from preferences
  const handleDropBackToLeft = () => {
    if (!draggedCourse || draggedCourse.fromIndex === undefined) return;

    setRankedCourses(prev => {
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

  // Validate before showing confirmation modal
  const handleSubmit = () => {
    const selected = rankedCourses.filter(Boolean);

    if (selected.length === 0) {
      setError('Please select at least one course before submitting.');
      return;
    }

    setError('');
    setShowConfirm(true);
  };

  // Save preferences to MongoDB
  const confirmSubmit = async () => {
    const selected = rankedCourses.filter(Boolean);
    const facultyName = sessionStorage.getItem('UserName');

    const formattedPreferences = rankedCourses
      .map((course, index) =>
        course
          ? {
              courseId: course.code,
              order: index + 1,
            }
          : null
      )
      .filter(Boolean);

    try {
      const res = await fetch(`${API}/api/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          termId: currentTerm,
          facultyName,
          preferences: formattedPreferences,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit preferences');

      setShowConfirm(false);
    } catch (error) {
      console.error('Error submitting preferences:', error);
      setError('Failed to submit preferences. Please try again.');
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="fp-page">
        <div className="container">
          <h3 className="mt-title">Set preferences</h3>
          <div className="td-term-badge">Upcoming Term {currentTerm}</div>

          {isLoading ? (
            <p>Loading offered courses...</p>
          ) : (
            <div className="fp-board">
              {/* Left side: courses offered in the upcoming term */}
              <div
                className="fp-column"
                onDragOver={handleDragOver}
                onDrop={handleDropBackToLeft}
              >
                <div className="fp-column-title">Courses</div>

                <div className="fp-list">
                  {leftCourses.map(course => (
                    <div
                      key={course.code}
                      className="fp-course-card"
                      draggable
                      onDragStart={() => handleDragStartFromLeft(course)}
                    >
                      <div className="fp-dots">⋮⋮</div>
                      <div>
                        <span className="fp-course-code">{course.code}</span>
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
                        {course && (
                          <div
                            className="fp-selected-card"
                            draggable
                            onDragStart={() => handleDragStartFromRight(course, index)}
                          >
                            <div className="fp-rank-badge">{index + 1}</div>
                            <div>
                              <span className="fp-course-code">{course.code}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="fp-actions">
            <button className="an-btn-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>

          {error && (
            <p style={{ color: 'red', marginTop: '10px', textAlign: 'left' }}>
              {error}
            </p>
          )}
        </div>
      </div>

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