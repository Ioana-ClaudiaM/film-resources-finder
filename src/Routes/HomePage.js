import React, { useState, useEffect, useRef } from 'react';
import ResponsiveAppBar from '../Components/AppBar';
import { useNavigate } from 'react-router-dom';
import '../Styles/HomePage.css';
import icon1 from '../Styles/Icons/icon1.png';
import icon2 from '../Styles/Icons/icon2.png';
import icon3 from '../Styles/Icons/icon3.png';
import casting from '../Styles/Icons/casting.png';
import drama from '../Styles/Icons/drama.png';
import schedule from '../Styles/Icons/schedule.png';
import cinema from '../Styles/Icons/cinema.png';
import planner from '../Styles/Icons/planner.png';
import offer from '../Styles/Icons/offer.png';
import Carousel from '../Components/Carousel';
import FunctionalCard from '../Components/FunctionalCard';
import FAQ from '../Components/FAQ';
import Footer from '../Components/Footer';
import UserMap from '../Components/UserMap';

const HomePage = () => {
  const navigate = useNavigate();
  const contentRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const tokenLS = localStorage.getItem('token');
    const tokenSS = sessionStorage.getItem('token');
    setIsLoggedIn(!!tokenLS || !!tokenSS);
  }, []);

  const parseToken = (token) => {
    const userData = token ? JSON.parse(atob(token.split('.')[1])) : null;
    return userData;
  };

  const handleRedirectToAccount = () => {
    const userTokenLS = localStorage.getItem('token');
    const userDataLS = parseToken(userTokenLS);

    const userTokenSS = sessionStorage.getItem('token');
    const userDataSS = parseToken(userTokenSS);

    if ((userDataLS && userDataLS.tip_utilizator) || (userDataSS && userDataSS.tip_utilizator)) {
      if (userDataLS && userDataLS.tip_utilizator === 'Actor' || userDataSS && userDataSS.tip_utilizator === 'Actor') {
        navigate('/Actor');
      } else if (userDataLS && userDataLS.tip_utilizator === 'Producator' || userDataSS && userDataSS.tip_utilizator === 'Producator') {
        navigate('/Producator');
      }
    } else {
      navigate('/Login');
    }
  };

  const handleClick = (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      const targetId = event.target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='homepage'>
      <ResponsiveAppBar navigate={navigate} />
      <div className='landing-page'>
        <div ref={contentRef}>
          <h1>Film Resources Finder</h1>
          <p>Intră în lumea cinematografiei și conectează-te ca actor sau producător!</p>
          <button className='intra-in-cont' onClick={handleRedirectToAccount}>Intră în cont</button>
        </div>
      </div>
      <UserMap></UserMap>
      <div className='descopera'> Descoperă principalele caracteristici ale platformei!</div>
      <div className="cartonase-container">
        <div className="cartonas cartonas-1">
          <div className='header-cartonas'>
            <div className='icon'>
              <img className='img-icon-cartonas' src={icon3} alt="Icon3" />
            </div>
            <div className='title1'>Descoperă scopul platformei</div>
          </div>
          <div className='content-cartonas'>
            <div className='paragraph1'>Scopul platformei presupune găsirea rapidă și eficientă a resurselor esențiale pentru
               producția cinematografică. De la costume la echipe profesioniste, platforma conectează producătorii cu case de 
               modă, studiouri și actori talentați. Explorează oferte variate și personalizează-ți echipa pentru a obține cele
                mai bune rezultate în realizarea filmelor tale.</div>
          </div>
        </div>
        <div className="cartonas cartonas-2">
          <div className='header-cartonas'>
            <div className='icon'>
              <img className='img-icon-cartonas' src={icon2} alt="Icon2" />
            </div>
            <div className='title2'>Contribuie la economia cinematografică</div>
          </div>
          <div className='content-cartonas'>
            <div className='paragraph2'>Optimizarea producțiilor cinematografice se realizează reducând costurile găsirii 
              resurselor. Prin conexiuni rapide, sprijină eficiența financiară și stimulează economiile locale prin colaborare
               regională, generând venituri și minimizând riscurile financiare. O soluție esențială pentru producătorii ce caută
                eficiență în industria cinematografică.</div>
          </div>
        </div>
        <div className="cartonas cartonas-3">
          <div className='header-cartonas'>
            <div className='icon'>
              <img className='img-icon-cartonas' src={icon1} alt="Icon1" />
            </div>
            <div className='title3'>Află beneficiile site-ului</div>
          </div>
          <div className='content-cartonas'>
            <div className='paragraph3'>Principalele beneficii presupun economisirea timpului și efortului prin acces rapid la 
              resurse, eficiența financiară prin conexiuni rapide cu profesioniști de încredere, stimularea colaborărilor creative
               și promovarea eficientă a proiectelor, precum și reducerea riscurilor financiare prin identificarea rapidă a 
               resurselor potrivite.</div>
            </div>
          </div>
        </div>
         <div className='cine-suntem'>
        <h1 className='homepage-header3' id='cineSuntemNoi'>Cine suntem noi?</h1>
        <div className='about-us'>
          <span className='span-about-us'>Film Resources Finder</span> este inima unei comunități unde pasiunea pentru cinema și inovația se întâlnesc
          pentru a oferi actorilor și producătorilor accesul la <span className='span-about-us'>resurse</span> esențiale de producție. Echipa noastră,
          alcătuită din <span className='span-about-us'>profesioniști</span> dedicați, facilitează conectarea talentelor și eficientizează
          colaborările.<br></br>  <span className='span-about-us'>Aici poți personaliza echipa de producție, de la actori la locații de filmare,
          transformând viziunea ta cinematografică în realitate.</span><br></br> Descoperă prin imaginile
          de mai jos o parte a echipei noastre, cum simplificăm procesul creativ și cum te sprijinim în realizarea proiectelor tale cinematografice.
        </div>
      </div>
      <Carousel/>
      <div className='content2'>
        <h1 className='homepage-header2' id='cumFunctioneaza'>Ce funcționalități are platforma?</h1>
        <div className='functionalities'>
          <div className='functionalities-list'>
            <FunctionalCard
              icon={casting}
              title="Căutare Castinguri"
              description="Acces la o listă de proiecte și castinguri la care pot aplica, filtrate după criterii precum locația, tipul rolului, genul filmului etc."
            />
            <FunctionalCard
              icon={drama}
              title="Aplicare pentru Roluri"
              description="Capacitatea de a trimite aplicații direct producătorilor, împreună cu CV-ul și materialele de prezentare."
            />
            <FunctionalCard
              icon={schedule}
              title="Gestionare Agenda"
              description="Acces la un calendar pentru a urmări programările, auditiile, și alte evenimente importante."
            />
            <FunctionalCard
              icon={cinema}
              title="Postare Proiecte"
              description="Capacitatea de a posta noi proiecte, descriind detaliat nevoile de casting, locațiile, costumele, și alți parametri specifici."
            />
            <FunctionalCard
              icon={planner}
              title="Organizare Producție"
              description="Acces la instrumente pentru planificarea locațiilor, gestionarea costumelor, stabilirea programului de repetiții, și comunicarea planurilor către echipă."
            />
            <FunctionalCard
              icon={offer}
              title="Căutare Resurse"
              description="Utilizarea platformei pentru a găsi oferte pentru locații, costume, echipă de sunet și imagine, bazate pe preferințele specificate."
            />
          </div>
        </div>
      </div>
      <FAQ />
      <Footer handleClick={handleClick} />
    </div>
  );
};

export default HomePage;
