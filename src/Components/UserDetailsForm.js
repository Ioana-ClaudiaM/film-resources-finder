import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import iconInformatii from '../Styles/Icons/description.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {jwtDecode} from 'jwt-decode';

function UserDetailsForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [id, setIdUtilizator] = useState('');
  const [formData, setFormData] = useState({
    nume: '',
    telefon: '',
    varsta: '',
    adresa: '',
    ani_experienta: '',
    titlu_job: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  const handleRememberMe = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const { nume, id } = decodedToken;
      setUsername(nume);
      setIdUtilizator(id);
    }
  };

  const fetchDataFromServer = async (userId) => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:8080/userdetails/get-user-details/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      setFormData(data.userDetails);
    } catch (error) {
      console.error('There was a problem fetching user details from the server:', error);
    }
  };

  useEffect(() => {
    handleRememberMe();
  }, []);

  useEffect(() => {
    if (id) {
      fetchDataFromServer(id);
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let errorMessage = '';

    switch (name) {
      case 'nume':
        if (value.trim().length < 3) {
          errorMessage = 'Numele trebuie să conțină cel puțin 3 caractere.';
        }
        break;
      case 'telefon':
        if (!(/^\d{10}$/).test(value)) {
          errorMessage = 'Telefonul trebuie să conțină 10 cifre.';
        }
        break;
      case 'varsta':
        if (!(/^\d+$/).test(value)) {
          errorMessage = 'Vârsta trebuie să fie un număr întreg pozitiv.';
        }
        break;
      case 'adresa':
        if (value.trim().length < 5) {
          errorMessage = 'Adresa trebuie să conțină cel puțin 5 caractere.';
        }
        break;
      case 'ani_experienta':
        if (!(/^\d+$/).test(value)) {
          errorMessage = 'Anii de experiență trebuie să fie un număr întreg pozitiv.';
        }
        break;
      case 'titlu_job':
        break;
      default:
        break;
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveFormDataToServer = async () => {
    setIsEditing(false);
    try {
      const response = await fetch(`http://localhost:8080/userdetails/update-user-details/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      setSuccessMessageOpen(true);
      console.log('Detaliile utilizatorului au fost actualizate cu succes!');
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

  const handleEdit = () => setIsEditing(true);
  const handleAddInfo = () => setIsEditing(true);

  return (
    <div>
      <div className='container-section'>
        <h2 className='section-title'><img className='icon' src={iconInformatii} alt="IconInformatii"/>Informații utile</h2>
        {!isEditing ? (
          (formData.nume || formData.telefon || formData.varsta || formData.adresa || formData.ani_experienta || formData.titlu_job) ? (
            <div className="user-details-text">
              <div className="form-columns">
                <div className="form-column1">
                  <p><strong>Nume:</strong> <span className='detalii-formular'>{formData.nume}</span></p>
                  <p><strong>Telefon:</strong> <span className='detalii-formular'>{formData.telefon}</span></p>
                  <p><strong>Vârstă:</strong> <span className='detalii-formular'>{formData.varsta}</span></p>
                </div>
                <div className="form-column">
                  <p><strong>Adresă:</strong> <span className='detalii-formular'>{formData.adresa}</span></p>
                  <p><strong>Ani de experiență:</strong> <span className='detalii-formular'>{formData.ani_experienta}</span></p>
                  <p><strong>Jobul actual:</strong><span className='detalii-formular'>{formData.titlu_job}</span> </p>
                </div>
              </div>
            </div>
            
          ) : (
            <div>
              <p>Nu ai adăugat încă nicio informație. Apasă pe butonul de mai jos pentru a adăuga una.</p>
              <button className="edit-button-details" onClick={handleAddInfo}> <FontAwesomeIcon icon={faPlus} /> Adaugă informații</button>
            </div>
          )
        ) : (
          <div>
            <div className="user-details-form">
              <form>
                <div className="form-columns">
                  <div className="form-column1">
                    <label>Nume:</label>
                    <input type="text" name="nume" value={formData.nume} onChange={handleChange} />
                    {errors.nume && <p className="error-message">{errors.nume}</p>}
                    <label>Telefon:</label>
                    <input type="text" name="telefon" value={formData.telefon} onChange={handleChange} />
                    {errors.telefon && <p className="error-message">{errors.telefon}</p>}
                    <label>Vârsta:</label>
                    <input type="text" name="varsta" value={formData.varsta} onChange={handleChange} />
                    {errors.varsta && <p className="error-message">{errors.varsta}</p>}
                  </div>
                  <div className="form-column">
                    <label>Adresă:</label>
                    <input type="text" name="adresa" value={formData.adresa} onChange={handleChange} />
                    {errors.adresa && <p className="error-message">{errors.adresa}</p>}
                    <label>Ani de experiență:</label>
                    <input type="text" name="ani_experienta" value={formData.ani_experienta} onChange={handleChange} />
                    {errors.ani_experienta && <p className="error-message">{errors.ani_experienta}</p>}
                    <label>Jobul actual:</label>
                    <input type="text" name="titlu_job" value={formData.titlu_job} onChange={handleChange} />
                    {errors.titlu_job && <p className="error-message">{errors.titlu_job}</p>}
                  </div>
                </div>
              </form>
            </div>
            <button className="save-button-details" onClick={saveFormDataToServer}> <FontAwesomeIcon icon={faCheck} /> Salvează</button>
          </div>
        )}
      </div>
      <button className="edit-button-details" onClick={handleEdit}> <FontAwesomeIcon icon={faPencilAlt} /> Editează</button>
      <Snackbar open={successMessageOpen} autoHideDuration={6000} onClose={handleSuccessMessageClose}>
        <Alert onClose={handleSuccessMessageClose} severity="success" sx={{ width: '100%' }}>
          Detaliile personale au fost salvate cu succes!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UserDetailsForm;
