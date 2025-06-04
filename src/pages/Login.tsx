
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Divider, 
  Alert, 
  InputAdornment, 
  IconButton, 
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { Visibility, VisibilityOff, Mail } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { useResponsive } from '@/hooks/useResponsive';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isDesktop } = useResponsive();

  // Check if coming from signup payment success
  const locationState = location.state as any;
  const requiresOtpVerification = locationState?.requiresOtpVerification;
  const paymentSuccessMessage = locationState?.message;
  const signupEmail = locationState?.email;

  useEffect(() => {
    if (signupEmail) {
      setEmail(signupEmail);
    }
  }, [signupEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login
    setTimeout(() => {
      setLoading(false);
      
      // If this is a first-time login after signup, show OTP verification
      if (requiresOtpVerification) {
        setShowOtpDialog(true);
        sendOtp();
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  const sendOtp = async () => {
    setOtpLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setOtpLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const verifyOtp = async () => {
    setOtpLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setOtpLoading(false);
      setShowOtpDialog(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&scope=openid%20profile%20email&response_type=code&state=google_oauth`;
    window.location.href = googleAuthUrl;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: {
        xs: 'column',
        lg: 'row'
      },
      overflow: 'hidden'
    }}>
      {/* Left side - Empty gradient background - Only show on desktop */}
      {isDesktop && (
        <Box sx={{
          flex: 1,
          height: '100vh',
          background: 'linear-gradient(135deg, #143151 0%, #387E89 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { lg: 3, xl: 4 },
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Empty gradient background only */}
        </Box>
      )}

      {/* Right side - Login Form */}
      <Box sx={{
        flex: 1,
        minHeight: { xs: '100vh', lg: '100vh' },
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: {
          xs: 2,
          sm: 3,
          md: 4,
          lg: 5,
          xl: 6
        },
        overflow: 'auto',
        width: { xs: '100%', lg: 'auto' }
      }}>
        {/* Logo and Title */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: {
            xs: 3,
            sm: 4,
            md: 5,
            lg: 6
          },
          width: '100%',
          maxWidth: {
            xs: '100%',
            sm: 400,
            md: 440,
            lg: 480
          }
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: {
              xs: 2,
              sm: 3,
              md: 4
            }
          }}>
            <Box 
              component="img" 
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png" 
              alt="S10.AI Logo" 
              sx={{
                height: {
                  xs: 35,
                  sm: 45,
                  md: 55,
                  lg: 60
                }
              }} 
            />
          </Box>

          <Typography 
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #143151, #387E89)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 1, sm: 2 },
              textAlign: 'center',
              fontSize: {
                xs: '1.5rem',
                sm: '1.75rem',
                md: '2rem',
                lg: '2.25rem'
              },
              lineHeight: 1.2
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{
              textAlign: 'center',
              fontSize: {
                xs: '0.9rem',
                sm: '1rem',
                md: '1.125rem',
                lg: '1.25rem'
              },
              lineHeight: 1.5,
              fontWeight: 500,
              px: { xs: 1, sm: 0 }
            }}
          >
            Sign in to continue your clinical documentation
          </Typography>
        </Box>

        {/* Form Container */}
        <Box sx={{
          width: '100%',
          maxWidth: {
            xs: '100%',
            sm: 400,
            md: 440,
            lg: 480
          }
        }}>
          {paymentSuccessMessage && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {paymentSuccessMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {error}
            </Alert>
          )}

          <SecondaryButton
            fullWidth
            onClick={handleGoogleLogin}
            startIcon={
              <Box 
                component="img" 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                sx={{ width: { xs: 18, sm: 20 }, height: { xs: 18, sm: 20 } }} 
              />
            }
            sx={{
              mb: { xs: 2.5, sm: 3 },
              py: {
                xs: 1.25,
                sm: 1.5,
                md: 1.75
              },
              borderColor: 'divider',
              fontSize: {
                xs: '0.875rem',
                sm: '0.95rem',
                md: '1rem',
                lg: '1.125rem'
              },
              fontWeight: 600,
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }
            }}
          >
            Continue with Google
          </SecondaryButton>

          <Divider sx={{ my: { xs: 2.5, sm: 3, md: 3.5 } }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.875rem',
                  md: '0.95rem'
                },
                fontWeight: 500
              }}
            >
              or sign in with email
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="small"
              sx={{
                mb: { xs: 2.5, sm: 3, md: 3.5 },
                '& .MuiOutlinedInput-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                    md: '1.125rem'
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                    md: '1.125rem'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail 
                      color="action" 
                      sx={{
                        fontSize: {
                          xs: 18,
                          sm: 20,
                          md: 22
                        }
                      }} 
                    />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="small"
              sx={{
                mb: { xs: 2.5, sm: 3, md: 3.5 },
                '& .MuiOutlinedInput-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                    md: '1.125rem'
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                    md: '1.125rem'
                  }
                }
              }}
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
                )
              }}
            />

            <PrimaryButton
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                py: { xs: 1.25, sm: 1.5, md: 1.75 },
                mb: { xs: 2.5, sm: 3, md: 3.5 },
                fontWeight: 700,
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem',
                  md: '1.125rem',
                  lg: '1.25rem'
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </PrimaryButton>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.875rem',
                  md: '0.95rem',
                  lg: '1rem'
                },
                lineHeight: 1.5
              }}
            >
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                sx={{
                  background: 'linear-gradient(90deg, #143151, #387E89)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                  fontWeight: 700,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* OTP Verification Dialog */}
      <Dialog 
        open={showOtpDialog} 
        onClose={() => {}} 
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: { xs: 1, sm: 2 },
            m: { xs: 2, sm: 3 }
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
            Verify Your Email
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, fontSize: { xs: '0.875rem', sm: '1rem' }, lineHeight: 1.6 }}>
            To complete your account activation, please enter the verification code sent to your email.
          </Typography>
          
          {otpSent && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Verification code sent to {email}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Verification Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            inputProps={{ maxLength: 6 }}
            size="small"
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '1rem', sm: '1.125rem' }
              }
            }}
          />

          <Button
            variant="text"
            onClick={sendOtp}
            disabled={otpLoading}
            sx={{ mb: 2, fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {otpLoading ? 'Sending...' : 'Resend Code'}
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button
            variant="contained"
            onClick={verifyOtp}
            disabled={!otp || otp.length !== 6 || otpLoading}
            fullWidth
            sx={{
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 700,
              background: 'linear-gradient(90deg, #143151, #387E89)',
              '&:hover': {
                background: 'linear-gradient(90deg, #0d1f31, #2c6269)'
              }
            }}
          >
            {otpLoading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
