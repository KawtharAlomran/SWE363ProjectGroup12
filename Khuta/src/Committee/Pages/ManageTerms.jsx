// Updated: replaced local data.js calls with API fetch calls
import { useState, useEffect } from 'react';
import AddNewTerm from './AddNewTerm';
import TermDetails from './TermDetails';

const API = 'http://localhost:5174';

export default function ManageTerms() {
  const TERMS_PER_PAGE = 5;
  
  // Removed: const [terms, setTerms] = useState(getTerms());
  const [terms, setTerms] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const currentYear = new Date().getFullYear();
  const totalPages = Math.ceil(terms.length / TERMS_PER_PAGE);
  const start = (currentPage - 1) * TERMS_PER_PAGE;
  const visibleTerms = terms.slice(start, start + TERMS_PER_PAGE);

  // Fetch all terms from the database on component mount
  const fetchTerms = async () => {
    try {
      const res = await fetch(`${API}/api/terms`);
      const data = await res.json();
      setTerms(data);
    } catch (err) {
      console.error("Error fetching terms:", err);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  if (showAddNew) {
    return (
      <AddNewTerm
        onBack={() => setShowAddNew(false)}
        onSubmit={async (newTerm) => {
          try {
            // Save new term to the database then refresh the list
            await fetch(`${API}/api/terms`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ termId: newTerm.termNum }),
            });
            await fetchTerms();
            setShowAddNew(false);
          } catch (err) {
            console.error("Error adding term:", err);
          }
        }}
      />
    );
  }

  if (selectedTerm) {
    return (
      <TermDetails
        term={selectedTerm}
        onBack={() => setSelectedTerm(null)}
        onDelete={async (termId) => {
          try {
            // Delete term from the database then refresh the list
            await fetch(`${API}/api/terms/${termId}`, { method: 'DELETE' });
            await fetchTerms();
            setSelectedTerm(null);
          } catch (err) {
            console.error("Error deleting term:", err);
          }
        }}
      />
    );
  }

  return (
    <>
      <div className="container">

        <div className="header">
          <h3 className="header h2">All Terms</h3>
          <button className="addBtn" onClick={() => setShowAddNew(true)}>Add new Term</button>
        </div>

        <div className="mt-list">
          {visibleTerms.map((term) => (
            // Use _id from MongoDB instead of id
            <div key={term._id} className="mt-row" onClick={() => setSelectedTerm(term)}>
              <span className="mt-name">Academic Term {term.termId}</span>
              {currentYear === new Date().getFullYear()
                ? <button className="mt-modify" onClick={e => { e.stopPropagation(); setSelectedTerm(term); }}>Modify</button>
                : <span className="mt-arrow">›</span>
              }
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pageNumbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i+1} className={currentPage === i+1 ? 'active' : ''} onClick={() => setCurrentPage(i+1)}>
                {i+1}
              </button>
            ))}
          </div>
        )}

      </div>
    </>
  );
}