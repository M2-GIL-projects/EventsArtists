import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Grid, CircularProgress, Alert, Box, Paper } from "@mui/material";
import { Error as ErrorIcon, EventBusy } from '@mui/icons-material';
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
      const errorMessage = error.response?.status === 500 
        ? "Aucun événement disponible pour le moment."
        : "Impossible de récupérer les événements. Veuillez réessayer plus tard.";
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

  const renderErrorMessage = () => (
    <Paper 
      elevation={3} 
      sx={{ 
        mt: 3,
        p: 4,
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'error.light',
        color: 'error.contrastText'
      }}
    >
      <ErrorIcon sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Oops! Une erreur s'est produite
      </Typography>
      <Typography>
        {error}
      </Typography>
    </Paper>
  );

  const renderNoEvents = () => (
    <Paper 
      elevation={3}
      sx={{ 
        mt: 3,
        p: 4,
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper'
      }}
    >
      <EventBusy sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
      <Typography variant="h5" gutterBottom fontWeight="bold" color="text.secondary">
        Aucun événement trouvé
      </Typography>
      <Typography color="text.secondary">
        Revenez plus tard pour découvrir nos prochains événements !
      </Typography>
    </Paper>
  );

  return (
    <Container sx={{ mt: 7, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
        🎶 Liste des Événements 🎶
      </Typography>

      {loading ? (
        <Box sx={{ 
          mt: 5, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Chargement des événements...
          </Typography>
        </Box>
      ) : error ? (
        renderErrorMessage()
      ) : events.length === 0 ? (
        renderNoEvents()
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center">
            {events.map((event) => (
              <Grid item key={event.id}>
                <EventCard event={event} onOpenModal={setSelectedEvent} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3 }}>
            <PaginationComponent totalPages={totalPages} page={page} onPageChange={setPage} />
          </Box>
        </>
      )}

      <EventModal 
        open={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        event={selectedEvent} 
        onEventUpdate={fetchEvents} 
      />
    </Container>
  );
}

export default EventsList;