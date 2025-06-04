
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { CreditCard, Lock, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface PaymentProps {
  onBack: () => void;
  data: any;
}

export const Payment: React.FC<PaymentProps> = ({ onBack, data }) => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Payment successful! Please log in with your credentials to activate your account.',
            requiresOtpVerification: true,
            email: data.email
          }
        });
      }, 2000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center'
      }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="success.main" fontWeight={600}>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Your subscription has been activated successfully.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Redirecting you to login screen...
        </Typography>
        <CircularProgress size={24} sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%'
    }}>
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
        Complete Your Subscription
      </Typography>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Subscription Summary */}
        <Card sx={{ mb: 3, border: '1px solid', borderColor: 'primary.light' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              S10.AI Pro Plan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Full access to clinical workflows, templates, and EHR integration
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight={700}>
                $99.99
              </Typography>
              <Typography variant="body2" color="text.secondary">
                per month
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Payment Information
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Lock sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">
                  Your payment information is secure and encrypted
                </Typography>
              </Box>
            </Alert>

            <TextField
              fullWidth
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              sx={{ mb: 2 }}
              size="small"
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Expiry Date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                size="small"
                sx={{ flex: 1 }}
              />
            </Box>

            <TextField
              fullWidth
              label="Name on Card"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              sx={{ mb: 2 }}
              size="small"
            />

            <TextField
              fullWidth
              label="Billing Address"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 3 }}
              size="small"
            />

            <Divider sx={{ my: 2 }} />

            <FormControlLabel
              control={
                <Checkbox
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the terms of service and privacy policy
                </Typography>
              }
            />
          </CardContent>
        </Card>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 3,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handlePayment}
          disabled={loading || !agreeToTerms || !cardNumber || !expiryDate || !cvv || !nameOnCard}
          startIcon={loading ? <CircularProgress size={16} /> : <CreditCard />}
        >
          {loading ? 'Processing...' : 'Complete Payment'}
        </Button>
      </Box>
    </Box>
  );
};
