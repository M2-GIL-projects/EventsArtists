import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { LibraryMusic } from "@mui/icons-material"; // Remplacement de l'icône
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Icône Musique à gauche */}
        <IconButton edge="start" color="inherit" aria-label="music" sx={{ mr: 2 }}>
          <LibraryMusic />
        </IconButton>

        {/* Titre / Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            EventManager
          </Link>
        </Typography>

        {/* Liens de navigation */}
        <Button color="inherit" component={Link} to="/events">Événements</Button>
        <Button color="inherit" component={Link} to="/artists">Artistes</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
