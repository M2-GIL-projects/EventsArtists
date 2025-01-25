// src/hooks/useFetchEvents.js
import { useState, useEffect } from 'react';
import { fetchEvents, fetchEventImage } from '../services/api';

const useFetchEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await fetchEvents();  // Cela doit appeler la fonction API qui récupère les données
        const eventsData = response.content || [];  // Extraction du tableau 'content'
        const eventsWithImages = await Promise.all(eventsData.map(async (event) => {
          try {
            const imageUrl = await fetchEventImage(event.label);  // Utiliser 'label' pour récupérer l'image
            return { ...event, imageUrl };
          } catch (imageError) {
            console.error('Error fetching image:', imageError);
            return { ...event, imageUrl: '/path/to/default-image.jpg' };  // Fournir une image par défaut en cas d'erreur
          }
        }));
        setEvents(eventsWithImages);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    getEvents();
  }, []);

  return events;
};

export default useFetchEvents;
