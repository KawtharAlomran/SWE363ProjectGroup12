import { useEffect, useState } from 'react';

// API base URL for backend requests
const API = 'http://localhost:5174';

function OfferedCourses() {
  // State for courses and terms fetched from the backend
  const [courses, setCourses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for selected term, current page, and selected course details
  const [selectedTerm, setSelectedTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // fetch terms from backend
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const termsRes = await fetch(`${API}/api/terms`);
        const termsData = await termsRes.json();

        setTerms(termsData);

        // set default term after loading
        if (termsData.length > 0) {
          setSelectedTerm(termsData[0].termId);
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };

    fetchTerms();
  }, []);

  // fetch offered courses for the selected term
useEffect(() => {
  if (!selectedTerm) return;

  const fetchOfferedCourses = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${API}/api/sections/unique/${selectedTerm}`);
      const data = await res.json();

      setOfferedCourses(data);
      setCurrentPage(1); // reset pagination
    } catch (error) {
      console.error("E  rror fetching offered courses:", error);
      setOfferedCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchOfferedCourses();
}, [selectedTerm]);




  // Number of courses shown per page
  const coursesPerPage = 5;


  const offeredCourses = courses.filter(course =>
  offeredCourseCodes.includes(course.code)
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = offeredCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(offeredCourses.length / coursesPerPage) || 1;


  // Open the popup with full course details
  const openCourseDetails = (course) => {
    setSelectedCourse(course);
  };

  return (
    <>
      <div className="container">
        <h3 className="mt-title">Offered Courses</h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '12px',
            marginBottom: '20px',
          }}
        >
          <label className="td-term-badge">Select Term:</label>
          <select
            className="an-select"
            value={selectedTerm}
            onChange={(e) => {
              setSelectedTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when term changes
            }}
          >
            {terms.map(term => (
              <option key={term.termId} value={term.termId}>
                {term.termId}
              </option>
            ))}
          </select>
        </div>

        <table className="an-table" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Course number</th>
              <th>Course name</th>
            </tr>
          </thead>
          <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="2" className="textCenter">
                Loading courses...
              </td>
            </tr>
          ) : currentCourses.length > 0 ? (
            currentCourses.map(course => (
              <tr
                key={course.code}
                onClick={() => openCourseDetails(course)}
                style={{ cursor: 'pointer' }}
              >
                <td className="an-course-name">{course.code}</td>
                <td>{course.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="textCenter">
                No courses available for this term.
              </td>
            </tr>
          )}
        </tbody>
        </table>

        {/* Page numbering */}
        {offeredCourses.length > 0 && (
          <div className="pageNumbers">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Course details popup */}
      {selectedCourse && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              width: '560px',
              maxWidth: '90%',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            }}
          >
            <h2
              style={{
                textAlign: 'center',
                color: '#5c8d67',
                marginBottom: '14px',
                fontSize: '22px',
                fontWeight: '700',
              }}
            >
              {selectedCourse.code}
            </h2>

            <p
              style={{
                textAlign: 'center',
                color: '#89b08f',
                fontWeight: '700',
                marginBottom: '20px',
                fontSize: '18px',
              }}
            >
              {selectedCourse.name} ({selectedCourse.credit_hours} credits)
            </p>

            <p
              style={{
                lineHeight: '1.8',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: '24px',
                textAlign: 'left',
              }}
            >
              {selectedCourse.description}
            </p>


            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="an-btn-submit"
                onClick={() => setSelectedCourse(null)} // Close popup
                style={{ minWidth: '90px' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OfferedCourses;