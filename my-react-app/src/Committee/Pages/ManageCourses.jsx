import { useState } from "react";
import '../../styles/ManageCourses.css';
import ConfirmModal from '../../shared/ConfirmModal';
import {getAllIcsCourses, deleteCourse} from "../../data";
/*
const coursesList = [
    { code: "ICS 104", name: "Intro. to Prog. in Python & C" },
    { code: "ICS 108", name: "Object-Oriented Programming" },
    { code: "ICS 202", name: "Data Structures and Algorithms" },
    { code: "ICS 253", name: "Discrete Structures" },
    { code: "ICS 321", name: "Database Systems" },
    { code: "ICS 343", name: "Fund. of Computer Networks" },
    { code: "ICS 344", name: "Information Security" },
    { code: "ICS 353", name: "Design/Analysis of Algorithms" },
    { code: "ICS 381", name: "Principles of Artificial Intelligence"},
    { code: "ICS 410", name: "Programming Languages"}
  ];
*/
export default function ManageCourses() {
  const [courses, setCourses] = useState(getAllIcsCourses());
  const [isDelete, setIsDelete] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;
  const startIndex = (currentPage - 1) * coursesPerPage; // to find the start index 
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courses.slice(startIndex, endIndex); // to display the courses in the specified page 
  const totalPages = Math.ceil(courses.length / coursesPerPage); // to find the total pages 
  const handleDelete = (code) => {
        const updatedData = deleteCourse(code);
        setCourses(updatedData);
    };

return (
    <div className="container">
      <div className="header">
        <h2>Manage Courses</h2>
        <button className="addBtn">Add new Course</button>
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
              <td>
                <button
                  className="deleteBtn"
                  onClick={() => {
                  setSelectedCourseCode(course.code);
                  setIsDelete(true);
                  }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDelete && (
  <ConfirmModal
    message="Are you sure you want to delete this course?"
    onConfirm={() => {
      handleDelete(selectedCourseCode);
      setIsDelete(false);
      setSelectedCourseCode(null);
    }}
    onCancel={() => {
      setIsDelete(false);
      setSelectedCourseCode(null);
    }}
  />
)}

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
