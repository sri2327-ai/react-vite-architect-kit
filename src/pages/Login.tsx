
import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Divider, Alert, InputAdornment, IconButton, Link, Container } from '@mui/material';
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
  const { isMobile } = useResponsive();

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
    // Handle Google OAuth
    console.log('Google login');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: { xs: 'auto', md: '600px' },
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(20, 49, 81, 0.15)'
        }}>
          {/* Left side - Branding */}
          <Box sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #143151 0%, #387E89 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 4 },
            color: 'white',
            textAlign: 'center',
            minHeight: { xs: '200px', md: 'auto' }
          }}>
            <Typography variant={isMobile ? "h4" : "h3"} sx={{
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2
            }}>
              Welcome to S10.AI
            </Typography>
            <Typography variant="h6" sx={{
              opacity: 0.9,
              maxWidth: 400,
              lineHeight: 1.5,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}>
              Transform your workflow with intelligent automation and streamlined processes
            </Typography>
            
            {/* Animation placeholder */}
            <Box sx={{
              mt: 4,
              width: { xs: 250, md: 300 },
              height: { xs: 150, md: 200 },
              border: '2px dashed rgba(255,255,255,0.3)',
              borderRadius: 2,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Animation Space
              </Typography>
            </Box>
          </Box>

          {/* Right side - Login Form */}
          <Box sx={{
            flex: 1,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 3, md: 5 }
          }}>
            {/* Logo and Title */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3
              }}>
                <Box
                  component="img"
                  src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
                  alt="S10.AI Logo"
                  sx={{
                    height: { xs: 40, md: 50 },
                    mr: 2,
                  }}
                />
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #143151, #387E89)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  S10.AI
                </Typography>
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
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}>
                Sign in to your S10.AI account
              </Typography>
            </Box>

            {/* Form Container */}
            <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <SecondaryButton
                fullWidth
                onClick={handleGoogleLogin}
                startIcon={<Google />}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderColor: 'divider',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'background.paper'
                  }
                }}
              >
                Continue with Google
              </SecondaryButton>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  or
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
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail color="action" />
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
                  sx={{ mb: 3 }}
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
                    )
                  }}
                />

                <PrimaryButton
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 3,
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </PrimaryButton>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{
                  fontSize: { xs: '0.8rem', md: '0.875rem' }
                }}>
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    sx={{
                      background: 'linear-gradient(90deg, #143151, #387E89)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
