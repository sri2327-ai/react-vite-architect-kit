
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff, Mail } from '@mui/icons-material';
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
    // Real Google OAuth integration
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&scope=openid%20profile%20email&response_type=code&state=google_signup`;
    window.location.href = googleAuthUrl;
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
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Create Your Account
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Join S10.AI to revolutionize your clinical documentation
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
            border: 'none',
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)',
          }}
        >
          {error}
        </Alert>
      )}

      {!formData.isGoogleSignup && (
        <>
          <SecondaryButton
            fullWidth
            onClick={handleGoogleSignup}
            startIcon={
              <Box
                component="img"
                src="/lovable-uploads/aedc49ae-9a96-4f24-b6d7-2a15e4ec0bb1.png"
                alt="Google"
                sx={{ width: 20, height: 20 }}
              />
            }
            sx={{
              mb: 3,
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
              border: '2px solid #E5E7EB',
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              color: '#374151',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              '&:hover': {
                borderColor: '#143151',
                backgroundColor: '#F8FAFC',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Sign up with Google
          </SecondaryButton>

          <Divider sx={{ my: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                px: 2,
              }}
            >
              or sign up with email
            </Typography>
          </Divider>
        </>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
            disabled={formData.isGoogleSignup}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: formData.isGoogleSignup ? '#F5F5F5' : '#FAFAFA',
                '&:hover': {
                  backgroundColor: formData.isGoogleSignup ? '#F5F5F5' : '#FFFFFF',
                },
                '&.Mui-focused': {
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 0 3px rgba(20, 49, 81, 0.1)',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
            disabled={formData.isGoogleSignup}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: formData.isGoogleSignup ? '#F5F5F5' : '#FAFAFA',
                '&:hover': {
                  backgroundColor: formData.isGoogleSignup ? '#F5F5F5' : '#FFFFFF',
                },
                '&.Mui-focused': {
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 0 3px rgba(20, 49, 81, 0.1)',
                },
              },
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
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: formData.isGoogleSignup ? '#F5F5F5' : '#FAFAFA',
              '&:hover': {
                backgroundColor: formData.isGoogleSignup ? '#F5F5F5' : '#FFFFFF',
              },
              '&.Mui-focused': {
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 0 3px rgba(20, 49, 81, 0.1)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail sx={{ color: '#6B7280' }} />
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
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: '#FAFAFA',
              '&:hover': {
                backgroundColor: '#FFFFFF',
              },
              '&.Mui-focused': {
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 0 3px rgba(20, 49, 81, 0.1)',
              },
            },
          }}
          helperText="Minimum 8 characters"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: '#6B7280' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ mb: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.agreedToBAA}
                onChange={(e) => setFormData(prev => ({ ...prev, agreedToBAA: e.target.checked }))}
                size="small"
                sx={{
                  color: '#6B7280',
                  '&.Mui-checked': {
                    color: '#143151',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                I agree to the{' '}
                <Link
                  href="#"
                  sx={{
                    color: '#143151',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#387E89',
                    },
                  }}
                >
                  Business Associate Agreement (BAA)
                </Link>
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                size="small"
                sx={{
                  color: '#6B7280',
                  '&.Mui-checked': {
                    color: '#143151',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                I agree to the{' '}
                <Link
                  href="#"
                  sx={{
                    color: '#143151',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#387E89',
                    },
                  }}
                >
                  Terms of Service
                </Link>
              </Typography>
            }
          />
        </Box>

        <PrimaryButton
          fullWidth
          type="submit"
          sx={{
            py: 2,
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: 3,
            textTransform: 'none',
            boxShadow: '0 6px 20px rgba(20, 49, 81, 0.25)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(20, 49, 81, 0.35)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Continue
        </PrimaryButton>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.9rem',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            sx={{
              color: '#143151',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline',
                color: '#387E89',
              },
              transition: 'color 0.2s ease-in-out',
            }}
          >
            Sign in here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
