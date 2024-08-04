import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import io from 'socket.io-client';
import { useParams, useLocation } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import '../Styles/AplicaRol.css';
import ActorAppBar from '../Components/ActorAppBar';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function AplicaRol() {
    const { titlu } = useParams();
    const [roluri, setRoluri] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [cvFile, setCVFile] = useState(null);
    const [projectLinks, setProjectLinks] = useState([]);
    const [username, setUsername] = useState('');
    const [id, setId] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [newRole, setNewRole] = useState({
        name: '',
        email: '',
        telefon: '',
        oras: ''
    });
    const [motivatie, setMotivatie] = useState('');
    const [raspuns1, setRaspuns1] = useState('');
    const [raspuns2, setRaspuns2] = useState('');
    const [currentSection, setCurrentSection] = useState('1');
    const [pdfBlob, setPdfBlob] = useState(null);
    const [showPdfPopup, setShowPdfPopup] = useState(false);
    const [socket, setSocket] = useState(null);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessageOpen, setSuccessMessageOpen] = useState(false);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const producerId = searchParams.get('producerId');

    useEffect(() => {
        const handleRememberMe = () => {
            let token = localStorage.getItem('token');
            if (!token) {
                token = sessionStorage.getItem('token');
            }
            if (token) {
                const decodedToken = jwtDecode(token);
                const { nume, id } = decodedToken;
                setUsername(nume);
                setId(id);
            }
        };
        handleRememberMe();

        const newSocket = io("http://localhost:8080");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [titlu]);

    const fetchRoles = async () => {
        try {
            const response = await fetch(`http://localhost:8080/movies/film/${titlu}/roluri`);
            const data = await response.json();
            setRoluri(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRole({
            ...newRole,
            [name]: value
        });
    };

    const handleCVUpload = (event) => {
        const file = event.target.files[0];
        setCVFile(file);
    };

    const handleProjectLinkChange = (index, event) => {
        const newLinks = [...projectLinks];
        newLinks[index] = event.target.value;
        setProjectLinks(newLinks);
    };

    const addProjectLink = () => {
        setProjectLinks([...projectLinks, '']);
    };

    const removeProjectLink = (index) => {
        const newLinks = [...projectLinks];
        newLinks.splice(index, 1);
        setProjectLinks(newLinks);
    };

    const handleError = (message) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
    };

    const sendNotification = async () => {
        const notificationData = {
            producerId: producerId,
            selectedRoleId: selectedRoleId,
            message: `${username} a aplicat pentru rolul ${selectedRoleId}. Verifică emailul pentru a vedea aplicarea.`
        };
        try {
            const response = await fetch('http://localhost:8080/sendNotification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notificationData),
            });

            if (!response.ok) {
                throw new Error('Failed to send notification');
            }
            socket.emit('applicationNotification', { username: username, selectedRoleId: selectedRoleId });
        } catch (error) {
            handleError('Error sending notification');
            console.error('Error sending notification:', error);
        }
    };

    const sendEmail = async () => {
        try {
            const formData = new FormData();
            formData.append('producerId', producerId);
            formData.append('cvFile', cvFile);
            formData.append('pdfBlob', pdfBlob);
            const response = await fetch('http://localhost:8080/roleapplication/send-aplicare', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Error sending email');
            }
        } catch (error) {
            handleError('Error sending email');
            console.error('Error sending email:', error);
            throw error; 
        }
    };

    const sendApplication = async () => {
        if (!cvFile) {
            handleError('CV-ul nu a fost atasat. Vă rugăm să încărcați CV-ul și să încercați din nou.');
            return;
        }
        try {
            
            const formData = new FormData();
            formData.append('producerId', producerId);
            formData.append('cvFile', cvFile);
            formData.append('pdfBlob', pdfBlob);
            const response = await fetch('http://localhost:8080/roleapplication/send-aplicare', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Error sending email');
            }
            sendEmail();
            sendNotification();

            const applicationData = {
                id_utilizator: id,
                rol: selectedRoleId,
                nume: newRole.name,
                status: 'În așteptare',
                producerId: producerId
            };
    
            const applicationResponse = await fetch('http://localhost:8080/roleapplication/submit-application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData)
            });
    
            if (!applicationResponse.ok) {
                throw new Error('Error submitting application');
            }
            
            setSuccessMessageOpen(true); 
        } catch (error) {
            handleError('Error sending application');
            console.error('Error submitting application:', error);
        }
    };
    
    const handleSuccessMessageClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSuccessMessageOpen(false);
      };

    const generateAndDisplayPDF = async () => {
        const pdfDoc = await generatePDF();
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        setPdfBlob(pdfBlob);
    };

    const generatePDF = async () => {
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);

        const fontBytes = await fetch('/fonts/Roboto-Regular.ttf').then(res => res.arrayBuffer());
        const customFont = await pdfDoc.embedFont(fontBytes);

        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        const margin = 50;
        const lineHeight = 20;
        let y = height - margin;

        const addText = (text, fontSize = 12) => {
            const lines = wordWrap(text, { width: width - margin * 2, font: customFont, fontSize });
            lines.forEach((line) => {
                if (y - lineHeight < margin) {
                    page = pdfDoc.addPage();
                    y = height - margin;
                }
                page.drawText(line, { x: margin, y: y - lineHeight, size: fontSize, font: customFont });
                y -= lineHeight;
            });
        };

        const title = `Aplicarea lui ${username} pentru rolul ${selectedRoleId}`;
        addText(title, 15);

        addText('Informatii personale:', 18);
        addText(`Nume: ${newRole.name}`);
        addText(`Email: ${newRole.email}`);
        addText(`Telefon: ${newRole.telefon}`);
        addText(`Oras: ${newRole.oras}`);

        addText('Motivatie:', 18);
        addText(motivatie);

        addText('Raspunsuri la intrebari:', 18);
        addText('1. De ce considerati ca sunteti potrivit pentru acest rol?');
        addText(raspuns1);
        addText('2. Care sunt cele mai mari contributii pe care le-ai putea aduce acestui proiect/film?');
        addText(raspuns2);

        const cvText = cvFile ? 'CV-ul a fost incarcat.' : 'CV-ul nu a fost incarcat.';
        addText('Status CV:', 18);
        addText(cvText);

        addText('Proiectele personale:', 18);
        if (projectLinks.length > 0) {
            projectLinks.forEach((link, index) => {
                addText(`${index + 1}. ${link}`);
            });
        } else {
            addText('Nu au fost incarcate proiecte personale.');
        }

        return pdfDoc;
    };

    const wordWrap = (text, options) => {
        const { width, font, fontSize } = options;
        const lines = [];
        let currentLine = '';
        const words = text.split(/\s+/);

        for (const word of words) {
            const wordWidth = font.widthOfTextAtSize(word, fontSize);
            const currentLineWidth = font.widthOfTextAtSize(currentLine, fontSize);

            if (word === '\n') {
                lines.push(currentLine.trim());
                currentLine = '';
            } else if (currentLineWidth + wordWidth < width) {
                currentLine += (currentLine.length > 0 ? ' ' : '') + word;
            } else {
                lines.push(currentLine.trim());
                currentLine = word;
            }
        }

        lines.push(currentLine.trim());
        return lines;
    };

    const openPdfPopup = () => {
        generateAndDisplayPDF();
        setShowPdfPopup(true);
    };

    const closePdfPopup = () => {
        setShowPdfPopup(false);
    };

    return (
        <div className='formular-aplicare'>
            <div className='formular-aplicare-film'>
                <ActorAppBar />
                <div className='header-aplicare-rol'>
                    <h1><span className='span-formular-rol'>Filmul</span> ales de tine pentru a aplica și a obține un <span className='span-formular-rol'>rol</span> în cadrul său este <br></br><span className='span-formular-titlu'>{titlu}</span>.</h1>
                    <h2> Completează <span className='span-formular-rol'>formularul</span> de mai jos pentru a trimite <span className='span-formular-rol'>aplicarea</span> ta producătorului. </h2>
                </div>
                <form className='formular-rol'>
                    <div className='buttons-section-rol'>
                        <div className='button-title-section'>
                            <button type='button' className={`section-button ${currentSection === '1' ? 'active' : ''}`} onClick={() => setCurrentSection('1')} data-section="1">
                                {currentSection === '1' ? <span>&#10003;</span> : '1'} </button>
                            Informatii personale
                        </div>
                        <div className={`line-${currentSection === '1' ? 'active' : ''}`} data-section="1"></div>
                        <div className='button-title-section'>
                            <button type='button' className={`section-button ${currentSection === '2' ? 'active' : ''}`} onClick={() => setCurrentSection('2')} data-section="2">
                                {currentSection === '2' ? <span>&#10003;</span> : '2'} </button>
                            Motivatia alegerii rolului selectat anterior
                        </div>
                        <div className={`line-${currentSection === '2' ? 'active' : ''}`} data-section="2"></div>
                        <div className='button-title-section'>
                            <button type='button' className={`section-button ${currentSection === '3' ? 'active' : ''}`} onClick={() => setCurrentSection('3')} data-section="3">
                                {currentSection === '3' ? <span>&#10003;</span> : '3'} </button>
                            Încarcare CV si proiecte personale
                        </div>
                    </div>
                    {currentSection === '1' && (
                        <div className='formular-rol-section'>
                            <p className='paragraf-motivatie'>Introduceti detaliile despre dumneavoastra in câmpurile de mai jos:</p>
                            <div className='sections-formular-rol'>
                                <div className='form-section-rol'>
                                    <div className='form-section-1'>
                                        <TextField
                                            className='textfield-formular'
                                            id="nume"
                                            label="Nume complet"
                                            variant="outlined"
                                            value={newRole.name}
                                            onChange={handleInputChange}
                                            name="name"
                                            required={true}
                                            InputLabelProps={{
                                                style: { color: '#e1c84a' }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#ccc',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#ccc',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#e1c84a',
                                                    },
                                                },
                                            }}
                                        />
                                        <TextField
                                            className='textfield-formular'
                                            id="email"
                                            label="Email"
                                            variant="outlined"
                                            value={newRole.email}
                                            onChange={handleInputChange}
                                            name="email"
                                            color='success'
                                            required={true}
                                            InputLabelProps={{
                                                style: { color: '#e1c84a' }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#ccc',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#ccc',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#e1c84a',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className='form-section-2'>
                                        <TextField
                                            className='textfield-formular'
                                            id="telefon"
                                            label="Numar de telefon"
                                            variant="outlined"
                                            value={newRole.telefon}
                                            onChange={handleInputChange}
                                            name="telefon"
                                            color='success'
                                            required={true}
                                            InputLabelProps={{
                                                style: { color: '#e1c84a' }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#ccc',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#ccc',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#e1c84a',
                                                    },
                                                },
                                            }}
                                        />
                                        <TextField
                                            className='textfield-formular'
                                            id="oras"
                                            label="Oras"
                                            variant="outlined"
                                            value={newRole.oras}
                                            onChange={handleInputChange}
                                            name="oras"
                                            color='success'
                                            required={true}
                                            InputLabelProps={{
                                                style: { color: '#e1c84a' }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#ccc',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#ccc',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#e1c84a',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='form-section-rol'>
                                    <p className='paragraf-motivatie'>Selectează rolul pentru care dorești să aplici:</p>
                                    <div className='rol-bifa-container'>
                                        {roluri.map((rol) => (
                                            <div key={rol.id_rol} className='rol-bifa'>
                                                <label htmlFor={rol.id_rol}>{rol.titlu}</label>
                                                <input
                                                    type="checkbox"
                                                    id={rol.id_rol}
                                                    name={rol.titlu}
                                                    onChange={() => setSelectedRoleId(rol.titlu)}
                                                    checked={selectedRoleId === rol.titlu}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr></hr>
                            <div className='buttons-form'>
                                <button className='mai-departe' onClick={() => setCurrentSection(String(Number(currentSection) + 1))}>Mai departe</button>
                            </div>
                        </div>
                    )}

                    {currentSection === '2' && (
                        <div className='formular-rol-section'>
                            <p className='paragraf-motivatie'>Motivatia personala pentru rolul selectat:</p>
                            <textarea
                                className='introducere-motivatie'
                                value={motivatie}
                                onChange={(e) => setMotivatie(e.target.value)}
                            ></textarea>
                            <div className='intrebari-specifice'>
                                <p>De ce considerati ca sunteti potrivit pentru acest rol?</p>
                                <textarea
                                    className='introducere-motivatie'
                                    value={raspuns1}
                                    onChange={(e) => setRaspuns1(e.target.value)}
                                ></textarea>
                                <p>Care sunt cele mai mari contributii pe care le-ai putea aduce acestui proiect/film?</p>
                                <textarea
                                    className='introducere-motivatie'
                                    value={raspuns2}
                                    onChange={(e) => setRaspuns2(e.target.value)}
                                ></textarea>
                            </div>
                            <div className='buttons-form'>
                                <button onClick={() => setCurrentSection(String(Number(currentSection) - 1))}>Înapoi</button>
                                <button onClick={() => setCurrentSection(String(Number(currentSection) + 1))}>Mai departe</button>
                            </div>
                        </div>
                    )}

                    {currentSection === '3' && (
                        <div className='formular-rol-section'>
                            <p className='paragraf-motivatie'>Încarcati mai jos CV-ul dumneavoastra:</p>
                            <div className='incarcare-cv'>
                                <input type="file" accept=".pdf,.doc,.docx" onChange={handleCVUpload} />
                                {cvFile && (
                                    <div>
                                        <CloudUploadIcon onClick={() => setShowPopup(true)} />
                                        <span onClick={() => setShowPopup(true)}> Vizualizeaza fisierul incarcat</span>
                                    </div>
                                )}
                                {showPopup && (
                                    <>
                                        <div className="blur-background" style={{ display: 'block' }}></div>
                                        <div className="popup" style={{ display: 'block', width: '80%', maxWidth: '600px' }}>
                                            <div className="popup-content">
                                                <span className="close-popup" onClick={() => setShowPopup(false)}>&times;</span>
                                                <embed src={URL.createObjectURL(cvFile)} type="application/pdf" width="100%" height="600px" />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {showPdfPopup && pdfBlob && (
                                    <>
                                        <div className="blur-background" style={{ display: 'block' }}></div>
                                        <div className="popup" style={{ display: 'block', width: '80%', maxWidth: '600px' }}>
                                            <div className="popup-content">
                                                <span className="close-popup" onClick={closePdfPopup}>&times;</span>
                                                <embed src={URL.createObjectURL(pdfBlob)} type="application/pdf" width="100%" height="600px" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='incarcare-linkuri'>
                                <p className='paragraf-motivatie'> Încarcati mai jos link-uri ale proiectelor personale:</p>
                                <div className='linkuri'>
                                    {projectLinks.map((link, index) => (
                                        <div key={index}>
                                            <input type="text" value={link} onChange={(e) => handleProjectLinkChange(index, e)} />
                                            <button type='button' className='delete-link-button' onClick={() => removeProjectLink(index)}>x Șterge</button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className='add-link-button' onClick={addProjectLink}>+ Adauga Link</button>
                            </div>
                            <p className='info-cv-pdf'>Pentru a converti informațiile din întregul formular într-un fișier PDF care să reprezinte profilul dumneavoastră
                                de candidat, apăsați pe 'Vizualizează PDF' pentru a putea vedea fișierul creat, ca ulterior acesta să fie trimis împreună
                                cu CV-ul către producător.
                            </p>
                            <div className='buttons-form-final'>
                                <button onClick={() => setCurrentSection(String(Number(currentSection) - 1))}>Înapoi</button>
                                <button type="button" onClick={openPdfPopup}>Vizualizează PDF-ul</button>
                                <button type="button" onClick={sendApplication}>Aplică</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
            <Snackbar open={successMessageOpen} autoHideDuration={6000} onClose={handleSuccessMessageClose}>
        <Alert onClose={handleSuccessMessageClose} severity="success" sx={{ width: '100%' }}>
          Aplicarea a fost trimisă cu succes!
        </Alert>
      </Snackbar>
        </div>
    );
}

export default AplicaRol;
