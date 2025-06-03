
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert
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
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const WorkflowBuilder: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [importedWorkflows, setImportedWorkflows] = useState<any[]>([]);

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
    <Box sx={{ p: 3, height: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        Workflow Builder
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Agentic EHR Automation:</strong> Configure and manage your EHR workflows, 
          map them to your visit types (from Template Builder), set up schedule preferences, 
          then execute with your EHR credentials for seamless automation.
        </Typography>
      </Alert>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="workflow builder tabs">
            <Tab 
              label={`My Workflows ${importedWorkflows.length > 0 ? `(${importedWorkflows.length})` : ''}`} 
            />
            <Tab label="Workflow Library" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <MyWorkflows importedWorkflows={importedWorkflows} setImportedWorkflows={setImportedWorkflows} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <WorkflowLibrary onImportWorkflow={handleImportWorkflow} />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default WorkflowBuilder;
