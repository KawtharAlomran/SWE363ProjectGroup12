import { useState, useEffect } from "react";
import ConfirmModal from '../../shared/ConfirmModal';

export default function IcsFaculty() {
  const [faculty, setfaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const facultyPerPage = 8;

  // Add faculty states
  const [isAdd, setIsAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [addError, setAddError] = useState("");

  // --- fetch Faculty from Server ---
  const fetchFaculty = async () => {
    try {
      const response = await fetch("/api/faculty");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setfaculty(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // --- handle Adding via API ---
  const handleAdd = async () => {
    if (!newEmail || !newName || !newLevel) {
      setAddError("All fields must be filled");
      return;
    }

    const codeRegex = /^.+@kfupm.edu.sa$/;
    if (!codeRegex.test(newEmail)) {
      setAddError("You must enter a valid KFUPM email.");
      return;
    }

    try {
      const response = await fetch("/api/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail,role:"faculty", rank: newLevel, pass: "1" }),
      });

      if (response.ok) {
        await fetchFaculty(); // Refresh the list from the database
        setNewEmail("");
        setNewName("");
        setNewLevel("");
        setAddError("");
        setIsAdd(false);
      } else {
        const errorData = await response.json();
        setAddError(errorData.message || "Error saving faculty");
      }
    } catch (error) {
      setAddError("Server connection failed");
    }
  };

  // --- hndle Deleting via API ---
  const handleDelete = async (email) => {
    try {
      const response = await fetch(`/api/faculty/${email}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchFaculty(); // Refresh the list
      }
    } catch (error) {
      console.error("Delete request failed", error);
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * facultyPerPage;
  const endIndex = startIndex + facultyPerPage;
  const currentfaculty = faculty.slice(startIndex, endIndex);
  const totalPages = Math.ceil(faculty.length / facultyPerPage);
  
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

  if (isLoading) return <div className="container">Loading Faculty Data...</div>;

  return (
    <>
    {/* view all ICS faculty with their information */}
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
              <th>Faculty Rank</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentfaculty.map((member) => (
              <tr key={member.email}>
                <td data-label="Faculty Name">{member.name}</td>
                <td data-label="Faculty Email">{member.email}</td>
                <td data-label="Faculty Rank">{member.rank}</td>
                <td>
                  <button className="deleteBtn" onClick={() => {
                    setSelectedFaculty(member.email);
                    setIsDelete(true);
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delete Confirmation */}
        {isDelete && (
          <ConfirmModal
            message="Are you sure you want to delete this faculty member?"
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

        {/* Add Faculty Form */}
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
                label: "Faculty Name",
                name: "name",
                placeholder: "Enter Faculty Full Name",
                onChange: (val) => setNewName(val)
              },
              {
                label: "KFUPM Email",
                name: "email",
                placeholder: "username@kfupm.edu.sa",
                onChange: (val) => setNewEmail(val)
              },
              {
                label: "Faculty Level",
                name: "level",
                placeholder: "e.g. Assistant Professor",
                onChange: (val) => setNewLevel(val)
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