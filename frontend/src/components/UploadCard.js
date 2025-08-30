import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, CardMedia } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadCard = ({ setUploadedImage }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  return (
    <Card sx={{ background: 'linear-gradient(145deg, #2c3e50, #1f283e)', height: '100%', border: '1px solid #444' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
          1. Envie sua Imagem
        </Typography>
        
        {!preview ? (
          <Box
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${isDragging ? '#f50057' : '#444'}`,
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'border-color 0.3s',
              bgcolor: isDragging ? 'rgba(245, 0, 87, 0.1)' : 'rgba(0,0,0,0.2)',
            }}
          >
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleUpload}
            />
            <label htmlFor="raised-button-file" style={{ cursor: 'pointer' }}>
              <CloudUploadIcon sx={{ fontSize: 60, color: '#777' }} />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Arraste e solte ou
              </Typography>
              <Button variant="contained" component="span" sx={{ mt: 1 }}>
                Selecione o Arquivo
              </Button>
            </label>
          </Box>
        ) : (
          <Box sx={{ mt: 2, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardMedia
              component="img"
              image={preview}
              alt="Preview"
              sx={{
                borderRadius: '8px',
                width: '100%',
                height: 'auto',
                maxHeight: 350,
                objectFit: 'contain',
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadCard;