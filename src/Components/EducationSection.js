import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faPlus, faTimes, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import iconEducatie from '../Styles/Icons/mortarboard.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const EducationSection = ({ educations, setEducation, id }) => {
    const [isEditingEducation, setIsEditingEducation] = useState(false);
    const [newEducationType, setNewEducationType] = useState('');
    const [newEducationName, setNewEducationName] = useState('');
    const [newEducationLocation, setNewEducationLocation] = useState('');
    const [newEducationStartYear, setNewEducationStartYear] = useState('');
    const [newEducationEndYear, setNewEducationEndYear] = useState('');
    const [newEducationDescription, setNewEducationDescription] = useState('');
    const [successMessageOpen, setSuccessMessageOpen] = useState(false);

    const years = [];
  for (let i = 1950; i <= 2030; i++) {
    years.push(i);
  }
  years.push('Prezent');

    const handleEditEducation = () => setIsEditingEducation(true);

    const handleAddEducation = () => {
        if (newEducationType && newEducationName && newEducationLocation && newEducationDescription && newEducationStartYear && newEducationEndYear) {
            const newEdu = {
                type: newEducationType.trim(),
                name: newEducationName.trim(),
                location: newEducationLocation.trim(),
                description: newEducationDescription.trim(),
                startYear: newEducationStartYear.trim(),
                endYear: newEducationEndYear.trim(),
                period: `${newEducationStartYear} - ${newEducationEndYear}`,
            };

           const isDuplicate = educations.some(education =>
                education.name === newEdu.name &&
                education.startYear === newEdu.startYear &&
                education.endYear === newEdu.endYear
            );

            if (!isDuplicate) {
                setEducation([...educations, newEdu]);
                setNewEducationType('');
                setNewEducationName('');
                setNewEducationLocation('');
                setNewEducationDescription('');
                setNewEducationStartYear('');
                setNewEducationEndYear('');
                setSuccessMessageOpen(true); 
            } else {
                alert('This education entry already exists.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleDeleteEducation = async (name) => {
        try {
            const response = await fetch('http://localhost:8080/education/delete-education', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) throw new Error('Network response for delete education was not ok.');

            setEducation(educations.filter(education => education.name !== name));
        } catch (error) {
            console.error('Eroare la ștergerea educației:', error);
        }
    };

    const saveEducationsToServer = async () => {
        setIsEditingEducation(false);
        try {
            const response = await fetch('http://localhost:8080/education/add-educations-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, educations }),
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
            <h2 className='section-title'><img className='icon' src={iconEducatie} alt="IconEducatie" />Educație</h2>
            {isEditingEducation ? (
                <div>
                    <div className="add-education-form">
                        <div className='inputs-education'>
                            <select className='input-education1' value={newEducationType} onChange={(e) => setNewEducationType(e.target.value)}>
                                <option value="">Selectează tipul ultimei instituții absolvite</option>
                                <option value="Liceu">Liceu</option>
                                <option value="Școală profesională">Școală profesională</option>
                                <option value="Universitate">Universitate</option>
                            </select>
                            <input className='input-education' type="text" placeholder="Denumirea instituției" value={newEducationName} onChange={(e) => setNewEducationName(e.target.value)} />
                            <input className='input-education' type="text" placeholder="Locul" value={newEducationLocation} onChange={(e) => setNewEducationLocation(e.target.value)} />
                            <select className='input-education1' value={newEducationStartYear} onChange={(e) => setNewEducationStartYear(e.target.value)}>
                                <option value="">Alege anul de început</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <select className='input-education1' value={newEducationEndYear} onChange={(e) => setNewEducationEndYear(e.target.value)}>
                                <option value="">Alege anul de sfârșit</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <input className='input-education' type="text" placeholder="Descrierea educației" value={newEducationDescription} onChange={(e) => setNewEducationDescription(e.target.value)} />
                        </div>
                        <button className='add-education-button' onClick={handleAddEducation}>
                            <FontAwesomeIcon icon={faPlus} /> Adaugă educație
                        </button>
                        <ul className='lista-educatie-afisate'>
                            {educations.map((edu, index) => (
                                <li key={index}>
                                    <div className='education-details'>
                                        <strong>{edu.type}</strong> - {edu.name} - {edu.location} - {edu.period}
                                        <span className="delete-icon" onClick={() => handleDeleteEducation(edu.name)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={saveEducationsToServer} className='save-education-button'>
                        <FontAwesomeIcon icon={faCheck} /> Salvează
                    </button>
                </div>
            ) : (
                <div>
                    <div className='container-section'>
                        {educations.length > 0 ? (
                            <ul className='lista-educatie-afisate'>
                                {educations.map((edu, index) => (
                                    <li key={index}>
                                        <div className='education-details'>
                                            <strong><FontAwesomeIcon icon={faBuildingColumns} className="bullet-icon" />
                                                <span className='education-period'>{edu.period} </span>
                                            </strong>
                                            <strong className='education-type'>{edu.type} - <span className='education-name'> {edu.name}</span> - <span className='education-location'>{edu.location}</span></strong>
                                        </div>
                                        <p className='education-description'>{edu.description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-education-message">Nu ai adăugat încă nicio educație. Adaugă una apăsând pe butonul de mai jos.</p>
                        )}
                    </div>
                    <button className='edit-education-button' onClick={() => setIsEditingEducation(true)}>
                        <FontAwesomeIcon icon={faPencilAlt} /> Editează
                    </button>
                </div>
            )}
            <Snackbar open={successMessageOpen} autoHideDuration={6000} onClose={handleSuccessMessageClose}>
                <Alert onClose={handleSuccessMessageClose} severity="success" sx={{ width: '100%' }}>
                    Educația a fost adăugată/salvată cu succes!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EducationSection;
