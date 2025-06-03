
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
  };

  const handleDrawerToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const ActiveComponent = menuItems.find(item => item.id === activeMenuItem)?.component || TemplateBuilder;
  const drawerWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

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
        p: isCollapsed ? 2 : 3,
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        minHeight: isCollapsed ? 80 : 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        transition: theme.transitions.create(['padding', 'min-height'], {
          duration: theme.transitions.duration.standard,
        })
      }}>
        {!isCollapsed ? (
          <Fade in={!isCollapsed} timeout={300}>
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
                title={isCollapsed ? item.label : ''} 
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
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 2 : 3,
                    transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
                      duration: theme.transitions.duration.short,
                    }),
                    position: 'relative',
                    overflow: 'hidden',
                    color: 'rgba(255, 255, 255, 0.9)',
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
                      transform: 'translateX(4px)',
                      // Remove any border or outline that might cause white lines
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none'
                    },
                    '&:active': {
                      transform: 'scale(0.98)'
                    },
                    // Ensure no borders or outlines
                    border: 'none',
                    outline: 'none'
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: isCollapsed ? 0 : 48,
                    color: 'inherit',
                    justifyContent: 'center',
                    transition: theme.transitions.create('color', {
                      duration: theme.transitions.duration.short,
                    })
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <Fade in={!isCollapsed} timeout={200}>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: activeMenuItem === item.id ? 600 : 500,
                          color: 'inherit',
                          sx: {
                            transition: theme.transitions.create('all', {
                              duration: theme.transitions.duration.short,
                            })
                          }
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

      {/* Collapse Toggle */}
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
                transform: 'scale(1.05)',
                // Remove any unwanted borders or outlines
                outline: 'none',
                boxShadow: 'none'
              },
              '&:active': {
                transform: 'scale(0.95)'
              },
              // Ensure no unwanted borders
              outline: 'none'
            }}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar Navigation - Same for all devices */}
      <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0 }}>
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
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: `calc(100% - ${drawerWidth}px)`,
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
