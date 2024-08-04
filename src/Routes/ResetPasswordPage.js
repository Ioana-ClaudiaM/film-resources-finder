import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadingGif } from '../Components/Imports';
import '../Styles/ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const handleCloseModal = () => {
    setNewPassword('');
    setMessage('');
    navigate('/LogIn');
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ newPassword, token }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setFormVisible(false);
      }
    } catch (error) {
      console.error('Eroare la resetarea parolei:', error.message);
      setMessage('Eroare la resetarea parolei. Te rugăm să încerci din nou mai târziu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className='modal-container'>
        <div className='modal-content'>
          <button className='popup-button' onClick={handleCloseModal}>Închide</button>
          <h2>Pagina de resetare a parolei</h2>
          {loading && (
            <div className="loading-popup">
              <img src={loadingGif} alt="Încărcare..." />
            </div>
          )}
          {formVisible && !loading && (
            <form onSubmit={handleResetPassword} className='password-reset'>
              <label htmlFor="newPassword">Noua Parolă:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="submit">Resetare Parolă</button>
            </form>
          )}
          {message && !loading && (
            <div className='popup-mesaj'>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
