import { useState } from 'react';
const TERMS = [
  { id: 1, name: 'Academic Terms 261' },
  { id: 2, name: 'Academic Terms 253' },
  { id: 3, name: 'Academic Terms 252' },
  { id: 4, name: 'Academic Terms 251' },
  { id: 5, name: 'Academic Terms 242' },
];
export default function ManageTerms() {
    const [showAddNew, setShowAddNew] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    if (showAddNew) {
        return <div>Add New Term — coming soon</div>;
    }
    

  return <h2>Manage Terms</h2>;
}