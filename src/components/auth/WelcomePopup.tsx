
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Step,
  StepLabel,
  Stepper,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { CheckCircle, User, Settings, CreditCard } from '@mui/icons-material';
import { PrimaryButton } from '@/components/ui/Buttons';

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

const gettingStartedSteps = [
  {
    icon: <User sx={{ fontSize: 20 }} />,
    title: 'Create Account',
    description: 'Set up your S10.AI account with basic information',
    status: 'active'
  },
  {
    icon: <Settings sx={{ fontSize: 20 }} />,
    title: 'Configure Settings',
    description: 'Choose your specialty and EHR integration preferences',
    status: 'upcoming'
  },
  {
    icon: <CreditCard sx={{ fontSize: 20 }} />,
    title: 'Complete Setup',
    description: 'Finalize payment and start using S10.AI',
    status: 'upcoming'
  }
];

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Welcome to S10.AI! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let's get you set up in just a few simple steps
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 2,
              textAlign: 'center'
            }}
          >
            Getting Started Guide
          </Typography>

          <Box sx={{ space: 2 }}>
            {gettingStartedSteps.map((step, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  border: step.status === 'active' ? 2 : 1,
                  borderColor: step.status === 'active' ? 'primary.main' : 'divider',
                  background: step.status === 'active' 
                    ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)'
                    : 'background.paper'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: step.status === 'active' 
                          ? 'linear-gradient(135deg, #143151, #387E89)'
                          : '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: step.status === 'active' ? 'white' : '#666'
                      }}
                    >
                      {step.icon}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          {step.title}
                        </Typography>
                        {step.status === 'active' && (
                          <Chip 
                            label="Current" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#E8F5E8', 
                              color: '#2E7D32',
                              fontSize: '0.7rem'
                            }} 
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>

                    {step.status === 'completed' && (
                      <CheckCircle sx={{ color: '#2E7D32' }} />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: '#FFF8E1',
              borderRadius: 2,
              border: '1px solid #FFE082'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#F57F17',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              💡 Tip: Complete all steps to unlock the full potential of S10.AI
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <PrimaryButton
          onClick={onClose}
          fullWidth
          sx={{
            py: 1.5,
            fontWeight: 700,
            borderRadius: 2
          }}
        >
          Let's Get Started! →
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
