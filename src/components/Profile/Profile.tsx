import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useProfileData } from '@/hooks/useProfileData';
import { useApiContext } from '@/contexts/ApiContext';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  ehrMode: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  subscription: {
    plan: string;
    status: string;
    nextBilling: string;
  };
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { useApiData } = useApiContext();
  const { profile, loading, error } = useProfileData(useApiData);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    ehrMode: false,
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    subscription: {
      plan: 'Pro',
      status: 'Active',
      nextBilling: '2024-02-01'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        address: profile.address || '',
        ehrMode: profile.ehrMode || false
      }));
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: keyof ProfileData['notifications']) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        address: profile.address || ''
      }));
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Error loading profile: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      overflow: 'auto',
      backgroundColor: '#f5f5f5'
    }}>
      <Container maxWidth="xl" sx={{ 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: { xs: 3, md: 4 }
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            Profile Settings
          </Typography>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 }
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                size={isMobile ? "small" : "medium"}
                sx={{ borderRadius: 2 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                size={isMobile ? "small" : "medium"}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Personal Information */}
          <Grid xs={12} lg={8}>
            <Card sx={{ 
              mb: { xs: 2, md: 3 }, 
              borderRadius: 2,
              boxShadow: 2
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3 
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    width: { xs: 40, md: 48 }, 
                    height: { xs: 40, md: 48 } 
                  }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    Personal Information
                  </Typography>
                </Box>

                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!isEditing}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: <BusinessIcon color="action" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* EHR Integration */}
            <Card sx={{ 
              mb: { xs: 2, md: 3 }, 
              borderRadius: 2,
              boxShadow: 2
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3 
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'secondary.main', 
                    width: { xs: 40, md: 48 }, 
                    height: { xs: 40, md: 48 } 
                  }}>
                    <SettingsIcon />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    EHR Integration
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.ehrMode}
                      onChange={(e) => handleInputChange('ehrMode', e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Enable EHR Mode
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Access advanced clinical workflows and EHR integrations
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start' }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Subscription & Security */}
          <Grid xs={12} lg={4}>
            {/* Subscription Info */}
            <Card sx={{ 
              mb: { xs: 2, md: 3 }, 
              borderRadius: 2,
              boxShadow: 2
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3 
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'success.main', 
                    width: { xs: 40, md: 48 }, 
                    height: { xs: 40, md: 48 } 
                  }}>
                    <PaymentIcon />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    Subscription
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Plan
                    </Typography>
                    <Chip 
                      label={profileData.subscription.plan} 
                      color="primary" 
                      size="small"
                    />
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip 
                      label={profileData.subscription.status} 
                      color="success" 
                      size="small"
                    />
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Next Billing
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {profileData.subscription.nextBilling}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card sx={{ 
              mb: { xs: 2, md: 3 }, 
              borderRadius: 2,
              boxShadow: 2
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3 
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'warning.main', 
                    width: { xs: 40, md: 48 }, 
                    height: { xs: 40, md: 48 } 
                  }}>
                    <SecurityIcon />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    Security
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setShowPasswordDialog(true)}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    borderRadius: 2,
                    mb: 2
                  }}
                >
                  Change Password
                </Button>

                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    textAlign: 'center'
                  }}
                >
                  Last password change: Never
                </Typography>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: 2
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3 
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'info.main', 
                    width: { xs: 40, md: 48 }, 
                    height: { xs: 40, md: 48 } 
                  }}>
                    <NotificationsIcon />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    Notifications
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profileData.notifications.email}
                        onChange={() => handleNotificationChange('email')}
                        disabled={!isEditing}
                        size="small"
                      />
                    }
                    label={
                      <Typography 
                        variant="body2"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Email Notifications
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profileData.notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                        disabled={!isEditing}
                        size="small"
                      />
                    }
                    label={
                      <Typography 
                        variant="body2"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        SMS Notifications
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profileData.notifications.push}
                        onChange={() => handleNotificationChange('push')}
                        disabled={!isEditing}
                        size="small"
                      />
                    }
                    label={
                      <Typography 
                        variant="body2"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Push Notifications
                      </Typography>
                    }
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Password Change Dialog */}
        <Dialog 
          open={showPasswordDialog} 
          onClose={() => setShowPasswordDialog(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ 
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            p: { xs: 2, sm: 3 }
          }}>
            Change Password
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ 
            p: { xs: 2, sm: 3 },
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button 
              onClick={() => setShowPasswordDialog(false)}
              size={isMobile ? "small" : "medium"}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setShowPasswordDialog(false)}
              size={isMobile ? "small" : "medium"}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Update Password
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Profile;
