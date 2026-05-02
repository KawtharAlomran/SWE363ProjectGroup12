// Updated: replaced local data.js calls with API fetch calls
// Added: Modify button logic based on term year and semester number
import { useState, useEffect } from 'react';
import AddNewTerm from './AddNewTerm';
import TermDetails from './TermDetails';

const API = 'http://localhost:5174';

export default function ManageTerms() {
  const TERMS_PER_PAGE = 5;

  const [terms, setTerms] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState(null);

  // Loading state to inform the user of the state of the website 
  const [loadingTerms, setLoadingTerms] = useState(true);

  // Get current year's 2-digit prefix e.g. 2026 → "26"
  const currentYearPrefix = String(new Date().getFullYear()).slice(-2);
  // Last year's 2-digit prefix e.g. 2025 → "25"
  const lastYearPrefix = String(new Date().getFullYear() - 1).slice(-2);

  // A term is editable if:
  // - it belongs to the current year (e.g. 26X), OR
  // - it belongs to last year AND is semester 3 (e.g. 253)
  const canEdit = (termId) => {
    const prefix = termId.slice(0, 2);
    const semester = termId.slice(2);
    return prefix === currentYearPrefix || (prefix === lastYearPrefix && semester === '3');
  };

  const fetchTerms = async () => {
    try {
      const res = await fetch(`${API}/api/terms`);
      const data = await res.json();
      setTerms(data);
      // Stop loading
      setLoadingTerms(false);
    } catch (err) {
      console.error("Error fetching terms:", err);
      // Stop loading
      setLoadingTerms(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const totalPages = Math.ceil(terms.length / TERMS_PER_PAGE);
  const start = (currentPage - 1) * TERMS_PER_PAGE;
  const visibleTerms = terms.slice(start, start + TERMS_PER_PAGE);

  if (showAddNew) {
    return (
      <AddNewTerm
        onBack={() => setShowAddNew(false)}
        onSubmit={async () => {
          // Term is already saved inside AddNewTerm via /api/sections
          // Just refresh the list and go back
          await fetchTerms();
          setShowAddNew(false);
        }}
      />
    );
  }

  if (selectedTerm) {
    return (
      <TermDetails
        term={selectedTerm}
        canEdit={canEdit(selectedTerm.termId)}
        onBack={() => setSelectedTerm(null)}
        onDelete={async (termId) => {
          try {
            // Delete all sections for this term
            await fetch(`${API}/api/sections/${selectedTerm.termId}`, {
              method: 'DELETE'
            });
            // Delete all assignment for this term
            await fetch(`${API}/api/assignments/${selectedTerm.termId}`, {
              method: 'DELETE'
            });
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
  // Show loading message while fetching terms
  if (loadingTerms) {
    return <div className="container">Loading terms...</div>;
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
            <div key={term._id} className="mt-row" onClick={() => setSelectedTerm(term)}>
              <span className="mt-name">Academic Term {term.termId}</span>
              {canEdit(term.termId)
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