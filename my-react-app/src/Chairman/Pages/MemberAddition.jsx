export default function AddModal({ message, fileds, onConfirm, onCancel, confirmText = 'Add', errorMessage }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onCancel}>✕</button>
        

        {message && <p className="modal-text">{message}</p>}

        <div className="modal-content-box">
          {fileds && (
            <div className="modal-fields">
              {fileds.map(filed => (
                <div key={filed.name} className="modal-field">
                  <label className="modal-label">{filed.label}</label>
                  <input 
                    className="modal-input" 
                    type={filed.type || 'text'} 
                    placeholder={filed.placeholder} 
                    onChange={e => filed.onChange(e.target.value)} 
                  />
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button className="modal-yes" onClick={onConfirm}>
              {confirmText}
            </button>
            </div>
            {errorMessage && (
                <p style={{color: 'red', marginTop: '10px', fontSize: '14px' }}>
                    {errorMessage}
                </p>
            )}
          
        </div>
      </div>
    </div>
  );
}