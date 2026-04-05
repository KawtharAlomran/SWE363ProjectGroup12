import { useState } from "react";

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


function renderCourses(courses, handleDelete) {
  return courses.map((course) => (
    <div key={course.code}>
      <span>{course.code}</span>
      <span>{course.name}</span>
      <button onClick={() => handleDelete(course.code)}>Delete</button>
    </div>
  ));
}

export default function ManageCourses() {
  const [courses, setCourses] = useState(coursesList);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courses.slice(startIndex, endIndex); // to display the courses in the specified page 
  const totalPages = Math.ceil(courses.length / coursesPerPage); // to find the total pages 

  const handleDelete = (code) => {
      setCourses((prevCourses) => prevCourses.filter((course) => course.code !== code));
  };
return (
    <div>
      <div>
        <h2>Manage Courses</h2>
        <button>Add new Course</button>
      </div>
      <div>
        <div>Course number</div>
        <div className="text-center">Course Name</div>
      </div>
      {renderCourses(currentCourses, handleDelete)}
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
