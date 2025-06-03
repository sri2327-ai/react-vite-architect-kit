
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import WorkflowLibrary from './WorkflowLibrary';
import MyWorkflows from './MyWorkflows';

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3, height: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Workflow Builder
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="workflow builder tabs">
            <Tab label="Workflow Library" />
            <Tab label="My Workflows" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <WorkflowLibrary />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <MyWorkflows />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default WorkflowBuilder;
