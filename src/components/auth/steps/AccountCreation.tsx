
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
import { Visibility, VisibilityOff, Google, Mail } from '@mui/icons-material';
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
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {!formData.isGoogleSignup && (
        <>
          <SecondaryButton
            fullWidth
            onClick={handleGoogleSignup}
            startIcon={<Google />}
            sx={{
              mb: 3,
              py: 1.5,
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'background.light',
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
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
            disabled={formData.isGoogleSignup}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
            disabled={formData.isGoogleSignup}
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail color="action" />
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
          helperText="Minimum 8 characters"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
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
              <Typography variant="body2">
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
              <Typography variant="body2">
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
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Continue
        </PrimaryButton>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link
            href="/login"
            sx={{
              color: 'primary.main',
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
