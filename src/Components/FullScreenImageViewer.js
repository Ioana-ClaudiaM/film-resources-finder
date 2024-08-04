import React from 'react';
import '../Styles/FullScreenImageViewer.css';

function FullScreenImageViewer({ isOpen, onClose, imageSrc, altText }) {
  if (!isOpen) return null;

  return (
    <div className="fullscreen-overlay" onClick={onClose}>
      <div className="fullscreen-content">
        <img src={imageSrc} alt={altText} />
      </div>
    </div>
  );
}

export default FullScreenImageViewer;
