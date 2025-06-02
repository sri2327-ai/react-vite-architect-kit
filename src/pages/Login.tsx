
import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Divider, Alert, InputAdornment, IconButton, Link, Grid } from '@mui/material';
import { Visibility, VisibilityOff, Google, Mail } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      background: `linear-gradient(135deg, ${(theme) => theme.palette.background.paper} 0%, ${(theme) => theme.palette.background.default} 100%)`
    }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Left side - Animation space */}
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: 'linear-gradient(135deg, #143151 0%, #387E89 100%)'
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white'
          }}>
            <Typography variant="h3" sx={{
              fontWeight: 700,
              mb: 2,
              textAlign: 'center'
            }}>
              Welcome to S10.AI
            </Typography>
            <Typography variant="h6" sx={{
              opacity: 0.9,
              textAlign: 'center',
              maxWidth: 400
            }}>
              Transform your workflow with intelligent automation
            </Typography>
            {/* Space reserved for future animation */}
            <Box sx={{
              mt: 4,
              width: 300,
              height: 200,
              border: '2px dashed rgba(255,255,255,0.3)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" sx={{
                opacity: 0.7
              }}>
                Animation Space
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right side - Login Form */}
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}>
          <Card sx={{
            maxWidth: 440,
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(20, 49, 81, 0.15)',
            border: `1px solid ${(theme) => theme.palette.divider}`
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #143151, #387E89)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to your S10.AI account
                </Typography>
              </Box>

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
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </PrimaryButton>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
