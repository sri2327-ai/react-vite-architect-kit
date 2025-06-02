
import React from 'react';
import { Box, Typography } from '@mui/material';
import { SignupFlow } from '@/components/auth/SignupFlow';

export const Signup: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${(theme) => theme.palette.background.light} 0%, ${(theme) => theme.palette.background.white} 100%)`,
        py: 2,
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          pt: 2,
        }}
      >
        <Box
          component="img"
          src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
          alt="S10.AI Logo"
          sx={{
            height: 60,
            mr: 2,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          S10.AI
        </Typography>
      </Box>
      
      <SignupFlow />
    </Box>
  );
};

export default Signup;
