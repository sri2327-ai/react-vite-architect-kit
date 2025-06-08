
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { ThemeToggle } from '../ThemeToggle';
import { HelpButton } from '@/components/tour';

export const Header: React.FC = () => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar data-tour-id="dashboard-header">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          S10.AI
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HelpButton />
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
