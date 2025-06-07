
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { 
  CheckCircle, 
  Person, 
  Settings, 
  CreditCard, 
  Celebration,
  ArrowForward,
  ArrowBack 
} from '@mui/icons-material';
import { PrimaryButton } from '@/components/ui/Buttons';

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

const gettingStartedSteps = [
  {
    icon: <Person sx={{ fontSize: 20 }} />,
    title: 'Create Account',
    description: 'Set up your S10.AI account with basic information',
    status: 'active'
  },
  {
    icon: <Settings sx={{ fontSize: 20 }} />,
    title: 'Configure Settings',
    description: 'Select specialty, customize templates, and connect EHR (optional). Skip to start without EHR.',
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
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep(1);
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <>
          <DialogTitle sx={{ textAlign: 'center', pb: 1, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Celebration sx={{ color: '#387E89', fontSize: { xs: 28, sm: 32 } }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #143151, #387E89)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.3rem', sm: '1.5rem' }
                }}
              >
                Welcome to S10.AI!
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
            >
              Let's get you set up in just a few simple steps
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 1 }}>
            <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 2,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Ready to revolutionize your documentation workflow?
              </Typography>

              <Typography 
                variant="body1"
                color="text.secondary"
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: 1.6
                }}
              >
                We'll guide you through a quick setup process to customize S10.AI for your practice and get you started with intelligent medical documentation.
              </Typography>

              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
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
                    textAlign: 'center',
                    fontSize: { xs: '0.75rem', sm: '0.8rem' }
                  }}
                >
                  💡 Tip: Complete all steps to unlock the full potential of S10.AI
                </Typography>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1, flexDirection: 'column', gap: 1 }}>
            <PrimaryButton
              onClick={handleNext}
              fullWidth
              endIcon={<ArrowForward />}
              sx={{
                py: 1.5,
                fontWeight: 700,
                borderRadius: 2,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              View Setup Guide
            </PrimaryButton>
            <Button
              onClick={onClose}
              variant="text"
              color="inherit"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
            >
              Skip for now
            </Button>
          </DialogActions>
        </>
      );
    }

    return (
      <>
        <DialogTitle sx={{ textAlign: 'center', pb: 1, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <IconButton 
              onClick={handleBack}
              sx={{ visibility: 'visible' }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Getting Started Guide
            </Typography>
            <Box sx={{ width: 40 }} /> {/* Spacer for centering */}
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}
          >
            Follow these steps to set up your account
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {gettingStartedSteps.map((step, index) => (
              <Card
                key={index}
                sx={{
                  border: step.status === 'active' ? 2 : 1,
                  borderColor: step.status === 'active' ? 'primary.main' : 'divider',
                  background: step.status === 'active' 
                    ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)'
                    : 'background.paper'
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        borderRadius: '50%',
                        background: step.status === 'active' 
                          ? 'linear-gradient(135deg, #143151, #387E89)'
                          : '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: step.status === 'active' ? 'white' : '#666',
                        flexShrink: 0
                      }}
                    >
                      {step.icon}
                    </Box>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            lineHeight: 1.2
                          }}
                        >
                          {step.title}
                        </Typography>
                        {step.status === 'active' && (
                          <Chip 
                            label="Current" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#E8F5E8', 
                              color: '#2E7D32',
                              fontSize: '0.65rem',
                              height: 20
                            }} 
                          />
                        )}
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          lineHeight: 1.3
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>

                    {step.status === 'completed' && (
                      <CheckCircle sx={{ color: '#2E7D32', fontSize: 20, flexShrink: 0 }} />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1 }}>
          <PrimaryButton
            onClick={onClose}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Let's Get Started! →
          </PrimaryButton>
        </DialogActions>
      </>
    );
  };

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
          mx: { xs: 1, sm: 2 },
          my: { xs: 1, sm: 2 },
        }
      }}
    >
      {renderStepContent()}
    </Dialog>
  );
};
