
import React, { useEffect } from 'react';
import { Box, Typography, Button, Alert, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle as CheckIcon, ArrowForward as ArrowIcon } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';
import { useTemplateData } from '@/hooks/useTemplateData';
import { useApiContext } from '@/contexts/ApiContext';

const TemplateBuilderTour: React.FC = () => {
  const { completeStep, setCanProceed } = useGuide();
  const { useApiData } = useApiContext();
  const { templates } = useTemplateData(useApiData);

  const hasTemplates = templates && templates.length > 0;

  useEffect(() => {
    if (hasTemplates) {
      setCanProceed(true);
      completeStep('template-builder');
    } else {
      setCanProceed(false);
    }
  }, [hasTemplates, setCanProceed, completeStep]);

  const handleGoToTemplates = () => {
    // Navigate to template builder
    window.location.hash = '#templates';
    window.location.reload();
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Your First Template
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Templates are the foundation of your documentation system. They define the structure 
        and content of your clinical notes.
      </Typography>

      {hasTemplates ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Great! You have created {templates.length} template{templates.length > 1 ? 's' : ''}. 
          You can proceed to the next step.
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          You need to create at least one template before proceeding.
        </Alert>
      )}

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        What you'll do:
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <CheckIcon color={hasTemplates ? 'success' : 'action'} />
          </ListItemIcon>
          <ListItemText
            primary="Create a visit type"
            secondary="Define different types of patient encounters (e.g., Annual Physical, Follow-up)"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckIcon color={hasTemplates ? 'success' : 'action'} />
          </ListItemIcon>
          <ListItemText
            primary="Build your template"
            secondary="Add sections like Chief Complaint, Assessment, Plan using our drag-and-drop editor"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <CheckIcon color={hasTemplates ? 'success' : 'action'} />
          </ListItemIcon>
          <ListItemText
            primary="Configure AI instructions"
            secondary="Set up how AI should generate content for each section"
          />
        </ListItem>
      </List>

      {!hasTemplates && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowIcon />}
            onClick={handleGoToTemplates}
            sx={{ px: 4 }}
          >
            Go to Template Builder
          </Button>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Create your first template, then return to continue the guide
          </Typography>
        </Box>
      )}

      {hasTemplates && (
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'success.light', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ color: 'success.dark' }}>
            ✅ Template setup complete! You're ready for the next step.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TemplateBuilderTour;
