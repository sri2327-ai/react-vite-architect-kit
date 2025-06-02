import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Divider, Alert, InputAdornment, IconButton, Link } from '@mui/material';
import { Visibility, VisibilityOff, Google, Mail } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { useResponsive } from '@/hooks/useResponsive';
export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {
    isMobile
  } = useResponsive();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };
  const handleGoogleLogin = () => {
    // Real Google OAuth integration
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&scope=openid%20profile%20email&response_type=code&state=google_oauth`;

    // Open Google OAuth in same window
    window.location.href = googleAuthUrl;
  };
  return <Box sx={{
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: {
      xs: 'column',
      md: 'row'
    },
    overflow: 'hidden'
  }}>
      {/* Left side - Branding */}
      <Box sx={{
      flex: {
        xs: 'none',
        md: 1
      },
      height: {
        xs: '200px',
        md: '100vh'
      },
      background: 'linear-gradient(135deg, #143151 0%, #387E89 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: {
        xs: 3,
        md: 4
      },
      color: 'white',
      textAlign: 'center'
    }}>
        
        
      </Box>

      {/* Right side - Login Form */}
      <Box sx={{
      flex: {
        xs: 1,
        md: 1
      },
      height: {
        xs: 'calc(100vh - 200px)',
        md: '100vh'
      },
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      p: {
        xs: 3,
        md: 5
      },
      overflow: 'auto'
    }}>
        {/* Logo and Title */}
        <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4,
        width: '100%',
        maxWidth: 400
      }}>
          <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3
        }}>
            <Box component="img" src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png" alt="S10.AI Logo" sx={{
            height: {
              xs: 40,
              md: 50
            },
            mr: 2
          }} />
            
          </Box>

          <Typography variant={isMobile ? "h5" : "h4"} sx={{
          fontWeight: 700,
          background: 'linear-gradient(90deg, #143151, #387E89)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          textAlign: 'center'
        }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{
          textAlign: 'center',
          fontSize: {
            xs: '0.9rem',
            md: '1rem'
          }
        }}>
            Sign in to your S10.AI account
          </Typography>
        </Box>

        {/* Form Container */}
        <Box sx={{
        width: '100%',
        maxWidth: 400
      }}>
          {error && <Alert severity="error" sx={{
          mb: 3,
          borderRadius: 2
        }}>
              {error}
            </Alert>}

          <SecondaryButton fullWidth onClick={handleGoogleLogin} startIcon={<Google />} sx={{
          mb: 3,
          py: 1.5,
          borderColor: 'divider',
          fontSize: {
            xs: '0.875rem',
            md: '1rem'
          },
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'background.paper'
          }
        }}>
            Continue with Google
          </SecondaryButton>

          <Divider sx={{
          my: 3
        }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleLogin}>
            <TextField fullWidth label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required sx={{
            mb: 3
          }} InputProps={{
            startAdornment: <InputAdornment position="start">
                    <Mail color="action" />
                  </InputAdornment>
          }} />

            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required sx={{
            mb: 3
          }} InputProps={{
            endAdornment: <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
          }} />

            <PrimaryButton fullWidth type="submit" disabled={loading} sx={{
            py: 1.5,
            mb: 3,
            fontWeight: 600,
            fontSize: {
              xs: '0.875rem',
              md: '1rem'
            }
          }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </PrimaryButton>
          </Box>

          <Box sx={{
          textAlign: 'center'
        }}>
            <Typography variant="body2" color="text.secondary" sx={{
            fontSize: {
              xs: '0.8rem',
              md: '0.875rem'
            }
          }}>
              Don't have an account?{' '}
              <Link href="/signup" sx={{
              background: 'linear-gradient(90deg, #143151, #387E89)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}>
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>;
};
export default Login;