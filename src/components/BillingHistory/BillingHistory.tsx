
import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { PageHeader } from '@/components/common/Layout';

interface BillingHistoryProps {
  sidebarCollapsed?: boolean;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ sidebarCollapsed }) => {
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
      <PageHeader title="Billing History" />
      
      <Box sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 }
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Payment History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Billing History content will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default BillingHistory;
