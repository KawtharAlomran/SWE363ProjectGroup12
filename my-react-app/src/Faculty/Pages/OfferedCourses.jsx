import { useState } from 'react';
import { getAllIcsCourses, getAllOfferedCourses } from '../../data';

function OfferedCourses() {
  const courses = getAllIcsCourses();
  const terms = getAllOfferedCourses();

  const [selectedTerm, setSelectedTerm] = useState(terms[0].termNum);
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 4;

  const currentTerm = terms.find(term => term.termNum === selectedTerm);

  const offeredCourses = courses.filter(course =>
    currentTerm.courses.includes(course.code)
  );

  // pagination logic
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = offeredCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(offeredCourses.length / coursesPerPage);

  return (
    <div className="mt-card">
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
        <label className="an-term-label">Select Term:</label>
        <select
          className="an-select"
          value={selectedTerm}
          onChange={(e) => {
            setSelectedTerm(e.target.value);
            setCurrentPage(1); //  مهم: يرجع الصفحة 1 عند تغيير الترم
          }}
        >
          {terms.map(term => (
            <option key={term.termNum} value={term.termNum}>
              {term.termNum}
            </option>
          ))}
        </select>
      </div>

      <div className="td-term-badge">
        Selected Term: {selectedTerm}
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
            <tr key={course.code}>
              <td className="an-course-name">{course.code}</td>
              <td>{course.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
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
  );
}

export default OfferedCourses;