
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
  Paper,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link
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
import TemplateBuilder from '@/components/TemplateBuilder/TemplateBuilder';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 72;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

// Mock user data - in real app this would come from your authentication system
const mockUserData = {
  email: 'john.doe@example.com',
  phoneNumber: '+1 (555) 123-4567',
  firstName: 'John',
  lastName: 'Doe',
  specialty: 'Cardiology',
  ehrMode: true,
  ehrName: 'Epic Systems',
  notesRetentionDuration: '7 years'
};

// Mock invoice data
const mockInvoices = [
  {
    id: '1',
    date: '2024-01-15',
    invoiceNumber: 'INV-2024-001',
    zohoLink: 'https://zoho.com/invoice/INV-2024-001',
    status: 'Paid',
    dueDate: '2024-01-30',
    amount: '$299.00'
  },
  {
    id: '2',
    date: '2023-12-15',
    invoiceNumber: 'INV-2023-012',
    zohoLink: 'https://zoho.com/invoice/INV-2023-012',
    status: 'Paid',
    dueDate: '2023-12-30',
    amount: '$299.00'
  },
  {
    id: '3',
    date: '2023-11-15',
    invoiceNumber: 'INV-2023-011',
    zohoLink: 'https://zoho.com/invoice/INV-2023-011',
    status: 'Overdue',
    dueDate: '2023-11-30',
    amount: '$299.00'
  }
];

// Updated Profile component
const Profile: React.FC = () => {
  const [notesRetention, setNotesRetention] = useState(mockUserData.notesRetentionDuration);

  const handleNotesRetentionChange = (event: any) => {
    setNotesRetention(event.target.value);
    // In real app, this would update the user's settings
    console.log('Notes retention updated to:', event.target.value);
  };

  const handleCancelSubscription = () => {
    // In real app, this would handle subscription cancellation
    console.log('Cancel subscription clicked');
    alert('Subscription cancellation functionality would be implemented here');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          User Information
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {mockUserData.email}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="body1">
              {mockUserData.phoneNumber}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              First Name
            </Typography>
            <Typography variant="body1">
              {mockUserData.firstName}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Last Name
            </Typography>
            <Typography variant="body1">
              {mockUserData.lastName}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Specialty
            </Typography>
            <Typography variant="body1">
              {mockUserData.specialty}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              EHR Mode
            </Typography>
            <Chip 
              label={mockUserData.ehrMode ? 'EHR Mode' : 'No EHR Mode'} 
              color={mockUserData.ehrMode ? 'primary' : 'default'}
              size="small"
            />
          </Box>
          
          {mockUserData.ehrMode && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                EHR Name
              </Typography>
              <Typography variant="body1">
                {mockUserData.ehrName}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Notes Retention Duration</InputLabel>
              <Select
                value={notesRetention}
                label="Notes Retention Duration"
                onChange={handleNotesRetentionChange}
              >
                <MenuItem value="1 year">1 Year</MenuItem>
                <MenuItem value="3 years">3 Years</MenuItem>
                <MenuItem value="5 years">5 Years</MenuItem>
                <MenuItem value="7 years">7 Years</MenuItem>
                <MenuItem value="10 years">10 Years</MenuItem>
                <MenuItem value="permanent">Permanent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Subscription
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            Current Plan: Professional
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleCancelSubscription}
          >
            Cancel Subscription
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// Updated BillingHistory component
const BillingHistory: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'overdue':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Billing History
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Invoice History
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    {new Date(invoice.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link 
                      href={invoice.zohoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={invoice.status} 
                      color={getStatusColor(invoice.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {invoice.amount}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

// Placeholder components
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
        flexDirection: 'column'
      }}>
        {!isCollapsed ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="img"
              src="/lovable-uploads/ed53daea-0c4e-4932-ad15-c29208c6a5ff.png"
              alt="S10.AI Logo"
              sx={{
                height: 52,
                mb: 1.5,
                objectFit: 'contain'
              }}
            />
            <Typography 
              variant="h6" 
              fontWeight={700} 
              color="white" 
              sx={{ 
                fontSize: '1.1rem',
                textAlign: 'center',
                letterSpacing: '0.02em'
              }}
            >
              S10.AI Dashboard
            </Typography>
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
                cursor: 'pointer'
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
                    borderRadius: 2,
                    mx: 1,
                    minHeight: 48,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 2 : 3,
                    color: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'transparent',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: isCollapsed ? 0 : 40,
                    color: 'inherit',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
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
              width: isCollapsed ? 40 : '100%',
              height: 40,
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white'
              }
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
      {/* Sidebar Navigation */}
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
          width: `calc(100% - ${drawerWidth}px)`,
          backgroundColor: bravoColors.background.light,
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%', p: 0 }}>
          <ActiveComponent />
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
