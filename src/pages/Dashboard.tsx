
import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  useTheme, 
  useMediaQuery, 
  Container,
  Tooltip,
  Fade
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
      {/* Header with Logo */}
      <Box sx={{
        p: isCollapsed && !isMobile ? 2 : 3,
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        minHeight: isCollapsed && !isMobile ? 80 : 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        transition: theme.transitions.create(['padding', 'min-height'], {
          duration: theme.transitions.duration.standard,
        })
      }}>
        {(!isCollapsed || isMobile) ? (
          <Fade in={!isCollapsed || isMobile} timeout={300}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                component="img"
                src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
                alt="S10.AI Logo"
                sx={{
                  height: isMobile ? 44 : isTablet ? 48 : 52,
                  mb: 1.5,
                  objectFit: 'contain',
                  transition: theme.transitions.create('height', {
                    duration: theme.transitions.duration.short,
                  })
                }}
              />
              <Typography 
                variant="h6" 
                fontWeight={700} 
                color="white" 
                sx={{ 
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  textAlign: 'center',
                  letterSpacing: '0.02em'
                }}
              >
                S10.AI Dashboard
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Tooltip title="S10.AI Dashboard" placement="right" arrow>
            <Box
              component="img"
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
              alt="S10.AI"
              sx={{
                height: 44,
                width: 44,
                objectFit: 'contain',
                transition: theme.transitions.create(['height', 'width'], {
                  duration: theme.transitions.duration.short,
                }),
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
              onClick={() => setIsCollapsed(false)}
            />
          </Tooltip>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2, px: 1, overflow: 'auto' }}>
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <Tooltip 
                title={isCollapsed && !isMobile ? item.label : ''} 
                placement="right" 
                arrow
              >
                <ListItemButton
                  onClick={() => handleMenuItemClick(item.id)}
                  selected={activeMenuItem === item.id}
                  sx={{
                    borderRadius: 3,
                    mx: 1,
                    minHeight: 56,
                    justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                    px: isCollapsed && !isMobile ? 2 : 3,
                    transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                      duration: theme.transitions.duration.short,
                    }),
                    position: 'relative',
                    overflow: 'hidden',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
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
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateX(4px)'
                    },
                    '&:active': {
                      transform: 'scale(0.98)'
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: isCollapsed && !isMobile ? 0 : 48,
                    color: activeMenuItem === item.id ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    justifyContent: 'center',
                    transition: theme.transitions.create('color', {
                      duration: theme.transitions.duration.short,
                    })
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {(!isCollapsed || isMobile) && (
                    <Fade in={!isCollapsed || isMobile} timeout={200}>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: activeMenuItem === item.id ? 600 : 500,
                          color: activeMenuItem === item.id ? 'white' : 'rgba(255, 255, 255, 0.9)',
                        }}
                      />
                    </Fade>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Collapse Toggle for Desktop */}
      {!isMobile && (
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="top" arrow>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                width: isCollapsed ? 48 : '100%',
                height: 48,
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: theme.transitions.create(['all'], {
                  duration: theme.transitions.duration.short,
                }),
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  transform: 'scale(1.05)'
                },
                '&:active': {
                  transform: 'scale(0.95)'
                }
              }}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 3,
            width: 56,
            height: 56,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            color: bravoColors.primaryFlat,
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transition: theme.transitions.create(['all'], {
              duration: theme.transitions.duration.short,
            }),
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
          {isDrawerOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
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
          /* Desktop Drawer */
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 10, md: 4 }, // Extra top padding on mobile for menu button
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
