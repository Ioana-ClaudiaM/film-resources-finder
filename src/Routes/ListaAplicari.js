import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ActorAppBar from '../Components/ActorAppBar';
import '../Styles/ListaAplicari.css';

function ListaAplicari() {
  const [aplicari, setAplicari] = useState([]);
  const [id_utilizator, setId] = useState('');

  const handleRememberMe = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      token = sessionStorage.getItem('token');
    }
    if (token) {
      const decodedToken = jwtDecode(token);
      const { id } = decodedToken;
      setId(id);
    }
  };

  useEffect(() => {
    handleRememberMe();
  }, []);

  useEffect(() => {
    const fetchAplicari = async () => {
      try {
        const response = await fetch(`http://localhost:8080/roleapplication/get-aplicari/${id_utilizator}`);
        if (response.ok) {
          const data = await response.json();
          setAplicari(data);
          console.log(aplicari);
        } else {
          console.error('Eroare la obținerea datelor aplicărilor:', response.status);
        }
      } catch (error) {
        console.error('Eroare la obținerea datelor aplicărilor:', error);
      }
    };

    fetchAplicari();
  }, [id_utilizator]);

  return (
    <div>
      <ActorAppBar />
      <div className='container-aplicari'>
        <h1 className='header-aplicari'>Lista aplicărilor pentru roluri</h1>
        <p className='paragraf-aplicari'>Mai jos regăsiți lista cu aplicările dumneavoastră unde puteți vedea detalii despre acestea.</p>
        <div className="aplicari-container">
          {aplicari.map((aplicare, index) => (
            <div className="card-aplicare" key={index}>
              <h2>Film: <span className='span-card-aplicare'>{aplicare.titlu_film} </span> </h2>
              <h2>Rolul ales: <span className='span-card-aplicare'>{aplicare.rol}</span></h2>
              <h6>
                Nume producător: 
                <Link to={`/producator-profile/${aplicare.id_producator}`} className='span-card-aplicare'>
                  {aplicare.nume_producator}
                </Link>
              </h6>
              <h6>Data aplicării: <span className='span-card-aplicare'>{aplicare.data_inregistrare}</span></h6>
              <p>Statusul aplicării: <span className='status-aplicare'>{aplicare.status}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListaAplicari;
