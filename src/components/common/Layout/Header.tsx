
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { ThemeToggle } from '../ThemeToggle';

export const Header: React.FC = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bravo App
        </Typography>
        <Box>
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
