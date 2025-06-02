
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
    <Box sx={{ 
      height: { xs: 'calc(100vh - 200px)', sm: 'calc(100vh - 250px)' },
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Box sx={{ textAlign: 'center', mb: 2, flexShrink: 0 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Create Your Account
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          Join thousands using S10.AI for clinical documentation
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              flexShrink: 0
            }}
          >
            {error}
          </Alert>
        )}

        <Card
          sx={{
            flex: 1,
            borderRadius: 2,
            border: '1px solid #F0F8FF',
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ 
            p: { xs: 2, sm: 3 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#a8a8a8',
              }
            }}>
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
                      mb: 2,
                      py: 1.5,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 600,
                      borderRadius: 2
                    }}
                  >
                    Continue with Google
                  </SecondaryButton>

                  <Divider sx={{ my: 2 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        backgroundColor: 'background.paper',
                        px: 2,
                        fontSize: '0.85rem'
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
                  gap: 2, 
                  mb: 2 
                }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    disabled={formData.isGoogleSignup}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={16} color="#888888" />
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
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={16} color="#888888" />
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
                  sx={{ mb: 2 }}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={16} color="#888888" />
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
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="Minimum 8 characters"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={16} color="#888888" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.agreedToBAA}
                        onChange={(e) => setFormData(prev => ({ ...prev, agreedToBAA: e.target.checked }))}
                        size="small"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Shield size={14} color="#387E89" />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          I agree to the{' '}
                          <Link href="#" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
                            Business Associate Agreement (BAA)
                          </Link>
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 1 }}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Shield size={14} color="#387E89" />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          I agree to the{' '}
                          <Link href="#" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
                            Terms of Service
                          </Link>
                        </Typography>
                      </Box>
                    }
                  />
                </Box>

                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: '0.8rem' }}
                  >
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ 
          flexShrink: 0,
          pt: 2
        }}>
          <PrimaryButton
            fullWidth
            type="submit"
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              borderRadius: 2
            }}
          >
            Create Account & Continue →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
