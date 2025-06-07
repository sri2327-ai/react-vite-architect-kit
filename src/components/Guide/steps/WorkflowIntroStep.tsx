
import React, { useEffect } from 'react';
import { Box, Typography, Card, Grid2 as Grid } from '@mui/material';
import { AccountTree, Schedule, Assignment, Sync } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';

const WorkflowIntroStep: React.FC = () => {
  const { completeStep, setCanProceed } = useGuide();

  useEffect(() => {
    setCanProceed(true);
    completeStep('workflow-intro');
  }, [setCanProceed, completeStep]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Understanding Workflows
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        Workflows automate the entire process from scheduling to note generation, 
        connecting your templates with your EHR system.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Schedule sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Schedule Integration
            </Typography>
            <Typography variant="body2">
              Automatically detect scheduled appointments and prepare the right templates
            </Typography>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Template Mapping
            </Typography>
            <Typography variant="body2">
              Connect your templates to specific visit types and EHR note sections
            </Typography>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Sync sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              EHR Synchronization
            </Typography>
            <Typography variant="body2">
              Seamlessly push generated notes to the correct location in your EHR
            </Typography>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <AccountTree sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Process Automation
            </Typography>
            <Typography variant="body2">
              Complete automation from patient check-in to documented encounter
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 3, backgroundColor: 'info.light', borderRadius: 2 }}>
        <Typography variant="body1" sx={{ color: 'info.dark' }}>
          💡 <strong>Next:</strong> We'll help you import a pre-built workflow and configure it 
          to work with your templates and EHR system.
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkflowIntroStep;
