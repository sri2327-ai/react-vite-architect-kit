
import React, { useEffect } from 'react';
import { Box, Typography, Card, Alert, Button } from '@mui/material';
import { Description, Add, LibraryBig, Visibility } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';

const TemplateBuilderTour: React.FC = () => {
  const { completeStep, setCanProceed } = useGuide();

  useEffect(() => {
    setCanProceed(true);
    completeStep('template-tour');
  }, [setCanProceed, completeStep]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', textAlign: 'center' }}>
        Template Builder Overview 📝
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
        Templates are the foundation of efficient clinical documentation. Let's explore what you can do in the Template Builder section.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Look for "My Templates" in your sidebar</strong> - This is where you'll create and manage all your note templates.
        </Typography>
      </Alert>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Add sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Create New Templates</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Click the "Create New Template" button to build custom note templates for different visit types.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Choose from various section types
            • Drag and drop to organize
            • Preview before saving
          </Typography>
        </Card>

        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LibraryBig sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Template Library</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Browse pre-built templates in the "Template Library" tab and import ones that fit your practice.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Specialty-specific templates
            • One-click import
            • Customize after importing
          </Typography>
        </Card>

        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Description sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Manage Templates</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            View, edit, duplicate, and organize all your templates in one place.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Edit existing templates
            • Duplicate for variations
            • Delete unused templates
          </Typography>
        </Card>

        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Visibility sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6">Preview & Test</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Use the preview feature to see how your templates will look before using them.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Real-time preview
            • Test all sections
            • Ensure proper formatting
          </Typography>
        </Card>
      </Box>

      <Box sx={{ mt: 4, p: 3, backgroundColor: 'action.hover', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          💡 Pro Tips for Template Creation:
        </Typography>
        <Typography variant="body2" component="div">
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <li>Start with the Template Library to find templates similar to your needs</li>
            <li>Use Section Headers to organize your notes logically</li>
            <li>Add Checklists for standardized assessments</li>
            <li>Include Exam Lists for physical examination documentation</li>
            <li>Use Static Text for standard disclaimers or instructions</li>
          </Box>
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Ready to explore templates? Look for <strong>"My Templates"</strong> in your sidebar to get started!
        </Typography>
      </Box>
    </Box>
  );
};

export default TemplateBuilderTour;
