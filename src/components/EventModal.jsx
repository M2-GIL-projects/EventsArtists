import React, { useState, useEffect } from "react";
import {
  CalendarToday, People, Delete, AddCircle, Close
} from "@mui/icons-material";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Alert, List, ListItem, ListItemText,
  Typography, IconButton, Box, Snackbar, TextField
} from "@mui/material";
import axios from "axios";
import CustomModal from "./CustomModal";
import useEventOperations from "../hooks/useEventOperations";

const EventModal = ({ open, onClose, event, onEventUpdate }) => {
  const [formData, setFormData] = useState({
    label: "",
    startDate: "",
    endDate: "",
    artists: []
  });

  const { updateEvent, removeArtist, addArtistToEvent, error, success, loading } = useEventOperations(event?.id, onEventUpdate);

  const [openArtistsModal, setOpenArtistsModal] = useState(false);
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  
  // États pour la gestion des dialogues et messages
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Réinitialisation des données à l'ouverture de la modal
  useEffect(() => {
    if (open) {
      setSnackbarMessage("");
      setSnackbarOpen(false);
      setFormData({
        label: event?.label || "",
        startDate: event?.startDate || "",
        endDate: event?.endDate || "",
        artists: event?.artists || []
      });
    }
  }, [event, open]);

  // Récupération des artistes
  const fetchArtists = async () => {
    setLoadingArtists(true);
    try {
      const response = await axios.get(`http://localhost:8080/artists?page=0&size=10`);
      setArtists(response.data.content || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des artistes:", error);
      setSnackbarMessage("Erreur lors de la récupération des artistes.");
      setSnackbarOpen(true);
    }
    setLoadingArtists(false);
  };

  // Gestion de la confirmation pour l'ajout d'un artiste
  const confirmAddArtist = (artist) => {
    setSelectedArtist(artist);
    setConfirmAction(() => () => handleAddArtist(artist));
    setConfirmDialogOpen(true);
  };

  // Gestion de la confirmation pour la suppression d'un artiste
  const confirmRemoveArtist = (artist) => {
    setSelectedArtist(artist);
    setConfirmAction(() => () => handleRemoveArtist(artist));
    setConfirmDialogOpen(true);
  };

  // Ajout d'un artiste
  const handleAddArtist = async (artist) => {
    try {
      await addArtistToEvent(artist.id);
      setFormData((prev) => ({
        ...prev,
        artists: [...prev.artists, artist]
      }));
      setSnackbarMessage(`Artiste ${artist.label} ajouté avec succès !`);
      setSnackbarOpen(true);
      setOpenArtistsModal(false);
    } catch (error) {
      setSnackbarMessage("Erreur lors de l'ajout de l'artiste.");
      setSnackbarOpen(true);
    }
    setConfirmDialogOpen(false);
  };

  // Suppression d'un artiste
  const handleRemoveArtist = async (artist) => {
    try {
      await removeArtist(artist.id);
      setFormData((prev) => ({
        ...prev,
        artists: prev.artists.filter(a => a.id !== artist.id)
      }));
      setSnackbarMessage(`Artiste ${artist.label} supprimé avec succès !`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Erreur lors de la suppression de l'artiste.");
      setSnackbarOpen(true);
    }
    setConfirmDialogOpen(false);
  };

  // Validation et sauvegarde de l'événement
  const handleSave = async () => {
    // Validation du formulaire
    if (formData.label.length < 3) {
      setSnackbarMessage("Le nom doit comporter au moins 3 caractères.");
      setSnackbarOpen(true);
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setSnackbarMessage("La date de début doit être avant la date de fin.");
      setSnackbarOpen(true);
      return;
    }

    try {
      await updateEvent(formData);
      setSnackbarMessage("Événement mis à jour avec succès !");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Erreur lors de la mise à jour de l'événement.");
      setSnackbarOpen(true);
    }
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Modifier l'Événement" onSave={handleSave} loading={loading}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box sx={{ marginTop: 2 }} />
      
      {/* Formulaire */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Nom de l'événement"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Date de début"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date de fin"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* Liste des artistes */}
      <Typography variant="h6" sx={{ mt: 2 }}>Artistes</Typography>
      <Box display="flex" alignItems="center">
        <ArtistList artists={formData.artists} onRemoveArtist={confirmRemoveArtist} />
        <IconButton color="success" onClick={() => { fetchArtists(); setOpenArtistsModal(true); }}>
          <AddCircle sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      {/* Modal de sélection d'artiste */}
      <Dialog open={openArtistsModal} onClose={() => setOpenArtistsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sélectionner un artiste</DialogTitle>
        <DialogContent>
          {loadingArtists ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {artists.length > 0 ? artists.map((artist) => (
                <ListItem button key={artist.id} onClick={() => confirmAddArtist(artist)}>
                  <People sx={{ color: "primary.main", mr: 1 }} />
                  <ListItemText primary={artist.label} />
                </ListItem>
              )) : (
                <Typography variant="body2" color="textSecondary">Aucun artiste disponible</Typography>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenArtistsModal(false)} color="secondary" variant="contained" startIcon={<Close />}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedArtist && `Êtes-vous sûr de vouloir ${confirmAction === handleAddArtist ? 'ajouter' : 'supprimer'} l'artiste ${selectedArtist.label} ?`}
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

      {/* Snackbar pour les messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </CustomModal>
  );
};

// Composant pour la liste des artistes
const ArtistList = ({ artists, onRemoveArtist }) => (
  <List>
    {artists.length > 0 ? (
      artists.map((artist) => (
        <ListItem key={artist.id}>
          <People sx={{ color: "primary.main", mr: 1 }} />
          <ListItemText primary={artist.label} />
          <IconButton edge="end" color="error" onClick={() => onRemoveArtist(artist)}>
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