
import React, { useState } from 'react';
import { Box, TextField, Typography, Divider, Alert, InputAdornment, IconButton, Link } from '@mui/material';
import { Visibility, VisibilityOff, Mail } from '@mui/icons-material';
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
    // Real Google OAuth integration
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&scope=openid%20profile%20email&response_type=code&state=google_oauth`;
    
    // Open Google OAuth in same window
    window.location.href = googleAuthUrl;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: { xs: 'column', lg: 'row' },
      overflow: 'hidden'
    }}>
      {/* Left side - Branding */}
      <Box sx={{
        flex: { xs: 'none', lg: 1 },
        height: { xs: '25vh', sm: '30vh', md: '35vh', lg: '100vh' },
        background: 'linear-gradient(135deg, #143151 0%, #387E89 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 4 },
        color: 'white',
        textAlign: 'center'
      }}>
        <Box 
          component="img" 
          src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png" 
          alt="Logo" 
          sx={{
            height: { xs: 60, sm: 80, md: 100, lg: 120 },
            width: 'auto',
            filter: 'brightness(0) invert(1)'
          }} 
        />
      </Box>

      {/* Right side - Login Form */}
      <Box sx={{
        flex: { xs: 1, lg: 1 },
        minHeight: { xs: '75vh', lg: '100vh' },
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 3, sm: 4, md: 5, lg: 6 },
        overflow: 'auto'
      }}>
        {/* Logo and Title */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: { xs: 3, sm: 4, md: 5 },
          width: '100%',
          maxWidth: { xs: 320, sm: 380, md: 420 }
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 3 }
          }}>
            <Box 
              component="img" 
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png" 
              alt="Logo" 
              sx={{
                height: { xs: 35, sm: 40, md: 50 }
              }} 
            />
          </Box>

          <Typography variant={isMobile ? "h5" : "h4"} sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
          }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{
            textAlign: 'center',
            fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
            lineHeight: 1.5
          }}>
            Sign in to your account
          </Typography>
        </Box>

        {/* Form Container */}
        <Box sx={{
          width: '100%',
          maxWidth: { xs: 320, sm: 380, md: 420 }
        }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
                sx={{ width: 18, height: 18 }}
              />
            }
            sx={{
              mb: 3,
              py: { xs: 1.25, sm: 1.5 },
              borderColor: 'divider',
              fontSize: { xs: '0.825rem', sm: '0.875rem', md: '0.95rem' },
              fontWeight: 500,
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }
            }}
          >
            Continue with Google
          </SecondaryButton>

          <Divider sx={{ my: { xs: 2.5, sm: 3 } }}>
            <Typography variant="body2" color="text.secondary" sx={{
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}>
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
              sx={{ 
                mb: { xs: 2.5, sm: 3 },
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '0.875rem', sm: '0.95rem' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail color="action" sx={{ fontSize: { xs: 18, sm: 20 } }} />
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
              sx={{ 
                mb: { xs: 2.5, sm: 3 },
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '0.875rem', sm: '0.95rem' }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end"
                      size={isMobile ? 'small' : 'medium'}
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
                py: { xs: 1.25, sm: 1.5 },
                mb: { xs: 2.5, sm: 3 },
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </PrimaryButton>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' },
              lineHeight: 1.5
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
  );
};

export default Login;
