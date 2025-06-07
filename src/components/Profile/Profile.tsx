
import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { PageHeader } from '@/components/common/Layout';

const Profile: React.FC = () => {
  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: 0,
        px: 0,
        width: '100%',
        maxWidth: '100vw'
      }}
    >
      <PageHeader title="Profile" />
      
      <Box sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 }
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Profile content will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Profile;
