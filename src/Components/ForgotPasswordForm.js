import { useState } from 'react';
import { loadingGif } from './Imports';
import '../Styles/ForgotPasswordForm.css';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formVisible, setFormVisible] = useState(true);

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
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
        <div className='forgot-password-form'>
                                <h2>Resetare Parolă</h2>
            {loading && (
                <div className="loading-popup">
                    <img src={loadingGif} alt="Încărcare..." />
                </div>
            )}
            {formVisible && !loading && (
                <div>
                    <form onSubmit={handleResetPassword}>
                        <div className="email-reset">
                            <label htmlFor="emailInput">Introduceți adresa de email asociată contului:</label>
                            <input type="email" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button type="submit">Trimite Cerere</button>
                    </form>
                </div>
            )}
            {message && (
                <div className='popup-mesaj'>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordForm;
