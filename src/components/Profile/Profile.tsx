
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid2 as Grid,
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
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Cancel as CancelIcon,
  Storage as StorageIcon
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

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
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

            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <ProfileField
                  icon={<EmailIcon />}
                  label="Email Address"
                  value={userProfile.email}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <ProfileField
                  icon={<PhoneIcon />}
                  label="Phone Number"
                  value={userProfile.phoneNumber}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <ProfileField
                  icon={<PersonIcon />}
                  label="First Name"
                  value={userProfile.firstName}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <ProfileField
                  icon={<PersonIcon />}
                  label="Last Name"
                  value={userProfile.lastName}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <ProfileField
                  icon={<BusinessIcon />}
                  label="Specialty"
                  value={userProfile.specialty}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <ProfileField
                  icon={<SettingsIcon />}
                  label="EHR Integration"
                  value={userProfile.ehrMode}
                  chip
                />
              </Grid>
              {userProfile.ehrMode && userProfile.ehrName && (
                <Grid xs={12} sm={6}>
                  <ProfileField
                    icon={<StorageIcon />}
                    label="EHR System"
                    value={userProfile.ehrName}
                  />
                </Grid>
              )}
            </Grid>
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
        </Grid>

        <Grid xs={12} md={4}>
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

          <Paper sx={{ p: 3, mt: 3, backgroundColor: 'primary.50' }}>
            <Typography variant="h6" gutterBottom>
              Account Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                <strong>Account Type:</strong> Premium
              </Typography>
              <Typography variant="body2">
                <strong>Member Since:</strong> January 2024
              </Typography>
              <Typography variant="body2">
                <strong>Templates Created:</strong> 5
              </Typography>
              <Typography variant="body2">
                <strong>Notes Generated:</strong> 127
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

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
