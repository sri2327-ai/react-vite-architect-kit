
import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          minHeight: '80vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            mb: 2,
          }}
        >
          S10.AI Admin Platform
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ mb: 4, maxWidth: '600px' }}
        >
          Revolutionize your clinical documentation with AI-powered scribe technology
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
          <PrimaryButton
            size="large"
            onClick={() => navigate('/signup')}
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started
          </PrimaryButton>
          <SecondaryButton
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 4, py: 1.5 }}
          >
            Sign In
          </SecondaryButton>
        </Stack>
      </Box>
    </Container>
  );
};

export default Index;
