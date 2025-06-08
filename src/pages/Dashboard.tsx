
import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Description as DescriptionIcon,
  AccountTree as WorkflowIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { bravoColors } from '@/theme/colors';
import { TourOverlay } from '@/components/tour/TourOverlay';
import { HelpButton } from '@/components/tour/HelpButton';
import { useResponsive } from '@/hooks/useResponsive';

const drawerWidth = 280;

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isTablet, isMobileView } = useResponsive();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileClose();
    // Add logout logic here
    navigate('/login');
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <HomeIcon />, 
      path: '/dashboard',
      tourId: 'nav-dashboard'
    },
    { 
      text: 'Templates', 
      icon: <DescriptionIcon />, 
      path: '/dashboard/templates',
      tourId: 'nav-templates'
    },
    { 
      text: 'Workflows', 
      icon: <WorkflowIcon />, 
      path: '/dashboard/workflows',
      tourId: 'nav-workflows'
    },
    { 
      text: 'Profile', 
      icon: <PersonIcon />, 
      path: '/dashboard/profile',
      tourId: 'nav-profile'
    },
  ];

  const isSelected = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${bravoColors.primary[600]} 0%, ${bravoColors.primary[800]} 100%)`,
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}
      data-tour-id="sidebar-navigation"
    >
      {/* Logo/Header Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5,
          background: `linear-gradient(135deg, ${bravoColors.primary[700]} 0%, ${bravoColors.primary[900]} 100%)`,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: 'white',
                fontSize: '1.2rem'
              }}
            >
              S10
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'white',
              fontSize: '1.1rem'
            }}
          >
            S10.AI
          </Typography>
        </Box>
        
        {/* Desktop Collapse Button */}
        {!isMobileView && (
          <IconButton
            data-tour-id="collapse-sidebar"
            onClick={handleDrawerToggle}
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                data-tour-id={item.tourId}
                onClick={() => {
                  navigate(item.path);
                  if (isMobileView) {
                    setMobileOpen(false);
                  }
                }}
                selected={isSelected(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 0,
                  py: 1.5,
                  px: 2,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'inherit',
                    minWidth: 36
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.95rem',
                      fontWeight: isSelected(item.path) ? 600 : 500
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Help Section */}
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <HelpButton />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { 
            xs: '100%',
            lg: mobileOpen ? '100%' : `calc(100% - ${drawerWidth}px)` 
          },
          ml: { 
            xs: 0,
            lg: mobileOpen ? 0 : `${drawerWidth}px` 
          },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Mobile Menu Button */}
            {isMobileView && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2,
                  color: 'text.primary'
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography 
              variant="h6" 
              noWrap 
              component="div"
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '1.1rem'
              }}
            >
              Clinical Assistant
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <IconButton sx={{ color: 'text.secondary' }}>
              <Badge badgeContent={3} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile Menu */}
            <IconButton onClick={handleProfileClick} sx={{ p: 0, ml: 1 }}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  backgroundColor: bravoColors.primary[500],
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                DR
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              onClick={handleProfileClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => navigate('/dashboard/profile')}>
                <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                Profile
              </MenuItem>
              <MenuItem>
                <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { lg: mobileOpen ? 0 : drawerWidth }, 
          flexShrink: { lg: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: isMobile ? '85vw' : '350px',
              maxWidth: '400px',
              border: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="persistent"
          open={!mobileOpen}
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: theme.transitions.create('transform', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              transform: mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            xs: '100%',
            lg: mobileOpen ? '100%' : `calc(100% - ${drawerWidth}px)` 
          },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Toolbar spacer */}
        <Toolbar />
        
        {/* Page Content */}
        <Container 
          maxWidth={false}
          sx={{ 
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3, md: 4 },
            height: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Tour Overlay */}
      <TourOverlay />
    </Box>
  );
};

export default Dashboard;
