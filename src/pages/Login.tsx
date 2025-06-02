
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Divider, Alert, InputAdornment, IconButton, Link } from '@mui/material';
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
    window.location.href = googleAuthUrl;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      overflow: 'hidden'
    }}>
      {/* Left side - Branding */}
      <Box sx={{
        flex: { xs: 'none', md: 1 },
        height: { xs: '200px', md: '100vh' },
        background: 'linear-gradient(135deg, #143151 0%, #387E89 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 3, md: 4 },
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}>
        <Typography
          variant={isMobile ? "h3" : "h2"}
          sx={{
            fontWeight: 800,
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            background: 'linear-gradient(45deg, #FFFFFF 30%, #A5CCF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          S10.AI
        </Typography>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          sx={{
            opacity: 0.9,
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          Revolutionizing Clinical Documentation with AI
        </Typography>
      </Box>

      {/* Right side - Login Form */}
      <Box sx={{
        flex: { xs: 1, md: 1 },
        height: { xs: 'calc(100vh - 200px)', md: '100vh' },
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 3, md: 5 },
        overflow: 'auto',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 70% 20%, rgba(56, 126, 137, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}>
        {/* Logo and Title */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          width: '100%',
          maxWidth: 420,
          zIndex: 1,
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            p: 2,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <Box
              component="img"
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
              alt="S10.AI Logo"
              sx={{
                height: { xs: 45, md: 55 },
                mr: 2
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

          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 700,
              color: '#143151',
              mb: 1,
              textAlign: 'center',
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              fontWeight: 400,
            }}
          >
            Sign in to your account to continue
          </Typography>
        </Box>

        {/* Form Container */}
        <Box sx={{
          width: '100%',
          maxWidth: 420,
          zIndex: 1,
        }}>
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

          <SecondaryButton
            fullWidth
            onClick={handleGoogleLogin}
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
              fontSize: { xs: '0.95rem', md: '1rem' },
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
            Continue with Google
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
              sx={{
                mb: 3,
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            <PrimaryButton
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                py: 2,
                mb: 3,
                fontWeight: 600,
                fontSize: { xs: '0.95rem', md: '1rem' },
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(20, 49, 81, 0.25)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(20, 49, 81, 0.35)',
                },
                '&:disabled': {
                  transform: 'none',
                  boxShadow: '0 4px 12px rgba(20, 49, 81, 0.15)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </PrimaryButton>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', md: '0.95rem' },
                fontWeight: 400,
              }}
            >
              Don't have an account?{' '}
              <Link
                href="/signup"
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
