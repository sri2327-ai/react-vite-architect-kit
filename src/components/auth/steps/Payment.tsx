
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { 
  CheckCircle, 
  CreditCard, 
  Shield, 
  Cloud,
  Headphones,
  BarChart3 
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface PaymentProps {
  onBack: () => void;
  data: Partial<SignupData>;
}

const features = [
  { icon: <Cloud size={16} />, text: 'Unlimited clinical note transcriptions' },
  { icon: <Shield size={16} />, text: 'HIPAA-compliant data security' },
  { icon: <Headphones size={16} />, text: '24/7 customer support' },
  { icon: <BarChart3 size={16} />, text: 'Advanced analytics and insights' },
];

export const Payment: React.FC<PaymentProps> = ({ onBack, data }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header - Fixed height */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 1, sm: 1.5 }, 
        flexShrink: 0 
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 0.5,
            fontSize: { xs: '1.4rem', sm: '1.8rem' }
          }}
        >
          Complete Your Setup
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.95rem' }
          }}
        >
          Choose your S10.AI subscription plan
        </Typography>
      </Box>

      {/* Scrollable content area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'auto'
      }}>
        <Card
          sx={{
            mb: 1,
            border: 2,
            borderColor: 'primary.main',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}
        >
          <CardContent sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0
          }}>
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Typography variant="h3" fontWeight={700} color="primary.main" sx={{ fontSize: { xs: '1.6rem', sm: '2rem' } }}>
                $99
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                per month
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                Professional Plan - Everything you need
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <List sx={{ py: 0, flex: 1 }}>
              {features.map((feature, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 20, color: '#000000' }}>
                    {feature.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.text}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Alert
          severity="success"
          sx={{ 
            mb: 1, 
            borderRadius: 2,
            backgroundColor: '#F0F8FF',
            borderColor: '#D6E8F5',
            flexShrink: 0
          }}
          icon={<CheckCircle size={16} />}
        >
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
            Setup Summary Complete
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: '0.65rem' }}>
            Account: {data.firstName} {data.lastName} • Specialty: {data.specialty}
            {data.ehrMode && ` • EHR: ${data.ehrSystem}`}
          </Typography>
        </Alert>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            textAlign: 'center', 
            mb: 1, 
            fontSize: '0.7rem', 
            flexShrink: 0 
          }}
        >
          🔒 Secure payment • Cancel anytime • 30-day money-back guarantee
        </Typography>
      </Box>

      {/* Fixed buttons at bottom */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        flexShrink: 0,
        pt: 1.5,
        borderTop: '1px solid #F0F8FF'
      }}>
        <SecondaryButton
          onClick={onBack}
          sx={{ 
            flex: 1,
            order: { xs: 2, sm: 1 },
            py: 1.25,
            borderRadius: 2
          }}
        >
          Back
        </SecondaryButton>
        <PrimaryButton
          onClick={handlePayment}
          disabled={loading}
          startIcon={<CreditCard size={16} />}
          sx={{ 
            flex: 2, 
            fontWeight: 600,
            order: { xs: 1, sm: 2 },
            py: 1.25,
            borderRadius: 2,
            fontSize: { xs: '0.85rem', sm: '0.95rem' }
          }}
        >
          {loading ? 'Processing Payment...' : 'Complete Setup - $99/month'}
        </PrimaryButton>
      </Box>
    </Box>
  );
};
