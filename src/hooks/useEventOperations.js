import { useState } from 'react';
import axios from 'axios';

const useEventOperations = (eventId, onEventUpdate) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const updateEvent = async (formData) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/events/${eventId}`, formData);
      setSuccess("Événement mis à jour avec succès !");
      onEventUpdate();
    } catch (error) {
      setError("Impossible de mettre à jour l'événement.");
    } finally {
      setLoading(false);
    }
  };

  const removeArtist = async (artistId) => {
    try {
      await axios.delete(`http://localhost:8080/events/${eventId}/artists/${artistId}`);
      onEventUpdate();
    } catch (error) {
      setError("Erreur lors de la suppression de l'artiste.");
    }
  };
  const addArtistToEvent = async (artistId) => {
    try {
      await axios.post(`http://localhost:8080/events/${eventId}/artists/${artistId}`);
      onEventUpdate(); // Rafraîchir la liste après l'ajout
      setSuccess("Artiste ajouté avec succès !");
    } catch (error) {
      setError("Erreur lors de l'ajout de l'artiste.");
    }
  };
  
  return { updateEvent, removeArtist, addArtistToEvent, error, setError, success, setSuccess, loading };

};



export default useEventOperations;
