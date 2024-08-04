import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import UserDetailsForm from './UserDetailsForm';
import iconDescriere from '../Styles/Icons/description.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import '../Styles/DescriptionSection.css'; 

const DescriptionSection = ({ description, setDescription, id }) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  const handleEditDescription = () => setIsEditingDescription(true);
  const handleChangeDescription = (event) => setDescription(event.target.value);

  const saveDescriptionToServer = async () => {
    setIsEditingDescription(false);
    try {
      const data = { id, description };
      const response = await fetch('http://localhost:8080/description/update-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Network response was not ok.');
      setSuccessMessageOpen(true); // Deschide Snackbar-ul
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleSuccessMessageClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessageOpen(false);
  };

  return (
    <div className='container-section'>
      <h2 className='section-title'><img className='icon' src={iconDescriere} alt="IconDescriere" />Despre mine</h2>
      {isEditingDescription ? (
        <div className='editing-description'>
          <textarea className='introducere-descriere' value={description} onChange={handleChangeDescription} />
          <button onClick={saveDescriptionToServer} className='save-description-button'>
            <FontAwesomeIcon icon={faCheck} /> Salvează
          </button>
        </div>
      ) : (
        <div className='description-content'>
          <p className='afisare-descriere'>{description}</p>
          {!description && !isEditingDescription && (
            <p className='alert-descriere'>Nu ai adăugat încă nicio descriere. Adaugă una apăsând pe butonul de mai jos.</p>
          )}
          <button className='edit-description-button' onClick={handleEditDescription}>
            <FontAwesomeIcon icon={faPencilAlt} /> Editează
          </button>
        </div>
      )}
      <UserDetailsForm />
      <Snackbar open={successMessageOpen} autoHideDuration={6000} onClose={handleSuccessMessageClose}>
        <Alert onClose={handleSuccessMessageClose} severity="success" sx={{ width: '100%' }}>
          Descrierea a fost salvată cu succes!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DescriptionSection;
