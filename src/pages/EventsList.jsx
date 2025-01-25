import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import PaginationComponent from "../components/PaginationComponent";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const pageSize = 4;

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/events?page=${page - 1}&size=${pageSize}`);
      setEvents(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  return (
    <Container sx={{ mt: 7, textAlign: "center" }}>
    <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>  
      🎶 Liste des Événements 🎶
    </Typography>
  

      {loading && <CircularProgress size={50} sx={{ mt: 5 }} />}

      <Grid container spacing={3} justifyContent="center">
        {events.map((event) => (
          <Grid item key={event.id}>
            <EventCard event={event} onOpenModal={setSelectedEvent} />
          </Grid>
        ))}
      </Grid>

      <PaginationComponent totalPages={totalPages} page={page} onPageChange={setPage} />

      <EventModal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} event={selectedEvent} onEventUpdate={fetchEvents} />
    </Container>
  );
}

export default EventsList;
