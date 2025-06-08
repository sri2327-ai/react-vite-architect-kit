import React, { useState } from 'react';
import { Box, Paper, Typography, Divider, Button, FormControl, InputLabel, Select, MenuItem, Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery, Link, Container, Card, CardContent, CircularProgress, Switch, FormControlLabel, TextField } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Business as BusinessIcon, Settings as SettingsIcon, Cancel as CancelIcon, Storage as StorageIcon, Logout as LogoutIcon, Extension as ExtensionIcon, Login as LoginIcon, PhoneAndroid as MobileIcon, OpenInNew as OpenInNewIcon, Security as SecurityIcon, CloudUpload as CloudIcon, Shield as ShieldIcon } from '@mui/icons-material';
import { useProfileData } from '../../hooks/useProfileData';
import { useApiContext } from '../../contexts/ApiContext';
import { useResponsive } from '../../hooks/useResponsive';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { isMobileView } = useResponsive();
  
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showMfaDialog, setShowMfaDialog] = useState(false);
  const [mfaOtp, setMfaOtp] = useState('');
  const [mfaOtpSent, setMfaOtpSent] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  
  const {
    useApiData
  } = useApiContext();
  const {
    profile,
    loading,
    error,
    updateProfile
  } = useProfileData(useApiData);
  
  const retentionOptions = [{
    value: 3,
    label: '3 Months'
  }, {
    value: 6,
    label: '6 Months'
  }, {
    value: 12,
    label: '1 Year'
  }, {
    value: 24,
    label: '2 Years'
  }, {
    value: 36,
    label: '3 Years'
  }, {
    value: 60,
    label: '5 Years'
  }, {
    value: -1,
    label: 'Permanent'
  }];
  
  const handleRetentionChange = async (duration: number) => {
    try {
      await updateProfile({
        notesRetentionDuration: duration
      });
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
        await updateProfile({
          mfaEnabled: false
        });
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
        await updateProfile({
          mfaEnabled: true
        });
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
      py: {
        xs: 1.5,
        sm: 2,
        md: 1.5
      },
      px: {
        xs: 1.5,
        sm: 2
      },
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:last-child': {
        borderBottom: 'none'
      },
      minHeight: {
        xs: 56,
        sm: 64
      }
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: {
          xs: 36,
          sm: 40,
          md: 44
        },
        mr: {
          xs: 1.5,
          sm: 2
        },
        color: 'primary.main',
        flexShrink: 0
      }}>
        {icon}
      </Box>
      <Box sx={{
        flex: 1,
        minWidth: 0
      }}>
        <Typography variant="caption" color="text.secondary" sx={{
          fontSize: {
            xs: '0.7rem',
            sm: '0.75rem'
          },
          fontWeight: 500,
          display: 'block'
        }}>
          {label}
        </Typography>
        {chip && typeof value === 'boolean' ? (
          <Chip 
            label={value ? 'EHR Connected' : 'No EHR Connection'} 
            color={value ? 'success' : 'default'} 
            size="small" 
            sx={{
              mt: 0.5,
              fontSize: {
                xs: '0.7rem',
                sm: '0.75rem'
              },
              height: {
                xs: 24,
                sm: 28
              }
            }} 
          />
        ) : (
          <Typography variant="body2" sx={{
            fontWeight: 500,
            mt: 0.5,
            fontSize: {
              xs: '0.85rem',
              sm: '0.875rem'
            },
            wordBreak: 'break-word'
          }}>
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
        height: '100%',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{
        p: {
          xs: 1.5,
          sm: 2,
          md: 2.5
        },
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: {
            xs: 1.5,
            sm: 2
          },
          width: '100%'
        }}>
          <Box sx={{
            color: 'primary.main',
            flexShrink: 0,
            '& svg': {
              fontSize: {
                xs: '1.2rem',
                sm: '1.5rem'
              }
            }
          }}>
            {icon}
          </Box>
          <Box sx={{
            flex: 1,
            minWidth: 0
          }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{
              mb: 0.5,
              fontSize: {
                xs: '0.85rem',
                sm: '0.875rem'
              },
              lineHeight: 1.2
            }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{
              fontSize: {
                xs: '0.7rem',
                sm: '0.75rem'
              },
              lineHeight: 1.2
            }}>
              {description}
            </Typography>
          </Box>
          <OpenInNewIcon fontSize="small" color="action" sx={{
            flexShrink: 0,
            fontSize: {
              xs: '1rem',
              sm: '1.2rem'
            }
          }} />
        </Box>
      </CardContent>
    </Card>
  );
  
  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        p: 3
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{
        p: {
          xs: 2,
          sm: 3
        }
      }}>
        <Alert severity="error">
          Failed to load profile data: {error}
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' },
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1.5, sm: 2, md: 2.5 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        position: 'relative'
      }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            textAlign: { xs: 'center', sm: 'center', md: 'left' },
            color: 'text.primary'
          }}
        >
          Profile
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        width: '100%',
        minHeight: '100vh',
        p: {
          xs: 1,
          sm: 2,
          md: 3
        },
        maxWidth: '100%'
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr'
          },
          gap: {
            xs: 2,
            sm: 3
          }
        }}>
          {/* Personal Information */}
          <Box>
            <Paper sx={{
            p: {
              xs: 2,
              sm: 3
            },
            mb: {
              xs: 2,
              sm: 3
            },
            borderRadius: 2
          }}>
              <Typography variant="h6" gutterBottom sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: {
                xs: 2,
                sm: 3
              },
              fontSize: {
                xs: '1rem',
                sm: '1.1rem',
                md: '1.25rem'
              }
            }}>
              <PersonIcon color="primary" />
              Personal Information
            </Typography>

            <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr'
            },
            gap: {
              xs: 0,
              md: 2
            }
          }}>
            <ProfileField icon={<EmailIcon />} label="Email Address" value={profile.email} />
            <ProfileField icon={<PhoneIcon />} label="Phone Number" value={profile.phoneNumber} />
            <ProfileField icon={<PersonIcon />} label="First Name" value={profile.firstName} />
            <ProfileField icon={<PersonIcon />} label="Last Name" value={profile.lastName} />
            <ProfileField icon={<BusinessIcon />} label="Medical Specialty" value={profile.specialty} />
            
            {/* Only show EHR Integration Status if ehrMode is true */}
            {profile.ehrMode && <>
                <ProfileField icon={<SettingsIcon />} label="EHR Integration Status" value={profile.ehrMode} chip />
                {profile.ehrName && <Box sx={{
                  gridColumn: {
                    xs: '1',
                    md: '1 / -1'
                  }
                }}>
                    <ProfileField icon={<StorageIcon />} label="Connected EHR System" value={profile.ehrName} />
                  </Box>}
              </>}
          </Box>

          {/* Show EHR disabled message if ehrMode is false */}
          {!profile.ehrMode && <Alert severity="info" sx={{
          mt: 3,
          fontSize: {
            xs: '0.85rem',
            sm: '0.875rem'
          }
        }}>
            <Typography variant="body2" sx={{
            fontWeight: 600,
            mb: 1,
            fontSize: {
              xs: '0.85rem',
              sm: '0.875rem'
            }
          }}>
            EHR Integration Disabled
          </Typography>
          <Typography variant="body2" sx={{
            fontSize: {
              xs: '0.8rem',
              sm: '0.875rem'
            }
          }}>
            Your account is currently set to no-EHR mode. EHR integration features and workflow automation are not available.
          </Typography>
        </Alert>}
          </Paper>

          {/* Security Settings */}
          <Paper sx={{
          p: {
            xs: 2,
            sm: 3
          },
          mb: {
            xs: 2,
            sm: 3
          },
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: {
              xs: 2,
              sm: 3
            },
            fontSize: {
              xs: '1rem',
              sm: '1.1rem',
              md: '1.25rem'
            }
          }}>
            <SecurityIcon color="primary" />
            Security & Authentication
          </Typography>

          <Alert severity="info" sx={{
            mb: 3,
            fontSize: {
              xs: '0.8rem',
              sm: '0.875rem'
            }
          }}>
            Enhance your account security with multi-factor authentication using email verification.
          </Alert>

          <Box sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row'
            },
            alignItems: {
              xs: 'stretch',
              sm: 'center'
            },
            justifyContent: 'space-between',
            p: {
              xs: 1.5,
              sm: 2
            },
            backgroundColor: 'grey.50',
            borderRadius: 1,
            mb: 2,
            gap: {
              xs: 2,
              sm: 0
            }
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: {
                xs: 1.5,
                sm: 2
              }
            }}>
              <ShieldIcon color="primary" />
              <Box>
                <Typography variant="body1" fontWeight={600} sx={{
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem'
                }
              }}>
                Multi-Factor Authentication (MFA)
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.8rem'
                }
              }}>
                Secure your account with email-based verification codes
              </Typography>
              </Box>
            </Box>
            <FormControlLabel control={<Switch checked={profile.mfaEnabled || false} onChange={e => handleMfaToggle(e.target.checked)} color="primary" size={isMobile ? "small" : "medium"} />} label="" sx={{
              m: 0
            }} />
          </Box>

          {profile.mfaEnabled && <Box sx={{
            p: {
              xs: 1.5,
              sm: 2
            },
            backgroundColor: 'success.light',
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="body2" color="success.dark" sx={{
              mb: 1,
              fontSize: {
                xs: '0.85rem',
                sm: '0.875rem'
              }
            }}>
              <strong>MFA is enabled</strong>
            </Typography>
            <Typography variant="caption" color="success.dark" sx={{
              fontSize: {
                xs: '0.75rem',
                sm: '0.8rem'
              }
            }}>
              You will receive a verification code via email each time you log in from a new device.
            </Typography>
          </Box>}
        </Paper>

        {/* Data Management */}
        <Paper sx={{
          p: {
            xs: 2,
            sm: 3
          },
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: {
              xs: 2,
              sm: 3
            },
            fontSize: {
              xs: '1rem',
              sm: '1.1rem',
              md: '1.25rem'
            }
          }}>
            <CloudIcon color="primary" />
            Data Management & Security
          </Typography>

          <Alert severity="info" sx={{
            mb: 3,
            fontSize: {
              xs: '0.8rem',
              sm: '0.875rem'
            }
          }}>
            Configure how long your clinical notes and templates are securely stored in our HIPAA-compliant system.
          </Alert>

          <FormControl fullWidth sx={{
            mb: 3
          }}>
            <InputLabel>Clinical Notes Retention Period</InputLabel>
            <Select value={profile.notesRetentionDuration} label="Clinical Notes Retention Period" onChange={e => handleRetentionChange(Number(e.target.value))} size={isMobile ? "small" : "medium"}>
              {retentionOptions.map(option => <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>)}
            </Select>
          </FormControl>

          <Box sx={{
            p: {
              xs: 1.5,
              sm: 2
            },
            backgroundColor: 'grey.50',
            borderRadius: 1
          }}>
            <Typography variant="body2" color="text.secondary" sx={{
              mb: 1,
              fontSize: {
                xs: '0.8rem',
                sm: '0.875rem'
              }
            }}>
              <strong>Current Setting:</strong> Your clinical notes and templates will be retained for{' '}
              <span style={{
                color: theme.palette.primary.main,
                fontWeight: 600
              }}>
                {profile.notesRetentionDuration === -1 ? 'permanently' : `${profile.notesRetentionDuration} months`}
              </span>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{
              fontSize: {
                xs: '0.75rem',
                sm: '0.8rem'
              }
            }}>
              All data is encrypted and stored in HIPAA-compliant infrastructure with 99.9% uptime guarantee.
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Quick Access */}
      <Box>
        <Paper sx={{
          p: {
            xs: 2,
            sm: 3
          },
          mb: {
            xs: 2,
            sm: 3
          },
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom sx={{
            fontSize: {
              xs: '1rem',
              sm: '1.1rem',
              md: '1.25rem'
            },
            mb: {
              xs: 2,
              sm: 3
            }
          }}>
            Quick Access
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: {
              xs: 1.5,
              sm: 2
            }
          }}>
            <QuickLinkCard href="https://chrome.google.com/webstore/detail/s10ai-crush-extension" icon={<ExtensionIcon />} title="Chrome Extension" description="Install S10.AI browser extension" />
            
            <QuickLinkCard href="https://app.s10.ai/login" icon={<LoginIcon />} title="Main Application" description="Access full S10.AI platform" />
            
            <QuickLinkCard href="https://play.google.com/store/apps/details?id=com.s10ai.mobile" icon={<MobileIcon />} title="Mobile App" description="Download for iOS/Android" />
          </Box>
        </Paper>

        {/* Account Actions */}
        <Paper sx={{
          p: {
            xs: 2,
            sm: 3
          },
          mb: {
            xs: 2,
            sm: 3
          },
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom sx={{
            fontSize: {
              xs: '1rem',
              sm: '1.1rem',
              md: '1.25rem'
            },
            mb: {
              xs: 2,
              sm: 3
            }
          }}>
            Account Actions
          </Typography>
          
          <Button variant="outlined" color="primary" fullWidth startIcon={<LogoutIcon />} onClick={() => setShowLogoutDialog(true)} sx={{
            py: {
              xs: 1.5,
              sm: 2
            },
            fontSize: {
              xs: '0.85rem',
              sm: '0.875rem',
              md: '1rem'
            }
          }}>
            Logout
          </Button>
        </Paper>

        {/* Subscription Management */}
        <Paper sx={{
          p: {
            xs: 2,
            sm: 3
          },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'error.light'
        }}>
          <Typography variant="h6" gutterBottom color="error" sx={{
            fontSize: {
              xs: '1rem',
              sm: '1.1rem',
              md: '1.25rem'
            },
            mb: {
              xs: 2,
              sm: 3
            }
          }}>
            Subscription Management
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{
            mb: 2,
            lineHeight: 1.5,
            fontSize: {
              xs: '0.8rem',
              sm: '0.875rem'
            }
          }}>
            Need to pause your subscription? Your data will be safely preserved.
          </Typography>
          
          <Button variant="outlined" color="error" fullWidth startIcon={<CancelIcon />} onClick={() => setShowCancelDialog(true)} sx={{
            py: {
              xs: 1.5,
              sm: 2
            },
            fontSize: {
              xs: '0.85rem',
              sm: '0.875rem',
              md: '1rem'
            },
            borderColor: 'error.main',
            '&:hover': {
              backgroundColor: 'error.main',
              color: 'white'
            }
          }}>
            Manage Subscription
          </Button>
          
          <Typography variant="caption" color="text.secondary" sx={{
            mt: 1,
            display: 'block',
            fontSize: {
              xs: '0.7rem',
              sm: '0.75rem'
            }
          }}>
            You can reactivate anytime without data loss.
          </Typography>
        </Paper>
      </Box>

      {/* MFA Dialog */}
      <Dialog open={showMfaDialog} onClose={() => setShowMfaDialog(false)}>
        <DialogTitle>Enable Multi-Factor Authentication</DialogTitle>
        <DialogContent>
          {!mfaOtpSent ? (
            <Typography>
              We'll send a verification code to your email address to set up MFA.
            </Typography>
          ) : (
            <Box>
              <Typography gutterBottom>
                Enter the verification code sent to your email:
              </Typography>
              <TextField
                fullWidth
                value={mfaOtp}
                onChange={(e) => setMfaOtp(e.target.value)}
                placeholder="Enter verification code"
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMfaDialog(false)}>Cancel</Button>
          {!mfaOtpSent ? (
            <Button onClick={sendMfaOtp} disabled={mfaLoading}>
              {mfaLoading ? <CircularProgress size={20} /> : 'Send Code'}
            </Button>
          ) : (
            <Button onClick={verifyMfaOtp} disabled={mfaLoading || !mfaOtp}>
              {mfaLoading ? <CircularProgress size={20} /> : 'Verify'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onClose={() => setShowLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="primary">Logout</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <DialogTitle>Manage Subscription</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your subscription? Your data will be preserved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>Cancel</Button>
          <Button onClick={handleCancelSubscription} color="error">Continue</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
