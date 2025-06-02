
import React from 'react';
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
} from '@mui/material';
import { 
  UserPlus, 
  User, 
  Settings, 
  Sparkles 
} from 'lucide-react';
import { PrimaryButton } from '@/components/ui/Buttons';

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    label: 'Create Your Account',
    description: 'Quick and secure registration in under 2 minutes',
    icon: <UserPlus size={24} />,
    details: 'Sign up with email or continue with Google',
    color: '#E8F5E8'
  },
  {
    label: 'Professional Setup',
    description: 'Customize S10.AI for your medical practice',
    icon: <User size={24} />,
    details: 'Tell us about your specialty and preferences',
    color: '#E8F0FF'
  },
  {
    label: 'EHR Integration',
    description: 'Connect your Electronic Health Records (optional)',
    icon: <Settings size={24} />,
    details: 'Skip this step to start immediately without EHR',
    color: '#FFF8E8'
  },
  {
    label: 'Start Documenting',
    description: 'Begin using AI-powered clinical documentation',
    icon: <Sparkles size={24} />,
    details: 'Transform your workflow in minutes',
    color: '#F0E8FF'
  }
];

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: { xs: 2, sm: 4 },
          background: 'linear-gradient(135deg, #fafbfc 0%, #ffffff 100%)',
          boxShadow: '0 20px 60px rgba(20, 49, 81, 0.15)',
          overflow: 'hidden',
          mx: { xs: 1, sm: 2 },
          my: { xs: 1, sm: 2 },
          maxHeight: { xs: '95vh', sm: '90vh' }
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pb: { xs: 1, sm: 2 }, 
        pt: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 }
      }}>
        <Box sx={{ mb: { xs: 1, sm: 2 } }}>
          <Box 
            component="img" 
            src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png" 
            alt="S10.AI Logo" 
            sx={{
              height: { xs: 36, sm: 48 },
              mb: { xs: 1, sm: 2 }
            }} 
          />
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' }
          }}
        >
          Welcome to S10.AI
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
          }}
        >
          Your AI-powered clinical documentation assistant
        </Typography>
        <Chip 
          label="✨ Get started in under 5 minutes"
          sx={{
            mt: { xs: 1, sm: 2 },
            backgroundColor: '#E8F5E8',
            color: '#2E7D32',
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ 
        px: { xs: 2, sm: 3, md: 5 }, 
        py: { xs: 2, sm: 3, md: 4 } 
      }}>
        <Typography
          variant="h5"
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            textAlign: 'center', 
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
          }}
        >
          Here's how it works:
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gap: { xs: 2, sm: 3 },
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }
        }}>
          {steps.map((step, index) => (
            <Card
              key={index}
              sx={{
                border: '2px solid transparent',
                borderRadius: { xs: 2, sm: 3 },
                background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, #387E89, #A5CCF3) border-box`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(56, 126, 137, 0.2)',
                  '& .step-icon': {
                    transform: 'scale(1.1)',
                    background: 'linear-gradient(135deg, #143151, #387E89)',
                    color: 'white',
                    boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.8), 0 0 0 6px rgba(56, 126, 137, 0.3)'
                  }
                }
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 2, sm: 3 },
                  flexDirection: { xs: 'column', sm: 'row' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  <Box
                    className="step-icon"
                    sx={{
                      minWidth: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      borderRadius: { xs: '12px', sm: '16px' },
                      background: step.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#387E89',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                        borderRadius: { xs: '12px', sm: '16px' }
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      {step.icon}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 1, sm: 2 }, 
                      mb: 1,
                      flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: { xs: '1rem', sm: '1.125rem' }
                        }}
                      >
                        {step.label}
                      </Typography>
                      <Chip 
                        label={`Step ${index + 1}`}
                        size="small"
                        sx={{
                          backgroundColor: '#F0F8FF',
                          color: '#387E89',
                          fontWeight: 600,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500,
                        mb: 1,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {step.description}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        opacity: 0.8
                      }}
                    >
                      {step.details}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            mt: { xs: 3, sm: 4, md: 5 },
            p: { xs: 2, sm: 3, md: 4 },
            background: 'linear-gradient(135deg, #F0F8FF, #E8F4F8)',
            borderRadius: { xs: 2, sm: 3 },
            border: '2px solid #D6E8F5',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))',
              borderRadius: { xs: 2, sm: 3 }
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              mb: { xs: 1, sm: 2 }, 
              color: '#143151',
              fontSize: { xs: '1rem', sm: '1.125rem' }
            }}>
              💡 Pro Tip
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'text.secondary', 
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              You can always skip the EHR integration step and add it later. 
              Start documenting immediately with our no-EHR mode!
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        px: { xs: 2, sm: 3, md: 5 }, 
        pb: { xs: 2, sm: 3, md: 4 }, 
        pt: { xs: 1, sm: 2 } 
      }}>
        <PrimaryButton
          onClick={onClose}
          fullWidth
          sx={{
            py: { xs: 1.5, sm: 2 },
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            borderRadius: { xs: 2, sm: 3 },
            textTransform: 'none',
            boxShadow: '0 8px 24px rgba(20, 49, 81, 0.3)',
            '&:hover': {
              boxShadow: '0 12px 32px rgba(20, 49, 81, 0.4)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Let's Get Started →
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
