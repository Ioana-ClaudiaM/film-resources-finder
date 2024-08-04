import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import iconLimbi from '../Styles/Icons/languages.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const LanguagesSection = ({ id }) => {
  const [languages, setLanguages] = useState([]);
  const [isEditingLanguages, setIsEditingLanguages] = useState(false);
  const [newLanguageName, setNewLanguageName] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState('');
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/languages/get-languages/${id}`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        setLanguages(data.languages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, [id]);

  const handleEditLanguages = () => setIsEditingLanguages(true);

  const handleAddLanguage = () => {
    if (newLanguageName && newLanguageLevel) {
      const newLanguage = { name: newLanguageName.trim(), level: parseInt(newLanguageLevel.trim(), 10) };
      setLanguages(prevLanguages => [...prevLanguages, newLanguage]);
      setNewLanguageName('');
      setNewLanguageLevel('');
      setSuccessMessageOpen(true); 
    }
  };

  const handleDeleteLanguage = async (name) => {
    try {
      const response = await fetch('http://localhost:8080/languages/delete-language', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Network response for delete language was not ok.');

      setLanguages(prevLanguages => prevLanguages.filter(language => language.name !== name));
    } catch (error) {
      console.error('Error deleting language:', error);
    }
  };

  const saveLanguagesToServer = async () => {
    setIsEditingLanguages(false);
    try {
      const response = await fetch('http://localhost:8080/languages/add-languages-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, languages }),
      });

      if (!response.ok) throw new Error('Network response was not ok.');
      setSuccessMessageOpen(true); 
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
      <h2 className='section-title'><img className='icon' src={iconLimbi} alt="IconLimbi" />Limbi străine</h2>
      {isEditingLanguages ? (
        <div className='container-limbi'>
          <div className='introducere-limbi'>
            <h2 className='introduceti-limba'>Introduceți o limbă străină</h2>
            <div className='inputs-limbi'>
              <p className='text-limba'>Introduceți denumirea limbii:</p>
              <input className='input-limba' type="text" value={newLanguageName} onChange={(e) => setNewLanguageName(e.target.value)} placeholder="Numele limbii" />
              <p className='text-limba'>Introduceți nivelul de cunoaștere al limbii:</p>
              <input className='input-limba' type="number" value={newLanguageLevel} onChange={(e) => setNewLanguageLevel(e.target.value)} placeholder="Nivelul de cunoștințe (0-100)" />
            </div>
            <button className='add-language-button' onClick={handleAddLanguage}> <FontAwesomeIcon icon={faPlus} /> Adaugă limbă</button>
            <h2 className='limbi-adaugate'>Limbi străine adăugate</h2>
            <ul className='lista-limbi-introducere'>
              {languages.map((language, index) => (
                <li className='lista-limbi' key={index}>
                  <strong>{language.name}</strong>
                  <CircularProgressWithLabel value={language.level} />
                  <span className="delete-icon" onClick={() => handleDeleteLanguage(language.name)}> <FontAwesomeIcon icon={faTimes} /></span>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={saveLanguagesToServer} className='save-language-button'>
            <FontAwesomeIcon icon={faCheck} /> Salvează
          </button>
        </div>
      ) : (
        <div>
          <div className='container-section'>
            {languages.length > 0 ? (
              <div className='afisare-limbi'>
                <ul className='lista-limbi-afisare'>
                  {languages.map((language, index) => (
                    <li className='lista-limbi' key={index}>
                      <strong className='nume-limba'>{language.name}</strong>
                      <CircularProgressWithLabel value={language.level} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className='alert-limbi'>Nu ai adăugat încă nicio limbă străină. Adaugă una apăsând pe butonul de mai jos.</p>
            )}
          </div>
          <button className='edit-language-button' onClick={handleEditLanguages}>
            <FontAwesomeIcon icon={faPencilAlt} /> Editează
          </button>
        </div>
      )}
      <Snackbar open={successMessageOpen} autoHideDuration={6000} onClose={handleSuccessMessageClose}>
        <Alert onClose={handleSuccessMessageClose} severity="success" sx={{ width: '100%' }}>
          Limba străină a fost adăugată/salvată cu succes!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LanguagesSection;
