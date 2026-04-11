
import {getFaculty, getAssignedCourses, calculateTeachingHours} from "../../data";
import { useState } from "react";

// maching each faculty rank with the max teaching hours
 const facultyHours={
  "Professor":6,
  "Associate Professor":9,
  "Assistant Professor":9,
  "Instructor":12,
  "Senior Lecturer":12,
  "Lecturer":12};

export default function Load(){
  const allTermsData =getAssignedCourses();
  const [faculty, setfaculty] = useState(getFaculty());

  // find number of pages for the page bar 
  const [currentPage, setCurrentPage] = useState(1);
  const facultyPerPage = 8;
  const startIndex = (currentPage - 1) * facultyPerPage; // to find the start index 
  const endIndex = startIndex + facultyPerPage;
  const currentfaculty = faculty.slice(startIndex, endIndex); // to display the faculty in the specified page 
  const totalPages = Math.ceil(faculty.length / facultyPerPage); // to find the total pages
   
  // to display the data for the selected term
  const [selectedTerm, setSelectedTerm] = useState(allTermsData[0]?.Term || '');
  const currentTermData = allTermsData.find(term => term.Term === selectedTerm);
  const facultyCourses = currentTermData?.assignedCourses || [];

  // give the max hours or above a red color otherwise a green color
  const getHoursColor=(hours, level) =>{
    let color='#00b894'
    if(hours>=facultyHours[level]){
      color="#e53e3e"
    }
    return color;

  }
 
// calculating each faculty teaching hours
  const getTeachingHours = (name) =>{
    const faculty = facultyCourses.find(c => c.faculty === name);
    if (!faculty || !faculty.courses) return 0;
    return calculateTeachingHours(faculty.courses);
}

return(
  <div className="container">
    <div className="header">
    <h2>Faculty Teaching Load</h2>
    </div>
    {/* term selection drop-down menue */}
    <div className="td-term-badge">
      <p>Select Term </p>
      <select className="selection" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
        {allTermsData.map((term) => (
          <option key={term.Term} value={term.Term}>{term.Term}</option>))}
      </select>
    </div>
    
    {/* View the faculty name with their teacing courses and number of section of each course and the total teaching hours */}
    <table className="coursesTable">
      <thead>
        <tr>
          <th>Faculty Name</th>
          <th>Teaching Courses</th>
          <th>Teaching hours</th>
        </tr>
      </thead>

      <tbody>
          {currentfaculty.map((member) => {
            const facultyCourseData = facultyCourses.find(f => f.faculty == member.name);
            const teachingHours = getTeachingHours(member.name);
            return (
              <tr key={member.email}>
                <td data-label="Faculty Name">{member.name}</td>
                <td data-label="Teaching Courses">
                  {facultyCourseData && facultyCourseData.courses.length > 0
                    ? facultyCourseData.courses.map(c => `${c.name} (${c.sections} ${c.sections === 1 ? 'section' : 'sections'})`).join(", ")
                    : "No courses assigned"}
                </td>
                <td data-label="Teaching hours:" 
                    style={{
                      background: getHoursColor(teachingHours, member.level), 
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
                  {teachingHours}
                </td>
              </tr>
            );
          })}
        </tbody>
    </table>
    
    {/* page bar */}
    <div className="pageNumbers">
      {Array.from({ length: totalPages }, (_, index) => (
        <button className={currentPage === index + 1 ? "active" : ""} key={index + 1}
          onClick={() => setCurrentPage(index + 1)}>
          {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

