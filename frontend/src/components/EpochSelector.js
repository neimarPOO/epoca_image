import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const epochs = [
  { label: 'Roma Antiga', color: '#c6a77b' },
  { label: 'Viking', color: '#8b939c' },
  { label: 'Renascimento', color: '#8a5a44' },
  { label: 'Anos 20', color: '#e0c2a2' },
  { label: 'Anos 60', color: '#d9a4a4' },
  { label: 'Brasil anos 90', color: '#00a591' },
  { label: 'Cyberpunk 2077', color: '#f50057' },
  { label: 'Futuro Steampunk', color: '#a97c50' },
  { label: '2050 Futuro', color: '#00bcd4' },
];

const StyledChip = styled(Chip)(({ theme, selected, chipcolor }) => ({
  color: '#fff',
  backgroundColor: selected ? chipcolor : '#444',
  border: `2px solid ${selected ? chipcolor : '#666'}`,
  transition: 'all 0.3s',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 'bold',
  padding: '16px 12px',
  fontSize: '0.9rem',
  '&:hover': {
    backgroundColor: selected ? chipcolor : '#555',
    transform: 'scale(1.05)',
    boxShadow: `0 0 15px ${chipcolor}77`,
  },
}));

const EpochSelector = ({ selectedEpoch, setSelectedEpoch }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, background: 'linear-gradient(145deg, #2c3e50, #1f283e)', height: '100%', border: '1px solid #444' }}>
      <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
        2. Escolha a Época
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {epochs.map((epoch) => (
          <StyledChip
            key={epoch.label}
            label={epoch.label}
            clickable
            selected={selectedEpoch === epoch.label}
            chipcolor={epoch.color}
            onClick={() => setSelectedEpoch(epoch.label)}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default EpochSelector;