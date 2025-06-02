
import React from 'react';
import { Box, Typography } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 2, 
        px: 3, 
        backgroundColor: 'grey.100',
        textAlign: 'center' 
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2024 My App. All rights reserved.
      </Typography>
    </Box>
  );
};
