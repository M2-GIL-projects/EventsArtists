import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Grid, CircularProgress, Paper, Box } from "@mui/material";
import { MusicOff } from '@mui/icons-material';  // Correct import for MusicOff
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import PaginationComponent from "../components/PaginationComponent";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 2;

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/events?page=${page - 1}&size=${pageSize}`);
      setEvents(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      let errorMessage = "Une erreur est survenue lors de la récupération des événements.";
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Requête invalide. Impossible de charger les événements.";
            break;
          case 401:
            errorMessage = "Accès non autorisé. Connexion requise.";
            break;
          case 403:
            errorMessage = "Permissions insuffisantes pour afficher les événements.";
            break;
          case 404:
            errorMessage = "Aucun événement trouvé.";
            break;
          case 500:
            errorMessage = "Erreur serveur. Impossible de récupérer les événements.";
            break;
          case 503:
            errorMessage = "Service temporairement indisponible.";
            break;
          default:
            errorMessage = "Erreur de chargement des événements.";
        }
      } else if (error.request) {
        errorMessage = "Aucune réponse du serveur. Vérifiez votre connexion.";
      }
      
      setError(errorMessage);
      setEvents([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const handleEventUpdate = async () => {
    await fetchEvents();
    setSelectedEvent(null);
  };

  return (
    <Container sx={{ mt: 7, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
        🎶 Liste des Événements 🎶
      </Typography>

      {loading ? (
        <CircularProgress size={50} sx={{ mt: 5 }} />
      ) : error || events.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            maxWidth: 600,
            mx: 'auto',
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 4
          }}
        >
          <MusicOff sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
            {error ? 'Erreur de chargement' : 'Aucun événement disponible'}
          </Typography>
          <Typography color="text.secondary" paragraph>
            {error || "Il n'y a actuellement aucun événement enregistré"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {events.map((event) => (
            <Grid item key={event.id}>
              <EventCard
                event={event}
                onOpenModal={() => setSelectedEvent(event)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <PaginationComponent
        totalPages={totalPages}
        page={page}
        onPageChange={setPage}
      />

      <EventModal
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onEventUpdate={handleEventUpdate}
      />
    </Container>
  );
}

export default EventsList;
