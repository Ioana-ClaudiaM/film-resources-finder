import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import iconSkills from '../Styles/Icons/creative-thinking.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SkillsSection = ({ id }) => {
  const [skills, setSkills] = useState([]);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('');
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`http://localhost:8080/skills/get-skills/${id}`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        setSkills(data.skills);
      } catch (error) {
        console.error('Eroare la preluarea skill-urilor:', error);
      }
    };

    fetchSkills();
  }, [id]);

  const handleEditSkills = () => setIsEditingSkills(true);

  const handleAddSkill = () => {
    if (newSkillName && newSkillLevel) {
      const newSkill = { name: newSkillName.trim(), level: parseInt(newSkillLevel.trim()) };
      setSkills([...skills, newSkill]);
      setNewSkillName('');
      setNewSkillLevel('');
      setSuccessMessageOpen(true); 
    }
  };

  const handleDeleteSkill = async (name) => {
    try {
      const response = await fetch('http://localhost:8080/skills/delete-skill', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Network response for delete skill was not ok.');

      setSkills(skills.filter(skill => skill.name !== name));
    } catch (error) {
      console.error('Eroare la ștergerea skill-ului:', error);
    }
  };

  const saveSkillsToServer = async () => {
    setIsEditingSkills(false);
    try {
      const response = await fetch('http://localhost:8080/skills/add-skills-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, skills }),
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
      <h2 className='section-title'><img className='icon' src={iconSkills} alt="IconSkills" />Skill-urile mele</h2>
      {isEditingSkills ? (
        <div>
          <div className='introducere-skilluri'>
            <h2 className='introduceti-skill'>Introduceți un skill</h2>
            <div className='inputs-skills'>
              <p className='text-skill'>Introduceți denumirea abilității:</p>
              <input className='input-skill' type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="Numele skill-ului" />
              <p className='text-skill'>Introduceți nivelul de cunoaștere al abilității:</p>
              <input className='input-skill' type="number" value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value)} placeholder="Nivelul de cunoștințe (0-100)" />
            </div>
          </div>
          <button className='add-skill-button' onClick={handleAddSkill}> <FontAwesomeIcon icon={faPlus} />Adaugă skill</button>
          <div className='afisare-skilluri'>
            <h2 className='skilluri-adaugate'>Skill-urile adăugate</h2>
            <ul className='lista-skilluri-introducere'>
              {skills.map((skill, index) => (
                <li className='lista-skilluri' key={index}>
                  <strong>{skill.name}</strong>
                  <CircularProgressWithLabel value={skill.level} />
                  <span className="delete-icon" onClick={() => handleDeleteSkill(skill.name)}> <FontAwesomeIcon icon={faTimes} /></span>
                </li>
              ))}
            </ul>
            <button onClick={saveSkillsToServer} className='save-skill-button'>
              <FontAwesomeIcon icon={faCheck} /> Salvează
            </button>
          </div>
        </div>
      ) : (
        <div className='container-section'>
          {skills.length > 0 ? (
            <div className='afisare-skilluri'>
              <ul className='lista-skilluri-afisare'>
                {skills.map((skill, index) => (
                  <li className='lista-skilluri' key={index}>
                    <strong className='nume-skill'>{skill.name}</strong>
                    <CircularProgressWithLabel value={skill.level} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className='alert-skills'>Nu ai adăugat încă niciun skill. Adaugă unul apăsând pe butonul de mai jos.</p>
          )}
        </div>
      )}
      <button className='edit-skill-button' onClick={handleEditSkills}>
        <FontAwesomeIcon icon={faPencilAlt} /> Editează
      </button>
      <Snackbar open={successMessageOpen} autoHideDuration={6000} onClose={handleSuccessMessageClose}>
        <Alert onClose={handleSuccessMessageClose} severity="success" sx={{ width: '100%' }}>
          Skill-ul a fost adăugat/salvat cu succes!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SkillsSection;
