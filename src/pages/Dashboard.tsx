
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
  Backdrop,
  Fade,
  Slide,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import { 
  LayoutTemplate, 
  Workflow, 
  User, 
  History,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Settings
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
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'template-builder',
    label: 'Template Builder',
    icon: <LayoutTemplate size={22} />,
    component: TemplateBuilder
  },
  {
    id: 'workflow-builder',
    label: 'Workflow Builder',
    icon: <Workflow size={22} />,
    component: WorkflowBuilder,
    badge: 'New'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <User size={22} />,
    component: Profile
  },
  {
    id: 'billing-history',
    label: 'Billing History',
    icon: <History size={22} />,
    component: BillingHistory
  }
];

export const Dashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('template-builder');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

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
      background: isMobile 
        ? 'linear-gradient(180deg, #143151 0%, #1a3a5c 50%, #387E89 100%)'
        : bravoColors.primary,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Subtle background pattern for mobile */}
      {isMobile && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
      )}

      {/* Enhanced Header */}
      <Box sx={{
        p: isMobile ? 3 : (isCollapsed && !isMobile ? 2 : 3),
        borderBottom: isMobile ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.12)',
        minHeight: isMobile ? 120 : (isCollapsed && !isMobile ? 80 : 100),
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'space-between' : 'center',
        flexDirection: isMobile ? 'row' : 'column',
        position: 'relative',
        zIndex: 1
      }}>
        {!isCollapsed || isMobile ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'row' : 'column', 
            alignItems: 'center',
            gap: isMobile ? 2 : 1
          }}>
            <Box
              component="img"
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
              alt="S10.AI Logo"
              sx={{
                height: isMobile ? 48 : 52,
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
            <Box sx={{ textAlign: isMobile ? 'left' : 'center' }}>
              <Typography 
                variant={isMobile ? "h5" : "h6"}
                sx={{ 
                  color: 'white', 
                  fontWeight: 700,
                  fontSize: isMobile ? '1.4rem' : '1.1rem',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                S10.AI
              </Typography>
              {isMobile && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    fontWeight: 400
                  }}
                >
                  Dashboard
                </Typography>
              )}
            </Box>
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
                borderRadius: '12px',
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
              onClick={() => setIsCollapsed(false)}
            />
          </Tooltip>
        )}
        
        {/* Enhanced Mobile Close Button */}
        {isMobile && (
          <Paper
            elevation={0}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{
                color: 'white',
                padding: 2,
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'rotate(90deg)'
                }
              }}
            >
              <X size={24} />
            </IconButton>
          </Paper>
        )}
      </Box>

      {/* User Profile Section for Mobile */}
      {isMobile && (
        <Box sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontWeight: 600
              }}
            >
              JD
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                John Doe
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                john@example.com
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Enhanced Navigation Menu */}
      <Box sx={{ 
        flex: 1, 
        py: 3, 
        px: isMobile ? 2 : 1, 
        overflow: 'auto',
        position: 'relative',
        zIndex: 1,
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.4)'
          }
        }
      }}>
        {isMobile && (
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              px: 2,
              mb: 2,
              display: 'block',
              fontWeight: 600,
              letterSpacing: '1px'
            }}
          >
            NAVIGATION
          </Typography>
        )}
        
        <List sx={{ px: 0 }}>
          {menuItems.map((item, index) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1.5 }}>
              <Tooltip 
                title={isCollapsed && !isMobile ? item.label : ''} 
                placement="right" 
                arrow
              >
                <ListItemButton
                  onClick={() => handleMenuItemClick(item.id)}
                  selected={activeMenuItem === item.id}
                  sx={{
                    borderRadius: isMobile ? '16px' : '12px',
                    mx: isMobile ? 1 : 1,
                    minHeight: isMobile ? 64 : 56,
                    justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                    px: isCollapsed && !isMobile ? 2 : 3,
                    py: isMobile ? 2 : 1.5,
                    color: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${index * 50}ms`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: activeMenuItem === item.id 
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
                        : 'transparent',
                      borderRadius: 'inherit',
                      transition: 'all 0.3s ease'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'transparent',
                      color: 'white',
                      transform: isMobile ? 'none' : 'translateX(6px)',
                      boxShadow: isMobile 
                        ? '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                        : '0 4px 12px rgba(0,0,0,0.15)',
                      border: isMobile ? '1px solid rgba(255,255,255,0.2)' : 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        transform: isMobile ? 'scale(1.02)' : 'translateX(8px)',
                        '&::before': {
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)'
                        }
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'white',
                      transform: isMobile ? 'translateY(-2px)' : 'translateX(4px)',
                      '&::before': {
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: isCollapsed && !isMobile ? 0 : (isMobile ? 48 : 40),
                    color: 'inherit',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {(!isCollapsed || isMobile) && (
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{item.label}</span>
                          {item.badge && (
                            <Paper
                              elevation={0}
                              sx={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                px: 1,
                                py: 0.25,
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                letterSpacing: '0.5px'
                              }}
                            >
                              {item.badge}
                            </Paper>
                          )}
                        </Box>
                      }
                      primaryTypographyProps={{
                        fontSize: isMobile ? '1rem' : '0.95rem',
                        fontWeight: activeMenuItem === item.id ? 600 : 500,
                        color: 'inherit',
                        position: 'relative',
                        zIndex: 1
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Enhanced Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Quick Actions for Mobile */}
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Settings" arrow>
                <IconButton
                  sx={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }
                  }}
                >
                  <Settings size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout" arrow>
                <IconButton
                  sx={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.2)',
                      color: '#f44336'
                    }
                  }}
                >
                  <LogOut size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* Collapse Toggle - Desktop Only */}
        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="top" arrow>
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden'
                }}
              >
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{
                    width: isCollapsed ? 48 : '100%',
                    height: 48,
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </IconButton>
              </Paper>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Enhanced Mobile Menu Button */}
      {isMobile && (
        <Fade in={!mobileOpen}>
          <Paper
            elevation={8}
            sx={{
              position: 'fixed',
              top: 20,
              left: 20,
              zIndex: 1300,
              display: { xs: 'block', md: 'none' },
              backgroundColor: bravoColors.primaryFlat,
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: 'white',
                padding: 2,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.1) rotate(90deg)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                },
                '&:active': {
                  transform: 'scale(0.95)'
                }
              }}
            >
              <Menu size={24} />
            </IconButton>
          </Paper>
        </Fade>
      )}

      {/* Desktop Sidebar */}
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
              boxShadow: '8px 0 32px rgba(0, 0, 0, 0.12)'
            }
          }}
          open
        >
          <DrawerContent />
        </Drawer>
      </Box>

      {/* Enhanced Mobile Drawer */}
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
        SlideProps={{
          direction: 'right'
        }}
      >
        <Slide direction="right" in={mobileOpen} mountOnEnter unmountOnExit>
          <Box>
            <DrawerContent />
          </Box>
        </Slide>
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
          pt: { xs: 0, md: 0 },
          position: 'relative'
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
