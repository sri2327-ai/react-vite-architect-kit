
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { SignupFlow } from '@/components/auth/SignupFlow';
import { WelcomePopup } from '@/components/auth/WelcomePopup';

export const Signup: React.FC = () => {
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      py: { xs: 2, sm: 3 },
      px: { xs: 2, sm: 3 }
    }}>
      {/* Header with Logo */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: { xs: 2, sm: 3 },
        pt: { xs: 1, sm: 2 }
      }}>
        <Box 
          component="img" 
          src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png" 
          alt="S10.AI Logo" 
          sx={{
            height: { xs: 45, sm: 55, md: 65 },
            mr: 2
          }} 
        />
      </Box>
      
      <SignupFlow />
      
      <WelcomePopup 
        open={showWelcomePopup} 
        onClose={() => setShowWelcomePopup(false)} 
      />
    </Box>
  );
};

export default Signup;
