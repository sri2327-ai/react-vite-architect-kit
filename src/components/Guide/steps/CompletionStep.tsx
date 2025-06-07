
import React, { useEffect } from 'react';
import { Box, Typography, Card, Button, Grid, Alert } from '@mui/material';
import { Launch as LaunchIcon, Link as LinkIcon } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';

const CompletionStep: React.FC = () => {
  const { guideState, completeStep, setCanProceed, skipGuide } = useGuide();

  useEffect(() => {
    setCanProceed(true);
    completeStep('completion');
  }, [setCanProceed, completeStep]);

  const handleComplete = () => {
    skipGuide();
  };

  const quickLinks = [
    {
      title: 'Template Builder',
      description: 'Create and manage your note templates',
      action: 'Go to Templates',
      url: '#templates'
    },
    ...(guideState.userMode === 'ehr' ? [{
      title: 'Workflow Manager',
      description: 'Configure and monitor your automated workflows',
      action: 'Go to Workflows',
      url: '#workflows'
    }] : []),
    {
      title: 'Documentation',
      description: 'Learn more about advanced features',
      action: 'View Docs',
      url: 'https://docs.s10.ai'
    }
  ];

  return (
    <Box sx={{ py: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        🎉 Setup Complete!
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
        Your {guideState.userMode === 'ehr' ? 'EHR-integrated' : 'standalone'} documentation system is ready to use
      </Typography>

      <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="body1" gutterBottom>
          <strong>Important:</strong> To use your configured system, please log in to your EHR or clinical application 
          using the same credentials you used for this S10.AI account.
        </Typography>
        <Typography variant="body2">
          Email: Use the same email address • Password: Use the same password
        </Typography>
      </Alert>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Quick Access Links
      </Typography>

      <Grid container spacing={3} sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
        {quickLinks.map((link, index) => (
          <Grid xs={12} sm={6} md={4} key={index}>
            <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                {link.title}
              </Typography>
              <Typography variant="body2" sx={{ flex: 1, mb: 2 }}>
                {link.description}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<LinkIcon />}
                onClick={() => {
                  if (link.url.startsWith('http')) {
                    window.open(link.url, '_blank');
                  } else {
                    window.location.hash = link.url;
                    window.location.reload();
                  }
                }}
                fullWidth
              >
                {link.action}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, backgroundColor: 'primary.light', borderRadius: 2 }}>
        <Typography variant="body1" sx={{ color: 'primary.dark', mb: 2 }}>
          🚀 <strong>What's Next?</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: 'primary.dark' }}>
          {guideState.userMode === 'ehr' 
            ? 'Your workflows will automatically detect scheduled appointments and generate notes using your templates. Log in to your EHR to see it in action!'
            : 'Start creating professional clinical notes using your templates. You can always come back to create more templates as needed.'
          }
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="large"
        startIcon={<LaunchIcon />}
        onClick={handleComplete}
        sx={{ mt: 4, px: 6 }}
      >
        Start Using S10.AI
      </Button>
    </Box>
  );
};

export default CompletionStep;
