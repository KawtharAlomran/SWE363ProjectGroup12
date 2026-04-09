
import {getFaculty, getAssignedCourses, getAllIcsCourses, calculateTeachingHours} from "../../data";
import { useState } from "react";
import '../../styles/ManageCourses.css';
import '../../styles/AssignCourses.css';

 const facultyHours={
  "Professor":6,
  "Associate Professor":9,
  "Assistant Professor":9,
  "Instructor":12,
  "Senior Lecturer":12,
  "Lecturer":12};

export default function Load(){
  const allcourses=getAllIcsCourses();
  const facultyCourses=getAssignedCourses();
  const [faculty, setfaculty] = useState(getFaculty());
  const [currentPage, setCurrentPage] = useState(1);
  const facultyPerPage = 8;
  const startIndex = (currentPage - 1) * facultyPerPage; // to find the start index 
  const endIndex = startIndex + facultyPerPage;
  const currentfaculty = faculty.slice(startIndex, endIndex); // to display the faculty in the specified page 
  const totalPages = Math.ceil(faculty.length / facultyPerPage); // to find the total pages 
  const getHoursColor=(hours, level) =>{
    let color='#00b894'
    if(hours>=facultyHours[level]){
      color="#e53e3e"
    }
    return color;

  }
 

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
    <div className="td-term-badge">Current Term</div>

    <table className="coursesTable">
      <thead>
        <tr>
          <th>Faculty Name</th>
          <th>Teaching Courses</th>
          <th>Teaching hours</th>
        </tr>
      </thead>

      <tbody>
        {currentfaculty.map((member) => (
          <tr key={member.email}>
            <td>{member.name}</td>
            <td>{facultyCourses.find(f => f.faculty == member.name) ? facultyCourses.find(f => f.faculty == member.name).courses.join(", ") : "No courses assigned"}</td>
            <td style={{background:getHoursColor(getTeachingHours(member.name),member.level), borderRadius: '12px',padding: '6px', display: 'flex',
              margin: 'auto',width: 'fit-content',minWidth: '50px', justifyContent: 'center',fontWeight: '600',color:'white'}}>{getTeachingHours(member.name)}</td>
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
  )
}

