
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
  { icon: <Cloud size={16} />, text: 'Unlimited clinical note transcriptions' },
  { icon: <Shield size={16} />, text: 'HIPAA-compliant data security' },
  { icon: <Headphones size={16} />, text: '24/7 customer support' },
  { icon: <BarChart3 size={16} />, text: 'Advanced analytics and insights' },
];

export const Payment: React.FC<PaymentProps> = ({ onBack, data }) => {
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

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
                ${finalPrice}
              </Typography>
              {promoApplied && (
                <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: '0.9rem' }}>
                  ${currentPrice}
                </Typography>
              )}
              <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                per month
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                {data.ehrMode ? 'Professional Plan with EHR' : 'Professional Plan'} - Everything you need
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Promo Code Section */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  size="small"
                  label="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: <Tag size={16} style={{ marginRight: 8, color: '#666' }} />
                  }}
                />
                <SecondaryButton
                  size="small"
                  onClick={handlePromoCode}
                  disabled={!promoCode || promoApplied}
                  sx={{ py: 1 }}
                >
                  Apply
                </SecondaryButton>
              </Box>
              {promoApplied && (
                <Typography variant="body2" color="success.main" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                  ✓ Promo code applied! You saved ${pricing.promoDiscount}
                </Typography>
              )}
            </Box>

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
          {loading ? 'Processing Payment...' : `Complete Setup - $${finalPrice}/month`}
        </PrimaryButton>
      </Box>

      {/* Payment Modal with Iframe */}
      <Dialog
        open={showPaymentModal}
        onClose={handlePaymentModalClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '80vh',
            maxHeight: '600px'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handlePaymentModalClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <X />
          </IconButton>
          {paymentUrl && (
            <iframe
              src={paymentUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Zoho SecurePay"
              onLoad={() => {
                // Send payment completion simulation after 5 seconds for demo
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
