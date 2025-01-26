import React, { useState, useEffect } from "react";
import {
  Event, Delete, AddCircle, Close
} from "@mui/icons-material";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Alert, List, ListItem, ListItemText,
  Typography, IconButton, Box, Snackbar, TextField
} from "@mui/material";
import axios from "axios";
import CustomModal from "./CustomModal";

const ArtistModal = ({ open, onClose, artist, onArtistUpdate }) => {
  const [formData, setFormData] = useState({
    label: "",
    events: []
  });

  const [alerts, setAlerts] = useState({
    success: null,
    error: null
  });
  
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  const [loading, setLoading] = useState(false);
  const [openEventsModal, setOpenEventsModal] = useState(false);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (open) {
      resetState();
      loadArtistEvents();
    }
  }, [artist?.id, open]);

  const resetState = () => {
    setAlerts({ success: null, error: null });
    setSnackbarState({ open: false, message: "", severity: "info" });
    setFormData({
      label: artist?.label || "",
      events: []
    });
  };

  const loadArtistEvents = async () => {
    if (!artist?.id) return;
    try {
      const response = await axios.get(`http://localhost:8080/artists/${artist.id}/events`);
      setFormData(prev => ({
        ...prev,
        events: response.data
      }));
    } catch (error) {
      showMessage("Erreur lors du chargement des événements", "error");
    }
  };

  const showMessage = (message, severity = "info") => {
    setSnackbarState({
      open: true,
      message,
      severity
    });
  };

  const showAlert = (message, type) => {
    setAlerts(prev => ({
      ...prev,
      [type]: message
    }));
    setTimeout(() => {
      setAlerts(prev => ({
        ...prev,
        [type]: null
      }));
    }, 5000);
  };

  const fetchAvailableEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await axios.get(`http://localhost:8080/events?page=0&size=10`);
      setAvailableEvents(response.data.content || []);
    } catch (error) {
      showMessage("Erreur lors de la récupération des événements", "error");
    }
    setLoadingEvents(false);
  };

  const handleAddEvent = async (event) => {
    try {
      await axios.post(`http://localhost:8080/events/${event.id}/artists/${artist.id}`);
      setFormData(prev => ({
        ...prev,
        events: [...prev.events, event]
      }));
      showMessage(`Événement ${event.label} ajouté avec succès !`, "success");
      showAlert(`Événement ${event.label} ajouté avec succès !`, "success");
      setOpenEventsModal(false);
    } catch (error) {
      showMessage("Erreur lors de l'ajout de l'événement", "error");
      showAlert("Erreur lors de l'ajout de l'événement", "error");
    }
  };

  const handleRemoveEvent = async (event) => {
    try {
      await axios.delete(`http://localhost:8080/events/${event.id}/artists/${artist.id}`);
      setFormData(prev => ({
        ...prev,
        events: prev.events.filter(e => e.id !== event.id)
      }));
      showMessage(`Événement ${event.label} retiré avec succès !`, "success");
      showAlert(`Événement ${event.label} retiré avec succès !`, "success");
    } catch (error) {
      showMessage("Erreur lors du retrait de l'événement", "error");
      showAlert("Erreur lors du retrait de l'événement", "error");
    }
    setConfirmDialogOpen(false);
  };

  const handleSave = async () => {
    if (formData.label.length < 3) {
      showMessage("Le nom doit comporter au moins 3 caractères", "error");
      showAlert("Le nom doit comporter au moins 3 caractères", "error");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/artists/${artist.id}`, { label: formData.label });
      showMessage("Artiste mis à jour avec succès !", "success");
      showAlert("Artiste mis à jour avec succès !", "success");
      if (onArtistUpdate) onArtistUpdate();
    } catch (error) {
      showMessage("Erreur lors de la mise à jour de l'artiste", "error");
      showAlert("Erreur lors de la mise à jour de l'artiste", "error");
    }
    setLoading(false);
  };

  const confirmRemoveEvent = (event) => {
    setSelectedEvent(event);
    setConfirmAction(() => () => handleRemoveEvent(event));
    setConfirmDialogOpen(true);
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Modifier l'Artiste" onSave={handleSave} loading={loading}>
      {alerts.error && (
        <Alert severity="error" onClose={() => setAlerts(prev => ({ ...prev, error: null }))}>
          {alerts.error}
        </Alert>
      )}
      {alerts.success && (
        <Alert severity="success" onClose={() => setAlerts(prev => ({ ...prev, success: null }))}>
          {alerts.success}
        </Alert>
      )}

      <Box sx={{ marginTop: 2 }} />
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Nom de l'artiste"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          fullWidth
          required
          helperText="Minimum 3 caractères"
        />
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>Événements</Typography>
      <Box display="flex" alignItems="center">
        <EventList events={formData.events} onRemoveEvent={confirmRemoveEvent} />
        <IconButton 
          color="success" 
          onClick={() => { 
            fetchAvailableEvents(); 
            setOpenEventsModal(true); 
          }}
        >
          <AddCircle sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      {/* Modal de sélection d'événement */}
      <Dialog open={openEventsModal} onClose={() => setOpenEventsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sélectionner un événement</DialogTitle>
        <DialogContent>
          {loadingEvents ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {availableEvents.length > 0 ? availableEvents.map((event) => (
                <ListItem button key={event.id} onClick={() => handleAddEvent(event)}>
                  <Event sx={{ color: "primary.main", mr: 1 }} />
                  <ListItemText 
                    primary={event.label} 
                    secondary={`${event.startDate} - ${event.endDate}`}
                  />
                </ListItem>
              )) : (
                <Typography variant="body2" color="textSecondary">
                  Aucun événement disponible
                </Typography>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenEventsModal(false)} 
            color="secondary" 
            variant="contained" 
            startIcon={<Close />}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedEvent && `Êtes-vous sûr de vouloir retirer l'événement ${selectedEvent.label} ?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmAction} color="primary" variant="contained">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))} 
          severity={snackbarState.severity} 
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </CustomModal>
  );
};

const EventList = ({ events, onRemoveEvent }) => (
  <List>
    {events.length > 0 ? (
      events.map((event) => (
        <ListItem key={event.id}>
          <Event sx={{ color: "primary.main", mr: 1 }} />
          <ListItemText 
            primary={event.label} 
            secondary={`${event.startDate} - ${event.endDate}`}
          />
          <IconButton edge="end" color="error" onClick={() => onRemoveEvent(event)}>
            <Delete />
          </IconButton>
        </ListItem>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">
        Aucun événement associé
      </Typography>
    )}
  </List>
);

export default ArtistModal;