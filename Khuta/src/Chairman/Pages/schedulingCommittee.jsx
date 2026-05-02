import { useState, useEffect } from "react";
import ConfirmModal from '../../shared/ConfirmModal';

export default function SchedulingCommittee() {
  const [committee, setcommittee] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // add/remove committee states
  const [isDelete, setIsDelete] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [selectedcommittee, setSelectedcommittee] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const committeePerPage = 8;
  const [newEmail, setNewEmail] = useState("");
  const [addError, setAddError] = useState("");

  // --- fetch committee members from server ---
  const fetchCommittee = async () => {
    try {
      // Using the role=committee query parameter
      const response = await fetch("/api/faculty?role=committee");
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

  // --- adding a member to the committee ---
  const handleAdd = async () => {
    if (!newEmail) {
      setAddError("Please enter an email.");
      return;
    }

    try {
      // We send a PATCH to update the role of the existing faculty member
      const response = await fetch(`/api/faculty/${newEmail.toLowerCase()}`, {
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

  // --- removing a member from the committee ---
  const handleDelete = async (email) => {
    try {
      // change the role to faculty
      const response = await fetch(`/api/faculty/${email}`, {
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

  // Pagination logic
  const startIndex = (currentPage - 1) * committeePerPage;
  const endIndex = startIndex + committeePerPage;
  const currentcommittee = committee.slice(startIndex, endIndex);
  const totalPages = Math.ceil(committee.length / committeePerPage);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) pages.push(i);
    }
    const withEllipsis = [];
    let prev = null;
    for (const page of pages) {
      if (prev && page - prev > 1) withEllipsis.push('...');
      withEllipsis.push(page);
      prev = page;
    }
    return withEllipsis;
  };

  // Reusable section select
  const SectionSelect = ({ value, courseCode, field }) => (
    <select className="an-select" value={value} onChange={e => updateSection(courseCode, field, e.target.value)}>
      {[...Array(30)].map((_, i) => <option key={i} value={i}>{i}</option>)}
    </select>
  );

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

        {/* remove committee from the list */}
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
        {/* Add committee Form */}
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

        {/* Smart pagination — 1 ... 4 5 6 ... */}
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
    </>
  );
}