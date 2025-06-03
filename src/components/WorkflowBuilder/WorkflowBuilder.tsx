
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
  Container
} from '@mui/material';
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
        <Box sx={{ pt: { xs: 2, md: 3 } }}>
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
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 3 } }}>
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          EHR Workflow Builder
        </Typography>
        
        <Alert 
          severity="info" 
          sx={{ 
            mb: { xs: 2, md: 3 },
            '& .MuiAlert-message': {
              fontSize: { xs: '0.875rem', md: '1rem' }
            }
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            <strong>Streamline Your EHR Tasks:</strong> Build automated workflows for your daily clinical activities. 
            Connect your templates, configure settings, and let AI handle repetitive EHR tasks while you focus on patient care.
          </Typography>
        </Alert>
      </Box>

      <Paper 
        elevation={2}
        sx={{ 
          width: '100%',
          borderRadius: { xs: 2, md: 3 },
          overflow: 'hidden'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
                minHeight: { xs: 48, md: 56 }
              }
            }}
          >
            <Tab 
              label={`My Workflows${importedWorkflows.length > 0 ? ` (${importedWorkflows.length})` : ''}`}
              sx={{ flex: 1 }}
            />
            <Tab 
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
