
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
    icon: <Sparkles size={20} />,
    title: 'AI-Powered Documentation',
    description: 'Transform voice into clinical notes'
  },
  {
    icon: <Shield size={20} />,
    title: 'HIPAA Compliant',
    description: 'Bank-level security'
  },
  {
    icon: <Zap size={20} />,
    title: 'EHR Integration',
    description: 'Seamless workflow'
  },
  {
    icon: <Clock size={20} />,
    title: 'Save Time',
    description: 'Reduce documentation by 70%'
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
          height: { xs: '95vh', sm: '85vh' },
          maxHeight: { xs: '95vh', sm: '85vh' },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogContent sx={{ 
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #143151, #387E89)',
          p: { xs: 2, sm: 3 },
          textAlign: 'center',
          flexShrink: 0
        }}>
          <Box 
            component="img" 
            src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png" 
            alt="S10.AI Logo" 
            sx={{
              height: { xs: 30, sm: 40 },
              mb: 1
            }} 
          />
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 800,
              mb: 0.5,
              fontSize: { xs: '1.25rem', sm: '1.75rem' }
            }}
          >
            Welcome to S10.AI
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }}
          >
            The future of clinical documentation
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 0
        }}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                mb: { xs: 2, sm: 3 },
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '1.1rem', sm: '1.3rem' }
              }}
            >
              Transform Your Medical Practice
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {features.map((feature, index) => (
                <Grid key={index} size={{ xs: 6, sm: 6 }}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #F8FBFF 0%, #F0F8FF 100%)',
                      border: '2px solid #E8F4F8',
                      borderRadius: 2,
                      height: '100%',
                      minHeight: { xs: 80, sm: 100 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(20, 49, 81, 0.1)',
                        border: '2px solid white',
                        outline: '2px solid #387E89',
                        '& .feature-icon': {
                          transform: 'scale(1.1)'
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 }, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box
                        className="feature-icon"
                        sx={{
                          width: { xs: 32, sm: 40 },
                          height: { xs: 32, sm: 40 },
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #143151, #387E89)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px auto',
                          color: 'white',
                          boxShadow: '0 4px 16px rgba(20, 49, 81, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{
              textAlign: 'center',
              p: { xs: 1.5, sm: 2 },
              backgroundColor: '#F8FBFF',
              borderRadius: 2,
              border: '1px solid #E8F4F8'
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                Join over <strong>10,000+ healthcare professionals</strong>
              </Typography>
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                ⭐ ⭐ ⭐ ⭐ ⭐ 4.9/5 rating
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 2 }}>
            <PrimaryButton
              fullWidth
              onClick={onClose}
              sx={{
                py: { xs: 1.5, sm: 2 },
                fontWeight: 700,
                fontSize: { xs: '0.9rem', sm: '1rem' },
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
                mt: 1,
                fontSize: { xs: '0.75rem', sm: '0.8rem' }
              }}
            >
              No credit card required • 30-day free trial
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
