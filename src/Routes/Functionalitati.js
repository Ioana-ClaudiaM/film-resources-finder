import React, { useState } from 'react';
import ResponsiveAppBar from '../Components/AppBar';
import { useNavigate } from 'react-router-dom';
import '../Styles/Functionalitati.css';
import { useLocation} from 'react-router-dom';

const Functionalitati = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = () => {
    navigate('/');
  };

  return (
    <div className='functionalitati'>
      <ResponsiveAppBar navigate={navigate} />
      <div className="functionalitati-container">
        <div className="coloana1">
          <div className="functionalitati-section">
            <h3>Pentru actorii în căutare de oportunități:</h3>
            <p className='paragraf-actori'>Creare cont personalizat:</p>
            <ul>
              <li>Alegeți tipul de cont "Actor" și completați detaliile necesare.</li>
              <li>Primiți acces la o varietate de oportunități în industria cinematografică.</li>
            </ul>
            <p className='paragraf-actori'>Explorare roluri disponibile:</p>
            <ul>
              <li>Descoperiți filme în căutare de actori și aplicați pentru rolurile care vă interesează.</li>
              <li>Monitorizați-vă starea aplicațiilor și primiți feedback rapid.</li>
            </ul>
            <p className='paragraf-actori'>CV și Portofoliu:</p>
            <ul>
              <li>Creați un CV online detaliat pentru a vă evidenția experiența și talentele.</li>
              <li>Construiți un portofoliu de succes pentru a impresiona producătorii.</li>
            </ul>
            <p className='paragraf-actori'>Interacțiune directă:</p>
            <ul>
              <li>Conectași-vă cu producătorii și echipele de filmare direct de pe platformă.</li>
              <li>Primiți invitații la interviuri și audieri.</li>
            </ul>
          </div>
        </div>

        <div className="coloana2">
          <div className="functionalitati-section">
            <h3>Pentru producătorii în căutare de talente și resurse:</h3>
            <p className='paragraf-producatori'>Creare cont personalizat:</p>
            <ul>
              <li>Alegeți tipul de cont "Producător" și completați detaliile necesare.</li>
              <li>Beneficiași de facilități adaptate nevoilor producției tale.</li>
            </ul>
            <p className='paragraf-producatori'>Postare proiecte:</p>
            <ul>
              <li>Detaliați filmele și postați proiecte în căutare de actori și resurse.</li>
              <li>Primiți aplicații de la actori interesați și echipe profesioniste.</li>
            </ul>
            <p className='paragraf-producatori'>Căutare de resurse:</p>
            <ul>
              <li>Explorați CV-urile actorilor, spațiile pentru filmare, echipele de filmare și sonorizare disponibile și casele de modă.</li>
              <li>Alegeți-vă resursele potrivite pentru proiecte.</li>
            </ul>
            <p className='paragraf-producatori'>Rezultate personalizate:</p>
            <ul>
              <li>Obțineți rezultate personalizate și oferte adaptate nevoilor de care dispuneți.</li>
              <li>Simplificați procesul de producție și maximizeați calitatea proiectelor postate.</li>
              </ul>
            </div>
        </div>
      </div>
      <button onClick={handleButtonClick} className="arrow-button1">
          Înapoi pe pagina principală<span className="arrow"></span>
        </button>
  </div>
  );
};

export default Functionalitati;
