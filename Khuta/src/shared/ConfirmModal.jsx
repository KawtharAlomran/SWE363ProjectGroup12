export default function ConfirmModal({ message, fileds, onConfirm, onCancel, confirmText = 'Yes', cancelText = 'No', errorMessage }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {message && <p className="modal-text">{message}</p>}
        <button className="modal-close" onClick={onCancel}>✕</button>

        {fileds && (
          <div className="modal-fields">
            {fileds.map(filed => (
              <div key={filed.name} className="modal-field">
                <label className="modal-label">{filed.label}</label>
                {filed.type === "textarea" ? (<textarea className="modal-input" placeholder={filed.placeholder} onChange={e => filed.onChange(e.target.value)}/>)
                : filed.type === "radio" ? (<div className="modal-radio-group"> {filed.options.map(option => (<label key={option.value} className="modal-radio"> <input type="radio" name={filed.name} value={option.value} onChange={() => filed.onChange(option.value)}/>{option.label}</label>))}</div>) 
                :(<input className="modal-input" type={filed.type || 'text'} placeholder={filed.placeholder} onChange={e => filed.onChange(e.target.value)} />)
                }
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-yes" onClick={onConfirm}>{confirmText}</button>
          <button className="modal-no" onClick={onCancel}>{cancelText}</button>
        </div>
        {errorMessage && (
                <p style={{color: 'red', marginTop: '10px', fontSize: '14px' }}>
                    {errorMessage}
                </p>
            )}

      </div>
    </div>
  );
}