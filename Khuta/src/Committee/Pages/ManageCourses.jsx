// import statments 
import { useState, useEffect } from "react";
import ConfirmModal from '../../shared/ConfirmModal';

export default function ManageCourses() {
  // define some useState to monitor changes
  const [isDelete, setIsDelete] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdd, setIsAdd] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [hasLab, setHasLab] = useState(null);
  const [addError, setAddError] = useState("")
  const [courses, setCourses] = useState([]);
  
  const API_URL = "http://localhost:5174/api/courses";
  
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (code) => {
    const res = await fetch(`${API_URL}/${encodeURIComponent(code)}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      console.error("Failed to delete course");
      return;
    }

    setCourses(courses.filter(c => c.code !== code));
  };

  // function to handle adding a new course
  const handleAdd = async () => {

    // create a new course object to send to backend
    const newCourse = {
      code: code.slice(0, 3).toUpperCase() + " " + code.slice(3), // format the code
      name,
      description,
      credit_hours: Number(hours),
      has_lab: hasLab,
      level: "undegraduate"
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCourse)
    });

    const data = await res.json();

    if (!res.ok) {
      setAddError(data.message || "Failed to add course");
      return;
    }

    setCourses([...courses, data]);

    setIsAdd(false);
    setCode("");
    setName("");
    setHours("");
    setDescription("");
    setHasLab(null);
    setAddError("");
  };

  // to handle pages 
  const coursesPerPage = 9;
  const startIndex = (currentPage - 1) * coursesPerPage; // to find the start index 
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courses.slice(startIndex, endIndex); // to display the courses in the specified page 
  const totalPages = Math.ceil(courses.length / coursesPerPage); // to find the total pages 
  

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
        {/* display courses */}
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
      
      {/* display confirmation message when delete button is clicked  */}
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

      {/* display confirmation message when add button is clicked  */}
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
   
          // check if there is any missing fields
          if (!code || !name || !hours || !description) {
            setAddError("All fields are required");
            return;
          }
          // check if the user choose one of the two options or not
          if (hasLab === null) {
          setAddError("Please choose whether the course has a lab");
          return;
          }
            // validate code (SWE206 or ICS455)
          const codeRegex = /^(SWE|ICS)\d{3}$/;
          if (!codeRegex.test(code.toUpperCase())) {
            setAddError("Course code must start with SWE or ICS followed directly by 3 digits");
            return;
          }
            // validate hours (must be 1–6)
          const hoursNum = Number(hours);
          if (isNaN(hoursNum) || hoursNum < 1 || hoursNum > 6) {
            setAddError("Course hours must be between 1 and 6");
            return;
          }
          // validate name 
          const nameRegex = /^[A-Za-z\s]+$/;
          if (!nameRegex.test(name)) {
            setAddError("Course name must contain only letters");
            return;
          }

          handleAdd();
        }}
        onCancel={() => {
          setIsAdd(false);
          setCode("");
          setName("");
          setHours("");
          setDescription("");
          setHasLab(null);
        }}
        confirmText="Add"
        cancelText="Cancel"
        errorMessage={addError}
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