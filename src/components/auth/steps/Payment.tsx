
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
  TextField,
  Dialog,
  DialogContent,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  CheckCircle, 
  CreditCard, 
  Shield, 
  Cloud,
  Headphones,
  BarChart3,
  X,
  Tag
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface PaymentProps {
  onBack: () => void;
  data: Partial<SignupData>;
}

interface PricingData {
  noEhrPrice: number;
  ehrPrice: number;
  promoDiscount?: number;
}

const features = [
  { icon: <Cloud size={20} />, text: 'Unlimited clinical note transcriptions' },
  { icon: <Shield size={20} />, text: 'HIPAA-compliant data security' },
  { icon: <Headphones size={20} />, text: '24/7 customer support' },
  { icon: <BarChart3 size={20} />, text: 'Advanced analytics and insights' },
];

export const Payment: React.FC<PaymentProps> = ({ onBack, data }) => {
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock pricing data - will be fetched from API
  const [pricing] = useState<PricingData>({
    noEhrPrice: 79,
    ehrPrice: 99,
    promoDiscount: 0
  });

  const currentPrice = data.ehrMode ? pricing.ehrPrice : pricing.noEhrPrice;
  const finalPrice = promoApplied ? currentPrice - (pricing.promoDiscount || 0) : currentPrice;

  const handlePromoCode = () => {
    // Mock promo code validation - will be API call
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
      pricing.promoDiscount = 10;
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Mock API call to generate payment URL - replace with actual API
      const mockPaymentUrl = 'https://zohosecurepay.com/books/s10aiinc/securepay?CInvoiceID=2-cab38e1b3e20ae6086682ef94096c3e79c3170a50e8a1445eae7a317be3fe45a83a8fc305b6392e6c032b46515559313bfd7df8d54ea98406754244081b9ca6aab2e67f7acee8330';
      
      setPaymentUrl(mockPaymentUrl);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error generating payment URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Redirect to dashboard on successful payment
    window.location.href = '/dashboard';
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setLoading(false);
  };

  // Listen for payment completion messages from iframe
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'payment_success' || event.data.type === 'payment_success') {
        handlePaymentSuccess();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 2, sm: 3 }, 
        flexShrink: 0 
      }}>
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
            maxWidth: 600,
            mx: 'auto'
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
            mb: 2,
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
            p: { xs: 2, sm: 3, md: 4 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0
          }}>
            {/* Pricing Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h2" fontWeight={700} color="primary.main" sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } 
              }}>
                ${finalPrice}
              </Typography>
              {promoApplied && (
                <Typography variant="h6" sx={{ 
                  textDecoration: 'line-through', 
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  ${currentPrice}
                </Typography>
              )}
              <Typography variant="h6" color="text.secondary" sx={{ 
                fontSize: { xs: '1rem', sm: '1.25rem' },
                mb: 1
              }}>
                per month
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                {data.ehrMode ? 'Professional Plan with EHR' : 'Professional Plan'} - Everything you need
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Promo Code Section */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    label="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    InputProps={{
                      startAdornment: <Tag size={16} style={{ marginRight: 8, color: '#666' }} />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <SecondaryButton
                    fullWidth
                    size="small"
                    onClick={handlePromoCode}
                    disabled={!promoCode || promoApplied}
                    sx={{ 
                      py: { xs: 1.5, sm: 1.25 },
                      fontSize: { xs: '0.875rem', sm: '0.75rem' }
                    }}
                  >
                    Apply
                  </SecondaryButton>
                </Grid>
              </Grid>
              {promoApplied && (
                <Typography variant="body2" color="success.main" sx={{ 
                  mt: 1, 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  ✓ Promo code applied! You saved ${pricing.promoDiscount}
                </Typography>
              )}
            </Box>

            {/* Features List */}
            <List sx={{ py: 0, flex: 1 }}>
              {features.map((feature, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ 
                    minWidth: { xs: 32, sm: 40 }, 
                    color: 'primary.main' 
                  }}>
                    {feature.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.text}
                    primaryTypographyProps={{
                      variant: 'body1',
                      fontWeight: 500,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Setup Summary */}
        <Alert
          severity="success"
          sx={{ 
            mb: 2, 
            borderRadius: 2,
            backgroundColor: '#F0F8FF',
            borderColor: '#D6E8F5',
            flexShrink: 0
          }}
          icon={<CheckCircle size={20} />}
        >
          <Typography variant="body1" fontWeight={600} sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Setup Summary Complete
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ 
            mt: 0.5, 
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            Account: {data.firstName} {data.lastName} • Specialty: {data.specialty}
            {data.ehrMode && ` • EHR: ${data.ehrSystem}`}
          </Typography>
        </Alert>

        {/* Security Note */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            textAlign: 'center', 
            mb: 2, 
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
        gap: 2,
        flexShrink: 0,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <SecondaryButton
          onClick={onBack}
          sx={{ 
            flex: { xs: 1, sm: 1 },
            order: { xs: 2, sm: 1 },
            py: { xs: 1.5, sm: 1.25 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Back
        </SecondaryButton>
        <PrimaryButton
          onClick={handlePayment}
          disabled={loading}
          startIcon={<CreditCard size={20} />}
          sx={{ 
            flex: { xs: 1, sm: 2 }, 
            fontWeight: 600,
            order: { xs: 1, sm: 2 },
            py: { xs: 1.5, sm: 1.25 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          {loading ? 'Processing Payment...' : `Complete Setup - $${finalPrice}/month`}
        </PrimaryButton>
      </Box>

      {/* Payment Modal with Iframe */}
      <Dialog
        open={showPaymentModal}
        onClose={handlePaymentModalClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isFullScreen}
        sx={{
          '& .MuiDialog-paper': {
            height: { xs: '100vh', sm: '80vh' },
            maxHeight: { xs: '100vh', sm: '800px' },
            m: { xs: 0, sm: 2 }
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handlePaymentModalClose}
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              top: { xs: 8, sm: 16 },
              zIndex: 1,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <X size={24} />
          </IconButton>
          {paymentUrl && (
            <iframe
              src={paymentUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Zoho SecurePay"
              onLoad={() => {
                // Send payment completion simulation after 30 seconds for demo
                setTimeout(() => {
                  // This would normally come from the payment gateway
                  // window.postMessage('payment_success', '*');
                }, 30000);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
