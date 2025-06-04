
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
  Button,
  Chip,
  InputAdornment
} from '@mui/material';
import { CreditCard, CheckCircle, LocalOffer, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';

interface PaymentProps {
  onBack: () => void;
  data: any;
}

export const Payment: React.FC<PaymentProps> = ({ onBack, data }) => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showIframe, setShowIframe] = useState(false);
  const navigate = useNavigate();

  const zohoPaymentUrl = "https://zohosecurepay.com/books/s10aiinc/securepay?CInvoiceID=2-cab38e1b3e20ae6086682ef94096c3e79c3170a50e8a1445eae7a317be3fe45a83a8fc305b6392e6c032b46515559313bfd7df8d54ea98406754244081b9ca6aab2e67f7acee8330";

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save20') {
      setPromoApplied(true);
      setDiscount(20);
    } else {
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  const handlePayNow = () => {
    setLoading(true);
    setShowIframe(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      navigate('/login', { 
        state: { 
          message: 'Payment successful! Please log in with your credentials to activate your account.',
          requiresOtpVerification: true,
          email: data.email
        }
      });
    }, 2000);
  };

  // Listen for payment success from iframe
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://zohosecurepay.com' && event.data === 'payment_success') {
        handlePaymentSuccess();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
        <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
        <Typography variant="h5" gutterBottom sx={{ color: '#4caf50', fontWeight: 600 }}>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Your subscription has been activated successfully.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Redirecting you to login screen...
        </Typography>
        <CircularProgress size={24} sx={{ mt: 2, color: '#4caf50' }} />
      </Box>
    );
  }

  const originalPrice = 99.99;
  const finalPrice = originalPrice - (originalPrice * discount / 100);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%'
    }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3, flexShrink: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#4caf50',
            mb: 2,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Complete Your Subscription
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.125rem' }
          }}
        >
          Secure payment powered by Zoho
        </Typography>
      </Box>

      {/* Content Area - Remove overflow hidden */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Subscription Summary */}
        <Card sx={{ 
          border: '1px solid', 
          borderColor: '#e0e7ff',
          backgroundColor: 'background.paper'
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#4caf50', fontWeight: 600 }}>
              S10.AI Pro Plan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              Full access to clinical workflows, templates, and EHR integration
            </Typography>
            
            {/* Pricing */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" fontWeight={600}>
                Subscription Price:
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: promoApplied ? 'text.secondary' : '#4caf50',
                  fontWeight: 700,
                  textDecoration: promoApplied ? 'line-through' : 'none'
                }}
              >
                ${originalPrice.toFixed(2)}
              </Typography>
            </Box>

            {promoApplied && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" fontWeight={600} sx={{ color: '#4caf50' }}>
                    After {discount}% discount:
                  </Typography>
                  <Chip 
                    label={`${discount}% OFF`} 
                    size="small" 
                    sx={{ 
                      ml: 1,
                      backgroundColor: '#e8f5e8',
                      color: '#4caf50',
                      fontWeight: 600
                    }} 
                  />
                </Box>
                <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  ${finalPrice.toFixed(2)}
                </Typography>
              </Box>
            )}

            <Typography variant="body2" color="text.secondary">
              per month
            </Typography>
          </CardContent>
        </Card>

        {/* Promo Code Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalOffer sx={{ mr: 1, color: '#4caf50' }} />
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                Promo Code
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="SAVE20"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOffer sx={{ color: '#4caf50', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                onClick={handleApplyPromo}
                disabled={!promoCode}
                sx={{
                  minWidth: 100,
                  borderColor: '#4caf50',
                  color: '#4caf50',
                  '&:hover': {
                    borderColor: '#388e3c',
                    backgroundColor: 'rgba(76, 175, 80, 0.04)'
                  }
                }}
              >
                Apply
              </Button>
            </Box>

            {promoApplied && (
              <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600}>
                  Promo code applied! You save ${(originalPrice * discount / 100).toFixed(2)}
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CreditCard sx={{ mr: 1, color: '#4caf50' }} />
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                Secure Payment
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                🔒 Your payment is processed securely through Zoho SecurePay with bank-level encryption
              </Typography>
            </Alert>

            {/* Pay Now Button - Always visible and prominent */}
            <Box sx={{ 
              textAlign: 'center', 
              py: 4, 
              mb: 3,
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              border: '2px solid #4caf50'
            }}>
              <PrimaryButton
                onClick={handlePayNow}
                disabled={loading}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  minWidth: 250,
                  minHeight: 56
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now - $' + finalPrice.toFixed(2)}
              </PrimaryButton>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
                Click to proceed to secure payment gateway
              </Typography>
            </Box>

            {/* Zoho Payment Iframe */}
            {showIframe && (
              <Box sx={{ 
                width: '100%', 
                height: 500, 
                border: '1px solid #e0e7ff',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                mt: 2
              }}>
                <iframe
                  src={zohoPaymentUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ 
                    border: 'none',
                    display: 'block'
                  }}
                  title="Zoho SecurePay"
                  onLoad={() => setLoading(false)}
                />
                {loading && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ 
        flexShrink: 0,
        pt: 3,
        display: 'flex',
        gap: 2,
        justifyContent: 'space-between'
      }}>
        <SecondaryButton
          onClick={onBack}
          startIcon={<ArrowBack />}
          disabled={loading}
          sx={{
            py: { xs: 1.5, sm: 1.25 },
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            minWidth: 120
          }}
        >
          Back
        </SecondaryButton>
        
        <Button
          variant="text"
          onClick={handlePaymentSuccess}
          sx={{
            py: { xs: 1.5, sm: 1.25 },
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            color: 'text.secondary'
          }}
        >
          Simulate Payment Success (Demo)
        </Button>
      </Box>
    </Box>
  );
};
