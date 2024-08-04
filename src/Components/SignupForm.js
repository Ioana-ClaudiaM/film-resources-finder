import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/SignupForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupForm = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [successPopupVisible, setSuccessPopupVisible] = useState(false);
    const [errorPopupVisible, setErrorPopupVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [telefonError, setTelefonError] = useState('');
    const [localitateError, setLocalitateError] = useState('');
    const [judetError, setJudetError] = useState('');
    const [nume, setNume] = useState('');
    const [email, setEmail] = useState('');
    const [telefon, setTelefon] = useState('');
    const [parola, setParola] = useState('');
    const [confirmareParola, setConfirmareParola] = useState('');
    const [localitate, setLocalitate] = useState('');
    const [judet, setJudet] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [telefonTouched, setTelefonTouched] = useState(false);
    const [parolaTouched, setParolaTouched] = useState(false);
    const [confirmareParolaTouched, setConfirmareParolaTouched] = useState(false);
    const [localitateTouched, setLocalitateTouched] = useState(false);
    const [judetTouched, setJudetTouched] = useState(false);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPhoneNumberValid = (telefon) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(telefon);
    };

    const validateNume = (nume) => {
        return nume.trim() !== '';
    };

    const validateEmail = (email) => {
        setEmail(email);
        if (!isEmailValid(email)) {
            setEmailError('Adresa de email nu este validă.');
        } else {
            setEmailError('');
        }
    };

    const validateTelefon = (telefon) => {
        setTelefon(telefon);
        if (!isPhoneNumberValid(telefon)) {
            setTelefonError('Numărul de telefon nu este valid.');
        } else {
            setTelefonError('');
        }
    };

    const validateParola = (parola) => {
        setParola(parola);
        if (parola !== confirmareParola) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    };

    const validateConfirmareParola = (confirmareParola) => {
        setConfirmareParola(confirmareParola);
        if (parola !== confirmareParola) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    };

    const validateLocalitate = (localitate) => {
        setLocalitate(localitate);
        if (localitate.trim() === '') {
            setLocalitateError('Localitatea nu este validă.');
        } else {
            setLocalitateError('');
        }
    };

    const validateJudet = (judet) => {
        setJudet(judet);
        if (judet.trim() === '') {
            setJudetError('Județul nu este valid.');
        } else {
            setJudetError('');
        }
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        if (!selectedRole || !nume || !email || !telefon || !parola || !confirmareParola || !localitate || !judet) {
            setErrorMessage('Te rugăm să completezi toate câmpurile!');
            setErrorPopupVisible(true);
            return;
        }
        if (emailError || telefonError || passwordError || localitateError || judetError || !validateNume(nume)) {
            setErrorMessage('Verifică câmpurile introduse!');
            setErrorPopupVisible(true);
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/auth/SignUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nume, email, telefon, parola, localitate, judet, tip_utilizator: selectedRole }),
            });
            if (response.ok) {
                setSuccessMessage('Utilizator înregistrat cu succes!');
                setSuccessPopupVisible(true);
            } else {
                setErrorMessage('Eroare la înregistrare: ' + response.statusText);
                setErrorPopupVisible(true);
            }
        } catch (error) {
            setErrorMessage('Eroare la înregistrare: ' + error.message);
            setErrorPopupVisible(true);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className='signup-page'>
        <div className="blur-background" style={{ display: 'block' }}></div>
            <div className='signup'>
                <div className='img-signup'></div>
                <div className='formular-signup'>
                    <div className='signup-content'>
                        <h2 className='header-signup'>SIGN UP</h2>
                        <div className="tip-cont-signup">
                            <label htmlFor="tipContSelect">Alege tipul contului</label>
                            <select id="tipContSelect" value={selectedRole} onChange={handleRoleChange}>
                                <option value="">Selectează...</option>
                                <option value="actor">Actor</option>
                                <option value="producator">Producător</option>
                            </select>
                        </div>
                        <div className="nume-signup">
                            <label htmlFor="numeInput">Nume</label>
                            <input type="text" id="numeInput" value={nume} onChange={(e) => setNume(e.target.value)} />
                        </div>
                        <div className="email-signup">
                            <label htmlFor="emailInput1">Email</label>
                            <input type="text" id="emailInput1" value={email} 
                                   onChange={(e) => validateEmail(e.target.value)} 
                                   onBlur={() => setEmailTouched(true)} />
                            {emailTouched && emailError && <p className="error-message" style={{ color: 'red', marginBottom: '-10px' }}>{emailError}</p>}
                        </div>
                        <div className="telefon-signup">
                            <label htmlFor="telefonInput">Telefon</label>
                            <input type="text" id="telefonInput" value={telefon} 
                                   onChange={(e) => validateTelefon(e.target.value)} 
                                   onBlur={() => setTelefonTouched(true)} />
                            {telefonTouched && telefonError && <p className="error-message" style={{ color: 'red', marginBottom: '-10px' }}>{telefonError}</p>}
                        </div>
                        <div className="localitate-signup">
                            <label htmlFor="localitateInput">Localitate</label>
                            <input type="text" id="localitateInput" value={localitate} 
                                   onChange={(e) => validateLocalitate(e.target.value)} 
                                   onBlur={() => setLocalitateTouched(true)} />
                            {localitateTouched && localitateError && <p className="error-message" style={{ color: 'red', marginBottom: '-10px' }}>{localitateError}</p>}
                        </div>
                        <div className="judet-signup">
                            <label htmlFor="judetInput">Județ</label>
                            <input type="text" id="judetInput" value={judet} 
                                   onChange={(e) => validateJudet(e.target.value)} 
                                   onBlur={() => setJudetTouched(true)} />
                            {judetTouched && judetError && <p className="error-message" style={{ color: 'red', marginBottom: '-10px' }}>{judetError}</p>}
                        </div>
                        <div className="parola-signup">
                            <label htmlFor="parolaInput">Parolă</label>
                            <div className="password-input-container">
                                <input type={showPassword ? 'text' : 'password'} id="parolaInput" value={parola} 
                                       onChange={(e) => validateParola(e.target.value)} 
                                       onBlur={() => setParolaTouched(true)} />
                                <span className="eye-icon" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <div className="confirmareParola-signup">
                            <label htmlFor="confirmareParolaInput">Confirmare Parolă</label>
                            <input type="password" id="confirmareParolaInput" value={confirmareParola} 
                                   onChange={(e) => validateConfirmareParola(e.target.value)} 
                                   onBlur={() => setConfirmareParolaTouched(true)} />
                            {confirmareParolaTouched && passwordError && <p style={{ color: 'red' }}>Parolele nu corespund</p>}
                        </div>
                        <button className='buton-inregistrare' type="submit" onClick={handleSignup}>Înregistrează-te</button>
                        <div>
                            <p className='verificare-cont'>Ai deja un cont? <span><a href='/LogIn'>Conectează-te</a></span></p>
                        </div>
                    </div>
                </div>
            </div>
            <button className='inapoi-pe-homepage' onClick={handleBack}>Înapoi pe pagina principală</button>

            <div className='popup-container' style={{ display: popupVisible ? 'block' : 'none' }}>
                <div className='popup'>
                    <p>Te rugăm să completezi toate câmpurile!</p>
                    <button className='popup-button' onClick={() => setPopupVisible(false)}>Închide</button>
                </div>
            </div>

            <div className='popup-container' style={{ display: successPopupVisible ? 'block' : 'none' }}>
                <div className='popup'>
                    <p>{successMessage}</p>
                    <button className='popup-button' onClick={() => { setSuccessPopupVisible(false); navigate('/'); }}>Închide</button>
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

export default SignupForm;
