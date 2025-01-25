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

  return { updateEvent, removeArtist, error, setError, success, setSuccess, loading };
};

export default useEventOperations;
