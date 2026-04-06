import { useState } from "react";
import '../../styles/ManageCourses.css';
import {ConfirmModal} from '../../shared/ConfirmModal'

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

function showConfirmModal(){
  return(<ConfirmModal
            message="Are you sure you want to delete this course?"
            fileds={[
              { key: "dummy", label: "", onChange: () => {} }
            ]}
            onConfirm={() => handleDelete(selectedCourseCode)}
            onCancel={() => setIsDelete(false)}
          />);
}

function handleDelete(code) {
    setCourses((prevCourses) => prevCourses.filter((course) => course.code !== code));
};
export default function ManageCourses() {
  const [courses, setCourses] = useState(coursesList);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;
  const startIndex = (currentPage - 1) * coursesPerPage; // to find the start index 
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courses.slice(startIndex, endIndex); // to display the courses in the specified page 
  const totalPages = Math.ceil(courses.length / coursesPerPage); // to find the total pages 


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
                  onClick={showConfirmModal}>
                  Delete
                </button>
              </td>
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
