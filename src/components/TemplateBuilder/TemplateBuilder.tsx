
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery,
  Container,
  Alert
} from '@mui/material';
import {
  Description as TemplateIcon,
  LibraryBooks as LibraryIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import TemplateLibraryTab from './TemplateLibraryTab';
import DraggableTemplateEditor from './DraggableTemplateEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`template-tabpanel-${index}`}
      aria-labelledby={`template-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TemplateBuilder: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 }, 
        px: { xs: 1, sm: 2, md: 3 } 
      }}
    >
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 }, 
          mb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <TemplateIcon 
            sx={{ 
              fontSize: { xs: 28, sm: 32, md: 40 },
              color: '#000000',
              display: { xs: 'none', sm: 'block' }
            }} 
          />
          <Box>
            <Typography 
              variant="h4"
              sx={{ 
                fontWeight: 600, 
                color: '#000000',
                mb: 0.5,
                fontSize: '2rem'
              }}
            >
              Template Builder
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 400, 
                color: theme.palette.text.secondary,
                opacity: 0.9,
                fontSize: '1.25rem'
              }}
            >
              Create and customize your clinical documentation templates
            </Typography>
          </Box>
        </Box>
        
        <Alert 
          icon={<InfoIcon />}
          severity="info" 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 2, md: 3 },
            backgroundColor: theme.palette.info.light + '10',
            border: `1px solid ${theme.palette.info.light}`,
            '& .MuiAlert-message': {
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              lineHeight: 1.6
            },
            '& .MuiAlert-icon': {
              color: theme.palette.info.main,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.6,
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
            }}
          >
            <strong>Build Custom Templates:</strong> Create personalized documentation templates for 
            your practice. Add sections, configure fields, and streamline your clinical workflow with 
            AI-powered template generation.
          </Typography>
        </Alert>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          width: '100%',
          borderRadius: { xs: 2, sm: 3, md: 4 },
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}
      >
        <Box sx={{ 
          borderBottom: `2px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="template builder tabs"
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                minHeight: { xs: 48, sm: 56, md: 64 },
                px: { xs: 1, sm: 2, md: 4 },
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.hover
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: theme.palette.primary.main
              }
            }}
          >
            <Tab 
              icon={<TemplateIcon sx={{ mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              iconPosition="start"
              label={
                <Typography variant="inherit" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Templates
                </Typography>
              }
              sx={{ flex: 1 }}
            />
            <Tab 
              icon={<LibraryIcon sx={{ mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              iconPosition="start"
              label={
                <Typography variant="inherit" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Template Library
                </Typography>
              }
              sx={{ flex: 1 }}
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <DraggableTemplateEditor />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <TemplateLibraryTab />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default TemplateBuilder;
