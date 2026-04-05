import { useState } from 'react';
import '../../styles/ManageTerms.css';

const TERMS = [
  { id: 1, name: 'Academic Terms 261', year: 2026 },
  { id: 2, name: 'Academic Terms 253', year: 2025 },
  { id: 3, name: 'Academic Terms 252', year: 2024 },
  { id: 4, name: 'Academic Terms 251', year: 2023 },
  { id: 5, name: 'Academic Terms 242', year: 2022 },
];

export default function ManageTerms() {
  const TERMS_PER_PAGE = 5;
  const totalPages = Math.ceil(TERMS.length / TERMS_PER_PAGE);
  const [showAddNew, setShowAddNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const currentYear = new Date().getFullYear();

  if (showAddNew) {
    return <div>Add New Term - coming soon</div>;
  }

  if (selectedTerm) {
    return <div>Term Details - {selectedTerm.name}</div>;
  }

  return (
    <>
      <h3>All Terms</h3>
      <button onClick={() => setShowAddNew(true)}>Add new Term</button>

      {TERMS.map((term) => (
        <div key={term.id}>
          <span>{term.name}</span>
          {currentYear === term.year
            ? <button onClick={() => setSelectedTerm(term)}>Modify</button>
            : <div onClick={() => setSelectedTerm(term)}>›</div>
          }
        </div>
      ))}

      {totalPages > 1 && (
        <div>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setCurrentPage(n)}>{n}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>›</button>
        </div>
      )}
    </>
  );
}