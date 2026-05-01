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
  
  // Loading state to inform the user of the state of the website 
  const [loadingCourses, setLoadingCourses] = useState(true);

  const API_URL = "http://localhost:5174/api/courses";
  
  // fetch courses when component loads (runs once)
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json()) // convert response to JSON
      .then(data => {
        // store courses in state
        setCourses(data)
        // Stop loading
        setLoadingCourses(false);
      }) 
      .catch(err => console.error(err)); // handle errors
  }, []);

  // function to delete a course
  const handleDelete = async (code) => {
    // send DELETE request with encoded code to handle spaces 
    const res = await fetch(`${API_URL}/${encodeURIComponent(code)}`, {
      method: "DELETE"
    });

    // if deletion failed notify the user 
    if (!res.ok) {
      console.error("Failed to delete course");
      alert("Failed to delete course");
      return;
    }
   // update UI by removing deleted course
    setCourses(courses.filter(c => c.code !== code));
  };

  // function to handle adding a new course
  const handleAdd = async () => {

    // create a new course object to send to backend
    const newCourse = {
      code: code.slice(0, 3).toUpperCase() + " " + code.slice(3), // format the code
      name,
      description,
      credit_hours: Number(hours), // convert hours to number
      has_lab: hasLab,
      level: "undegraduate"  // default level
    };

    // send POST request to backend API
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCourse)
    });

    const data = await res.json();

    // if request failed, show error message
    if (!res.ok) {
      setAddError(data.message || "Failed to add course");
      return;
    }

    // update UI by adding the new course to the list
    setCourses([...courses, data]);

    // clear form fields
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
  
  // Smart pagination — shows first, last, and 1 page around current
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      }
    }
     const withEllipsis = [];
    let prev = null;
    for (const page of pages) {
      if (prev && page - prev > 1) withEllipsis.push('...');
      withEllipsis.push(page);
      prev = page;
    }
    return withEllipsis;
  }
  // Show loading message while fetching terms
  if (loadingCourses) {
    return <div className="container">Loading courses...</div>;
  }

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
    {/* Smart pagination */}
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
  )
}