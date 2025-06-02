
import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Sparkles, Shield, Zap, Clock } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/Buttons';

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: <Sparkles size={24} />,
    title: 'AI-Powered Documentation',
    description: 'Transform your voice into structured clinical notes instantly'
  },
  {
    icon: <Shield size={24} />,
    title: 'HIPAA Compliant',
    description: 'Bank-level security for all your patient data'
  },
  {
    icon: <Zap size={24} />,
    title: 'EHR Integration',
    description: 'Seamlessly connect with your existing workflow'
  },
  {
    icon: <Clock size={24} />,
    title: 'Save Time',
    description: 'Reduce documentation time by up to 70%'
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
          backgroundColor: 'background.paper',
          maxHeight: { xs: '90vh', sm: '80vh' },
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ 
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        height: { xs: '90vh', sm: 'auto' },
        maxHeight: { xs: '90vh', sm: '80vh' }
      }}>
        {/* Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #143151, #387E89)',
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
          flexShrink: 0
        }}>
          <Box 
            component="img" 
            src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png" 
            alt="S10.AI Logo" 
            sx={{
              height: { xs: 40, sm: 50 },
              mb: 2
            }} 
          />
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            Welcome to S10.AI
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            The future of clinical documentation is here
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ 
          p: { xs: 3, sm: 4 },
          flex: 1,
          overflow: 'auto',
          minHeight: 0
        }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Transform Your Medical Practice
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {features.map((feature, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #F8FBFF 0%, #F0F8FF 100%)',
                    border: '2px solid #E8F4F8',
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(20, 49, 81, 0.1)',
                      border: '2px solid white',
                      outline: '2px solid #387E89',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #143151, #387E89)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto',
                        color: 'white',
                        boxShadow: '0 4px 16px rgba(20, 49, 81, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{
            textAlign: 'center',
            p: 3,
            backgroundColor: '#F8FBFF',
            borderRadius: 3,
            border: '1px solid #E8F4F8',
            mb: 3
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Join over <strong>10,000+ healthcare professionals</strong> who trust S10.AI
            </Typography>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
              ⭐ ⭐ ⭐ ⭐ ⭐ 4.9/5 rating from verified users
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          p: { xs: 3, sm: 4 },
          borderTop: '1px solid #F0F8FF',
          flexShrink: 0
        }}>
          <PrimaryButton
            fullWidth
            onClick={onClose}
            sx={{
              py: 2,
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              borderRadius: 3,
              textTransform: 'none'
            }}
          >
            Get Started - Create Your Account →
          </PrimaryButton>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              mt: 2,
              fontSize: '0.875rem'
            }}
          >
            No credit card required • 30-day free trial • Cancel anytime
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
