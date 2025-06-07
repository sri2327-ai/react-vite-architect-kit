
import React, { useEffect } from 'react';
import { Box, Typography, Card, Alert, Stepper, Step, StepLabel } from '@mui/material';
import { Download, LibraryBig, Search, CheckCircle } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';

const WorkflowImportStep: React.FC = () => {
  const { completeStep, setCanProceed } = useGuide();

  useEffect(() => {
    setCanProceed(true);
    completeStep('workflow-import');
  }, [setCanProceed, completeStep]);

  const importSteps = [
    'Navigate to Workflow Library',
    'Browse Available Workflows',
    'Select Compatible Workflow',
    'Import to My Workflows'
  ];

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', textAlign: 'center' }}>
        Import Your First Workflow 📥
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
        Let's walk through how to find and import a workflow from our library that matches your EHR system and practice needs.
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>Look for "Workflow Library"</strong> in your sidebar under the Workflow Builder section to get started.
        </Typography>
      </Alert>

      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LibraryBig sx={{ mr: 1, color: 'primary.main' }} />
          Import Process Overview
        </Typography>
        
        <Stepper orientation="vertical" sx={{ mt: 2 }}>
          {importSteps.map((step, index) => (
            <Step key={step} active={true} completed={false}>
              <StepLabel>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {step}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Search sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Finding the Right Workflow</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Use the search and filter options to find workflows that match your EHR system and specialty.
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography variant="body2" component="li" color="text.secondary">
              Filter by EHR system (Epic, Cerner, etc.)
            </Typography>
            <Typography variant="body2" component="li" color="text.secondary">
              Search by specialty or visit type
            </Typography>
            <Typography variant="body2" component="li" color="text.secondary">
              Check compatibility indicators
            </Typography>
          </Box>
        </Card>

        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Download sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Import Process</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Once you find a suitable workflow, importing it is just one click away.
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography variant="body2" component="li" color="text.secondary">
              Click "Import Workflow" button
            </Typography>
            <Typography variant="body2" component="li" color="text.secondary">
              Review workflow details
            </Typography>
            <Typography variant="body2" component="li" color="text.secondary">
              Confirm import to your workspace
            </Typography>
          </Box>
        </Card>
      </Box>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircle sx={{ mr: 1 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              What happens after import?
            </Typography>
            <Typography variant="body2">
              The workflow appears in your "My Workflows" section where you can configure it for your specific needs.
            </Typography>
          </Box>
        </Box>
      </Alert>

      <Box sx={{ p: 3, backgroundColor: 'action.hover', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          💡 Import Tips:
        </Typography>
        <Typography variant="body2" component="div">
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <li>Start with workflows designed for your EHR system</li>
            <li>Look for workflows with high ratings and good descriptions</li>
            <li>You can always customize workflows after importing</li>
            <li>Import multiple workflows for different appointment types</li>
          </Box>
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Ready to import? Navigate to <strong>"Workflow Library"</strong> in your sidebar to browse available workflows!
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkflowImportStep;
