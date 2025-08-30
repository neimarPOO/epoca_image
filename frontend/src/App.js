import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Grid,
  Fab,
  CircularProgress,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import UploadCard from './components/UploadCard';
import EpochSelector from './components/EpochSelector';
import ResultViewer from './components/ResultViewer';
import './App.css'; // Import the new CSS

// Define the dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f50057', // A vibrant pink/red
    },
    secondary: {
      main: '#00bcd4', // A cool cyan
    },
    background: {
      default: '#121212',
      paper: 'rgba(255, 255, 255, 0.09)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Russo One", sans-serif',
    h1: {
      fontFamily: '"Russo One", sans-serif',
    },
    h2: {
      fontFamily: '"Russo One", sans-serif',
    },
    h3: {
      fontFamily: '"Russo One", sans-serif',
    },
    h4: {
        fontFamily: '"Russo One", sans-serif',
    },
    h5: {
        fontFamily: '"Russo One", sans-serif',
    },
  },
});

function App() {
  useEffect(() => {
    // Store original body style
    const originalStyle = document.body.style.cssText;

    document.body.style.cssText += `
      background: 
        linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8), rgba(15, 52, 96, 0.8)),
        url("/fundo.png");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
    `;

    // Cleanup function to reset the style when the component unmounts
    return () => {
      document.body.style.cssText = originalStyle;
    };
  }, []); // Empty dependency array means this runs once on mount

  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedEpoch, setSelectedEpoch] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedEpoch) {
      alert('Por favor, envie uma imagem e selecione uma época.');
      return;
    }

    setLoading(true);
    setGeneratedImage(null); // Clear previous result

    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      try {
        const response = await fetch('http://localhost:3001/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: base64Image, epoch: selectedEpoch }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'A chamada para a API falhou.');
        }

        const data = await response.json();
        if (data.choices && data.choices[0].message.images && data.choices[0].message.images[0].image_url.url) {
            setGeneratedImage(data.choices[0].message.images[0].image_url.url);
        } else {
            throw new Error('A resposta da API não continha uma imagem no formato esperado.');
        }

      } catch (error) {
        console.error('Erro durante a geração da imagem:', error);
        alert(`Falha ao gerar imagem: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = (error) => {
        console.error("Erro ao ler o arquivo:", error);
        setLoading(false);
        alert("Não foi possível ler o arquivo da imagem.");
    };
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h2" align="center" gutterBottom className="main-title">
            Época Imagens
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 5, maxWidth: '700px', mx: 'auto', fontFamily: 'Inter, sans-serif' }}>
            Faça uma viagem no tempo. Envie uma foto e veja como ela seria em diferentes períodos da história, do futuro ou de universos alternativos.
          </Typography>

          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} md={10} lg={8}>
                <Box mb={4}>
                    <UploadCard setUploadedImage={setUploadedImage} />
                </Box>
                <Box>
                    <EpochSelector selectedEpoch={selectedEpoch} setSelectedEpoch={setSelectedEpoch} />
                </Box>
            </Grid>
          </Grid>

          {(uploadedImage || generatedImage) && (
            <Box mt={4}>
                <ResultViewer originalImage={uploadedImage} generatedImage={generatedImage} />
            </Box>
          )}

          <Fab
            variant="extended"
            className="fab-button"
            onClick={handleGenerate}
            disabled={loading || !uploadedImage || !selectedEpoch}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                <AutoFixHighIcon sx={{ mr: 1 }} />
                Gerar Versão
              </>)}
          </Fab>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;