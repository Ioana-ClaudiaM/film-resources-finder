import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import ProducatorAppBar from '../Components/ProducatorAppBar';
import { MdCheckCircleOutline, MdCancel } from 'react-icons/md';
import '../Styles/AplicariActor.css';
import { io } from 'socket.io-client';

function AplicariActori() {
  const STATUS_APLICARE = {
    TRIMISA: 'Trimisa',
    ACCEPTATA: 'Acceptata',
    RESPINSA: 'Respinsa',
    VIZUALIZATA: 'Vizualizata'
  };

  const [aplicari, setAplicari] = useState([]);
  const [socket, setSocket] = useState(null);
  const [id, setProducerId] = useState('');
  const [producerName, setProducerName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAplicare, setSelectedAplicare] = useState(null);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [selectedAplicareDetails, setSelectedAplicareDetails] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    location: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setProducerName(decodedToken.nume);
    }

    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    newSocket.on('notification', (notification) => {
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const fetchAplicariActori = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          return;
        }
        const decodedToken = jwtDecode(token);
        const { nume } = decodedToken;
        const { id } = decodedToken;
        setProducerId(id);
        const response = await fetch(`http://localhost:8080/roleapplication/get-aplicari-actor/${nume}`);
        if (response.ok) {
          const data = await response.json();
          setAplicari(data);
        } else {
          console.error('Eroare la obținerea datelor aplicărilor actorului:', response.status);
        }
      } catch (error) {
        console.error('Eroare la obținerea datelor aplicărilor actorului:', error);
      }
    };

    fetchAplicariActori();
  }, []);

  const sendActorNotification = async (actorId, message) => {
    try {
      await fetch('http://localhost:8080/sendNotificationActor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actorId, message }),
      });

      if (socket) {
        socket.emit('applicationNotification', { actorId, message });
      }
    } catch (error) {
      console.error('Eroare la trimiterea notificării către actor:', error);
    }
  };

  const handleAccept = async (index) => {
    try {
      const updatedAplicari = [...aplicari];
      updatedAplicari[index].status = STATUS_APLICARE.ACCEPTATA;
      setAplicari(updatedAplicari);

      const aplicareId = aplicari[index].id_aplicare;
      const actorId = aplicari[index].id_utilizator;
      const producerId = id;
      const id_film = aplicari[index].film_id;
      const id_rol = aplicari[index].role_id;

      await fetch(`http://localhost:8080/roleapplication/update-aplicare-status/${aplicareId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: STATUS_APLICARE.ACCEPTATA })
      });

      await sendActorNotification(actorId, `Producătorul ${producerName} ți-a marcat aplicarea pentru rolul ${aplicari[index].rol} ca Acceptată.`);
      
      setSelectedAplicare({ ...updatedAplicari[index], producerId, actorId, id_film, id_rol });
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Eroare la actualizarea statusului și trimiterea notificării către actor:', error);
    }
  };

  const handleReject = async (index) => {
    try {
      const updatedAplicari = [...aplicari];
      updatedAplicari[index].status = STATUS_APLICARE.RESPINSA;
      setAplicari(updatedAplicari);

      const aplicareId = aplicari[index].id_aplicare;
      const actorId = aplicari[index].id_utilizator;

      await fetch(`http://localhost:8080/roleapplication/update-aplicare-status/${aplicareId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: STATUS_APLICARE.RESPINSA })
      });

      await sendActorNotification(actorId, `Producătorul ${producerName} ți-a marcat aplicarea pentru rolul ${aplicari[index].rol} ca Respinsă.`);
    } catch (error) {
      console.error('Eroare la actualizarea statusului și trimiterea notificării către actor:', error);
    }
  };

  const handleViewDetails = async (index) => {
    try {
      const updatedAplicari = [...aplicari];
      updatedAplicari[index].status = STATUS_APLICARE.VIZUALIZATA;
      setAplicari(updatedAplicari);

      const aplicareId = aplicari[index].id_aplicare;
      const actorId = aplicari[index].id_utilizator;

      await fetch(`http://localhost:8080/roleapplication/update-aplicare-status/${aplicareId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: STATUS_APLICARE.VIZUALIZATA })
      });

      await sendActorNotification(actorId, `Producătorul ${producerName} ți-a marcat aplicarea pentru rolul ${aplicari[index].rol} ca Vizualizată.`);

      setSelectedAplicareDetails(aplicari[index]);
      setIsDetailsPopupOpen(true);
    } catch (error) {
      console.error('Eroare la actualizarea statusului și trimiterea notificării către actor:', error);
    }
  };

  const handleScheduleEvent = async () => {
    try {
      const { location, date, time, notes } = eventDetails;
      const { id_aplicare, producerId, actorId, id_film, id_rol } = selectedAplicare;
      const response = await fetch('http://localhost:8080/roleapplication/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aplicare_id: id_aplicare,
          location,
          date,
          time,
          notes,
          actor_id: actorId,
          producer_id: producerId,
          type: 'Interviu',
          id_film,
          id_rol
        })
      });

      if (response.ok) {
        console.log('Eveniment programat cu succes.');
        setIsPopupOpen(false);
      } else {
        console.error('Eroare la programarea evenimentului.');
      }
    } catch (error) {
      console.error('Eroare la programarea evenimentului:', error);
    }
  };

  return (
    <div className='aplicari'>
      <ProducatorAppBar notifications={notifications} />
      <div className='container-aplicari'>
        <h1 className='header-aplicari'>Aplicările actorilor</h1>
        <div className="aplicari-container">
          {aplicari.map((aplicare, index) => (
            <div className="card-aplicare" key={index}>
              <div className='content-card'>
                <h3>Nume candidat: <span className='span-card-aplicare'> <Link to={`/ActorProfile/${aplicare.id_utilizator}`} className='info-film'>
                  {aplicare.nume_utilizator}
                </Link> </span> </h3>
                <h4>Film: <span className='span-card-aplicare'>{aplicare.titlu_film}</span> </h4>
                <h4>Rolul ales: <span className='span-card-aplicare'>{aplicare.rol}</span></h4>
                <p>Statusul aplicării: <span className={`status-aplicare ${aplicare.status.toLowerCase()}`}>{aplicare.status}</span></p>
                <div className='buttons-aplicari'>
                  <button className='vezi-detalii-aplicare-actor' onClick={() => handleViewDetails(index)}>Vezi detalii</button>
                  <MdCheckCircleOutline className='accept-icon' onClick={() => handleAccept(index)} />
                  <MdCancel className='reject-icon' onClick={() => handleReject(index)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isDetailsPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Detalii Aplicare</h2>
              <button onClick={() => setIsDetailsPopupOpen(false)}>&times;</button>
            </div>
            <div className="popup-body">
              {selectedAplicareDetails && (
                <>
                  <p><strong>Nume candidat:</strong> {selectedAplicareDetails.nume_utilizator}</p>
                  <p><strong>Film:</strong> {selectedAplicareDetails.titlu_film}</p>
                  <p><strong>Rolul ales:</strong> {selectedAplicareDetails.rol}</p>
                  <p><strong>Statusul aplicării:</strong> {selectedAplicareDetails.status}</p>
                  <p><strong>Producător:</strong> {selectedAplicareDetails.nume_producator}</p>
                  <p><strong>Data înregistrării:</strong> {selectedAplicareDetails.data_inregistrare}</p>
                  <p><strong>Data rezoluției:</strong> {selectedAplicareDetails.data_rezolutie || 'N/A'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Programează un interviu</h2>
              <button onClick={() => setIsPopupOpen(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleScheduleEvent(); }}>
              <div className="popup-body">
                <label>
                  Locație:
                  <input type="text" value={eventDetails.location} onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })} required />
                </label>
                <label>
                  Data:
                  <input type="date" value={eventDetails.date} onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })} required />
                </label>
                <label>
                  Ora:
                  <input type="time" value={eventDetails.time} onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })} required />
                </label>
                <label>
                  Detalii:
                  <textarea value={eventDetails.notes} onChange={(e) => setEventDetails({ ...eventDetails, notes: e.target.value })}></textarea>
                </label>
              </div>
              <div className="popup-footer">
                <button type="submit">Programează</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AplicariActori;
