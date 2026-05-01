import { useState, useEffect } from 'react';

export default function ChairmanHomePage() {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  // --- 1. Fetch Terms and Fix Initialization ---
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch("http://localhost:5174/api/terms");
        const data = await res.json();
        setTerms(data);
        
        // FIX: Access data[0] to initialize with the first term ID
        if (data && data.length > 0) {
          setSelectedTerm(data[0].termId); 
        }
      } catch (err) {
        console.error("Failed to fetch terms:", err);
      }
    };
    fetchTerms();
  }, []);

  // --- 2. Call the NEW Unique Endpoint ---
  useEffect(() => {
    if (!selectedTerm) return;

    const fetchOfferedCourses = async () => {
      setIsLoading(true);
      try {
        // Updated URL to use the specialized 'unique' route
        const res = await fetch(`http://localhost:5174/api/sections/unique/${selectedTerm}`);
        const data = await res.json();
        
        setOfferedCourses(data); 
        setCurrentPage(1); 
      } catch (err) {
        console.error("Failed to fetch unique sections:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfferedCourses();
  }, [selectedTerm]);

  // Pagination Logic
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = offeredCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(offeredCourses.length / coursesPerPage);

  return (
    <div className="container">
      <div className="header">
        <h2>All Offered Courses</h2>
      </div>
      
      <div className="td-term-badge">
        <p>Select Term </p>
        <select 
          className="an-select" 
          value={selectedTerm} 
          onChange={(e) => setSelectedTerm(e.target.value)}
        >
          {terms.map((term) => (
            <option key={term._id || term.termId} value={term.termId}>
              {term.termId}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Loading courses...</p>
      ) : (
        <>
          <table className="coursesTable">
            <thead>
              <tr>
                <th>Course number</th>
                <th>Course Name</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course) => (
                <tr key={course._id}>
                  <td data-label="Course number">{course.courseId}</td> 
                  <td data-label="Course Name">{course.name}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pageNumbers">
            {Array.from({ length: totalPages }, (_, index) => (
              <button 
                className={currentPage === index + 1 ? "active" : ""} 
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}