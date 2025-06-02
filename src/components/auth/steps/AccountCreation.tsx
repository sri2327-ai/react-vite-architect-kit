
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
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(90deg, #143151, #387E89)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          textAlign: 'center',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}
      >
        Create Your Account
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ 
          textAlign: 'center', 
          mb: 4,
          fontSize: { xs: '0.875rem', sm: '1rem' },
          px: { xs: 1, sm: 0 }
        }}
      >
        Join S10.AI to revolutionize your clinical documentation
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                sx={{ width: 18, height: 18 }} 
              />
            }
            sx={{
              mb: 3,
              py: { xs: 1.25, sm: 1.5 },
              borderColor: 'divider',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              },
            }}
          >
            Sign up with Google
          </SecondaryButton>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>
        </>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          mb: 3 
        }}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
            disabled={formData.isGoogleSignup}
            size="small"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
            disabled={formData.isGoogleSignup}
            size="small"
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
          sx={{ mb: 3 }}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail color="action" sx={{ fontSize: 20 }} />
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
          sx={{ mb: 4 }}
          size="small"
          helperText="Minimum 8 characters"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
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
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                I agree to the{' '}
                <Link href="#" color="primary" sx={{ textDecoration: 'none' }}>
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
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                I agree to the{' '}
                <Link href="#" color="primary" sx={{ textDecoration: 'none' }}>
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
            py: { xs: 1.25, sm: 1.5 },
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Continue
        </PrimaryButton>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            sx={{
              background: 'linear-gradient(90deg, #143151, #387E89)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              fontWeight: 600,
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
