
import {getFaculty} from "../../data";
import { useState } from "react";
import '../../styles/ManageCourses.css';

export default function Load(){
  //let faculty=getFaculty();
  const [faculty, setfaculty] = useState(getFaculty());
  const [currentPage, setCurrentPage] = useState(1);
  const facultyPerPage = 8;
  const startIndex = (currentPage - 1) * facultyPerPage; // to find the start index 
  const endIndex = startIndex + facultyPerPage;
  const currentfaculty = faculty.slice(startIndex, endIndex); // to display the faculty in the specified page 
  const totalPages = Math.ceil(faculty.length / facultyPerPage); // to find the total pages 
return(
  <div className="container">
    <div className="header">
      <h3>All ICS Faculty</h3>
      <button className="addBtn">Add new faclty</button>
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
        {currentfaculty.map((member) => (
          <tr key={member.email}>
            <td>{member.name}</td>
            <td></td>
            <td></td>
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