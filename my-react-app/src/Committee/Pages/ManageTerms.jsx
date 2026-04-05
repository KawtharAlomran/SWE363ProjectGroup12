import { useState } from 'react';
import '../../styles/ManageTerms.css';

const TERMS = [
  { id: 1, name: 'Academic Terms 261', year: 2026 },
  { id: 2, name: 'Academic Terms 253', year: 2025 },
  { id: 3, name: 'Academic Terms 252', year: 2024 },
  { id: 4, name: 'Academic Terms 251', year: 2023 },
  { id: 5, name: 'Academic Terms 242', year: 2022 },
    { id: 6, name: 'Academic Terms 242', year: 2022 },
      { id: 7, name: 'Academic Terms 242', year: 2022 },


];

export default function ManageTerms() {
  const TERMS_PER_PAGE = 5;
  const totalPages = Math.ceil(TERMS.length / TERMS_PER_PAGE);
  const [showAddNew, setShowAddNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const currentYear = new Date().getFullYear();
const start = (currentPage - 1) * TERMS_PER_PAGE;
const visibleTerms = TERMS.slice(start, start + TERMS_PER_PAGE);
  if (showAddNew) {
    return <AddNewTerm onBack={() => setShowAddNew(false)} />;  }

  if (selectedTerm) {
    return <div>Term Details - {selectedTerm.name}</div>;
  }

  return (
    <>
      <div className="mt-card">

        <div className="mt-header">
          <h3 className="mt-title">All Terms</h3>
          <button
            className="mt-btn-add"
            onClick={() => setShowAddNew(true)}
          >
            Add new Term
          </button>
        </div>

        <div className="mt-list">
          {visibleTerms.map((term) => (
            <div
              key={term.id}
              className="mt-row"
              onClick={() => setSelectedTerm(term)}
            >
              <span className="mt-name">{term.name}</span>
              {currentYear === term.year
                ? (
                  <button
                    className="mt-modify"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedTerm(term);
                    }}
                  >
                    Modify
                  </button>
                )
                : <span className="mt-arrow">›</span>
              }
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-pagination">
            <button
              className="mt-page"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`mt-page${currentPage === n ? ' mt-page-active' : ''}`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}

            <button
              className="mt-page"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            > ›</button>
          </div>
        )}

      </div>
    </>
  );
}