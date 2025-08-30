import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import DownloadButton from './DownloadButton';

const ResultViewer = ({ originalImage, generatedImage }) => {
  const originalImageUrl = originalImage ? URL.createObjectURL(originalImage) : '';

  const commonImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, background: 'linear-gradient(145deg, #2c3e50, #1f283e)', border: '1px solid #444' }}>
      <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}>
        3. Resultado da Viagem no Tempo
      </Typography>
      {generatedImage ? (
        <Box sx={{ position: 'relative' }}>
          <ReactCompareSlider
            itemOne={<ReactCompareSliderImage src={originalImageUrl} alt="Original" style={commonImageStyle} />}
            itemTwo={<ReactCompareSliderImage src={generatedImage} alt="Generated" style={commonImageStyle} />}
            style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', maxHeight: '70vh' }}
          />
          <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 10 }}>
            <DownloadButton imageUrl={generatedImage} />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #444',
            borderRadius: '8px',
            bgcolor: 'rgba(0,0,0,0.2)',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            A imagem gerada aparecerá aqui
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ResultViewer;