import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  SaveAlt as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { useProfileData } from '@/hooks/useProfileData';
import { useApiContext } from '@/contexts/ApiContext';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  ehrSystem: string;
  ehrMode: boolean;
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
  subscriptionPlan: string;
  subscriptionStatus: string;
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { useApiData } = useApiContext();
  const { profile: apiProfile } = useProfileData(useApiData);

  const [profile, setProfile] = useState<ProfileData>({
    firstName: apiProfile?.firstName || '',
    lastName: apiProfile?.lastName || '',
    email: apiProfile?.email || '',
    organization: apiProfile?.organization || '',
    role: apiProfile?.role || '',
    ehrSystem: apiProfile?.ehrSystem || '',
    ehrMode: apiProfile?.ehrMode || false,
    notificationsEnabled: apiProfile?.notificationsEnabled || false,
    twoFactorEnabled: apiProfile?.twoFactorEnabled || false,
    subscriptionPlan: apiProfile?.subscriptionPlan || 'Basic',
    subscriptionStatus: apiProfile?.subscriptionStatus || 'Active',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfile({
      firstName: apiProfile?.firstName || '',
      lastName: apiProfile?.lastName || '',
      email: apiProfile?.email || '',
      organization: apiProfile?.organization || '',
      role: apiProfile?.role || '',
      ehrSystem: apiProfile?.ehrSystem || '',
      ehrMode: apiProfile?.ehrMode || false,
      notificationsEnabled: apiProfile?.notificationsEnabled || false,
      twoFactorEnabled: apiProfile?.twoFactorEnabled || false,
      subscriptionPlan: apiProfile?.subscriptionPlan || 'Basic',
      subscriptionStatus: apiProfile?.subscriptionStatus || 'Active',
    });
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100%',
      minHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Container maxWidth="xl" sx={{
        flex: 1,
        overflow: 'auto',
        p: { xs: 1, sm: 2, md: 3 }
      }}>
        <Typography 
          variant={isMobile ? "h5" : isTablet ? "h5" : "h4"} 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: { xs: 2, md: 3 },
            textAlign: { xs: 'center', md: 'left' },
            fontSize: { 
              xs: '1.5rem', 
              sm: '1.75rem', 
              md: '2rem' 
            }
          }}
        >
          Profile Settings
        </Typography>

        <Paper elevation={2} sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          width: '100%',
          minWidth: 0
        }}>
          <Box sx={{ 
            p: { xs: 2, sm: 2.5, md: 3 }, 
            borderBottom: '1px solid', 
            borderColor: 'divider' 
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}>
              <PersonIcon color="primary" />
              Personal Information
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 0.5,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              Manage your personal details
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              variant="outlined"
              InputProps={{
                readOnly: !isEditing,
              }}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Organization"
              name="organization"
              value={profile.organization}
              onChange={handleChange}
              disabled={!isEditing}
              variant="outlined"
              InputProps={{
                readOnly: !isEditing,
              }}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={profile.role}
              onChange={handleChange}
              disabled={!isEditing}
              variant="outlined"
              InputProps={{
                readOnly: !isEditing,
              }}
              sx={{ mb: 3 }}
            />
          </CardContent>
        </Paper>

        <Paper elevation={2} sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          width: '100%',
          minWidth: 0,
          mt: 4
        }}>
          <Box sx={{ 
            p: { xs: 2, sm: 2.5, md: 3 }, 
            borderBottom: '1px solid', 
            borderColor: 'divider' 
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}>
              <BusinessIcon color="primary" />
              System Preferences
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 0.5,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              Configure your system settings
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <TextField
              fullWidth
              label="EHR System"
              name="ehrSystem"
              value={profile.ehrSystem}
              onChange={handleChange}
              disabled={!isEditing}
              variant="outlined"
              InputProps={{
                readOnly: !isEditing,
              }}
              sx={{ mb: 3 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={profile.ehrMode}
                  onChange={handleChange}
                  name="ehrMode"
                  disabled={!isEditing}
                />
              }
              label="EHR Mode Enabled"
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Paper>

        <Paper elevation={2} sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          width: '100%',
          minWidth: 0,
          mt: 4
        }}>
          <Box sx={{ 
            p: { xs: 2, sm: 2.5, md: 3 }, 
            borderBottom: '1px solid', 
            borderColor: 'divider' 
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}>
              <SecurityIcon color="primary" />
              Security & Notifications
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 0.5,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              Manage your security settings and notifications
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <FormControlLabel
              control={
                <Switch
                  checked={profile.notificationsEnabled}
                  onChange={handleChange}
                  name="notificationsEnabled"
                  disabled={!isEditing}
                />
              }
              label="Notifications Enabled"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={profile.twoFactorEnabled}
                  onChange={handleChange}
                  name="twoFactorEnabled"
                  disabled={!isEditing}
                />
              }
              label="Two-Factor Authentication Enabled"
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Paper>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isEditing ? (
            <Box>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleCancel}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSave}
                startIcon={<SaveIcon />}
              >
                Save Changes
              </Button>
            </Box>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {saveSuccess && (
          <Alert 
            icon={<CheckCircleIcon fontSize="inherit" />}
            severity="success" 
            sx={{ mt: 3, borderRadius: 2 }}
          >
            Profile updated successfully!
          </Alert>
        )}

        {saveError && (
          <Alert 
            icon={<WarningIcon fontSize="inherit" />}
            severity="error" 
            sx={{ mt: 3, borderRadius: 2 }}
          >
            Failed to update profile. Please try again.
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default Profile;
