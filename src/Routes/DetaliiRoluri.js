import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/DetaliiRoluri.css';
import ActorAppBar from '../Components/ActorAppBar';

function DetaliiRoluri() {
  const [roluri, setRoluri] = useState([]);
  const { filmId } = useParams();

  useEffect(() => {
    const fetchRoluri = async () => {
      try {
        const response = await fetch(`http://localhost:8080/roles/get-roluri/${filmId}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setRoluri(data);
          } else if (data !== null && typeof data === 'object') {
            setRoluri([data]); 
          } else {
            console.error('Unexpected response format:', data);
          }
        } else {
          console.error('Eroare la obținerea listei de roluri');
        }
      } catch (error) {
        console.error('Eroare la comunicarea cu serverul:', error);
      }
    };
    fetchRoluri();
  }, [filmId]);

  console.log(roluri);
  return (
    <div className="detalii-roluri">
          <ActorAppBar></ActorAppBar>
      <h1 className="header">Detalii despre roluri</h1>
      <ul className="list">
        {roluri.map((rol) => (
          <div className='container'>
          <li key={rol.id_rol} className="listItem">
            <div className="details-title"><strong>Titlu:</strong> {rol.titlu}</div>
            <div className="details-text"><strong>Sex:</strong> {rol.sex}</div>
            <div className="details-text"><strong>Varsta:</strong> {rol.varsta}</div>
            <div className="details-text"><strong>Experienta:</strong> {rol.experienta}</div>
            <div className="details-text"><strong>Etnie:</strong> {rol.etnie}</div>
            <div className="details-text description"><strong>Descriere:</strong> {rol.descriere}</div>
          </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default DetaliiRoluri;
