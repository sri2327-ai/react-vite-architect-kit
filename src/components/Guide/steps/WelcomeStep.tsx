
import React, { useEffect } from 'react';
import { Box, Typography, Card, Grid } from '@mui/material';
import { Template as TemplateIcon, AccountTree as WorkflowIcon, Star as StarIcon } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';

const WelcomeStep: React.FC = () => {
  const { guideState, completeStep, setCanProceed } = useGuide();

  useEffect(() => {
    setCanProceed(true);
    completeStep('welcome');
  }, [setCanProceed, completeStep]);

  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Welcome to S10.AI! 🎉
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
        Let's get you set up with your {guideState.userMode === 'ehr' ? 'EHR-integrated' : 'standalone'} clinical documentation system
      </Typography>

      {guideState.userMode === 'ehr' ? (
        <>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Since you've chosen EHR mode, we'll guide you through setting up both templates and workflows 
            to create a complete documentation system that integrates with your EHR.
          </Typography>

          <Grid container spacing={3} sx={{ maxWidth: 800, mx: 'auto' }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <TemplateIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Step 1: Templates
                </Typography>
                <Typography variant="body2">
                  Create note templates for different visit types
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <WorkflowIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Step 2: Workflows
                </Typography>
                <Typography variant="body2">
                  Set up automated workflows for your EHR system
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <StarIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Step 3: Go Live
                </Typography>
                <Typography variant="body2">
                  Start using your configured system with your EHR
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Since you've chosen standalone mode, we'll focus on setting up templates 
            to help you create consistent, high-quality clinical documentation.
          </Typography>

          <Grid container spacing={3} sx={{ maxWidth: 600, mx: 'auto' }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <TemplateIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Step 1: Templates
                </Typography>
                <Typography variant="body2">
                  Create note templates for different visit types and specialties
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <StarIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Step 2: Go Live
                </Typography>
                <Typography variant="body2">
                  Start creating professional clinical notes
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
        This guide will take you through each step with interactive demonstrations
      </Typography>
    </Box>
  );
};

export default WelcomeStep;
