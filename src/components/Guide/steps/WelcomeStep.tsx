
import React, { useEffect } from 'react';
import { Box, Typography, Card } from '@mui/material';
import { Description as TemplateIcon, AccountTree as WorkflowIcon, Star as StarIcon } from '@mui/icons-material';
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

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3, 
            maxWidth: 800, 
            mx: 'auto' 
          }}>
            <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <TemplateIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Step 1: Templates
              </Typography>
              <Typography variant="body2">
                Create note templates for different visit types
              </Typography>
            </Card>
            
            <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <WorkflowIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Step 2: Workflows
              </Typography>
              <Typography variant="body2">
                Set up automated workflows for your EHR system
              </Typography>
            </Card>
            
            <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Step 3: Go Live
              </Typography>
              <Typography variant="body2">
                Start using your configured system with your EHR
              </Typography>
            </Card>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Perfect! In standalone mode, you'll focus on creating powerful note templates 
            that you can use independently for your clinical documentation needs.
          </Typography>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 4, 
            maxWidth: 600, 
            mx: 'auto' 
          }}>
            <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <TemplateIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Create Templates
              </Typography>
              <Typography variant="body2">
                Build customized note templates for your practice
              </Typography>
            </Card>
            
            <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Start Documenting
              </Typography>
              <Typography variant="body2">
                Use your templates for efficient clinical documentation
              </Typography>
            </Card>
          </Box>
        </>
      )}

      <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic', color: 'text.secondary' }}>
        This guide will walk you through the existing features without changing anything. 
        You can skip or replay this guide anytime from your dashboard.
      </Typography>
    </Box>
  );
};

export default WelcomeStep;
