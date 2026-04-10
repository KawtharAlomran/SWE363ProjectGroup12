

import { useState } from 'react';
import { getAllOfferedCourses, getAllIcsCourses } from "../../data";
//import '../../styles/ManageCourses.css';

export default function ChairmanHomePage() {



  //const courses = getAllIcsCourses();
  const terms = getAllOfferedCourses();
const [courses, setCourses] = useState(getAllIcsCourses());

  if (!terms || terms.length === 0) {
    return <div>There is no terms</div>;
  }

  const [selectedTerm, setSelectedTerm] = useState(terms[0].termNum);
  
  const currentTermData = terms.find(t => t.termNum === selectedTerm);
  
  const filteredCourses = courses.filter(course => 
    currentTermData?.courses.includes(course.code)
  );

const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;
  const startIndex = (currentPage - 1) * coursesPerPage; // to find the start index 
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex); // to display the courses in the specified page 
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage); // to find the total pages 

  return (
    <div className="container">

        <div className="header">
          <h2>All Offered Courses</h2>
          </div>
          <div className="td-term-badge">
            <p>Select Term </p>

            <select className="selection" value={selectedTerm} 
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              {terms.map((term) => (
                <option key={term.termNum} value={term.termNum}>
                  {term.termNum}
                </option>
              ))}
            </select>
          </div>
        
          

          <table className="coursesTable">
            <thead>
              <tr>
                <th>Course number</th>
                <th>Course Name</th>
              </tr>
            </thead>

            <tbody>
              {currentCourses.map((course) => (
                <tr key={course.code}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        <div className="pageNumbers">
        {Array.from({ length: totalPages }, (_, index) => (
          <button className={currentPage === index + 1 ? "active" : ""} key={index + 1}
            onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      
    </div>
  );
}