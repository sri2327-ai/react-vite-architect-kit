
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Alert, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { Settings as ConfigIcon, CheckCircle as CheckIcon, ArrowForward as ArrowIcon } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';

const WorkflowConfigStep: React.FC = () => {
  const { completeStep, setCanProceed } = useGuide();
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // In a real implementation, check if workflow is configured
    // For now, we'll simulate this
    const checkConfiguration = () => {
      const configured = localStorage.getItem('workflow-configured') === 'true';
      setIsConfigured(configured);
      setCanProceed(configured);
      if (configured) {
        completeStep('workflow-config');
      }
    };

    checkConfiguration();
    const interval = setInterval(checkConfiguration, 2000);
    return () => clearInterval(interval);
  }, [setCanProceed, completeStep]);

  const handleGoToConfig = () => {
    // Navigate to workflow configuration
    window.location.hash = '#workflows';
    window.location.reload();
  };

  const handleMarkConfigured = () => {
    // For demo purposes
    localStorage.setItem('workflow-configured', 'true');
    setIsConfigured(true);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Configure Your Workflow
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Now let's configure your imported workflow to connect with your templates and EHR system.
      </Typography>

      {isConfigured ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Perfect! Your workflow is fully configured and ready to use.
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          Complete the workflow configuration to proceed.
        </Alert>
      )}

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Configuration Steps:
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <CheckIcon color={isConfigured ? 'success' : 'action'} />
          </ListItemIcon>
          <ListItemText
            primary="Schedule Settings"
            secondary="Configure provider name, location, and default settings"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckIcon color={isConfigured ? 'success' : 'action'} />
          </ListItemIcon>
          <ListItemText
            primary="Visit Type Mapping"
            secondary="Map workflow blocks to your template sections"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckIcon color={isConfigured ? 'success' : 'action'} />
          </ListItemIcon>
          <ListItemText
            primary="EHR Integration"
            secondary="Connect workflow outputs to your EHR note sections"
          />
        </ListItem>
      </List>

      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Configuration includes:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Provider Settings" size="small" />
          <Chip label="Template Mapping" size="small" />
          <Chip label="EHR Note Types" size="small" />
          <Chip label="Schedule Integration" size="small" />
        </Box>
      </Box>

      {!isConfigured && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ConfigIcon />}
            endIcon={<ArrowIcon />}
            onClick={handleGoToConfig}
            sx={{ px: 4, mb: 2 }}
          >
            Configure Workflow
          </Button>
          <br />
          <Button
            variant="outlined"
            size="small"
            onClick={handleMarkConfigured}
            sx={{ px: 3 }}
          >
            Mark as Configured (Demo)
          </Button>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Complete the configuration, then return to finish the setup
          </Typography>
        </Box>
      )}

      {isConfigured && (
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'success.light', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ color: 'success.dark' }}>
            ✅ Configuration complete! Your workflow is ready to automate your documentation process.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WorkflowConfigStep;
