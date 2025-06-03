
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
  X as CloseIcon 
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
      {/* Header */}
      <Box sx={{
        p: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        {(!isCollapsed || isMobile) ? (
          <>
            <Box
              component="img"
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
              alt="S10.AI Logo"
              sx={{
                height: 32,
                mb: 1,
                objectFit: 'contain'
              }}
            />
            <Typography variant="h6" fontWeight={600} color="white" sx={{ fontSize: '1rem' }}>
              S10.AI Dashboard
            </Typography>
          </>
        ) : (
          <Box
            component="img"
            src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
            alt="S10.AI"
            sx={{
              height: 28,
              width: 28,
              objectFit: 'contain'
            }}
          />
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleMenuItemClick(item.id)}
                selected={activeMenuItem === item.id}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  minHeight: 48,
                  justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                  px: isCollapsed && !isMobile ? 1 : 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ListItemIcon sx={{
                  minWidth: isCollapsed && !isMobile ? 0 : 40,
                  color: 'rgba(255, 255, 255, 0.8)',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </ListItemIcon>
                {(!isCollapsed || isMobile) && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Collapse Toggle for Desktop */}
      {!isMobile && (
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              width: '100%',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuIcon size={20} />
          </IconButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            background: bravoColors.primary,
            zIndex: theme.zIndex.drawer + 1
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              {isDrawerOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </IconButton>
            <Typography variant="h6" noWrap>
              S10.AI Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
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
                background: bravoColors.primary
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
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen
                }),
                overflowX: 'hidden'
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
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: 0 },
          mt: { xs: 8, md: 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
        }}
      >
        <Container maxWidth="xl">
          <ActiveComponent />
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
