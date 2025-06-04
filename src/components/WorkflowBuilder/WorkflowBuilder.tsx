
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  useTheme,
  useMediaQuery,
  Container,
  Chip
} from '@mui/material';
import {
  Build as BuildIcon,
  LibraryBooks as LibraryBooksIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import WorkflowLibrary from './WorkflowLibrary';
import MyWorkflows from './MyWorkflows';
import { templateBuilderService } from '../../services/templateBuilderService';

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
        <Box sx={{ pt: { xs: 3, md: 4 } }}>
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleImportWorkflow = (workflow: any) => {
    // Get available visit types from template builder
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
      }))
    };

    setImportedWorkflows(prev => [...prev, importedWorkflow]);
    
    // Stay on My Workflows tab to show the imported workflow
    setTabValue(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 2,
          flexDirection: { xs: 'column', md: 'row' },
          textAlign: { xs: 'center', md: 'left' }
        }}>
          <BuildIcon 
            sx={{ 
              fontSize: { xs: 32, md: 40 }, 
              color: theme.palette.primary.main,
              display: { xs: 'none', md: 'block' }
            }} 
          />
          <Box>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.text.primary,
                mb: 0.5
              }}
            >
              EHR Workflow Builder
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 400, 
                color: theme.palette.text.secondary,
                opacity: 0.8
              }}
            >
              Automate your clinical workflows with AI-powered efficiency
            </Typography>
          </Box>
        </Box>
        
        <Alert 
          icon={<InfoIcon />}
          severity="info" 
          sx={{ 
            mb: { xs: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: theme.palette.info.light + '15',
            border: `1px solid ${theme.palette.info.light}`,
            '& .MuiAlert-message': {
              fontSize: { xs: '0.875rem', md: '1rem' },
              lineHeight: 1.6
            },
            '& .MuiAlert-icon': {
              color: theme.palette.info.main
            }
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            <strong>Streamline Your EHR Tasks:</strong> Build automated workflows for your daily clinical activities. 
            Connect your templates, configure settings, and let AI handle repetitive EHR tasks while you focus on patient care.
          </Typography>
        </Alert>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          width: '100%',
          borderRadius: { xs: 3, md: 4 },
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Box sx={{ 
          borderBottom: `2px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="workflow builder tabs"
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                minHeight: { xs: 56, md: 64 },
                px: { xs: 2, md: 4 },
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
              icon={<BuildIcon sx={{ mb: 0.5 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  My Workflows
                  {importedWorkflows.length > 0 && (
                    <Chip 
                      label={importedWorkflows.length} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white'
                      }} 
                    />
                  )}
                </Box>
              }
              sx={{ flex: 1 }}
            />
            <Tab 
              icon={<LibraryBooksIcon sx={{ mb: 0.5 }} />}
              iconPosition="start"
              label="Workflow Library" 
              sx={{ flex: 1 }}
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <MyWorkflows importedWorkflows={importedWorkflows} setImportedWorkflows={setImportedWorkflows} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <WorkflowLibrary onImportWorkflow={handleImportWorkflow} />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default WorkflowBuilder;
