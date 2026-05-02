import { useEffect, useState } from 'react';

// API base URL for backend requests
const API = 'http://localhost:5174';

function OfferedCourses() {
  // State for courses and terms fetched from the backend
  const [courses, setCourses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // State for course codes offered in the selected term
  const [offeredCourseCodes, setOfferedCourseCodes] = useState([]);

  // State for selected term, current page, and selected course details
  const [selectedTerm, setSelectedTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // fetch courses and terms from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // get all courses
        const coursesRes = await fetch(`${API}/api/courses`);
        const coursesData = await coursesRes.json();

        // get all terms
        const termsRes = await fetch(`${API}/api/terms`);
        const termsData = await termsRes.json();

        setCourses(coursesData);
        setTerms(termsData);

        // set default term after loading
        if (termsData.length > 0) {
          setSelectedTerm(termsData[0].termId);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // fetch offered course codes for the selected term
  useEffect(() => {
    const fetchOfferedCourses = async () => {
      if (!selectedTerm) return;

      try {
        const res = await fetch(`${API}/api/sections/${selectedTerm}`);
        const data = await res.json();

        // Sections can have both LEC and LAB, so remove duplicate course codes
        const codes = [...new Set(data.map(section => section.courseId))];

        setOfferedCourseCodes(codes);
      } catch (error) {
        console.error("Error fetching offered courses:", error);
        setOfferedCourseCodes([]);
      }
    };

    fetchOfferedCourses();
  }, [selectedTerm]);


  // Number of courses shown per page
  const coursesPerPage = 5;

  // Find the currently selected term
  const currentTerm = terms.find(term => term.termId === selectedTerm);

  // temporary variable to hold courses for the current term (since all courses are fetched at once)
  const offeredCourses = courses;

  // Pagination logic
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = offeredCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(offeredCourses.length / coursesPerPage) || 1;

  // Extra course details to show in the popup
  const courseDetails = {
    'ICS 104': {
      description: 'Introduction to problem solving and programming using Python and C.',
      prerequisites: 'None',
      credits: '4-2-3'
    },
    'ICS 108': {
      description: 'Object-oriented programming concepts including classes, inheritance, polymorphism, and file handling.',
      prerequisites: 'ICS 104',
      credits: '4-2-3'
    },
    'ICS 202': {
      description: 'Review of object-oriented concepts; basic algorithms analysis; fundamental data structures such as stacks, queues, linked lists, trees, graphs, greedy algorithms, and hash tables.',
      prerequisites: 'ICS 108',
      credits: '4-2-3'
    },
    'ICS 253': {
      description: 'Discrete structures including logic, sets, functions, relations, counting, and graph theory.',
      prerequisites: 'ICS 104',
      credits: '3-3-0'
    },
    'ICS 321': {
      description: 'Introduction to database systems, relational models, SQL, normalization, and database design.',
      prerequisites: 'ICS 202',
      credits: '3-3-0'
    },
    'ICS 343': {
      description: 'Fundamentals of computer networks, layered architecture, routing, switching, and network protocols.',
      prerequisites: 'ICS 202',
      credits: '3-3-0'
    },
    'ICS 344': {
      description: 'Information security concepts, cryptography basics, access control, and secure systems.',
      prerequisites: 'ICS 202',
      credits: '3-3-0'
    },
    'ICS 353': {
      description: 'Design and analysis of algorithms including divide and conquer, dynamic programming, and greedy methods.',
      prerequisites: 'ICS 202',
      credits: '3-3-0'
    },
    'ICS 381': {
      description: 'Principles of artificial intelligence, search methods, knowledge representation, and reasoning.',
      prerequisites: 'ICS 202',
      credits: '3-3-0'
    },
    'ICS 410': {
      description: 'Concepts of programming languages, syntax, semantics, and language implementation techniques.',
      prerequisites: 'ICS 202',
      credits: '3-3-0'
    }
  };

  // Open the popup with full course details
  const openCourseDetails = (course) => {
    setSelectedCourse({
      ...course,
      ...courseDetails[course.code]
    });
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
            {currentCourses.map(course => (
              <tr
                key={course.code}
                onClick={() => openCourseDetails(course)}
                style={{ cursor: 'pointer' }} // Make rows clickable
              >
                <td className="an-course-name">{course.code}</td>
                <td>{course.name}</td>
              </tr>
            ))}
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
              {selectedCourse.name} ({selectedCourse.credits})
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

            <p
              style={{
                fontSize: '15px',
                fontWeight: '700',
                marginBottom: '22px',
              }}
            >
              Pre-requisites: {selectedCourse.prerequisites}
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