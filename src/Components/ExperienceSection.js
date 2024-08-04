import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faPlus, faTimes, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import iconExperienta from '../Styles/Icons/portfolio.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ExperienceSection = ({ id }) => {
  const [experiences, setExperiences] = useState([]);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [newExperienceTitle, setNewExperienceTitle] = useState('');
  const [newExperienceStartYear, setNewExperienceStartYear] = useState('');
  const [newExperienceEndYear, setNewExperienceEndYear] = useState('');
  const [newExperienceLocation, setNewExperienceLocation] = useState('');
  const [newExperienceDescription, setNewExperienceDescription] = useState('');
  const [error, setError] = useState('');
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  const years = [];
  for (let i = 1950; i <= 2030; i++) {
    years.push(i);
  }
  years.push('Prezent');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`http://localhost:8080/experiences/get-experiences/${id}`);
        const data = await response.json();
        if (response.ok) {
          console.log('Experiences fetched:', data.experiences); 
          setExperiences(data.experiences);
        } else {
          console.error('Error fetching experiences:', data.error);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    };

    fetchExperiences();
  }, [id]);

  const handleEditExperience = () => setIsEditingExperience(true);

  const handleAddExperience = () => {
    if (newExperienceTitle && newExperienceStartYear && newExperienceEndYear && newExperienceLocation && newExperienceDescription) {
      if (newExperienceStartYear <= newExperienceEndYear || newExperienceEndYear === 'Prezent') {
        const newExperience = {
          id: new Date().getTime().toString(),
          title: newExperienceTitle.trim(),
          startYear: newExperienceStartYear,
          endYear: newExperienceEndYear,
          location: newExperienceLocation.trim(),
          description: newExperienceDescription.trim(),
        };

        const duplicate = experiences.find(exp => 
          exp.title === newExperience.title &&
          exp.startYear === newExperience.startYear &&
          exp.endYear === newExperience.endYear &&
          exp.location === newExperience.location &&
          exp.description === newExperience.description
        );

        if (!duplicate) {
          setExperiences([...experiences, newExperience]);
          setNewExperienceTitle('');
          setNewExperienceStartYear('');
          setNewExperienceEndYear('');
          setNewExperienceLocation('');
          setNewExperienceDescription('');
          setError('');
          setSuccessMessageOpen(true);
        } else {
          setError('Experiența există deja.');
        }
      } else {
        setError('Anul de început trebuie să fie mai mic sau egal cu anul de sfârșit.');
      }
    } else {
      setError('Toate câmpurile sunt obligatorii.');
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      const response = await fetch('http://localhost:8080/experiences/delete-experience', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: experienceId }),
      });

      if (response.ok) {
        setExperiences(experiences.filter(exp => exp.id !== experienceId));
      } else {
        console.error('Network response for delete experience was not ok.');
      }
    } catch (error) {
      console.error('Eroare la ștergerea experienței:', error);
    }
  };

  const saveExperiencesToServer = async () => {
    setIsEditingExperience(false);
    try {
      const response = await fetch('http://localhost:8080/experiences/add-experiences-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, experiences }),
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
      <h2 className='section-title'><img className='icon' src={iconExperienta} alt="IconExperienta" />Experiența</h2>
      {isEditingExperience ? (
        <div className='experiences-section'>
          <div className='introducere-experiente'>
            <div className='inputs-experience'>
              <input className='input-experience' type="text" placeholder="Numele job-ului" value={newExperienceTitle} onChange={(e) => setNewExperienceTitle(e.target.value)} />
              <input className='input-experience' type="text" placeholder="Numele locatiei" value={newExperienceLocation} onChange={(e) => setNewExperienceLocation(e.target.value)} />
              <select className='input-experience1' value={newExperienceStartYear} onChange={(e) => setNewExperienceStartYear(e.target.value)}>
                <option value="">Alege anul de început</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select className='input-experience1' value={newExperienceEndYear} onChange={(e) => setNewExperienceEndYear(e.target.value)}>
                <option value="">Alege anul de sfârșit</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {error && <p className="error-message">{error}</p>}
              <input className='input-experience' type="text" placeholder="Descrierea job-ului" value={newExperienceDescription} onChange={(e) => setNewExperienceDescription(e.target.value)} />
            </div>
            <button className='add-experience-button' onClick={handleAddExperience}>
              <FontAwesomeIcon icon={faPlus} /> Adaugă experiență
            </button>
            <ul className='afisare-experiente'>
              <h2>Lista experiențelor</h2>
              {experiences.map((experience) => (
                <li key={experience.id}>
                  <div className='experience-details'>
                    <strong>{experience.title}</strong> - {experience.description} 
                    <span className="delete-icon" onClick={() => handleDeleteExperience(experience.id)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={saveExperiencesToServer} className='save-experience-button'>
            <FontAwesomeIcon icon={faCheck} /> Salvează
          </button>
        </div>
      ) : (
        <div>
          {!experiences.length ? (
            <p className='alert-experienta'>Nu ai adăugat încă nicio experiență. Adaugă una apăsând pe butonul de mai jos.</p>
          ) : (
            <div className='container-section'>
              <ul className='lista-experiente-afisate'>
                {experiences.map((experience) => (
                  <li key={experience.id}>
                    <div className='experience-details'>
                      <strong>
                        <FontAwesomeIcon icon={faBriefcase} className="bullet-icon" />
                        <span className='experience-period'> {experience.startYear} - {experience.endYear}</span>
                      </strong>-<strong className='experience-title'>{experience.title} - <span className='experience-location'>{experience.location}</span></strong>
                    </div>
                    <p className='experience-description'>{experience.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className='edit-experience-button' onClick={handleEditExperience}>
            <FontAwesomeIcon icon={faPencilAlt} /> Editează
          </button>
        </div>
      )}
      <Snackbar open={successMessageOpen} autoHideDuration={6000} onClose={handleSuccessMessageClose}>
        <Alert onClose={handleSuccessMessageClose} severity="success" sx={{ width: '100%' }}>
          Experiența a fost adăugată/salvată cu succes!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ExperienceSection;
