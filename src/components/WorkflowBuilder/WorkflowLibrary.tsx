
import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { PageHeader } from '@/components/common/Layout';

interface WorkflowLibraryProps {
  onImportWorkflow?: (workflow: any) => void;
}

const WorkflowLibrary: React.FC<WorkflowLibraryProps> = ({ onImportWorkflow }) => {
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
      <PageHeader title="Workflow Library" />
      
      <Box sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 }
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Browse Workflows
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Workflow Library content will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default WorkflowLibrary;
