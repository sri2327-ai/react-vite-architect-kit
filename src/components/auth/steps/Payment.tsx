
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { CheckCircle, CreditCard, Security } from '@mui/icons-material';
import { SignupData } from '../SignupFlow';
import { useGuide } from '@/contexts/GuideContext';

interface PaymentProps {
  onBack: () => void;
  data: Partial<SignupData>;
}

export const Payment: React.FC<PaymentProps> = ({ onBack, data }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { startGuide } = useGuide();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentCompleted(true);
    
    // Start the implementation guide after successful payment
    setTimeout(() => {
      const userMode = data.ehrMode ? 'ehr' : 'standalone';
      startGuide(userMode);
    }, 1500);
  };

  if (paymentCompleted) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400
      }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
          Welcome to S10.AI! 🎉
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
          Your account has been successfully created
        </Typography>
        <Alert severity="info" sx={{ mb: 3, maxWidth: 500 }}>
          <Typography variant="body2">
            Your implementation guide will start automatically to help you get set up with 
            {data.ehrMode ? ' your EHR-integrated' : ' your standalone'} clinical documentation system.
          </Typography>
        </Alert>
        <Typography variant="body2" color="text.secondary">
          If the guide doesn't appear, you can always access it from your dashboard.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      overflow: 'auto'
    }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, flexShrink: 0 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Complete Your Setup
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Final step to activate your S10.AI account
        </Typography>
      </Box>

      {/* Payment Form */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Payment Information</Typography>
          </Box>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
            </Typography>
          </Alert>

          <Box sx={{ 
            p: 2, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 1,
            backgroundColor: 'action.hover'
          }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              S10.AI Professional Plan
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
              $99/month
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Includes EHR integration, unlimited templates, and priority support
            </Typography>
          </Box>
        </Card>

        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Security sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Security & Terms</Typography>
          </Box>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I agree to the Terms of Service and Privacy Policy
              </Typography>
            }
          />
        </Card>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        pt: 3,
        flexShrink: 0
      }}>
        <Button 
          onClick={onBack}
          variant="outlined"
          disabled={isProcessing}
        >
          Back
        </Button>
        
        <Button
          onClick={handlePayment}
          variant="contained"
          disabled={!agreedToTerms || isProcessing}
          sx={{ minWidth: 120 }}
        >
          {isProcessing ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Complete Setup'
          )}
        </Button>
      </Box>
    </Box>
  );
};
