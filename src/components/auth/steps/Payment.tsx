
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
  { icon: <Cloud size={18} />, text: 'Unlimited clinical note transcriptions' },
  { icon: <Shield size={18} />, text: 'HIPAA-compliant data security' },
  { icon: <Headphones size={18} />, text: '24/7 customer support' },
  { icon: <BarChart3 size={18} />, text: 'Advanced analytics and insights' },
];

export const Payment: React.FC<PaymentProps> = ({ onBack, data }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // Redirect to dashboard or success page
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      maxHeight: { xs: 'calc(100vh - 200px)', sm: 'calc(100vh - 250px)' }
    }}>
      <Box sx={{ textAlign: 'center', mb: 3, flexShrink: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Complete Your Setup
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            px: { xs: 1, sm: 0 }
          }}
        >
          Choose your S10.AI subscription plan
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <Card
          sx={{
            mb: 4,
            border: 2,
            borderColor: 'primary.main',
            backgroundColor: 'background.paper',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" fontWeight={700} color="primary.main">
                $99
              </Typography>
              <Typography variant="h6" color="text.secondary">
                per month
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Professional Plan - Everything you need to get started
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <List sx={{ py: 0 }}>
              {features.map((feature, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: '#000000' }}>
                    {feature.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.text}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 500,
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
            mb: 4, 
            borderRadius: 2,
            backgroundColor: '#F0F8FF',
            borderColor: '#D6E8F5',
          }}
          icon={<CheckCircle size={20} />}
        >
          <Typography variant="body2" fontWeight={600}>
            Setup Summary Complete
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Account: {data.firstName} {data.lastName} • Specialty: {data.specialty}
            {data.ehrMode && ` • EHR: ${data.ehrSystem}`}
            • Retention: {data.retentionDuration?.replace('years', ' Years').replace('year', ' Year')}
          </Typography>
        </Alert>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: 3 }}
        >
          🔒 Secure payment processing • Cancel anytime • 30-day money-back guarantee
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        flexShrink: 0,
        pt: 2,
        borderTop: '1px solid #F0F8FF'
      }}>
        <SecondaryButton
          onClick={onBack}
          sx={{ 
            flex: 1,
            order: { xs: 2, sm: 1 },
            py: 1.5,
            borderRadius: 3
          }}
        >
          Back
        </SecondaryButton>
        <PrimaryButton
          onClick={handlePayment}
          disabled={loading}
          startIcon={<CreditCard size={18} />}
          sx={{ 
            flex: 2, 
            fontWeight: 600,
            order: { xs: 1, sm: 2 },
            py: 1.5,
            borderRadius: 3,
            fontSize: '1.1rem'
          }}
        >
          {loading ? 'Processing Payment...' : 'Complete Setup - $99/month'}
        </PrimaryButton>
      </Box>
    </Box>
  );
};
