import { useState, useEffect } from "react";
// Remove local data imports
import ConfirmModal from '../../shared/ConfirmModal';

export default function SchedulingCommittee() {
  const [committee, setcommittee] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // add/remove committee states
  const [isDelete, setIsDelete] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [selectedcommittee, setSelectedcommittee] = useState(null);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const committeePerPage = 8;
  const [newEmail, setNewEmail] = useState("");
  const [addError, setAddError] = useState("");

  // --- 1. Fetch Committee Members from Server ---
  const fetchCommittee = async () => {
    try {
      // Using the role=committee query parameter as specified
      const response = await fetch("http://localhost:5174/api/faculty?role=committee");
      if (!response.ok) throw new Error("Failed to fetch committee");
      const data = await response.json();
      setcommittee(data);
    } catch (error) {
      console.error("Error loading committee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, []);

  // Pagination calculations
  const startIndex = (currentPage - 1) * committeePerPage;
  const endIndex = startIndex + committeePerPage;
  const currentcommittee = committee.slice(startIndex, endIndex);
  const totalPages = Math.ceil(committee.length / committeePerPage);

  // --- 2. Adding a member to the committee ---
  const handleAdd = async () => {
    if (!newEmail) {
      setAddError("Please enter an email.");
      return;
    }

    try {
      // We send a PATCH or POST to update the role of the existing faculty member
      // Note: This assumes your backend handles assigning the 'committee' role to an existing email
      const response = await fetch(`http://localhost:5174/api/faculty/${newEmail.toLowerCase()}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "committee" }),
      });

      if (response.ok) {
        await fetchCommittee(); // Refresh list
        setNewEmail("");
        setAddError("");
        setIsAdd(false);
      } else {
        const err = await response.json();
        setAddError(err.message || "Faculty member not found.");
      }
    } catch (error) {
      setAddError("Server error. Please try again.");
    }
  };

  // --- 3. Removing a member from the committee ---
  const handleDelete = async (email) => {
    try {
      // Instead of deleting the user entirely, we usually just change their role back to 'faculty'
      const response = await fetch(`http://localhost:5174/api/faculty/${email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "faculty" }),
      });

      if (response.ok) {
        await fetchCommittee();
      }
    } catch (error) {
      console.error("Removal failed:", error);
    }
  };

  if (isLoading) return <div className="container">Loading Committee...</div>;

  return (
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
                <td>
                  <button className="deleteBtn" onClick={() => {
                    setSelectedcommittee(member.email);
                    setIsDelete(true);
                  }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isDelete && (
          <ConfirmModal
            message="Are you sure you want to remove this member from the committee?"
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
          <ConfirmModal
            onConfirm={handleAdd}
            onCancel={() => {
              setIsAdd(false);
              setAddError("");
            }}
            errorMessage={addError}
            fileds={[
              {
                label: "KFUPM Email",
                name: "email",
                placeholder: "Enter Faculty Email to add",
                onChange: (val) => setNewEmail(val)
              }
            ]}
            confirmText='Add'
            cancelText='Cancel'
          />
        )}

        <div className="pageNumbers">
          {Array.from({ length: totalPages }, (_, index) => (
            <button 
              className={currentPage === index + 1 ? "active" : ""} 
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}