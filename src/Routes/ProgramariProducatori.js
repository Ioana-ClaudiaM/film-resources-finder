import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {jwtDecode} from 'jwt-decode';
import ProducatorAppBar from '../Components/ProducatorAppBar';
import '../Styles/Programari.css';

const localizer = momentLocalizer(moment);

const ProgramariProducatori = () => {
  const [events, setEvents] = useState([]);
  const [producerId, setProducerId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setProducerId(decodedToken.id);
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/roleapplication/events');
        if (response.ok) {
          const data = await response.json();
          console.log('Data:', data);

          const eventsData = Array.isArray(data) ? data : [data];

          const formattedEvents = eventsData.map(event => {
            console.log('Event:', event);
            const startDate = new Date(event.date);
            const [hours, minutes] = event.time.split(':');
            startDate.setHours(hours, minutes);

            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 1);

            return {
              title: `${event.type} - ${event.film_title} (${event.role_title})`,
              start: startDate,
              end: endDate,
              location: event.location,
              actor: event.actor_id,
              producer: event.producer_id,
              notes: event.notes,
              type: event.type,
              time: event.time,
              actorName: event.actor_name || 'Nume nespecificat',
              actorEmail: event.actor_email || 'Email nespecificat',
              actorPhone: event.actor_phone || 'Telefon nespecificat',
              filmTitle: event.film_title || 'Titlu film nespecificat',
              roleTitle: event.role_title || 'Rol nespecificat'
            };
          });

          const filteredEvents = formattedEvents.filter(event => event.producer === producerId);
          setEvents(filteredEvents);
        } else {
          console.error('Eroare la obținerea evenimentelor:', response.status);
        }
      } catch (error) {
        console.error('Eroare la obținerea evenimentelor:', error);
      }
    };

    if (producerId) {
      fetchEvents();
    }
  }, [producerId]);

  const eventStyleGetter = (event) => {
    const backgroundColor = '#3174ad';
    const style = {
      backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  const eventTooltip = (event) => {
    return `${event.type}\nFilm: ${event.filmTitle}\nRol: ${event.roleTitle}\nLocație: ${event.location}\nOra: ${moment(event.start).format('HH:mm')}\nDetalii: ${event.notes}\nNume Actor: ${event.actorName}\nEmail: ${event.actorEmail}\nTelefon: ${event.actorPhone}`;
  };

  return (
    <div className='programari'>
      <ProducatorAppBar />
      <p className='calendar-paragraph'>
        Mai jos regăsiți calendarul pentru a putea vizualiza diverse programări și anunțuri din partea producătorilor.
      </p>
      <div style={{ padding: '20px' }} className='calendar'>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={eventTooltip}
        />
      </div>
    </div>
  );
};

export default ProgramariProducatori;
