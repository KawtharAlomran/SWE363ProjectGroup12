import { useState } from 'react';
import AddNewTerm from './AddNewTerm';
import TermDetails from './TermDetails';
import { getTerms, addTerm, deleteTerm } from '../../data';

export default function ManageTerms() {
  const TERMS_PER_PAGE = 5;
  
  // Load terms from shared data
  const [terms, setTerms] = useState(getTerms());
  const [showAddNew, setShowAddNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const currentYear = new Date().getFullYear();
  const totalPages = Math.ceil(terms.length / TERMS_PER_PAGE);
  const start = (currentPage - 1) * TERMS_PER_PAGE;
  const visibleTerms = terms.slice(start, start + TERMS_PER_PAGE);

  if (showAddNew) {
    return (
      <AddNewTerm
        onBack={() => setShowAddNew(false)}
        onSubmit={(newTerm) => {
          // Save to shared data then update local state
          addTerm(newTerm);
          setTerms(getTerms());
          setShowAddNew(false);
        }}
      />
    );
  }

  if (selectedTerm) {
    return (
      <TermDetails
        term={selectedTerm}
        onBack={() => setSelectedTerm(null)}
        onDelete={(termId) => {
          deleteTerm(termId);
          setTerms(getTerms());
          setSelectedTerm(null);
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
            <div key={term.id} className="mt-row" onClick={() => setSelectedTerm(term)}>
              <span className="mt-name">{term.name}</span>
              {currentYear === term.year
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