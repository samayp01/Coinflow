import React from 'react';
import '../../style/ConfirmationDialog.css';

function ConfirmationDialog({ message, onConfirm, onCancel }) {

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="form-popup-overlay">
      <div className="form-popup">
        <h2>Confirm</h2>
        <p>{message}</p>
        <div className="button-group">
          <button className="confirm-button" onClick={handleConfirm}>
            Yes
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;