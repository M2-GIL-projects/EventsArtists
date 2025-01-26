import { useState } from 'react';
import axios from 'axios';

const useEventOperations = (eventId, onEventUpdate) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const updateEvent = async (formData) => {
    setLoading(true);
    clearMessages();
    try {
      await axios.put(`http://localhost:8080/events/${eventId}`, formData);
      setSuccess("Événement mis à jour avec succès !");
      if (onEventUpdate) await onEventUpdate();
      return true;
    } catch (error) {
      setError("Impossible de mettre à jour l'événement.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeArtist = async (artistId) => {
    setLoading(true);
    clearMessages();
    try {
      await axios.delete(`http://localhost:8080/events/${eventId}/artists/${artistId}`);
      setSuccess("Artiste supprimé avec succès !");
      if (onEventUpdate) await onEventUpdate();
      return true;
    } catch (error) {
      setError("Erreur lors de la suppression de l'artiste.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addArtistToEvent = async (artistId) => {
    setLoading(true);
    clearMessages();
    try {
      await axios.post(`http://localhost:8080/events/${eventId}/artists/${artistId}`);
      setSuccess("Artiste ajouté avec succès !");
      if (onEventUpdate) await onEventUpdate();
      return true;
    } catch (error) {
      setError("Erreur lors de l'ajout de l'artiste.");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { 
    updateEvent, 
    removeArtist, 
    addArtistToEvent, 
    error, 
    success, 
    loading,
    clearMessages 
  };
};

export default useEventOperations;