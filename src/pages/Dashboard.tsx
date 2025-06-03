
import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  useTheme, 
  useMediaQuery, 
  Container 
} from '@mui/material';
import { 
  LayoutTemplate, 
  Workflow, 
  User, 
  History, 
  Menu as MenuIcon, 
  X as CloseIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { bravoColors } from '@/theme/colors';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 72;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

// Placeholder components
const TemplateBuilder: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Template Builder
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Create and manage your templates here.
    </Typography>
  </Box>
);

const WorkflowBuilder: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Workflow Builder
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Design and configure your workflows here.
    </Typography>
  </Box>
);

const Profile: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Profile
    </Typography>
    <Typography variant="body1" color="text.secondary">
      View and edit your user details here.
    </Typography>
  </Box>
);

const BillingHistory: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Billing History
    </Typography>
    <Typography variant="body1" color="text.secondary">
      View your billing history and invoices here.
    </Typography>
  </Box>
);

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setIsDrawerOpen(!isDrawerOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const ActiveComponent = menuItems.find(item => item.id === activeMenuItem)?.component || TemplateBuilder;
  const drawerWidth = isMobile ? DRAWER_WIDTH : (isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH);

  const DrawerContent = () => (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: bravoColors.primary,
      overflow: 'hidden'
    }}>
      {/* Enhanced Header with better logo sizing */}
      <Box sx={{
        p: isCollapsed && !isMobile ? 1.5 : 3,
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        minHeight: isCollapsed && !isMobile ? 72 : 88,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        transition: 'all 0.3s ease'
      }}>
        {(!isCollapsed || isMobile) ? (
          <>
            <Box
              component="img"
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
              alt="S10.AI Logo"
              sx={{
                height: isMobile ? 48 : isTablet ? 52 : 56,
                mb: 1.5,
                objectFit: 'contain',
                transition: 'height 0.3s ease'
              }}
            />
            <Typography 
              variant="h6" 
              fontWeight={700} 
              color="white" 
              sx={{ 
                fontSize: isMobile ? '1.05rem' : '1.2rem',
                textAlign: 'center',
                letterSpacing: '0.02em',
                transition: 'all 0.3s ease'
              }}
            >
              S10.AI Dashboard
            </Typography>
          </>
        ) : (
          <Box
            component="img"
            src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
            alt="S10.AI"
            sx={{
              height: 48,
              width: 48,
              objectFit: 'contain',
              transition: 'all 0.3s ease'
            }}
          />
        )}
      </Box>

      {/* Enhanced Navigation Menu */}
      <Box sx={{ flex: 1, py: 2, px: 1 }}>
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleMenuItemClick(item.id)}
                selected={activeMenuItem === item.id}
                sx={{
                  borderRadius: 3,
                  mx: 1,
                  minHeight: 56,
                  justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                  px: isCollapsed && !isMobile ? 1.5 : 2.5,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.22)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      backgroundColor: 'white',
                      borderRadius: '0 2px 2px 0'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    transform: 'translateX(2px)'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: isCollapsed && !isMobile ? 0 : 44,
                  color: activeMenuItem === item.id ? 'white' : 'rgba(255, 255, 255, 0.85)',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease'
                }}>
                  {item.icon}
                </ListItemIcon>
                {(!isCollapsed || isMobile) && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: activeMenuItem === item.id ? 600 : 500,
                      color: activeMenuItem === item.id ? 'white' : 'rgba(255, 255, 255, 0.9)',
                    }}
                    sx={{
                      transition: 'all 0.2s ease'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Enhanced Collapse Toggle for Desktop */}
      {!isMobile && (
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              width: isCollapsed ? 48 : '100%',
              height: 48,
              color: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                transform: 'scale(1.02)'
              },
              '&:active': {
                transform: 'scale(0.98)'
              }
            }}
          >
            {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </IconButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Enhanced Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: theme.zIndex.drawer + 3,
            width: 56,
            height: 56,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            color: bravoColors.primaryFlat,
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.05)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)'
            },
            '&:active': {
              transform: 'scale(0.95)'
            }
          }}
        >
          {isDrawerOpen ? <CloseIcon size={26} /> : <MenuIcon size={26} />}
        </IconButton>
      )}

      {/* Sidebar Navigation */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                background: bravoColors.primary,
                border: 'none',
                boxShadow: '8px 0 32px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            <DrawerContent />
          </Drawer>
        ) : (
          /* Enhanced Desktop Drawer */
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                background: bravoColors.primary,
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.standard
                }),
                overflowX: 'hidden',
                border: 'none',
                boxShadow: '4px 0 20px rgba(0, 0, 0, 0.08)'
              }
            }}
            open
          >
            <DrawerContent />
          </Drawer>
        )}
      </Box>

      {/* Enhanced Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard
          }),
          backgroundColor: bravoColors.background.light,
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%' }}>
          <ActiveComponent />
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
