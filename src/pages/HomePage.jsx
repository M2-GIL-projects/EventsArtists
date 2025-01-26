import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { Event, People, CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Event sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Gestion des Événements",
      description: "Créez et gérez vos événements musicaux",
      path: "/events"
    },
    {
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Gestion des Artistes",
      description: "Gérez votre base de données d'artistes",
      path: "/artists"
    }
  ];

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography 
        variant="h2" 
        component="h1" 
        sx={{ 
          mb: 4,
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Gestion d'Événements Musicaux
      </Typography>

      <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
        Votre plateforme de gestion d'événements et d'artistes
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 2,
                p: 4
              }}>
                {feature.icon}
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(feature.path)}
                  sx={{ mt: 'auto' }}
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;