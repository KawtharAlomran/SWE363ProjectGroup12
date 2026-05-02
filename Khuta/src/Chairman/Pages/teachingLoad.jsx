import { useState, useEffect } from "react";

// Matching each faculty rank with the max teaching hours
const facultyHours = {
  "Professor": 9,
  "Associate Professor": 9,
  "Assistant Professor": 12,
  "Chair Professor":12,
  "Instructor": 12,
  "Senior Lecturer": 12,
  "Lecturer": 12
};

export default function Load() {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [teachingLoad, setTeachingLoad] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const facultyPerPage = 8;

  // fetch Terms from the database
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch("http://localhost:5174/api/terms");
        const data = await res.json();
        setTerms(data);
        if (data && data.length > 0) {
          // Initialize with the first termId from the array
          setSelectedTerm(data[0].termId);
        }
      } catch (err) {
        console.error("Failed to fetch terms:", err);
      }
    };
    fetchTerms();
  }, []);

  // fetch teaching load when selectedTerm changes
  useEffect(() => {
    if (!selectedTerm) return;

    const fetchLoad = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5174/api/assignments/load/${selectedTerm}`);
        const data = await res.json();
        setTeachingLoad(data);
        setCurrentPage(1); // Reset to first page on term change
      } catch (err) {
        console.error("Failed to fetch teaching load:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoad();
  }, [selectedTerm]);

  // Pagination calculations
  const startIndex = (currentPage - 1) * facultyPerPage;
  const currentFaculty = teachingLoad.slice(startIndex, startIndex + facultyPerPage);
  const totalPages = Math.ceil(teachingLoad.length / facultyPerPage);

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

  // Color logic based on rank hours
  const getHoursColor = (hours, rank) => {
    const maxHours = facultyHours[rank] || 12; 
    if(hours < maxHours)
      return "#00b894";
    else if (hours == maxHours)
      return "#e4cd4a";
    else
      return  "#e53e3e";
  };

  if (terms.length === 0 && !isLoading) {
    return <div className="container">No terms available.</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Faculty Teaching Load</h2>
      </div>
      {/* select term from the Dropdown menu */}
      <div className="td-term-badge">
        <p>Select Term </p>
        <select 
          className="an-select" 
          value={selectedTerm} 
          onChange={(e) => setSelectedTerm(e.target.value)}
        >
          {terms.map((t) => (
            <option key={t.termId} value={t.termId}>
              {t.termId}
            </option>
          ))}
        </select>
      </div>

      <table className="coursesTable">
        <thead>
          <tr>
            <th>Faculty Name</th>
            <th>Teaching Courses</th>
            <th>Teaching hours</th>
          </tr>
        </thead>

        <tbody>
          {/* view all ICS faculty with their teaching courses and total hours */}
          {isLoading ? (
            <tr><td colSpan="3">Loading data...</td></tr>
          ) : (
            currentFaculty.map((member) => (
              <tr key={member.email}>
                <td data-label="Faculty Name">{member.name}</td>
                <td data-label="Teaching Courses">
                  {member.courses && member.courses.length > 0
                    ? member.courses.map(c => 
                        `${c.courseId} (${c.sections} ${c.sections === 1 ? 'section' : 'sections'})`
                      ).join(", ")
                    : "No courses assigned"}
                </td>
                <td data-label="Teaching hours:">
                  <div style={{
                    background: getHoursColor(member.teachingHours, member.rank),
                    borderRadius: '12px',
                    padding: '6px',
                    display: 'flex',
                    margin: 'auto',
                    width: 'fit-content',
                    minWidth: '50px',
                    justifyContent: 'center',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    {member.teachingHours}
                  </div>
                </td>
              </tr>
            ))
          )}
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
    </div>
  );
}