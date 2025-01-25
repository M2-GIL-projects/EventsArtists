import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Box
} from "@mui/material";

const EventDetails = () => {
  const { id } = useParams(); // Récupérer l'ID depuis l'URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ label: "", startDate: "", endDate: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Récupérer les détails de l'événement
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/events/${id}`);
        setEvent(response.data);
        setFormData({
          label: response.data.label,
          startDate: response.data.startDate,
          endDate: response.data.endDate
        });
      } catch (err) {
        setError(err.response?.status === 404 ? "Événement non trouvé." : "Erreur serveur.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Valider et soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.label.length < 3) {
      setError("Le nom doit comporter au moins 3 caractères.");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("La date de début doit être avant la date de fin.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/events/${id}`, formData);
      setSuccessMessage("Événement mis à jour avec succès !");
      setOpenSnackbar(true);
    } catch (err) {
      setError("Impossible de mettre à jour l'événement.");
    }
  };

  // Supprimer un artiste
  const removeArtist = async (artistId) => {
    try {
      await axios.delete(`http://localhost:8080/events/${id}/artists/${artistId}`);
      setEvent((prev) => ({
        ...prev,
        artists: prev.artists.filter((artist) => artist.id !== artistId)
      }));
    } catch (err) {
      setError("Erreur lors de la suppression de l'artiste.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Détails de l'événement
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nom de l'événement"
              name="label"
              value={formData.label}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Date de début"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Date de fin"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Mettre à jour
            </Button>
          </form>

          <Typography variant="h5" sx={{ mt: 3 }}>
            Artistes associés :
          </Typography>
          {event.artists.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {event.artists.map((artist) => (
                <Grid item xs={12} key={artist.id}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
                    <Typography>{artist.label}</Typography>
                    <Button variant="outlined" color="secondary" onClick={() => removeArtist(artist.id)}>
                      Supprimer
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>Aucun artiste associé.</Typography>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={successMessage}
      />
    </Box>
  );
};

export default EventDetails;
