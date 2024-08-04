import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../Components/ForgotPasswordForm';
import '../Styles/LoginForm.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [parola, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
    const [successPopupVisible, setSuccessPopupVisible] = useState(false);
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!email || !parola) {
            setErrorMessage('Adresa de email sau parola nu sunt completate.');
            setErrorPopupVisible(true);
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ email, parola }),
            });

            const data = await response.json();
            if (response.ok) {
                if (rememberMe) {
                    localStorage.setItem('token', data.token);
                } else {
                    sessionStorage.setItem('token', data.token);
                }
                const parseToken = (token) => {
                    const userData = token ? JSON.parse(atob(token.split('.')[1])) : null;
                    return userData;
                };
                const userTokenLS = localStorage.getItem('token');
                const userDataLS = parseToken(userTokenLS);
                const userTokenSS = sessionStorage.getItem('token');
                const userDataSS = parseToken(userTokenSS);
                if ((userDataLS && userDataLS.tip_utilizator) || (userDataSS && userDataSS.tip_utilizator)) {
                    setSuccessMessage('Autentificare cu succes!');
                    setSuccessPopupVisible(true);
                    setTimeout(() => {
                        if ((userDataLS && userDataLS.tip_utilizator === 'Actor') || (userDataSS && userDataSS.tip_utilizator === 'Actor')) {
                            navigate('/Actor');
                        } else if ((userDataLS && userDataLS.tip_utilizator === 'Producator') || (userDataSS && userDataSS.tip_utilizator === 'Producator')) {
                            navigate('/Producator');
                        }
                    }, 2000);
                }
            } else {
                setErrorMessage('Adresa de email sau parola greșită.');
                setErrorPopupVisible(true);
            }
        } catch (error) {
            console.error('Eroare la autentificare:', error.message);
            setErrorMessage('Eroare la autentificare.');
            setErrorPopupVisible(true);
        }
    };

    const handleResetPassword = () => {
        setResetPasswordModalVisible(true);
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className='login-page'>
        <div className="blur-background" style={{ display: 'block' }}></div>
            <div className='login'>
                <div className='img-login'></div>
                <div className='formular-login'>
                    <div className='login-content'>
                        <h2 className='header-login'>LOG IN</h2>
                        <div className="email-login">
                            <label htmlFor="emailInput1">Email</label>
                            <input type="text" id="emailInput1" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="parola-login">
                            <label htmlFor="passwordInput">Parolă</label>
                            <input type="password" id="passwordInput" value={parola} onChange={(e) => setPassword(e.target.value)} />
                            <p>Ai uitat parola? <span onClick={handleResetPassword}>Resetare parolă</span></p>
                        </div>
                        <div className='conectare'>
                            <button className='buton-inregistrare' type="button" onClick={handleLogin}>
                                Conectează-te
                            </button>
                            <div className='remember-me'>
                                <label htmlFor="rememberMe">Ține-mă minte!</label>
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                            </div>
                        </div>
                        <div>
                            <p>Nu ai un cont? <span><a href='/SignUp'>Înregistrează-te</a></span></p>
                        </div>
                    </div>
                </div>
            </div>
            <button className='inapoi-pe-homepage' onClick={handleBack}>Înapoi pe pagina principală</button>
            <div className='popup-container' style={{ display: popupVisible ? 'block' : 'none' }}>
                <div className='popup'>
                    <p>Adresa de email sau parola greșită.</p>
                    <button className='popup-button' onClick={() => setPopupVisible(false)}>Închide</button>
                </div>
            </div>
            {resetPasswordModalVisible && (
                <div className='modal-container'>
                    <div className='modal-content'>
                        <button className='popup-button' onClick={() => setResetPasswordModalVisible(false)}>Închide</button>
                        <ForgotPasswordForm />
                    </div>
                </div>
            )}
            <div className='popup-container' style={{ display: successPopupVisible ? 'block' : 'none' }}>
                <div className='popup'>
                    <p>{successMessage}</p>
                    <button className='popup-button' onClick={() => setSuccessPopupVisible(false)}>Închide</button>
                </div>
            </div>

            <div className='popup-container' style={{ display: errorPopupVisible ? 'block' : 'none' }}>
                <div className='popup'>
                    <p>{errorMessage}</p>
                    <button className='popup-button' onClick={() => setErrorPopupVisible(false)}>Închide</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
