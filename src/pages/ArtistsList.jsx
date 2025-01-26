import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Typography, Grid, CircularProgress, TextField,
  Button, Box, Card, CardContent, Chip, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert, Snackbar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MusicOff, Search, Error, Clear } from '@mui/icons-material';
import PaginationComponent from "../components/PaginationComponent";

const NoArtistsFound = ({ searchTerm }) => (
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
      {searchTerm ? 'Aucun résultat trouvé' : 'Aucun artiste disponible'}
    </Typography>
    <Typography color="text.secondary" paragraph>
      {searchTerm 
        ? `Aucun artiste ne correspond à "${searchTerm}"`
        : "Il n'y a actuellement aucun artiste enregistré"}
    </Typography>
  </Paper>
);

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, handleClear }) => (
  <Box sx={{ 
    display: "flex", 
    justifyContent: "center", 
    gap: 2, 
    mb: 4,
    flexWrap: 'wrap'
  }}>
    <TextField
      label="Rechercher un artiste"
      variant="outlined"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      InputProps={{
        startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
        endAdornment: searchTerm && (
          <Clear 
            sx={{ color: 'text.secondary', cursor: 'pointer' }}
            onClick={handleClear}
          />
        )
      }}
    />
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleSearch}
      sx={{ height: '56px' }}
    >
      Rechercher
    </Button>
  </Box>
);

const ArtistsList = () => {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasArtists, setHasArtists] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error"
  });

  const navigate = useNavigate();
  const pageSize = 10;

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/artists`, {
        params: {
          page: page - 1,
          size: pageSize,
          label: searchTerm || undefined
        }
      });
      
      const content = response.data.content || [];
      setArtists(content);
      setTotalPages(response.data.totalPages || 1);
      setHasArtists(content.length > 0 || !searchTerm);
    } catch (error) {
      let message = "Une erreur est survenue lors de la récupération des artistes.";
      if (error.response?.status === 404) {
        message = "La ressource demandée n'a pas été trouvée.";
      } else if (error.response?.status === 500) {
        message = "Une erreur serveur s'est produite. Veuillez réessayer plus tard.";
      }
      showSnackbar(message);
      setArtists([]);
      setTotalPages(0);
      setHasArtists(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchArtists();
  };

  const handleClear = () => {
    setSearchTerm("");
    setPage(1);
    fetchArtists();
  };

  return (
    <Container sx={{ mt: 7, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
        🎤 Liste des Artistes 🎤
      </Typography>

      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        handleSearch={handleSearch}
        handleClear={handleClear}
      />

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5, gap: 2 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Chargement des artistes...
          </Typography>
        </Box>
      ) : artists.length === 0 ? (
        <NoArtistsFound searchTerm={searchTerm} />
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center">
            {artists.map((artist) => (
              <Grid item key={artist.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{
                  height: "100%",
                  boxShadow: 4,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" }
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {artist.label}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      {artist.events?.length > 0 ? (
                        <>
                          <Typography variant="body2" fontWeight="bold">
                            Événements :
                          </Typography>
                          {artist.events.slice(0, 3).map((event) => (
                            <Chip 
                              key={event.id} 
                              label={event.label} 
                              sx={{ m: 0.5 }}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                          {artist.events.length > 3 && (
                            <Typography variant="body2" color="textSecondary">
                              + {artist.events.length - 3} autres
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Aucun événement
                        </Typography>
                      )}
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2, borderRadius: 10 }}
                      onClick={() => navigate(`/artists/${artist.id}`)}
                    >
                      Voir détails
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 0 && (
            <Box sx={{ mt: 4, mb: 4 }}>
              <PaginationComponent
                totalPages={totalPages}
                page={page}
                onPageChange={setPage}
              />
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ArtistsList;