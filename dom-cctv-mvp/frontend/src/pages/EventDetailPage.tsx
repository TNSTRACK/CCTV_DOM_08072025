// src/pages/EventDetailPage.tsx
// Página de detalle de evento (placeholder)

import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const EventDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Detalle de Evento
        </Typography>
        <Typography variant="body1">
          Página de detalle de evento - Se implementará en las siguientes tareas
        </Typography>
      </Box>
    </Container>
  );
};

export default EventDetailPage;