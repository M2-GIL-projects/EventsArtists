import React, { useState, useEffect } from "react";
import {
  DialogContent, Alert, List, ListItem, ListItemText,
  Typography, IconButton, Box, TextField, Dialog,
  Button, DialogTitle, DialogActions, Snackbar
} from "@mui/material";
import { People, Delete, AddCircle, Close } from "@mui/icons-material";
import axios from "axios";
import CustomModal from "./CustomModal";
import useEventOperations from "../hooks/useEventOperations";
import ConfirmationDialog from './ConfirmationDialog';

const EventModal = ({ open, onClose, event, onEventUpdate }) => {
  const [formData, setFormData] = useState({
    label: "",
    startDate: "",
    endDate: "",
    artists: []
  });

  const [openArtistsModal, setOpenArtistsModal] = useState(false);
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    data: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const { 
    updateEvent, 
    removeArtist, 
    addArtistToEvent, 
    loading 
  } = useEventOperations(event?.id, onEventUpdate);

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  useEffect(() => {
    if (open && event) {
      setFormData({
        label: event.label,
        startDate: event.startDate,
        endDate: event.endDate,
        artists: event.artists || []
      });
      setHasChanges(false);
    }
  }, [open, event]);

  const handleChange = (e) => {
    setHasChanges(true);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchArtists = async () => {
    setLoadingArtists(true);
    try {
      const response = await axios.get(`http://localhost:8080/artists?page=0&size=10`);
      setArtists(response.data.content || []);
    } catch (error) {
      showMessage("Erreur lors de la récupération des artistes", "error");
    }
    setLoadingArtists(false);
  };

  const handleCloseModal = () => {
    if (hasChanges) {
      setConfirmDialog({
        open: true,
        type: 'close',
        data: null
      });
    } else {
      onClose(false);
    }
  };

  const handleConfirmDialog = async () => {
    const { type, data } = confirmDialog;
    
    if (type === 'close') {
      setConfirmDialog({ open: false, type: null, data: null });
      onClose(false);
    } else if (type === 'delete') {
      const success = await removeArtist(data.id);
      if (success) {
        setFormData(prev => ({
          ...prev,
          artists: prev.artists.filter(a => a.id !== data.id)
        }));
        showMessage(`Artiste ${data.label} supprimé avec succès`);
        setHasChanges(true);
      } else {
        showMessage("Erreur lors de la suppression de l'artiste", "error");
      }
      setConfirmDialog({ open: false, type: null, data: null });
    }
  };

  const handleSave = async () => {
    if (formData.label.length < 3) {
      showMessage("Le nom doit comporter au moins 3 caractères.", "error");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      showMessage("La date de début doit être avant la date de fin.", "error");
      return;
    }
    
    const success = await updateEvent(formData);
    if (success) {
      showMessage("Événement mis à jour avec succès");
      setHasChanges(false);
      onClose(true);
    }
  };

  const handleDeleteArtist = (artist) => {
    setConfirmDialog({
      open: true,
      type: 'delete',
      data: artist
    });
  };

  const handleAddArtist = async (artist) => {
    const success = await addArtistToEvent(artist.id);
    if (success) {
      setFormData(prev => ({
        ...prev,
        artists: [...prev.artists, artist]
      }));
      setOpenArtistsModal(false);
      setHasChanges(true);
      showMessage(`Artiste ${artist.label} ajouté avec succès`);
    } else {
      showMessage("Erreur lors de l'ajout de l'artiste", "error");
    }
  };

  const dialogConfig = {
    close: {
      title: "Fermer sans sauvegarder",
      message: "Voulez-vous vraiment fermer sans sauvegarder les modifications ?",
      confirmText: "Quitter sans sauvegarder"
    },
    delete: {
      title: "Supprimer l'artiste",
      message: `Voulez-vous vraiment supprimer l'artiste "${confirmDialog.data?.label}" ?`,
      confirmText: "Supprimer"
    }
  };

  return (
    <>
      <CustomModal 
        open={open} 
        onClose={handleCloseModal}
        title="Modifier l'événement"
        onSave={handleSave}
        loading={loading}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Nom de l'événement"
            name="label"
            value={formData.label}
            onChange={handleChange}
            fullWidth
            required
            error={formData.label.length < 3}
            helperText={formData.label.length < 3 ? "Le nom doit comporter au moins 3 caractères" : ""}
          />
          <TextField
            label="Date de début"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Date de fin"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            error={new Date(formData.startDate) > new Date(formData.endDate)}
            helperText={new Date(formData.startDate) > new Date(formData.endDate) ? 
              "La date de fin doit être après la date de début" : ""}
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Artistes</Typography>
        <Box display="flex" alignItems="center">
          <List sx={{ width: '100%' }}>
            {formData.artists.map((artist) => (
              <ListItem key={artist.id}>
                <People sx={{ color: "primary.main", mr: 1 }} />
                <ListItemText primary={artist.label} />
                <IconButton color="error" onClick={() => handleDeleteArtist(artist)}>
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <IconButton color="primary" onClick={() => {
            fetchArtists();
            setOpenArtistsModal(true);
          }}>
            <AddCircle />
          </IconButton>
        </Box>
      </CustomModal>

      <Dialog open={openArtistsModal} onClose={() => setOpenArtistsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sélectionner un artiste</DialogTitle>
        <DialogContent>
          <List>
            {artists.map((artist) => (
              <ListItem button key={artist.id} onClick={() => handleAddArtist(artist)}>
                <People sx={{ color: "primary.main", mr: 1 }} />
                <ListItemText primary={artist.label} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenArtistsModal(false)} startIcon={<Close />}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: null, data: null })}
        onConfirm={handleConfirmDialog}
        title={dialogConfig[confirmDialog.type]?.title}
        message={dialogConfig[confirmDialog.type]?.message}
        confirmText={dialogConfig[confirmDialog.type]?.confirmText}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EventModal;