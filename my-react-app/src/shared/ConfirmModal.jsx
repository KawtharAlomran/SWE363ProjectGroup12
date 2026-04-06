export default function ConfirmModal({message,fileds,onConfirm,onCancel,  confirmText = 'Yes', 
  cancelText = 'No'} ){
    
    return(
        <div>
            <div>
                <p> {message} </p>
                <button onClick={onCancel}> ✕ </button>
                {fileds && (
                    <div>
                        {fileds.map(filed=> (<div key={filed.key}>
                            <label className="modal-label">{filed.label}</label>
                            <input type={filed.type || 'text' } placeholder={filed.placholder} onChange={e => filed.onChange(e.target.value)}/>
                            <div className="modal-actions">
                                <button className="modal-yes" onClick={onConfirm}>{confirmText}</button>
                                <button className="modal-no" onClick={onCancel}>{cancelText}</button>
                            </div>

        <div className="modal-actions">
          <button className="modal-yes" onClick={onConfirm}>{confirmText}</button>
          <button className="modal-no" onClick={onCancel}>{cancelText}</button>
        </div>

      </div>
    </div>
    </div>
    </div>
  );
}