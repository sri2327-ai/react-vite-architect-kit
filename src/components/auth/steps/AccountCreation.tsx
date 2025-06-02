
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Card,
  CardContent,
} from '@mui/material';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface AccountCreationProps {
  onNext: (data: Partial<SignupData>) => void;
  data: Partial<SignupData>;
}

export const AccountCreation: React.FC<AccountCreationProps> = ({ onNext, data }) => {
  const [formData, setFormData] = useState({
    email: data.email || '',
    password: data.password || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    isGoogleSignup: data.isGoogleSignup || false,
    agreedToBAA: data.agreedToBAA || false,
    agreedToTerms: data.agreedToTerms || false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignup = () => {
    // Simulate Google OAuth
    setFormData(prev => ({
      ...prev,
      email: 'user@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      isGoogleSignup: true,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.agreedToBAA || !formData.agreedToTerms) {
      setError('Please accept both the Business Associate Agreement and Terms of Service');
      return;
    }

    if (!formData.isGoogleSignup && formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    onNext(formData);
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: '1.75rem', sm: '2.25rem' }
          }}
        >
          Create Your Account
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          Join thousands of healthcare professionals using S10.AI to revolutionize clinical documentation
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            border: '1px solid #ffcdd2',
            backgroundColor: '#ffebee'
          }}
        >
          {error}
        </Alert>
      )}

      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          border: '2px solid #F0F8FF',
          backgroundColor: 'background.paper',
          boxShadow: '0 8px 32px rgba(20, 49, 81, 0.08)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {!formData.isGoogleSignup && (
            <>
              <SecondaryButton
                fullWidth
                onClick={handleGoogleSignup}
                startIcon={
                  <Box 
                    component="img" 
                    src="https://developers.google.com/identity/images/g-logo.png" 
                    alt="Google" 
                    sx={{ width: 20, height: 20 }} 
                  />
                }
                sx={{
                  mb: 4,
                  py: 2,
                  borderColor: '#E0E7FF',
                  borderWidth: 2,
                  fontSize: { xs: '0.975rem', sm: '1.05rem' },
                  fontWeight: 600,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: '#F8FAFF',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  },
                }}
              >
                Continue with Google
              </SecondaryButton>

              <Divider sx={{ my: 4 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    backgroundColor: 'background.paper',
                    px: 3,
                    fontWeight: 500
                  }}
                >
                  or create with email
                </Typography>
              </Divider>
            </>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3, 
              mb: 4 
            }}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
                disabled={formData.isGoogleSignup}
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: formData.isGoogleSignup ? '#F5F5F5' : 'transparent'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={18} color="#888888" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
                disabled={formData.isGoogleSignup}
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: formData.isGoogleSignup ? '#F5F5F5' : 'transparent'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={18} color="#888888" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={formData.isGoogleSignup}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: formData.isGoogleSignup ? '#F5F5F5' : 'transparent'
                }
              }}
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="#888888" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              sx={{ 
                mb: 5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              size="medium"
              helperText="Minimum 8 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} color="#888888" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mb: 5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreedToBAA}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreedToBAA: e.target.checked }))}
                    size="medium"
                    sx={{ color: '#387E89' }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Shield size={16} color="#387E89" />
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
                      I agree to the{' '}
                      <Link href="#" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
                        Business Associate Agreement (BAA)
                      </Link>
                    </Typography>
                  </Box>
                }
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                    size="medium"
                    sx={{ color: '#387E89' }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Shield size={16} color="#387E89" />
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
                      I agree to the{' '}
                      <Link href="#" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
                        Terms of Service
                      </Link>
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <PrimaryButton
              fullWidth
              type="submit"
              sx={{
                py: 2,
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: 3,
                textTransform: 'none'
              }}
            >
              Create Account & Continue →
            </PrimaryButton>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' } }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            sx={{
              background: 'linear-gradient(135deg, #143151, #387E89)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              fontWeight: 700,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign in here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
