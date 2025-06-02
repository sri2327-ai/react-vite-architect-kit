
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  Card,
  CardContent,
} from '@mui/material';
import { CheckCircle, AccountCircle, Info, Settings, Payment } from '@mui/icons-material';
import { PrimaryButton } from '@/components/ui/Buttons';

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    label: 'Create Your Account',
    description: 'Sign up with your email or Google account',
    icon: <AccountCircle color="primary" />,
    details: 'Quick and secure registration process'
  },
  {
    label: 'Professional Information',
    description: 'Tell us about your medical practice',
    icon: <Info color="primary" />,
    details: 'Help us customize your experience'
  },
  {
    label: 'Optional EHR Integration',
    description: 'Connect your Electronic Health Records (optional)',
    icon: <Settings color="primary" />,
    details: 'Skip this step if you prefer to start without EHR'
  },
  {
    label: 'Start Using S10.AI',
    description: 'Begin documenting with AI assistance',
    icon: <CheckCircle color="primary" />,
    details: 'Transform your clinical documentation workflow'
  }
];

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Welcome to S10.AI
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your AI-powered clinical documentation assistant
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}
        >
          Getting started is simple - here's how:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {steps.map((step, index) => (
            <Card
              key={index}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(20, 49, 81, 0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #143151, #387E89)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {step.label}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                      {step.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      {step.details}
                    </Typography>
                  </Box>
                  {step.icon}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: 'primary.light',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.main'
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            💡 Pro Tip:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can always skip the EHR integration step and add it later. 
            Start documenting immediately with our no-EHR mode!
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3 }}>
        <PrimaryButton
          onClick={onClose}
          fullWidth
          sx={{
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          Let's Get Started
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
