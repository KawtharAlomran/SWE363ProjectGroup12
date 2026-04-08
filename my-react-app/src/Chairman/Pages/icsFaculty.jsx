
import { useState } from "react";
import {getFaculty} from "../../data";
import '../../styles/ManageCourses.css';
import ConfirmModal from '../../shared/ConfirmModal';

//---Only button handeling is remaining---//

export default function IcsFaculty(){
  const [faculty, setfaculty] = useState(getFaculty());
  const [isDelete, setIsDelete] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const facultyPerPage = 8;
  const startIndex = (currentPage - 1) * facultyPerPage; // to find the start index 
  const endIndex = startIndex + facultyPerPage;
  const currentfaculty = faculty.slice(startIndex, endIndex); // to display the faculty in the specified page 
  const totalPages = Math.ceil(faculty.length / facultyPerPage); // to find the total pages 
  const handleDelete = (email) => {
        setfaculty((prevCourses) => prevCourses.filter((faculty) => faculty.email !== email));
    };
    return(
        <>
        <div className="container">
            <div className="header">
              <h2>All ICS Faculty</h2>
              <button className="addBtn">Add new faclty</button>
              </div>
              <table className="coursesTable">
                <thead>
                  <tr>
                    <th>Faculty Name</th>
                    <th>Faculty Email</th>
                    <th>Faculty Level</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentfaculty.map((member) => (
                  <tr key={member.email}>
                    <td >{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.level}</td>
                    <td><button className="deleteBtn" onClick={() => {
                  setSelectedFaculty(member.email);
                  setIsDelete(true);
                  }}>Remove</button></td>
                  </tr>
                  ))}
                </tbody>
              </table>
              {isDelete && (
                <ConfirmModal
                  message="Are you sure you want to delete the faculty member?"
                  onConfirm={() => {
                    handleDelete(selectedFaculty);
                    setIsDelete(false);
                    setSelectedFaculty(null);
                  }}
                  onCancel={() => {
                    setIsDelete(false);
                    setSelectedFaculty(null);
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
        </>
    )
}