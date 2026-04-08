
import { useState } from "react";
import {getCommittee, deleteCommittee} from "../../data";
import '../../styles/ManageCourses.css';
import ConfirmModal from '../../shared/ConfirmModal';

//---Only button handeling is remaining---//

export default function SchedulingCommittee(){
  //let committee=getCommittee();
    const [committee, setcommittee] = useState(getCommittee());
    const [isDelete, setIsDelete] = useState(false);
    const [selectedcommittee, setSelectedcommittee] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const committeePerPage = 8;
    const startIndex = (currentPage - 1) * committeePerPage; // to find the start index 
    const endIndex = startIndex + committeePerPage;
    const currentcommittee = committee.slice(startIndex, endIndex); // to display the committee in the specified page 
    const totalPages = Math.ceil(committee.length / committeePerPage); // to find the total pages 
    const handleDelete = (email) => {
      const updatedData = deleteCommittee(email);
      setcommittee(updatedData);
      };
    return(
        <>
        <div className="container">
            <div className="header">
              <h2>Scheduling Committee members</h2>
              <button className="addBtn">Add new committee</button>
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
