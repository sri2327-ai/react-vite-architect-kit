
import React, { useEffect } from 'react';
import { Box, Typography, Card, Alert, Grid } from '@mui/material';
import { Settings, Assignment, Schedule, Mapping } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';

const WorkflowConfigStep: React.FC = () => {
  const { completeStep, setCanProceed } = useGuide();

  useEffect(() => {
    setCanProceed(true);
    completeStep('workflow-config');
  }, [setCanProceed, completeStep]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', textAlign: 'center' }}>
        Configure Your Workflow ⚙️
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
        Now that you've imported a workflow, let's configure it to work perfectly with your practice setup and EHR system.
      </Typography>

      <Alert severity="warning" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>Configuration Required:</strong> Each imported workflow needs to be configured for your specific templates and scheduling preferences.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6">Template Mapping</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Connect your existing templates to different visit types in the workflow.
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography variant="body2" component="li" color="text.secondary">
                Map templates to appointment types
              </Typography>
              <Typography variant="body2" component="li" color="text.secondary">
                Set default templates for each scenario
              </Typography>
              <Typography variant="body2" component="li" color="text.secondary">
                Configure template variations
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Schedule sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6">Scheduling Setup</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Define when and how notes should be generated based on appointments.
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography variant="body2" component="li" color="text.secondary">
                Set provider preferences
              </Typography>
              <Typography variant="body2" component="li" color="text.secondary">
                Configure location settings
              </Typography>
              <Typography variant="body2" component="li" color="text.secondary">
                Define timing rules
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Configuration Process
        </Typography>
        
        <Grid container spacing={2}>
          {[
            { 
              icon: <Settings />, 
              title: 'Open Configuration', 
              desc: 'Click "Configure" on your imported workflow in My Workflows',
              step: '1'
            },
            { 
              icon: <Mapping />, 
              title: 'Map Templates', 
              desc: 'Select which templates to use for each visit type',
              step: '2'
            },
            { 
              icon: <Schedule />, 
              title: 'Set Schedule Rules', 
              desc: 'Configure provider, location, and timing preferences',
              step: '3'
            },
            { 
              icon: <Assignment />, 
              title: 'Test & Activate', 
              desc: 'Review settings and activate the workflow',
              step: '4'
            }
          ].map((item, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <Card sx={{ p: 2, textAlign: 'center', height: '100%', position: 'relative' }}>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {item.step}
                </Box>
                <Box sx={{ color: 'primary.main', mb: 1, mt: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Look for "My Workflows"</strong> in your sidebar to find your imported workflows and start the configuration process.
        </Typography>
      </Alert>

      <Box sx={{ mt: 4, p: 3, backgroundColor: 'action.hover', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          🔧 Configuration Best Practices:
        </Typography>
        <Typography variant="body2" component="div">
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <li>Start with your most common appointment types</li>
            <li>Use specific templates for specialized visits</li>
            <li>Set realistic timing for note generation</li>
            <li>Test the workflow with a few appointments first</li>
            <li>Adjust settings based on your workflow needs</li>
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkflowConfigStep;
