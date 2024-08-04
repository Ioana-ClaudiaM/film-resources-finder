import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ActorAppBar from '../Components/ActorAppBar';
import '../Styles/ListaFilme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faFileAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ButonInimioara from '../Components/ButonInimioară';

function ListaFilme() {
  const [filme, setFilme] = useState([]);
  const [filmeFiltrate, setFilmeFiltrate] = useState([]);

  const fetchProducerName = async (id_producator, film) => {
    try {
      const response = await fetch(`http://localhost:8080/producers/get-producer-name/${id_producator}`);
      if (response.ok) {
        const data = await response.json();
        const producerName = data.producerNume;
        return { ...film, producator: producerName };
      } else {
        console.error('Eroare la obținerea numelui producătorului');
        return { ...film, producator: 'N/A' };
      }
    } catch (error) {
      console.error('Eroare la comunicarea cu serverul:', error);
      return { ...film, producator: 'N/A' };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/movies/get-filme');
        if (response.ok) {
          const data = await response.json();
          const filmeCuProducatoriPromises = data.map(async (film) => {
            return await fetchProducerName(film.id_producator, film);
          });

          const filmeCuProducatori = await Promise.all(filmeCuProducatoriPromises);
          setFilme(filmeCuProducatori);
          setFilmeFiltrate(filmeCuProducatori);
        } else {
          console.error('Eroare la obținerea listei de filme');
        }
      } catch (error) {
        console.error('Eroare la comunicarea cu serverul:', error);
      }
    };

    fetchData();
  }, []);

 

  return (
    <div className='film-list-container'>
      <ActorAppBar />
      <div className='lista-filme-postate'>
        <div className='container-filme'>
          <h1>Lista de filme în cadrul căreia puteți aplica pentru un rol</h1>
          <p className='filme-paragraph'>Mai jos regăsiți filmele postate de către diverși producători pentru care puteți aplica apăsând pe "Aplică pentru un rol." .
            De asemenea, puteți vizualiza detaliile despre roluri apăsând pe "Vezi detalii roluri.".
          </p>
          <div className="card-container">
            {filmeFiltrate.map((film) => (
              <div className='filme' key={film.id_film}>
                <div className='film-card-list'>
                  <div className='content-lista-filme'>
                    <h2>
                      <span className='span-card-film'>{film.titlu}</span>
                    </h2>
                    <p className='film-description'>{film.descriere}</p>
                    <p className='info-film'>Gen: <span className='span-card-film'>{film.gen.toUpperCase()}</span></p>
                    <p className='info-film'> Producător: <Link to={`/ProducatorProfile/${film.id_producator}`} className='info-film'>
                      <span className='span-card-film'>{film.producator}</span>
                    </Link></p>
                  </div>
                  <div className='buttons-film'>
                    <div className='button-with-tooltip'>
                      <ButonInimioara className='buton-inimioara' filmTitlu={film.titlu} producerId={film.id_producator} filmId={film.id_film} />
                      <span className='tooltiptext'>Apreciază filmul</span>
                    </div>
                    <div className='button-with-tooltip'>
                      <Link className='depune-cv' to={`/aplicarol/${encodeURIComponent(film.titlu)}?producerId=${film.id_producator}`}>
                        <FontAwesomeIcon icon={faFileAlt} className='icon debug-icon' />
                      </Link>
                      <span className='tooltiptext'>Aplică pentru un rol</span>
                    </div>
                    <div className='button-with-tooltip'>
                      <Link to={`/detalii-roluri/${film.id_film}`} className='vezi-detalii-btn'>
                        <FontAwesomeIcon icon={faInfoCircle} className='icon debug-icon' />
                      </Link>
                      <span className='tooltiptext'>Vezi detalii despre roluri</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListaFilme;
