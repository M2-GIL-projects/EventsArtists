import React from "react";
import { Box, Container, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#1976d2",
        color: "white",
        textAlign: "center"
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1">
          © {new Date().getFullYear()} EventManager - Tous droits réservés.
        </Typography>
        
        {/* Icônes de réseaux sociaux */}
        <Box sx={{ mt: 1 }}>
          <IconButton href="https://facebook.com" target="_blank" color="inherit">
            <Facebook />
          </IconButton>
          <IconButton href="https://twitter.com" target="_blank" color="inherit">
            <Twitter />
          </IconButton>
          <IconButton href="https://instagram.com" target="_blank" color="inherit">
            <Instagram />
          </IconButton>
        </Box>

        {/* Liens de footer */}
        <Typography variant="body2" sx={{ mt: 1 }}>
          <Link href="/about" color="inherit" sx={{ mx: 1 }}>À propos</Link> | 
          <Link href="/contact" color="inherit" sx={{ mx: 1 }}>Contact</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
