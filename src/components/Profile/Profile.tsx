
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Link,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Switch,
  FormControlLabel,
  TextField
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Cancel as CancelIcon,
  Storage as StorageIcon,
  Logout as LogoutIcon,
  Extension as ExtensionIcon,
  Login as LoginIcon,
  PhoneAndroid as MobileIcon,
  OpenInNew as OpenInNewIcon,
  Security as SecurityIcon,
  CloudUpload as CloudIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import { useProfileData } from '../../hooks/useProfileData';
import { useApiContext } from '../../contexts/ApiContext';

interface UserProfile {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  specialty: string;
  ehrMode: boolean;
  ehrName?: string;
  notesRetentionDuration: number; // in months
  mfaEnabled: boolean;
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showMfaDialog, setShowMfaDialog] = useState(false);
  const [mfaOtp, setMfaOtp] = useState('');
  const [mfaOtpSent, setMfaOtpSent] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  
  const { useApiData } = useApiContext();
  const { profile, loading, error, updateProfile } = useProfileData(useApiData);

  const retentionOptions = [
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 12, label: '1 Year' },
    { value: 24, label: '2 Years' },
    { value: 36, label: '3 Years' },
    { value: 60, label: '5 Years' },
    { value: -1, label: 'Permanent' }
  ];

  const handleRetentionChange = async (duration: number) => {
    try {
      await updateProfile({ notesRetentionDuration: duration });
    } catch (error) {
      console.error('Failed to update retention duration:', error);
    }
  };

  const handleMfaToggle = async (enabled: boolean) => {
    if (enabled) {
      // Show MFA setup dialog
      setShowMfaDialog(true);
      sendMfaOtp();
    } else {
      // Disable MFA directly
      try {
        await updateProfile({ mfaEnabled: false });
      } catch (error) {
        console.error('Failed to disable MFA:', error);
      }
    }
  };

  const sendMfaOtp = async () => {
    setMfaLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setMfaLoading(false);
      setMfaOtpSent(true);
    }, 1000);
  };

  const verifyMfaOtp = async () => {
    setMfaLoading(true);
    // Simulate OTP verification
    setTimeout(async () => {
      setMfaLoading(false);
      setShowMfaDialog(false);
      setMfaOtp('');
      setMfaOtpSent(false);
      try {
        await updateProfile({ mfaEnabled: true });
      } catch (error) {
        console.error('Failed to enable MFA:', error);
      }
    }, 1000);
  };

  const handleCancelSubscription = () => {
    console.log('Canceling subscription...');
    setShowCancelDialog(false);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setShowLogoutDialog(false);
    window.location.href = '/login';
  };

  const ProfileField = ({ 
    icon, 
    label, 
    value, 
    chip = false 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string | boolean; 
    chip?: boolean;
  }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      py: { xs: 1, md: 1.5 },
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:last-child': {
        borderBottom: 'none'
      }
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: { xs: 32, md: 40 }, 
        mr: 2,
        color: 'primary.main'
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
          {label}
        </Typography>
        {chip && typeof value === 'boolean' ? (
          <Chip 
            label={value ? 'EHR Connected' : 'No EHR Connection'}
            color={value ? 'success' : 'default'}
            size="small"
            sx={{ mt: 0.5, fontSize: '0.75rem' }}
          />
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
            {String(value)}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const QuickLinkCard = ({ 
    href, 
    icon, 
    title, 
    description 
  }: { 
    href: string; 
    icon: React.ReactNode; 
    title: string; 
    description: string;
  }) => (
    <Card 
      component={Link}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ 
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ color: 'primary.main' }}>
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <OpenInNewIcon fontSize="small" color="action" />
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">
          Failed to load profile data: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 3 } }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          mb: { xs: 2, md: 3 },
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        My Profile
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' }, 
        gap: { xs: 2, md: 3 } 
      }}>
        <Box sx={{ flex: { lg: 2 } }}>
          {/* Personal Information */}
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}>
              <PersonIcon color="primary" />
              Personal Information
            </Typography>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 2 
            }}>
              <ProfileField
                icon={<EmailIcon />}
                label="Email Address"
                value={profile.email}
              />
              <ProfileField
                icon={<PhoneIcon />}
                label="Phone Number"
                value={profile.phoneNumber}
              />
              <ProfileField
                icon={<PersonIcon />}
                label="First Name"
                value={profile.firstName}
              />
              <ProfileField
                icon={<PersonIcon />}
                label="Last Name"
                value={profile.lastName}
              />
              <ProfileField
                icon={<BusinessIcon />}
                label="Medical Specialty"
                value={profile.specialty}
              />
              
              {/* Only show EHR Integration Status if ehrMode is true */}
              {profile.ehrMode && (
                <>
                  <ProfileField
                    icon={<SettingsIcon />}
                    label="EHR Integration Status"
                    value={profile.ehrMode}
                    chip
                  />
                  {profile.ehrName && (
                    <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                      <ProfileField
                        icon={<StorageIcon />}
                        label="Connected EHR System"
                        value={profile.ehrName}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>

            {/* Show EHR disabled message if ehrMode is false */}
            {!profile.ehrMode && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  EHR Integration Disabled
                </Typography>
                <Typography variant="body2">
                  Your account is currently set to no-EHR mode. EHR integration features and workflow automation are not available.
                </Typography>
              </Alert>
            )}
          </Paper>

          {/* Security Settings */}
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}>
              <SecurityIcon color="primary" />
              Security & Authentication
            </Typography>

            <Alert severity="info" sx={{ mb: 3, fontSize: { xs: '0.875rem', md: '1rem' } }}>
              Enhance your account security with multi-factor authentication using email verification.
            </Alert>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: 2, 
              backgroundColor: 'grey.50', 
              borderRadius: 1,
              mb: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ShieldIcon color="primary" />
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Multi-Factor Authentication (MFA)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Secure your account with email-based verification codes
                  </Typography>
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.mfaEnabled || false}
                    onChange={(e) => handleMfaToggle(e.target.checked)}
                    color="primary"
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>

            {profile.mfaEnabled && (
              <Box sx={{ p: 2, backgroundColor: 'success.light', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="success.dark" sx={{ mb: 1 }}>
                  <strong>MFA is enabled</strong>
                </Typography>
                <Typography variant="caption" color="success.dark">
                  You will receive a verification code via email each time you log in from a new device.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Data Management */}
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}>
              <CloudIcon color="primary" />
              Data Management & Security
            </Typography>

            <Alert severity="info" sx={{ mb: 3, fontSize: { xs: '0.875rem', md: '1rem' } }}>
              Configure how long your clinical notes and templates are securely stored in our HIPAA-compliant system.
            </Alert>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Clinical Notes Retention Period</InputLabel>
              <Select
                value={profile.notesRetentionDuration}
                label="Clinical Notes Retention Period"
                onChange={(e) => handleRetentionChange(Number(e.target.value))}
                size={isMobile ? "small" : "medium"}
              >
                {retentionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Current Setting:</strong> Your clinical notes and templates will be retained for{' '}
                <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                  {profile.notesRetentionDuration === -1 
                    ? 'permanently' 
                    : `${profile.notesRetentionDuration} months`}
                </span>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                All data is encrypted and stored in HIPAA-compliant infrastructure with 99.9% uptime guarantee.
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: { lg: 1 } }}>
          {/* Quick Access */}
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
              Quick Access
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <QuickLinkCard
                href="https://chrome.google.com/webstore/detail/s10ai-crush-extension"
                icon={<ExtensionIcon />}
                title="Chrome Extension"
                description="Install S10.AI browser extension"
              />
              
              <QuickLinkCard
                href="https://app.s10.ai/login"
                icon={<LoginIcon />}
                title="Main Application"
                description="Access full S10.AI platform"
              />
              
              <QuickLinkCard
                href="https://play.google.com/store/apps/details?id=com.s10ai.mobile"
                icon={<MobileIcon />}
                title="Mobile App"
                description="Download for iOS/Android"
              />
            </Box>
          </Paper>

          {/* Account Actions */}
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
              Account Actions
            </Typography>
            
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={() => setShowLogoutDialog(true)}
              sx={{ 
                py: { xs: 1, md: 1.5 },
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}
            >
              Logout
            </Button>
          </Paper>

          {/* Subscription Management */}
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid', borderColor: 'error.light' }}>
            <Typography variant="h6" gutterBottom color="error" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
              Subscription Management
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
              Need to pause your subscription? Your data will be safely preserved.
            </Typography>
            
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<CancelIcon />}
              onClick={() => setShowCancelDialog(true)}
              sx={{
                py: { xs: 1, md: 1.5 },
                fontSize: { xs: '0.875rem', md: '1rem' },
                borderColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'white'
                }
              }}
            >
              Manage Subscription
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              You can reactivate anytime without data loss.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* MFA Setup Dialog */}
      <Dialog 
        open={showMfaDialog} 
        onClose={() => setShowMfaDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Enable Multi-Factor Authentication
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            To enable MFA, please verify your email address by entering the code we've sent to {profile.email}.
          </Typography>
          
          {mfaOtpSent && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Verification code sent to your email
            </Alert>
          )}

          <TextField
            fullWidth
            label="Verification Code"
            value={mfaOtp}
            onChange={(e) => setMfaOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            inputProps={{ maxLength: 6 }}
            sx={{ mb: 2 }}
          />

          <Button
            variant="text"
            onClick={sendMfaOtp}
            disabled={mfaLoading}
            sx={{ mb: 2 }}
          >
            {mfaLoading ? 'Sending...' : 'Resend Code'}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMfaDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={verifyMfaOtp}
            disabled={!mfaOtp || mfaOtp.length !== 6 || mfaLoading}
          >
            {mfaLoading ? 'Verifying...' : 'Enable MFA'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to logout? You'll need to sign in again to access your clinical workflows and templates.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Subscription</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to pause your subscription?
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              What happens when you pause:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Your clinical data remains secure and accessible</li>
              <li>Billing stops immediately</li>
              <li>Premium features become unavailable</li>
              <li>You can reactivate anytime</li>
            </Box>
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Your subscription will remain active until the end of your current billing period.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>
            Keep Active
          </Button>
          <Button onClick={handleCancelSubscription} color="error" variant="contained">
            Pause Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
