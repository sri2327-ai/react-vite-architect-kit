
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  useTheme,
  Container,
  Chip,
  Stack
} from '@mui/material';
import {
  LibraryBooks as LibraryBooksIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Workflow as WorkflowIcon } from 'lucide-react';
import WorkflowLibrary from './WorkflowLibrary';
import MyWorkflows from './MyWorkflows';
import { templateBuilderService } from '../../services/templateBuilderService';
import { useResponsive } from '../../hooks/useResponsive';
import { useApiContext } from '../../contexts/ApiContext';

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
      id={`workflow-tabpanel-${index}`}
      aria-labelledby={`workflow-tab-${index}`}
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

const WorkflowBuilder: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [importedWorkflows, setImportedWorkflows] = useState<any[]>([]);
  const theme = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const { useApiData } = useApiContext();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleImportWorkflow = (workflow: any) => {
    // Get available visit types from template builder or API
    const availableVisitTypes = templateBuilderService.getAllVisitTypeNames();
    
    // Convert predefined workflow to imported workflow format
    const importedWorkflow = {
      id: `imported-${Date.now()}`,
      name: workflow.name,
      description: workflow.description,
      ehrSystem: workflow.ehrSystem,
      status: 'draft' as const,
      blocks: workflow.blocks,
      availableVisitTypes: availableVisitTypes,
      visitTypeMappings: availableVisitTypes.map((visitType: string) => ({
        visitType,
        templateFields: {},
        scheduleConfig: {
          providerName: '',
          location: ''
        },
        isConfigured: false
      })),
      lastModified: new Date().toISOString(),
      isConfigured: false
    };

    setImportedWorkflows(prev => [...prev, importedWorkflow]);
    
    // Stay on My Workflows tab to show the imported workflow
    setTabValue(0);
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 }, 
        px: { xs: 1, sm: 2, md: 3 },
        width: '100%',
        maxWidth: '100%'
      }}
    >
      {/* Header - Fully responsive */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'center', md: 'flex-start' }}
          spacing={{ xs: 1, md: 2 }}
          sx={{ 
            mb: { xs: 1.5, md: 2 },
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          {!isMobile && (
            <WorkflowIcon 
              size={isTablet ? 36 : 40}
              color="black"
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              sx={{ 
                fontWeight: 700, 
                color: '#000000',
                mb: 0.5,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
              }}
            >
              EHR Workflow Builder
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              sx={{ 
                fontWeight: 400, 
                color: theme.palette.text.secondary,
                opacity: 0.9,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                lineHeight: { xs: 1.4, md: 1.6 }
              }}
            >
              Automate your clinical workflows with AI-powered efficiency
            </Typography>
          </Box>
        </Stack>
        
        {/* Info Alert - Responsive */}
        <Alert 
          icon={<InfoIcon />}
          severity="info" 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 2, md: 3 },
            backgroundColor: theme.palette.info.light + '10',
            border: `1px solid ${theme.palette.info.light}`,
            '& .MuiAlert-message': {
              fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
              lineHeight: { xs: 1.4, md: 1.6 },
              width: '100%'
            },
            '& .MuiAlert-icon': {
              color: theme.palette.info.main,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: { xs: 1.4, md: 1.6 },
              fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' }
            }}
          >
            <strong>Streamline Your EHR Tasks:</strong> Build automated workflows for your daily clinical activities. 
            Connect your templates, configure settings, and let AI handle repetitive EHR tasks while you focus on patient care.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content Paper - Responsive */}
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%',
          borderRadius: { xs: 2, sm: 3, md: 4 },
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: { 
            xs: '0 4px 16px rgba(0,0,0,0.06)',
            md: '0 8px 32px rgba(0,0,0,0.08)'
          }
        }}
      >
        {/* Tabs - Responsive */}
        <Box sx={{ 
          borderBottom: `2px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="workflow builder tabs"
            variant={isMobile ? "fullWidth" : "standard"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 48, sm: 56, md: 64 },
              '& .MuiTab-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                minHeight: { xs: 48, sm: 56, md: 64 },
                px: { xs: 1, sm: 2, md: 4 },
                py: { xs: 1, md: 2 },
                color: theme.palette.text.secondary,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 0.5, sm: 1 },
                '&.Mui-selected': {
                  color: theme.palette.success.main,
                },
                '&:hover': {
                  color: theme.palette.success.main,
                  backgroundColor: theme.palette.action.hover
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: theme.palette.success.main
              },
              '& .MuiTabs-flexContainer': {
                height: '100%'
              }
            }}
          >
            <Tab 
              icon={<WorkflowIcon size={isMobile ? 16 : 20} />}
              iconPosition={isMobile ? "top" : "start"}
              label={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 0.5, sm: 1 },
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}
                  >
                    My Workflows
                  </Typography>
                  {importedWorkflows.length > 0 && (
                    <Chip 
                      label={importedWorkflows.length} 
                      size="small" 
                      sx={{ 
                        height: { xs: 16, sm: 20 }, 
                        fontSize: { xs: '0.6rem', sm: '0.75rem' },
                        backgroundColor: theme.palette.success.main,
                        color: 'white',
                        minWidth: { xs: 16, sm: 20 }
                      }} 
                    />
                  )}
                </Box>
              }
              sx={{ flex: 1, minWidth: 0 }}
            />
            <Tab 
              icon={<LibraryBooksIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
              iconPosition={isMobile ? "top" : "start"}
              label={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Workflow Library
                </Typography>
              }
              sx={{ flex: 1, minWidth: 0 }}
            />
          </Tabs>
        </Box>
        
        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <MyWorkflows 
            importedWorkflows={importedWorkflows} 
            setImportedWorkflows={setImportedWorkflows} 
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <WorkflowLibrary onImportWorkflow={handleImportWorkflow} />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default WorkflowBuilder;
