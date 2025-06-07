import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TemplateBuilder from '@/components/TemplateBuilder/TemplateBuilder';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import { PrimaryButton } from '@/components/ui';
import { bravoColors } from '@/theme/colors';
import GuideModal from '@/components/Guide/GuideModal';
import { useGuide } from '@/contexts/GuideContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DashboardContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState<string>('templates');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { startGuide, guideState } = useGuide();

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    navigate(`#${newValue}`);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const tab = hash.replace('#', '');
      setActiveTab(tab);
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutMessage(true);
      setTimeout(() => {
        setShowLogoutMessage(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  // Add effect to start guide for new users
  useEffect(() => {
    const hasCompletedGuide = localStorage.getItem('implementation-guide-state');
    const isNewUser = !hasCompletedGuide || JSON.parse(hasCompletedGuide).hasCompletedGuide === false;
    
    if (isNewUser && !guideState.isActive) {
      // Detect user mode from signup data or default to standalone
      const signupData = localStorage.getItem('signup-data');
      const userMode = signupData ? JSON.parse(signupData).ehrMode ? 'ehr' : 'standalone' : 'standalone';
      
      // Start guide after a short delay
      setTimeout(() => {
        startGuide(userMode);
      }, 1000);
    }
  }, [startGuide, guideState.isActive]);

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, md: 3 } }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 }
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: bravoColors.grey900 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <PrimaryButton onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging Out...' : 'Logout'}
            </PrimaryButton>
          </Box>
        </Box>

        {showLogoutMessage && (
          <Box sx={{
            bgcolor: 'success.light',
            color: 'success.dark',
            p: 2,
            mb: 3,
            borderRadius: 1
          }}>
            <Typography>Logout successful. Redirecting...</Typography>
          </Box>
        )}

        <Box sx={{
          width: '100%',
          bgcolor: 'background.paper',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
        }}>
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            overflowX: 'auto',
            '::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}>
            <Button
              onClick={(event) => handleChangeTab(event, 'templates')}
              sx={{
                py: 2,
                px: 3,
                fontSize: isMobile ? '0.875rem' : '1rem',
                fontWeight: 500,
                textTransform: 'none',
                color: activeTab === 'templates' ? 'primary.main' : 'text.secondary',
                borderBottom: activeTab === 'templates' ? '2px solid' : 'none',
                borderColor: 'primary.main',
                borderRadius: 0,
                flexShrink: 0,
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'transparent',
                },
              }}
              {...a11yProps(0)}
            >
              Templates
            </Button>
            <Button
              onClick={(event) => handleChangeTab(event, 'workflows')}
              sx={{
                py: 2,
                px: 3,
                fontSize: isMobile ? '0.875rem' : '1rem',
                fontWeight: 500,
                textTransform: 'none',
                color: activeTab === 'workflows' ? 'primary.main' : 'text.secondary',
                borderBottom: activeTab === 'workflows' ? '2px solid' : 'none',
                borderColor: 'primary.main',
                borderRadius: 0,
                flexShrink: 0,
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'transparent',
                },
              }}
              {...a11yProps(1)}
            >
              Workflows
            </Button>
          </Box>
          <TabPanel value={activeTab} index="templates" >
            <TemplateBuilder activeTab={activeTab} />
          </TabPanel>
          <TabPanel value={activeTab} index="workflows">
            <WorkflowBuilder activeTab={activeTab} />
          </TabPanel>
        </Box>
      </Container>
      
      {/* Add Guide Modal */}
      <GuideModal />
    </>
  );
};

const Dashboard: React.FC = () => {
  return (
    <DashboardContent />
  );
};

export default Dashboard;
