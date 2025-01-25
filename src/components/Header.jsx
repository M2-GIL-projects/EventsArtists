import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Icône Menu à gauche */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
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
