import { useState, useEffect } from 'react';

export default function ChairmanHomePage() {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  // --- Fetch Terms ---
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch("http://localhost:5174/api/terms");
        const data = await res.json();
        setTerms(data);
        
        if (data && data.length > 0) {
          setSelectedTerm(data[0].termId); 
        }
      } catch (err) {
        console.error("Failed to fetch terms:", err);
      }
    };
    fetchTerms();
  }, []);

  // --- getting offered courses in the selected term ---
  useEffect(() => {
    if (!selectedTerm) return;

    const fetchOfferedCourses = async () => {
      setIsLoading(true);
      try {
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

    // ---  Pagination Logic  --- 
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = offeredCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(offeredCourses.length / coursesPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) pages.push(i);
    }
    const withEllipsis = [];
    let prev = null;
    for (const page of pages) {
      if (prev && page - prev > 1) withEllipsis.push('...');
      withEllipsis.push(page);
      prev = page;
    }
    return withEllipsis;
  };

  // Reusable section select
  const SectionSelect = ({ value, courseCode, field }) => (
    <select className="an-select" value={value} onChange={e => updateSection(courseCode, field, e.target.value)}>
      {[...Array(30)].map((_, i) => <option key={i} value={i}>{i}</option>)}
    </select>
  );



  return (
    <div className="container">
      <div className="header">
        <h2>All Offered Courses</h2>
      </div>
      {/* select term from the Dropdown menu */}
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
        {/* view the offered courses in the selected term */}
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

          {/* Smart pagination — 1 ... 4 5 6 ... */}
        {totalPages > 1 && (
          <div className="pageNumbers">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
            {getPageNumbers().map((page, i) =>
              page === '...'
                ? <span key={`ellipsis-${i}`} style={{ margin: '0 4px' }}>...</span>
                : <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>{page}</button>
            )}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
          </div>
        )}

        </>
      )}
    </div>
  );
}