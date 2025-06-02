
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
  Security, 
  CloudSync,
  Support,
  Analytics 
} from '@mui/icons-material';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface PaymentProps {
  onBack: () => void;
  data: Partial<SignupData>;
}

const features = [
  { icon: <CloudSync />, text: 'Unlimited clinical note transcriptions' },
  { icon: <Security />, text: 'HIPAA-compliant data security' },
  { icon: <Support />, text: '24/7 customer support' },
  { icon: <Analytics />, text: 'Advanced analytics and insights' },
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
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Complete Your Setup
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Choose your S10.AI subscription plan
      </Typography>

      <Card
        sx={{
          mb: 4,
          border: 2,
          borderColor: 'primary.main',
          backgroundColor: 'background.paper',
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
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {React.cloneElement(feature.icon, { sx: { color: '#000000' }, fontSize: 'small' })}
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
        sx={{ mb: 4, borderRadius: 2 }}
        icon={<CheckCircle />}
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

      <Box sx={{ display: 'flex', gap: 2 }}>
        <SecondaryButton
          onClick={onBack}
          sx={{ flex: 1 }}
        >
          Back
        </SecondaryButton>
        <PrimaryButton
          onClick={handlePayment}
          disabled={loading}
          startIcon={<CreditCard />}
          sx={{ flex: 2, fontWeight: 600 }}
        >
          {loading ? 'Processing Payment...' : 'Complete Setup - $99/month'}
        </PrimaryButton>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', mt: 3 }}
      >
        🔒 Secure payment processing • Cancel anytime • 30-day money-back guarantee
      </Typography>
    </Box>
  );
};
