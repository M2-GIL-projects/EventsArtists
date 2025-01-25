import React, { useState, useEffect } from "react";
import axios from "axios";
import { CalendarToday, People, Delete } from "@mui/icons-material";
import CustomModal from "./CustomModal";
import FormField from "./FormField";
import { Alert, List, ListItem, ListItemText, Typography, IconButton } from "@mui/material";

const EventModal = ({ open, onClose, event, onEventUpdate }) => {
  const [formData, setFormData] = useState({
    label: "",
    startDate: "",
    endDate: "",
    artists: [],  
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger les données de l'événement dans le state
  useEffect(() => {
    if (event) {
      setFormData({
        label: event.label || "",
        startDate: event.startDate || "",
        endDate: event.endDate || "",
        artists: event.artists || [],  
      });
    }
  }, [event]);

  const validateForm = () => {
    if (formData.label.length < 3) {
      setError("Le nom doit comporter au moins 3 caractères.");
      return false;
    }
    if (new Date(formData.startDate) < new Date()) {
      setError("La date de début doit être future.");
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("La date de début doit être avant la date de fin.");
      return false;
    }
    setError("");
    return true;
  };

  const handleUpdateEvent = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/events/${event.id}`, {
        label: formData.label,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      setSuccess("Événement mis à jour avec succès !");
      onEventUpdate();
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 2000);
    } catch (error) {
      setError("Impossible de mettre à jour l'événement.");
    }
    setLoading(false);
  };

  // 🔴 Fonction pour supprimer un artiste de l'événement
  const handleRemoveArtist = async (artistId) => {
    try {
      await axios.delete(`http://localhost:8080/events/${event.id}/artists/${artistId}`);
      
      // Mise à jour de la liste des artistes après suppression
      setFormData((prevState) => ({
        ...prevState,
        artists: prevState.artists.filter(artist => artist.id !== artistId),
      }));

      setSuccess("Artiste retiré avec succès !");
    } catch (error) {
      setError("Erreur lors de la suppression de l'artiste.");
    }
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Modifier l'Événement" onSave={handleUpdateEvent} loading={loading}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <FormField
        label="Nom de l'événement"
        value={formData.label}
        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
        icon={CalendarToday}
      />
      <FormField
        label="Date de début"
        type="date"
        value={formData.startDate}
        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        icon={CalendarToday}
      />
      <FormField
        label="Date de fin"
        type="date"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        icon={CalendarToday}
      />

      {/* ✅ Affichage des artistes avec possibilité de suppression */}
      <Typography variant="h6" sx={{ mt: 2 }}>Artistes</Typography>
      <List>
        {formData.artists.length > 0 ? (
          formData.artists.map((artist) => (
            <ListItem key={artist.id}>
              <People sx={{ color: "primary.main", mr: 1 }} />
              <ListItemText primary={artist.label} />
              <IconButton edge="end" color="error" onClick={() => handleRemoveArtist(artist.id)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">Aucun artiste</Typography>
        )}
      </List>
    </CustomModal>
  );
};

export default EventModal;
