// components/EventModal.jsx

import React from 'react';
import { CalendarToday, People, Delete } from "@mui/icons-material";
import CustomModal from "./CustomModal";
import FormField from "./FormField";
import { Alert, List, ListItem, ListItemText, Typography, IconButton } from "@mui/material";
import useEventForm from '../hooks/useEventForm';
import useEventOperations from '../hooks/useEventOperations';
import { Box } from '@mui/material';


const EventModal = ({ open, onClose, event, onEventUpdate }) => {
  const [formData, handleChange] = useEventForm(event);
  const { updateEvent, removeArtist, error, success, loading } = useEventOperations(event?.id, onEventUpdate);

  const handleSave = async () => {
    if (!validateForm(formData, setError)) return;
    await updateEvent(formData);
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Modifier l'Événement" onSave={handleSave} loading={loading}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Box sx={{ marginTop: 2}}></Box>
      <FormField label="Nom de l'événement" value={formData.label} onChange={handleChange} name="label" icon={CalendarToday}/>
      <FormField label="Date de début" type="date" value={formData.startDate} onChange={handleChange} name="startDate" icon={CalendarToday} />
      <FormField label="Date de fin" type="date" value={formData.endDate} onChange={handleChange} name="endDate" icon={CalendarToday} />
      <ArtistList artists={formData.artists} onRemoveArtist={removeArtist} />
    </CustomModal>
  );
};

const ArtistList = ({ artists, onRemoveArtist }) => (
  <List>
    {artists.length > 0 ? (
      artists.map((artist) => (
        <ListItem key={artist.id}>
          <People sx={{ color: "primary.main", mr: 1 }} />
          <ListItemText primary={artist.label} />
          <IconButton edge="end" color="error" onClick={() => onRemoveArtist(artist.id)}>
            <Delete />
          </IconButton>
        </ListItem>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">Aucun artiste</Typography>
    )}
  </List>
);

export default EventModal;
