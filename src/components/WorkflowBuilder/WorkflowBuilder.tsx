
import React, { useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Container } from '@mui/material';
import WorkflowLibrary from './WorkflowLibrary';
import MyWorkflows from './MyWorkflows';
import { templateBuilderService } from '../../services/templateBuilderService';

interface WorkflowBuilderProps {
  activeTab?: 'my-workflows' | 'workflow-library';
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ activeTab = 'my-workflows' }) => {
  const [importedWorkflows, setImportedWorkflows] = useState<any[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
  };

  return (
    <Container maxWidth="xl" sx={{
      py: {
        xs: 2,
        sm: 3,
        md: 4
      },
      px: {
        xs: 1,
        sm: 2,
        md: 3
      }
    }}>
      <Box sx={{
        mb: {
          xs: 2,
          sm: 3,
          md: 4
        }
      }}>
        <Typography variant="h4" component="h1" sx={{
          fontSize: {
            xs: '1.5rem',
            sm: '2rem',
            md: '2.25rem'
          },
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1,
          textAlign: 'center'
        }}>
          {activeTab === 'my-workflows' ? 'My Workflows' : 'Workflow Library'}
        </Typography>
        <Typography variant="body1" sx={{
          fontSize: {
            xs: '0.875rem',
            sm: '1rem'
          },
          color: theme.palette.text.secondary,
          textAlign: 'center',
          maxWidth: '600px',
          mx: 'auto'
        }}>
          {activeTab === 'my-workflows' 
            ? 'Create, edit, and manage your custom workflows'
            : 'Browse and import pre-built workflows from our library'
          }
        </Typography>
      </Box>

      {activeTab === 'my-workflows' ? (
        <MyWorkflows 
          importedWorkflows={importedWorkflows} 
          setImportedWorkflows={setImportedWorkflows} 
        />
      ) : (
        <WorkflowLibrary onImportWorkflow={handleImportWorkflow} />
      )}
    </Container>
  );
};

export default WorkflowBuilder;
