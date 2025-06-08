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
  Paper,
  Collapse
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
  ChevronDown,
  ChevronUp,
  LibraryBig,
  FolderOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bravoColors } from '@/theme/colors';
import { useAuthStore } from '@/features/auth/stores/authStore';
import TemplateBuilder from '@/components/TemplateBuilder/TemplateBuilder';
import Profile from '@/components/Profile/Profile';
import BillingHistory from '@/components/BillingHistory/BillingHistory';
import WorkflowBuilder from '@/components/WorkflowBuilder/WorkflowBuilder';
import { useProfileData } from '@/hooks/useProfileData';
import { useApiContext } from '@/contexts/ApiContext';
import { HelpButton } from '@/components/tour';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 72;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component?: React.ComponentType<any>;
  badge?: string;
  requiresEHR?: boolean;
  children?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  activeTab: string;
}

export const Dashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('my-templates');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['template-builder', 'workflow-builder']);
  
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { useApiData } = useApiContext();
  const { profile } = useProfileData(useApiData);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Define menu items with children for accordions
  const allMenuItems: MenuItem[] = [
    {
      id: 'template-builder',
      label: 'Template Builder',
      icon: <LayoutTemplate size={22} />,
      children: [
        {
          id: 'my-templates',
          label: 'My Templates',
          icon: <FolderOpen size={20} />,
          component: TemplateBuilder,
          activeTab: 'my-templates'
        },
        {
          id: 'template-library',
          label: 'Template Library',
          icon: <LibraryBig size={20} />,
          component: TemplateBuilder,
          activeTab: 'template-library'
        }
      ]
    },
    {
      id: 'workflow-builder',
      label: 'Workflow Builder',
      icon: <Workflow size={22} />,
      badge: 'New',
      requiresEHR: true,
      children: [
        {
          id: 'my-workflows',
          label: 'My Workflows',
          icon: <FolderOpen size={20} />,
          component: WorkflowBuilder,
          activeTab: 'my-workflows'
        },
        {
          id: 'workflow-library',
          label: 'Workflow Library',
          icon: <LibraryBig size={20} />,
          component: WorkflowBuilder,
          activeTab: 'workflow-library'
        }
      ]
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

  // Filter menu items based on EHR mode
  const menuItems = allMenuItems.filter(item => 
    !item.requiresEHR || (item.requiresEHR && profile?.ehrMode)
  );

  // Get all available menu items (including children)
  const getAllMenuItems = () => {
    const items: Array<MenuItem | SubMenuItem> = [];
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => items.push(child));
      } else {
        items.push(item);
      }
    });
    return items;
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleAccordionToggle = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getActiveComponent = () => {
    const allItems = getAllMenuItems();
    const activeItem = allItems.find(item => item.id === activeMenuItem);
    if (activeItem && 'activeTab' in activeItem) {
      return () => <activeItem.component activeTab={activeItem.activeTab} />;
    }
    return activeItem?.component || TemplateBuilder;
  };

  const ActiveComponent = getActiveComponent();
  const drawerWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  const DrawerContent = () => (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: isMobile 
        ? 'linear-gradient(180deg, #143151 0%, #1a3a5c 50%, #387E89 100%)'
        : bravoColors.primary,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Mobile Header */}
      {isMobile ? (
        <Box 
          data-tour-id="dashboard-header"
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            minHeight: 80,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.2 }}>
                {profile?.firstName} {profile?.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', lineHeight: 1.2 }}>
                {profile?.email}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpButton />
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'rotate(90deg)'
                }
              }}
            >
              <X size={20} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        /* Desktop Header with Logo and Profile */
        <Box 
          data-tour-id="dashboard-header"
          sx={{
            p: isCollapsed ? 2 : 3,
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            minHeight: isCollapsed ? 80 : 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          {!isCollapsed ? (
            <>
              <Box
                component="img"
                src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
                alt="S10.AI Logo"
                sx={{
                  height: 40,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  transition: 'transform 0.3s ease',
                  mb: 2,
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                >
                  {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    fontSize: '0.8rem', 
                    lineHeight: 1.2,
                    display: 'block'
                  }}>
                    {profile?.firstName} {profile?.lastName}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '0.7rem', 
                    lineHeight: 1.2 
                  }}>
                    {profile?.email}
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <Tooltip title={`${profile?.firstName} ${profile?.lastName}`} placement="right" arrow>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)'
                  }
                }}
                onClick={() => setIsCollapsed(false)}
              >
                {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
              </Avatar>
            </Tooltip>
          )}
        </Box>
      )}

      {/* Enhanced Navigation Menu with Accordions */}
      <Box 
        data-tour-id="sidebar-navigation"
        sx={{ 
          flex: 1, 
          py: 2, 
          px: isMobile ? 1.5 : 1, 
          overflow: 'auto',
          position: 'relative',
          zIndex: 1,
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px'
          }
        }}
      >
        <List sx={{ px: 0, py: 1 }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {item.children ? (
                // Accordion Item
                <>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <Tooltip 
                      title={isCollapsed && !isMobile ? item.label : ''} 
                      placement="right" 
                      arrow
                    >
                      <ListItemButton
                        data-tour-id={item.id === 'template-builder' ? 'nav-templates' : item.id === 'workflow-builder' ? 'nav-workflows' : `nav-${item.id}`}
                        onClick={() => !isCollapsed ? handleAccordionToggle(item.id) : setIsCollapsed(false)}
                        sx={{
                          borderRadius: isMobile ? '14px' : '12px',
                          mx: isMobile ? 1 : 1,
                          minHeight: isMobile ? 56 : 52,
                          justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                          px: isCollapsed && !isMobile ? 2 : isMobile ? 2.5 : 2.5,
                          py: isMobile ? 1.5 : 1.25,
                          color: 'rgba(255, 255, 255, 0.75)',
                          backgroundColor: 'transparent',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'rgba(255, 255, 255, 0.95)',
                            transform: isMobile ? 'translateY(-1px)' : 'translateX(2px)',
                            '&::before': {
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)'
                            }
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'transparent',
                            borderRadius: 'inherit',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      >
                        <ListItemIcon sx={{
                          minWidth: isCollapsed && !isMobile ? 0 : (isMobile ? 44 : 40),
                          color: 'inherit',
                          justifyContent: 'center',
                          position: 'relative',
                          zIndex: 1,
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}>
                          {item.icon}
                        </ListItemIcon>
                        {(!isCollapsed || isMobile) && (
                          <>
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
                                        borderRadius: '10px',
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.3px'
                                      }}
                                    >
                                      {item.badge}
                                    </Paper>
                                  )}
                                </Box>
                              }
                              primaryTypographyProps={{
                                fontSize: isMobile ? '0.95rem' : '0.9rem',
                                fontWeight: 500,
                                color: 'inherit',
                                position: 'relative',
                                zIndex: 1
                              }}
                            />
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                              {expandedItems.includes(item.id) ? 
                                <ChevronUp size={18} /> : 
                                <ChevronDown size={18} />
                              }
                            </Box>
                          </>
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                  
                  {/* Submenu Items */}
                  {(!isCollapsed || isMobile) && (
                    <Collapse in={expandedItems.includes(item.id)} timeout="auto" unmountOnExit>
                      <List sx={{ pl: 2, py: 0 }}>
                        {item.children.map((child) => (
                          <ListItem key={child.id} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                              onClick={() => handleMenuItemClick(child.id)}
                              selected={activeMenuItem === child.id}
                              sx={{
                                borderRadius: isMobile ? '12px' : '10px',
                                mx: isMobile ? 1 : 0.5,
                                minHeight: isMobile ? 48 : 44,
                                px: isMobile ? 2 : 2,
                                py: isMobile ? 1 : 0.75,
                                color: 'rgba(255, 255, 255, 0.65)',
                                backgroundColor: 'transparent',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: activeMenuItem === child.id 
                                    ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)'
                                    : 'transparent',
                                  borderRadius: 'inherit',
                                  transition: 'all 0.3s ease'
                                },
                                '&.Mui-selected': {
                                  backgroundColor: 'transparent',
                                  color: 'white',
                                  transform: isMobile ? 'none' : 'translateX(4px)',
                                  boxShadow: isMobile 
                                    ? '0 2px 8px rgba(0,0,0,0.1)'
                                    : '0 2px 6px rgba(0,0,0,0.1)',
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                    transform: isMobile ? 'translateY(-1px)' : 'translateX(6px)',
                                    '&::before': {
                                      background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
                                    }
                                  }
                                },
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  transform: isMobile ? 'translateY(-1px)' : 'translateX(2px)',
                                  '&::before': {
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)'
                                  }
                                }
                              }}
                            >
                              <ListItemIcon sx={{
                                minWidth: isMobile ? 36 : 32,
                                color: 'inherit',
                                justifyContent: 'center',
                                position: 'relative',
                                zIndex: 1
                              }}>
                                {child.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={child.label}
                                primaryTypographyProps={{
                                  fontSize: isMobile ? '0.85rem' : '0.8rem',
                                  fontWeight: activeMenuItem === child.id ? 600 : 400,
                                  color: 'inherit',
                                  position: 'relative',
                                  zIndex: 1
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </>
              ) : (
                // Regular Menu Item
                <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                  <Tooltip 
                    title={isCollapsed && !isMobile ? item.label : ''} 
                    placement="right" 
                    arrow
                  >
                    <ListItemButton
                      data-tour-id={`nav-${item.id}`}
                      onClick={() => handleMenuItemClick(item.id)}
                      selected={activeMenuItem === item.id}
                      sx={{
                        borderRadius: isMobile ? '14px' : '12px',
                        mx: isMobile ? 1 : 1,
                        minHeight: isMobile ? 56 : 52,
                        justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                        px: isCollapsed && !isMobile ? 2 : isMobile ? 2.5 : 2.5,
                        py: isMobile ? 1.5 : 1.25,
                        color: 'rgba(255, 255, 255, 0.75)',
                        backgroundColor: 'transparent',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: activeMenuItem === item.id 
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)'
                            : 'transparent',
                          borderRadius: 'inherit',
                          transition: 'all 0.3s ease'
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'transparent',
                          color: 'white',
                          transform: isMobile ? 'none' : 'translateX(4px)',
                          boxShadow: isMobile 
                            ? '0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)'
                            : '0 4px 12px rgba(0,0,0,0.15)',
                          border: isMobile ? '1px solid rgba(255,255,255,0.15)' : 'none',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            transform: isMobile ? 'translateY(-1px)' : 'translateX(6px)',
                            '&::before': {
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
                            }
                          }
                        },
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: 'rgba(255, 255, 255, 0.95)',
                          transform: isMobile ? 'translateY(-1px)' : 'translateX(2px)',
                          '&::before': {
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)'
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{
                        minWidth: isCollapsed && !isMobile ? 0 : (isMobile ? 44 : 40),
                        color: 'inherit',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      {(!isCollapsed || isMobile) && (
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: isMobile ? '0.95rem' : '0.9rem',
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
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Enhanced Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 1
      }}>
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Tooltip title="Logout" arrow>
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.15)',
                      color: '#f44336',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <LogOut size={18} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <HelpButton />
            <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="top" arrow>
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  overflow: 'hidden'
                }}
              >
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    padding: 1.5,
                    borderRadius: '14px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
      {/* Mobile Menu Button with Gradient */}
      {isMobile && (
        <Fade in={!mobileOpen}>
          <Paper
            elevation={6}
            sx={{
              position: 'fixed',
              top: 20,
              left: 20,
              zIndex: 1300,
              display: { xs: 'block', md: 'none' },
              background: 'linear-gradient(135deg, #143151 0%, #387E89 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: 'white',
                padding: 1.75,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                },
                '&:active': {
                  transform: 'scale(0.98)'
                }
              }}
            >
              <Menu size={22} />
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
            background: 'linear-gradient(180deg, #143151 0%, #1a3a5c 50%, #387E89 100%)',
            border: 'none'
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
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
