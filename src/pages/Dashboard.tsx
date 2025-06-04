
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
  Backdrop
} from '@mui/material';
import { 
  LayoutTemplate, 
  Workflow, 
  User, 
  History,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { bravoColors } from '@/theme/colors';
import TemplateBuilder from '@/components/TemplateBuilder/TemplateBuilder';
import Profile from '@/components/Profile/Profile';
import BillingHistory from '@/components/BillingHistory/BillingHistory';
import WorkflowBuilder from '@/components/WorkflowBuilder/WorkflowBuilder';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 72;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

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
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
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
      {/* Header with Logo and Mobile Close */}
      <Box sx={{
        p: isCollapsed && !isMobile ? 2 : 3,
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        minHeight: isCollapsed && !isMobile ? 80 : 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'space-between' : 'center',
        flexDirection: isMobile ? 'row' : 'column'
      }}>
        {!isCollapsed || isMobile ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'row' : 'column', 
            alignItems: 'center',
            gap: isMobile ? 2 : 0
          }}>
            <Box
              component="img"
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
              alt="S10.AI Logo"
              sx={{
                height: isMobile ? 40 : 52,
                objectFit: 'contain'
              }}
            />
            {isMobile && (
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                S10.AI Dashboard
              </Typography>
            )}
          </Box>
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
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onClick={() => setIsCollapsed(false)}
            />
          </Tooltip>
        )}
        
        {/* Mobile Close Button */}
        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              padding: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }
            }}
          >
            <X size={24} />
          </IconButton>
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
                    borderRadius: 2,
                    mx: 1,
                    minHeight: 56,
                    justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                    px: isCollapsed && !isMobile ? 2 : 3,
                    py: 1.5,
                    color: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'transparent',
                    transition: 'all 0.2s ease-in-out',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      transform: 'translateX(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateX(6px)'
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      transform: 'translateX(2px)'
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: isCollapsed && !isMobile ? 0 : 40,
                    color: 'inherit',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {(!isCollapsed || isMobile) && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.95rem',
                        fontWeight: activeMenuItem === item.id ? 600 : 500,
                        color: 'inherit'
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Collapse Toggle - Desktop Only */}
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
                width: isCollapsed ? 40 : '100%',
                height: 40,
                color: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  transform: 'scale(1.05)'
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
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1300,
            display: { xs: 'block', md: 'none' }
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: bravoColors.primaryFlat,
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                backgroundColor: bravoColors.primaryDark,
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <Menu size={24} />
          </IconButton>
        </Box>
      )}

      {/* Sidebar Navigation */}
      <Box component="nav" sx={{ 
        width: { xs: 0, md: drawerWidth }, 
        flexShrink: 0,
        display: { xs: 'none', md: 'block' }
      }}>
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

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '100vw',
            height: '100vh',
            background: bravoColors.primary,
            border: 'none'
          }
        }}
      >
        <DrawerContent />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            xs: '100vw', 
            md: `calc(100% - ${drawerWidth}px)` 
          },
          backgroundColor: bravoColors.background.light,
          minHeight: '100vh',
          overflow: 'auto',
          pt: { xs: 10, md: 0 }
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%', p: 0 }}>
          {activeMenuItem === 'billing-history' ? (
            <BillingHistory sidebarCollapsed={isCollapsed} />
          ) : (
            <ActiveComponent />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
