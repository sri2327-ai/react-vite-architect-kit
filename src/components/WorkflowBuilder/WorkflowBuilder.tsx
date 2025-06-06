
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { bravoColors } from '@/theme/colors';
import MyWorkflows from './MyWorkflows';
import WorkflowLibrary from './WorkflowLibrary';
import DynamicWorkflowBuilder from './DynamicWorkflowBuilder';

const WorkflowBuilder: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Main Heading */}
      <Typography 
        variant="h3" 
        sx={{ 
          color: bravoColors.primaryFlat, 
          fontWeight: 700, 
          mb: 4,
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        Workflow Builder
      </Typography>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              color: bravoColors.text?.secondary || '#666',
              px: 4,
              py: 2,
              '&.Mui-selected': {
                color: bravoColors.primaryFlat,
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: bravoColors.primaryFlat,
              height: 3,
              borderRadius: 2
            }
          }}
        >
          <Tab label="My Workflows" />
          <Tab label="Workflow Library" />
          <Tab label="Dynamic Builder" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 0 && <MyWorkflows />}
      {currentTab === 1 && <WorkflowLibrary />}
      {currentTab === 2 && <DynamicWorkflowBuilder />}
    </Box>
  );
};

export default WorkflowBuilder;
