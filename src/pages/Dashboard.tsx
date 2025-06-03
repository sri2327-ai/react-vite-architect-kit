import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, useTheme, useMediaQuery, Container } from '@mui/material';
import { LayoutTemplate, Workflow, User, History, Menu as MenuIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { bravoColors } from '@/theme/colors';

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

// Placeholder components for each menu item
const TemplateBuilder: React.FC = () => <Box sx={{
  p: 3
}}>
    <Typography variant="h4" gutterBottom>
      Template Builder
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Create and manage your templates here.
    </Typography>
  </Box>;
const WorkflowBuilder: React.FC = () => <Box sx={{
  p: 3
}}>
    <Typography variant="h4" gutterBottom>
      Workflow Builder
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Design and configure your workflows here.
    </Typography>
  </Box>;
const Profile: React.FC = () => <Box sx={{
  p: 3
}}>
    <Typography variant="h4" gutterBottom>
      Profile
    </Typography>
    <Typography variant="body1" color="text.secondary">
      View and edit your user details here.
    </Typography>
  </Box>;
const BillingHistory: React.FC = () => <Box sx={{
  p: 3
}}>
    <Typography variant="h4" gutterBottom>
      Billing History
    </Typography>
    <Typography variant="body1" color="text.secondary">
      View your billing history and invoices here.
    </Typography>
  </Box>;
const menuItems: MenuItem[] = [
  {
    id: 'template-builder',
    label: 'Template Builder',
    icon: <LayoutTemplate size={20} />,
    component: TemplateBuilder
  },
  {
    id: 'workflow-builder',
    label: 'Workflow Builder',
    icon: <Workflow size={20} />,
    component: WorkflowBuilder
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <User size={20} />,
    component: Profile
  },
  {
    id: 'billing-history',
    label: 'Billing History',
    icon: <History size={20} />,
    component: BillingHistory
  }
];
export const Dashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('template-builder');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopToggle = () => {
    setDesktopCollapsed(!desktopCollapsed);
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const activeComponent = menuItems.find(item => item.id === activeMenuItem)?.component || TemplateBuilder;
  const ActiveComponent = activeComponent;

  const currentDrawerWidth = isMobile ? drawerWidth : (desktopCollapsed ? collapsedDrawerWidth : drawerWidth);

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: bravoColors.primary
    }}>
      {/* Logo/Brand */}
      <Box sx={{
        p: desktopCollapsed && !isMobile ? 1 : 3,
        borderBottom: 1,
        borderColor: 'divider',
        textAlign: 'center',
        background: 'transparent',
        minHeight: 80,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {(!desktopCollapsed || isMobile) && (
          <>
            <Box
              component="img"
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
              alt="S10.AI Logo"
              sx={{
                height: 40,
                mb: 1
              }}
            />
            <Typography variant="h6" fontWeight={700} color="white">
              S10.AI Dashboard
            </Typography>
          </>
        )}
        {desktopCollapsed && !isMobile && (
          <Box
            component="img"
            src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
            alt="S10.AI Logo"
            sx={{
              height: 32,
              width: 32,
              margin: '0 auto'
            }}
          />
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{
        flex: 1,
        pt: 2
      }}>
        {menuItems.map(item => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleMenuItemClick(item.id)}
              selected={activeMenuItem === item.id}
              sx={{
                mx: 2,
                borderRadius: 2,
                minHeight: 48,
                justifyContent: desktopCollapsed && !isMobile ? 'center' : 'flex-start',
                px: desktopCollapsed && !isMobile ? 1 : 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon sx={{
                minWidth: desktopCollapsed && !isMobile ? 0 : 40,
                color: activeMenuItem === item.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              {(!desktopCollapsed || isMobile) && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: activeMenuItem === item.id ? 600 : 500,
                    fontSize: '0.875rem',
                    color: activeMenuItem === item.id ? 'white' : 'rgba(255, 255, 255, 0.9)'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Collapse Toggle Button - Desktop Only */}
      {!isMobile && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <IconButton
            onClick={handleDesktopToggle}
            sx={{
              width: '100%',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {desktopCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </IconButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar - Mobile Only */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            zIndex: theme.zIndex.drawer + 1,
            display: { md: 'none' },
            background: `${bravoColors.primary} !important`,
            backgroundColor: 'transparent !important'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon size={24} />
            </IconButton>
            <Typography variant="h6" noWrap component="div" color="white">
              S10.AI Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: currentDrawerWidth },
          flexShrink: { md: 0 }
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: `${bravoColors.primary} !important`,
              backgroundColor: 'transparent !important'
            }
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              position: 'relative',
              height: '100vh',
              background: `${bravoColors.primary} !important`,
              backgroundColor: 'transparent !important',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              })
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          height: '100vh',
          overflow: 'auto',
          pt: { xs: 8, md: 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          })
        }}
      >
        <Container maxWidth="xl" sx={{
          height: '100%',
          py: { xs: 2, md: 3 }
        }}>
          <ActiveComponent />
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
