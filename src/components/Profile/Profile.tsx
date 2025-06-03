
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
  Link,
  IconButton
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
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

interface UserProfile {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  specialty: string;
  ehrMode: boolean;
  ehrName?: string;
  notesRetentionDuration: number; // in months
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Mock user data - in real app this would come from signup data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: 'doctor@example.com',
    phoneNumber: '+1 (555) 123-4567',
    firstName: 'Dr. John',
    lastName: 'Smith',
    specialty: 'Cardiology',
    ehrMode: true,
    ehrName: 'Epic',
    notesRetentionDuration: 12
  });

  const retentionOptions = [
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 12, label: '1 Year' },
    { value: 24, label: '2 Years' },
    { value: 36, label: '3 Years' },
    { value: 60, label: '5 Years' },
    { value: -1, label: 'Permanent' }
  ];

  const handleRetentionChange = (duration: number) => {
    setUserProfile(prev => ({
      ...prev,
      notesRetentionDuration: duration
    }));
  };

  const handleCancelSubscription = () => {
    // Handle subscription cancellation logic here
    console.log('Canceling subscription...');
    setShowCancelDialog(false);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    setShowLogoutDialog(false);
    // Redirect to login or home page
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
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: 40, 
        mr: 2,
        color: 'primary.main'
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {label}
        </Typography>
        {chip && typeof value === 'boolean' ? (
          <Chip 
            label={value ? 'EHR Mode' : 'No EHR Mode'}
            color={value ? 'success' : 'default'}
            size="small"
            sx={{ mt: 0.5 }}
          />
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
            {String(value)}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Profile
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 3 
            }}>
              <PersonIcon color="primary" />
              Personal Information
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <ProfileField
                icon={<EmailIcon />}
                label="Email Address"
                value={userProfile.email}
              />
              <ProfileField
                icon={<PhoneIcon />}
                label="Phone Number"
                value={userProfile.phoneNumber}
              />
              <ProfileField
                icon={<PersonIcon />}
                label="First Name"
                value={userProfile.firstName}
              />
              <ProfileField
                icon={<PersonIcon />}
                label="Last Name"
                value={userProfile.lastName}
              />
              <ProfileField
                icon={<BusinessIcon />}
                label="Specialty"
                value={userProfile.specialty}
              />
              <ProfileField
                icon={<SettingsIcon />}
                label="EHR Integration"
                value={userProfile.ehrMode}
                chip
              />
              {userProfile.ehrMode && userProfile.ehrName && (
                <ProfileField
                  icon={<StorageIcon />}
                  label="EHR System"
                  value={userProfile.ehrName}
                />
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 3 
            }}>
              <StorageIcon color="primary" />
              Data Retention Settings
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Configure how long your notes and templates are stored in the system.
            </Alert>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Notes Retention Duration</InputLabel>
              <Select
                value={userProfile.notesRetentionDuration}
                label="Notes Retention Duration"
                onChange={(e) => handleRetentionChange(Number(e.target.value))}
              >
                {retentionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="body2" color="text.secondary">
              Current setting: Your notes will be retained for{' '}
              <strong>
                {userProfile.notesRetentionDuration === -1 
                  ? 'permanently' 
                  : `${userProfile.notesRetentionDuration} months`}
              </strong>
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link
                href="https://chrome.google.com/webstore/detail/s10ai-crush-extension"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  textDecoration: 'none',
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ExtensionIcon color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    S10.AI CRUSH EXTENSION
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chrome extension for enhanced productivity
                  </Typography>
                </Box>
                <OpenInNewIcon fontSize="small" sx={{ ml: 'auto' }} />
              </Link>

              <Link
                href="https://app.s10.ai/login"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  textDecoration: 'none',
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <LoginIcon color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Product Login URL
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Access the main application
                  </Typography>
                </Box>
                <OpenInNewIcon fontSize="small" sx={{ ml: 'auto' }} />
              </Link>

              <Link
                href="https://play.google.com/store/apps/details?id=com.s10ai.mobile"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  textDecoration: 'none',
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <MobileIcon color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Mobile App
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Download S10.AI mobile application
                  </Typography>
                </Box>
                <OpenInNewIcon fontSize="small" sx={{ ml: 'auto' }} />
              </Link>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Actions
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={() => setShowLogoutDialog(true)}
              sx={{ mb: 2 }}
            >
              Logout
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="error">
              Danger Zone
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Cancel your subscription and lose access to premium features.
            </Typography>
            
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<CancelIcon />}
              onClick={() => setShowCancelDialog(true)}
              sx={{
                borderColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'white'
                }
              }}
            >
              Cancel Subscription
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              You can reactivate your subscription at any time.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onClose={() => setShowLogoutDialog(false)}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to logout? You will need to sign in again to access your account.
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
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to cancel your subscription?
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Canceling your subscription will:
          </Alert>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>Remove access to premium features</li>
            <li>Stop automatic billing</li>
            <li>Preserve your data according to retention settings</li>
            <li>Allow reactivation at any time</li>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Your subscription will remain active until the end of your current billing period.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>
            Keep Subscription
          </Button>
          <Button onClick={handleCancelSubscription} color="error" variant="contained">
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
