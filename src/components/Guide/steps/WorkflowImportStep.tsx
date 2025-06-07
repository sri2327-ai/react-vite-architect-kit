
import React, { useEffect } from 'react';
import { Box, Typography, Button, Alert, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Download as ImportIcon, CheckCircle as CheckIcon, ArrowForward as ArrowIcon } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';
import { useWorkflowData } from '@/hooks/useWorkflowData';
import { useApiContext } from '@/contexts/ApiContext';

const WorkflowImportStep: React.FC = () => {
  const { completeStep, setCanProceed } = useGuide();
  const { useApiData } = useApiContext();
  const { workflows } = useWorkflowData(useApiData);

  const hasWorkflows = workflows && workflows.length > 0;

  useEffect(() => {
    if (hasWorkflows) {
      setCanProceed(true);
      completeStep('workflow-import');
    } else {
      setCanProceed(false);
    }
  }, [hasWorkflows, setCanProceed, completeStep]);

  const handleGoToWorkflows = () => {
    // Navigate to workflow builder
    window.location.hash = '#workflows';
    window.location.reload();
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Import Your First Workflow
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Let's import a pre-built workflow that matches your specialty and customize it 
        for your specific needs.
      </Typography>

      {hasWorkflows ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Excellent! You have imported {workflows.length} workflow{workflows.length > 1 ? 's' : ''}. 
          Now we need to configure it.
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          You need to import at least one workflow from the library.
        </Alert>
      )}

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Import Process:
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <CheckIcon color={hasWorkflows ? 'success' : 'action'} />
          </ListItemIcon>
          <ListItemText
            primary="Browse Workflow Library"
            secondary="Choose from specialty-specific workflow templates"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckIcon color={hasWorkflows ? 'success' : 'action'} />
          </ListItemIcon>
          <ListItemText
            primary="Select and Import"
            secondary="Import the workflow that best matches your practice"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckIcon color={hasWorkflows ? 'success' : 'action'} />
          </ListItemIcon>
          <ListItemText
            primary="Review Workflow Blocks"
            secondary="Understand the automated steps in your imported workflow"
          />
        </ListItem>
      </List>

      {!hasWorkflows && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ImportIcon />}
            endIcon={<ArrowIcon />}
            onClick={handleGoToWorkflows}
            sx={{ px: 4 }}
          >
            Go to Workflow Library
          </Button>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Import a workflow, then return to continue the setup
          </Typography>
        </Box>
      )}

      {hasWorkflows && (
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'success.light', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ color: 'success.dark' }}>
            ✅ Workflow imported! Next, we'll configure it to work with your templates.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WorkflowImportStep;
