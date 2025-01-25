import React from "react";
import { Card, CardContent, Typography, Button, Box, Chip, Stack, Tooltip, Badge } from "@mui/material";
import { Event as EventIcon, CalendarToday, People } from "@mui/icons-material";

const EventCard = ({ event, onOpenModal }) => {
  return (
    <Card 
      sx={{ 
        maxWidth: 450, 
        width: "100%",
        minHeight: 250, 
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3, 
        boxShadow: 8, 
        transition: "0.4s",
        "&:hover": { transform: "translateY(-5px)", boxShadow: 12, backgroundColor: "#f5f5f5" }
      }}
    >
      <CardContent>
        {/* Icône et titre de l'événement */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Tooltip title="Événement musical">
          </Tooltip>
          <Typography variant="h6" fontWeight="bold" textAlign="center" flexGrow={1}>
            {event.label}
          </Typography>
        </Box>

        {/* Dates de l'événement */}
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 1 }}>
          <Chip
            icon={<CalendarToday />}
            label={`Début: ${new Date(event.startDate).toLocaleDateString()}`}
            sx={{ fontSize: 14, backgroundColor: "#e3f2fd", color: "#0d47a1", fontWeight: "bold" }}
          />
          <Chip
            icon={<CalendarToday />}
            label={`Fin: ${new Date(event.endDate).toLocaleDateString()}`}
            sx={{ fontSize: 14, backgroundColor: "#ffebee", color: "#b71c1c", fontWeight: "bold" }}
          />
        </Stack>

        {/* Artistes et nombre d'artistes totale */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
  {/* Icône et badge */}
  <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
    <People color="primary" sx={{ fontSize: 30 }} />

    {/* Badge bien positionné au-dessus de l'icône */}
    <Badge 
      badgeContent={event.artists.length}  
      sx={{ 
        position: "absolute", 
        top: -6, 
        left : 7,
        "& .MuiBadge-badge": { 
          fontSize: "0.9rem",
          minWidth: "22px", 
          height: "22px",
          borderRadius: "50%", 
          border: "2px solid white", 
          boxShadow: 4,
          backgroundColor: "#4CAF50", 
          color: "white",
        }
      }}
    />
  </Box>

  {/* Liste des artistes bien alignée */}
  <Typography 
    variant="body1" 
    sx={{ 
      flexGrow: 1, 
      color: "#424242",
      textAlign: "left", 
    }}
  >
    {event.artists.length > 0 
      ? event.artists.map((artist) => artist.label).join(", ")
      : "Aucun artiste"}
  </Typography>
</Box>

      </CardContent>

      {/* Bouton "Lire plus" avec un effet au survol */}
      <Button 
        variant="contained" 
        color="primary"
        sx={{ 
          borderRadius: 20, 
          
          m: 2, 
          transition: "0.3s",
          "&:hover": { backgroundColor: "#1976d2", transform: "scale(1.05)" }
        }}
        onClick={() => onOpenModal(event)}
      >
        Détails 🎵
      </Button>
    </Card>
  );
};

export default EventCard;
