
import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadButton = ({ imageUrl }) => {
  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'imagem_gerada.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      sx={{ mt: 2 }}
      disabled={!imageUrl}
    >
      Download
    </Button>
  );
};

export default DownloadButton;

