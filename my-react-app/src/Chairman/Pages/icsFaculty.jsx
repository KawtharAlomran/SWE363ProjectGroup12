
import { useState } from "react";
import {getFaculty, deleteFaculty, addFaculty} from "../../data";
import '../../styles/ManageCourses.css';
import AddModal from "./MemberAddition";

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
  const [isAdd, setIsAdd] = useState(false);
  const [newEmail, setNewEmail] = useState(""); 
  const [newName, setNewName] = useState(""); 
  const [newLevel, setNewLevel] = useState(""); 
  const [addError, setAddError] = useState("")

  const handleAdd = () => {
    if (!faculty.find(f => f.email === newEmail)){
      setAddError("All fields must be filled");
    } 
    const updatedData = addFaculty(newName,newEmail,newLevel); 
    setfaculty(updatedData); 
    setNewEmail("");
    setNewName("");
    setNewLevel("");
    setAddError("");
    setIsAdd(false);
    };
  const handleDelete = (email) => {
        const updatedData = deleteFaculty(email);
        setfaculty(updatedData);
    };
    return(
        <>
        <div className="container">
            <div className="header">
              <h2>All ICS Faculty</h2>
              <button className="addBtn" onClick={() => setIsAdd(true)}>Add new faculty</button>
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

              {isAdd && (
                <AddModal
                  onConfirm={() => {handleAdd()}}
                  onCancel={() => {
                    setIsAdd(false);
                    setAddError("");}}
                  errorMessage={addError}
                  fileds={[
                    {
                      label: "Faculty Name",
                      name: "name",
                      placeholder: "Enter Faculty Full Name",
                      onChange: (val) => setNewName(val)
                    },
                    {
                      label: "KFUPM Email",
                      name: "email",
                      placeholder: "Enter Committee Email",
                      onChange: (val) => setNewEmail(val)
                    },
                    {
                      label: "Faculty Level",
                      name: "level",
                      placeholder: "Enter Faculty Level",
                      onChange: (val) => setNewLevel(val)
                    }
                  ]}
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