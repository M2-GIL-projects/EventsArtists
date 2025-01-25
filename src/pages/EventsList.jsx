import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Pagination, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";

function EventsList() {
  const [events, setEvents] = useState([]); // Liste des événements
  const [page, setPage] = useState(1); // Commence à 1 pour correspondre à Material-UI
  const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
  const pageSize = 4; // Nombre d'événements par page

  // Fonction pour récupérer les événements paginés
  const fetchEvents = async (currentPage) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/events?page=${currentPage - 1}&size=${pageSize}`
      );

      console.log("API Response:", response.data); // Vérification des données reçues

      setEvents(response.data.content || []); // S'assurer que 'content' existe
      setTotalPages(response.data.totalPages || 1); // Vérifier si 'totalPages' est bien présent

      console.log("Total pages:", response.data.totalPages);
      console.log("Total elements:", response.data.totalElements);
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
    }
  };

  // Exécuter la requête API à chaque changement de page
  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  return (
    <div>
      <Grid container spacing={2}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{event.label}</Typography>
                  <Typography color="textSecondary">
                    Start: {new Date(event.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography color="textSecondary">
                    End: {new Date(event.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    Artists: {event.artists.map((artist) => artist.label).join(", ")}
                  </Typography>
                </CardContent>
                <Button size="small" href={`/events/${event.id}`}>
                  Learn More
                </Button>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="h6"
            style={{ textAlign: "center", width: "100%", padding: "20px" }}
          >
            Aucun événement trouvé.
          </Typography>
        )}
      </Grid>

      {/* PAGINATION MATERIAL-UI */}
      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" sx={{ marginTop: 3 }}>
          <Pagination
            count={totalPages} // Nombre total de pages
            page={page} // Page actuelle
            onChange={(event, value) => setPage(value)} // Changement de page
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Stack>
      )}
    </div>
  );
}

export default EventsList;
