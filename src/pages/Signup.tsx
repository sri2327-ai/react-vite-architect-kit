
import React from 'react';
import { Box } from '@mui/material';
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
      <SignupFlow />
    </Box>
  );
};

export default Signup;
