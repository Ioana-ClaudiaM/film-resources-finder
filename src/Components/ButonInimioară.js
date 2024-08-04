import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

function ButonInimioară({ producerId,filmTitlu,filmId }) {
  const [apreciat, setApreciat] = useState(false);
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const localStorageToken = localStorage.getItem('token');
    const sessionStorageToken = sessionStorage.getItem('token');
  
    if (localStorageToken) {
      const decodedToken = jwtDecode(localStorageToken);
      const { nume } = decodedToken;
      setUsername(nume);
    } else if (sessionStorageToken) {
      const decodedToken = jwtDecode(sessionStorageToken);
      const { nume } = decodedToken;
      setUsername(nume);
    }
  }, []);
  

  useEffect(() => {
    const newSocket = io("http://localhost:8080");    
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleNotification = () => {
    if (isFetching) return;
    setIsFetching(true);
    if (!apreciat) {
      const notificationData = {
        producerId: producerId,
        filmTitlu: filmTitlu,
        message: `${username} ți-a apreciat postarea despre filmul ${filmTitlu}.`
      };
      fetch('http://localhost:8080/sendNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      })
      .then(response => {
        if (response.ok) {
          setApreciat(true); 
        } else {
          console.error('Failed to send notification');
        }
      })
      .then(response => {
        if (response.ok) {
          console.log('Like and notification sent successfully');
        } else {
          console.error('Failed to send like');
        }
      })
      .catch(error => {
        console.error('Error sending notification or like:', error);
      })
      .finally(() => {
        setIsFetching(false);
      });
      socket.emit('likeNotification', { filmId: filmId, username: username });
    } else {
      setApreciat(false);
      setIsFetching(false);
    }
  };

  return (
    <div>
      <button className='buton-inimioara' disabled={isFetching} onClick={handleNotification}>
        {apreciat ? '❤️' : '🤍'} 
      </button>
    </div>
  );
}

export default ButonInimioară;
