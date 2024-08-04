import React from 'react'

const ErrorPopup = ({ message, onClose }) => {
    return (
        <div className="error-popup">
            <div className="popup-content">
                <p>{message}</p>
                <button onClick={onClose}>Închide</button>
            </div>
        </div>
    );
};

export default ErrorPopup
