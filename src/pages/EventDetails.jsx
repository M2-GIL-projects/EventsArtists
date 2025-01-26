// EventDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card, CardContent, Typography, Button,
  CircularProgress, Alert, Grid, Box
} from "@mui/material";
import { Edit } from '@mui/icons-material';
import EventModal from "./EventModal";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/events/${id}`);
      setEvent(response.data);
      setError(null);
    } catch (err) {
      const message = err.response?.status === 404 ? "Événement non trouvé." : "Erreur serveur.";
      setError(message);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">{event?.label}</Typography>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setModalOpen(true)}
            >
              Modifier
            </Button>
          </Box>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Date: {event?.startDate} - {event?.endDate}
          </Typography>

          <Typography variant="h5" sx={{ mt: 3 }}>
            Artistes associés
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {event?.artists?.length > 0 ? (
              event.artists.map((artist) => (
                <Grid item xs={12} key={artist.id}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 1
                  }}>
                    <Typography>{artist.label}</Typography>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography color="text.secondary">Aucun artiste associé</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <EventModal
        open={modalOpen}
        onClose={(saved) => {
          setModalOpen(false);
          if (saved) fetchEvent();
        }}
        event={event}
      />
    </Box>
  );
};

export default EventDetails;