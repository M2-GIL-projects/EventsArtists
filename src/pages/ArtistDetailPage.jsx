import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, List, ListItem,
  ListItemText, CircularProgress, Alert, Snackbar,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Edit, Event, Warning, Error } from '@mui/icons-material';
import axios from 'axios';
import ArtistModal from "../components/ArtistModal";
import ConfirmationDialog from "../components/ConfirmationDialog";
const ErrorDisplay = ({ message }) => (
  <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
    <Error color="error" sx={{ fontSize: 60 }} />
    <Typography variant="h5" color="error">
      {message}
    </Typography>
  </Box>
);

const ArtistDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleError = (error) => {
    let message = "Une erreur inattendue s'est produite.";
    
    if (error.response) {
      switch (error.response.status) {
        case 404:
          message = "L'artiste demandé n'a pas été trouvé.";
          navigate('/artists');
          break;
        case 403:
          message = "Vous n'avez pas les droits pour accéder à cet artiste.";
          break;
        case 500:
          message = "Une erreur serveur s'est produite. Veuillez réessayer plus tard.";
          break;
        default:
          message = error.response.data?.message || "Erreur lors de la communication avec le serveur.";
      }
    } else if (error.request) {
      message = "Impossible de communiquer avec le serveur. Vérifiez votre connexion.";
    }

    setError(message);
    showSnackbar(message, 'error');
  };

  const loadArtistData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [artistResponse, eventsResponse] = await Promise.all([
        axios.get(`http://localhost:8080/artists/${id}`),
        axios.get(`http://localhost:8080/artists/${id}/events`)
      ]);
      setArtist(artistResponse.data);
      setEvents(eventsResponse.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtistData();
  }, [id]);

  const handleModalClose = () => {
    setConfirmClose(true);
  };

  const handleConfirmClose = (confirm) => {
    setConfirmClose(false);
    if (confirm) {
      loadArtistData();
      setModalOpen(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{artist?.label}</Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => setModalOpen(true)}
        >
          Modifier
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Event sx={{ mr: 1 }} />
          <Typography variant="h6">Événements</Typography>
        </Box>
        <List>
          {events.length > 0 ? (
            events.map((event) => (
              <ListItem key={event.id}>
                <ListItemText
                  primary={event.label}
                  secondary={`${event.startDate} - ${event.endDate}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Aucun événement associé" />
            </ListItem>
          )}
        </List>
      </Paper>

      <ArtistModal
        open={modalOpen}
        onClose={handleModalClose}
        artist={artist}
        onArtistUpdate={() => {
          loadArtistData();
          setModalOpen(false);
        }}
      />

      <ConfirmationDialog
        open={confirmClose}
  onClose={() => setConfirmClose(false)}
  onConfirm={() => {
    loadArtistData();
    setModalOpen(false);
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
    </Box>
  );
};

export default ArtistDetailPage;