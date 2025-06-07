
import React, { useEffect } from 'react';
import { Box, Typography, Card, Button, Alert } from '@mui/material';
import { CheckCircle, Rocket, Help, Refresh, Launch } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';

const CompletionStep: React.FC = () => {
  const { guideState, completeStep, setCanProceed, resetGuide } = useGuide();

  useEffect(() => {
    setCanProceed(true);
    completeStep('completion');
  }, [setCanProceed, completeStep]);

  const quickLinks = [
    {
      title: 'Create Your First Template',
      description: 'Start building custom note templates',
      action: 'Go to My Templates',
      icon: <CheckCircle />
    },
    {
      title: guideState.userMode === 'ehr' ? 'Import a Workflow' : 'Browse Template Library',
      description: guideState.userMode === 'ehr' 
        ? 'Set up automated EHR workflows' 
        : 'Find pre-built templates for your specialty',
      action: guideState.userMode === 'ehr' ? 'Go to Workflow Library' : 'Go to Template Library',
      icon: <Rocket />
    },
    {
      title: 'Need Help?',
      description: 'Access documentation and support',
      action: 'View Help Resources',
      icon: <Help />
    }
  ];

  return (
    <Box sx={{ py: 2, textAlign: 'center' }}>
      <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
      
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
        Setup Complete! 🎉
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
        You're all set up and ready to start using S10.AI for efficient clinical documentation
      </Typography>

      <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          What you've learned:
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <Typography variant="body2" component="li">
            How to navigate the Template Builder
          </Typography>
          <Typography variant="body2" component="li">
            Where to find and create note templates
          </Typography>
          {guideState.userMode === 'ehr' && (
            <>
              <Typography variant="body2" component="li">
                Understanding EHR workflow integration
              </Typography>
              <Typography variant="body2" component="li">
                How to import and configure workflows
              </Typography>
            </>
          )}
          <Typography variant="body2" component="li">
            Key features and navigation tips
          </Typography>
        </Box>
      </Alert>

      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Quick Actions to Get Started
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        {quickLinks.map((link, index) => (
          <Card key={index} sx={{ 
            p: 3, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }}>
            <Box sx={{ color: 'primary.main', mb: 2 }}>
              {link.icon}
            </Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {link.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, flex: 1 }}>
              {link.description}
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              endIcon={<Launch fontSize="small" />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {link.action}
            </Button>
          </Card>
        ))}
      </Box>

      <Box sx={{ p: 3, backgroundColor: 'action.hover', borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🚀 Ready to Start Documenting?
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          You now have everything you need to create efficient, standardized clinical documentation. 
          {guideState.userMode === 'ehr' 
            ? ' Your EHR integration will automate note generation based on appointments.'
            : ' Start by creating templates for your most common visit types.'
          }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Remember: You can always access this guide again or explore additional features as your practice grows.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Refresh fontSize="small" />}
          onClick={resetGuide}
          size="small"
        >
          Replay Guide
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Help fontSize="small" />}
          size="small"
        >
          Get Support
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic', color: 'text.secondary' }}>
        Thank you for choosing S10.AI for your clinical documentation needs!
      </Typography>
    </Box>
  );
};

export default CompletionStep;
