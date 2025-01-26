import React, { useState, useEffect } from "react";
import {
  DialogContent, Alert, List, ListItem, ListItemText,
  Typography, IconButton, Box, TextField, Dialog,
  Button, DialogTitle, DialogActions
} from "@mui/material";
import { People, Delete, AddCircle, Close } from "@mui/icons-material";
import axios from "axios";
import CustomModal from "./CustomModal";
import useEventOperations from "../hooks/useEventOperations";
import ConfirmationDialog from './ConfirmationDialog';

const EventModal = ({ open, onClose, event }) => {
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

  const { updateEvent, removeArtist, addArtistToEvent, error, success, loading } = 
    useEventOperations(event?.id, null);

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
      console.error("Erreur lors de la récupération des artistes:", error);
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
      await removeArtist(data.id);
      setFormData(prev => ({
        ...prev,
        artists: prev.artists.filter(a => a.id !== data.id)
      }));
      setConfirmDialog({ open: false, type: null, data: null });
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    if (formData.label.length < 3) return;
    if (new Date(formData.startDate) > new Date(formData.endDate)) return;
    
    const success = await updateEvent(formData);
    if (success) {
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
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

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
    </>
  );
};

export default EventModal;