
import { useState } from "react";
import {getCommittee, deleteCommittee, addCommittee, getFaculty} from "../../data";
import '../../styles/ManageCourses.css';
import ConfirmModal from '../../shared/ConfirmModal';
import AddModal from './MemberAddition';

//---Only button handeling is remaining---//

export default function SchedulingCommittee(){
    let faculty=getFaculty();
    const [committee, setcommittee] = useState(getCommittee());
    const [isDelete, setIsDelete] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [selectedcommittee, setSelectedcommittee] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const committeePerPage = 8;
    const startIndex = (currentPage - 1) * committeePerPage; // to find the start index 
    const endIndex = startIndex + committeePerPage;
    const currentcommittee = committee.slice(startIndex, endIndex); // to display the committee in the specified page 
    const totalPages = Math.ceil(committee.length / committeePerPage); // to find the total pages 
    const [newEmail, setNewEmail] = useState(""); 
    const [addError, setAddError] = useState("")

    const handleAdd = () => {
        if (!faculty.find(f => f.email === newEmail)){
          setAddError("Faculty member not found with that email.");
          return;
        } 
        const updatedData = addCommittee(newEmail); 
        setcommittee(updatedData); 
        setNewEmail("");
        setAddError("");
        setIsAdd(false);
    };
    
    const handleDelete = (email) => {
      const updatedData = deleteCommittee(email);
      setcommittee(updatedData);
      };
    return(
        <>
        <div className="container">
            <div className="header">
              <h2>Scheduling Committee members</h2>
              <button className="addBtn" onClick={() => setIsAdd(true)}>Add new committee</button>
              </div>
              <table className="coursesTable">
                <thead>
                  <tr>
                    <th>Committee Name</th>
                    <th>Committee Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentcommittee.map((member) => (
                  <tr key={member.email}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td><button className="deleteBtn" onClick={() => {
                  setSelectedcommittee(member.email);
                  setIsDelete(true);
                  }}>Remove</button></td>
                  </tr>
                  ))}
                </tbody>
              </table>
              {isDelete && (
                <ConfirmModal
                  message="Are you sure you want to delete the committee member?"
                  onConfirm={() => {
                    handleDelete(selectedcommittee);
                    setIsDelete(false);
                    setSelectedcommittee(null);
                  }}
                  onCancel={() => {
                    setIsDelete(false);
                    setSelectedcommittee(null);
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
                      label: "KFUPM Email",
                      name: "email",
                      placeholder: "Enter Committee Email",
                      onChange: (val) => setNewEmail(val)
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
