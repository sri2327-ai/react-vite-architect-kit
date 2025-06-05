
import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  AccountTree as WorkflowIcon,
  Description as TemplateIcon,
  Person as ProfileIcon,
  Payment as BillingIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { WorkflowBuilder } from '../components/WorkflowBuilder';
import { TemplateBuilder } from '../components/TemplateBuilder';
import { Profile } from '../components/Profile';
import { BillingHistory } from '../components/BillingHistory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    handleProfileMenuClose();
  };

  const getTabContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Box>
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
              <Typography 
                variant="h4"
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 1,
                  fontSize: '2rem'
                }}
              >
                EHR Workflow Builder
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '1.25rem'
                }}
              >
                Automate your clinical documentation and EHR workflows with AI-powered tools
              </Typography>
            </Box>
            <WorkflowBuilder />
          </Box>
        );
      case 1:
        return <TemplateBuilder />;
      case 2:
        return (
          <Box>
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
              <Typography 
                variant="h4"
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 1,
                  fontSize: '2rem'
                }}
              >
                My Profile
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '1.25rem'
                }}
              >
                Manage your account settings and preferences
              </Typography>
            </Box>
            <Profile />
          </Box>
        );
      case 3:
        return (
          <Box>
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
              <Typography 
                variant="h4"
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 1,
                  fontSize: '2rem'
                }}
              >
                Billing & Subscription
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '1.25rem'
                }}
              >
                View your billing history and manage your subscription
              </Typography>
            </Box>
            <BillingHistory />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: { xs: 1, sm: 1.5, md: 2 },
            px: { xs: 1, sm: 2 }
          }}>
            {/* Logo/Brand */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.main,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              HealthAI
            </Typography>

            {/* Profile Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <IconButton
                  size="large"
                  onClick={handleProfileMenuOpen}
                  sx={{ 
                    color: theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              )}
              
              <IconButton
                size="large"
                onClick={handleProfileMenuOpen}
                sx={{ 
                  p: 0.5,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: { xs: 32, sm: 36, md: 40 }, 
                    height: { xs: 32, sm: 36, md: 40 },
                    backgroundColor: theme.palette.primary.main
                  }}
                >
                  <AccountIcon />
                </Avatar>
              </IconButton>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: `1px solid ${theme.palette.divider}`
                }
              }}
            >
              <MenuItem onClick={() => setTabValue(2)}>
                <ListItemIcon>
                  <ProfileIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setTabValue(3)}>
                <ListItemIcon>
                  <BillingIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Billing</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Container>
      </Paper>

      {/* Navigation Tabs */}
      <Paper 
        elevation={0}
        sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Container maxWidth="xl">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="dashboard navigation tabs"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                minHeight: { xs: 48, sm: 56, md: 64 },
                px: { xs: 2, sm: 3, md: 4 },
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.hover
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: theme.palette.primary.main
              },
              '& .MuiTabs-scrollButtons': {
                color: theme.palette.text.secondary
              }
            }}
          >
            <Tab 
              icon={<WorkflowIcon sx={{ mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              iconPosition="start"
              label={
                <Typography variant="inherit" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Workflow Builder
                </Typography>
              }
            />
            <Tab 
              icon={<TemplateIcon sx={{ mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              iconPosition="start"
              label={
                <Typography variant="inherit" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Template Builder
                </Typography>
              }
            />
            <Tab 
              icon={<ProfileIcon sx={{ mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              iconPosition="start"
              label={
                <Typography variant="inherit" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Profile
                </Typography>
              }
            />
            <Tab 
              icon={<BillingIcon sx={{ mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              iconPosition="start"
              label={
                <Typography variant="inherit" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Billing
                </Typography>
              }
            />
          </Tabs>
        </Container>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ flexGrow: 1 }}>
        <TabPanel value={tabValue} index={0}>
          {getTabContent(0)}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {getTabContent(1)}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {getTabContent(2)}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {getTabContent(3)}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Dashboard;
