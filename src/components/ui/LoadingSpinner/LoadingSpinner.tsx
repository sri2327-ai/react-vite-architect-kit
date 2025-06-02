
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium'
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        minHeight: { xs: '200px', md: '300px' }
      }}
    >
      <CircularProgress size={sizeMap[size]} />
      {message && (
        <Typography variant="body2" color="text.secondary" align="center">
          {message}
        </Typography>
      )}
    </Box>
  );
};
