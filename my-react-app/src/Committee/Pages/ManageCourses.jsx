import { useState } from "react";
import '../../styles/ManageCourses.css';
import ConfirmModal from '../../shared/ConfirmModal';
import {getAllIcsCourses, deleteCourse, addCourse} from "../../data";

export default function ManageCourses() {
  const [courses, setCourses] = useState(getAllIcsCourses());
  const [isDelete, setIsDelete] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdd, setIsAdd] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [hasLab, setHasLab] = useState(false);

  const coursesPerPage = 6;
  const startIndex = (currentPage - 1) * coursesPerPage; // to find the start index 
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courses.slice(startIndex, endIndex); // to display the courses in the specified page 
  const totalPages = Math.ceil(courses.length / coursesPerPage); // to find the total pages 
  
  // handle deleting course
  const handleDelete = (code) => {
        const updatedData = deleteCourse(code);
        setCourses(updatedData);
    };

  // handle adding course 
  const handleAdd = (code, name, hours, description ) => {
        addCourse(code, name, hours, description);
        setCourses(getAllIcsCourses());
    };

return (
    <div className="container">
      <div className="header">
        <h2>Manage Courses</h2>
        <button className="addBtn" onClick={() => setIsAdd(true)} >Add new Course</button>
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

    {isAdd && (
      <ConfirmModal
        message="Add course"
        fileds={[
          {
            name: "code",
            label: "Course code",
            type: "text",
            placeholder: "Enter course code",
            onChange: setCode,
          },
          {
            name: "name",
            label: "Course Name",
            type: "text",
            placeholder: "Enter course name",
            onChange: setName,
          },
          {
            name: "hours",
            label: "Course hours",
            type: "text",
            placeholder: "Enter course credits",
            onChange: setHours,
          },
          {
          name: "hasLab",
          label: "Has Lab?",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false }
          ],
          onChange: setHasLab,
          },
          {
            name: "description",
            label: "Course description",
            type: "textarea",
            placeholder: "Enter course description",
            onChange: setDescription,
          },
        ]}
        onConfirm={() => {
          if (!code || !name || !hours || !description) {
            alert("All fields are required");
            return;
          }
          handleAdd(code, name, hours,hasLab, description);
          setIsAdd(false);
          setCode("");
          setName("");
          setHours("");
          setDescription("");
        }}
        onCancel={() => {
          setIsAdd(false);
          setCode("");
          setName("");
          setHours("");
          setDescription("");
        }}
        confirmText="Add"
        cancelText="Cancel"
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