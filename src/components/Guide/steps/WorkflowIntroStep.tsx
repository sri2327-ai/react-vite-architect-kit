
import React, { useEffect } from 'react';
import { Box, Typography, Card, Alert } from '@mui/material';
import { AccountTree, Hub, AutoMode, Timeline } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';

const WorkflowIntroStep: React.FC = () => {
  const { completeStep, setCanProceed } = useGuide();

  useEffect(() => {
    setCanProceed(true);
    completeStep('workflow-intro');
  }, [setCanProceed, completeStep]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', textAlign: 'center' }}>
        Workflow Builder Introduction 🔄
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
        Workflows automate your EHR integration by connecting your templates to specific appointment types and scheduling systems.
      </Typography>

      <Alert severity="success" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>EHR Integration Activated!</strong> You can now create workflows that automatically generate notes based on your EHR appointments.
        </Typography>
      </Alert>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3 
      }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Hub sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
            <Typography variant="h6">What are Workflows?</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Workflows connect your note templates to your EHR system, automatically creating documentation based on appointment types.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            When a patient appointment is scheduled, the workflow automatically:
            • Detects the appointment type
            • Selects the appropriate template
            • Pre-fills patient information
            • Schedules note generation
          </Typography>
        </Card>

        <Card sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoMode sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
            <Typography variant="h6">Automation Benefits</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Save time and reduce errors with automated note generation that adapts to your practice patterns.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Benefits include:
            • Consistent documentation standards
            • Reduced manual data entry
            • Automatic appointment detection
            • Customizable scheduling rules
          </Typography>
        </Card>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          How Workflows Work in Your Practice
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2 
        }}>
          {[
            { icon: <Timeline />, title: 'Appointment Scheduled', desc: 'Patient books appointment in your EHR system' },
            { icon: <AccountTree />, title: 'Workflow Triggered', desc: 'System detects appointment type and activates workflow' },
            { icon: <Hub />, title: 'Template Selected', desc: 'Appropriate note template is automatically chosen' },
            { icon: <AutoMode />, title: 'Note Generated', desc: 'Documentation is created and ready for your review' }
          ].map((step, index) => (
            <Card key={index} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
              <Box sx={{ color: 'primary.main', mb: 1 }}>
                {step.icon}
              </Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {step.desc}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 4, p: 3, backgroundColor: 'action.hover', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          🎯 Next Steps:
        </Typography>
        <Typography variant="body2">
          In the following steps, we'll show you how to browse the Workflow Library, import a pre-built workflow, 
          and configure it to work with your specific EHR system and appointment types.
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkflowIntroStep;
