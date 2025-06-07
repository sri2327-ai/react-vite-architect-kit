
import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import WorkflowLibrary from './WorkflowLibrary';
import MyWorkflows from './MyWorkflows';
import { templateBuilderService } from '../../services/templateBuilderService';

interface WorkflowBuilderProps {
  activeTab?: string;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ activeTab = 'my-workflows' }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [importedWorkflows, setImportedWorkflows] = useState<any[]>([]);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

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
    setCurrentTab('my-workflows');
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', p: 0 }}>
      <Box sx={{ height: '100%', overflow: 'auto' }}>
        {currentTab === 'my-workflows' && (
          <MyWorkflows 
            importedWorkflows={importedWorkflows} 
            setImportedWorkflows={setImportedWorkflows} 
          />
        )}
        {currentTab === 'workflow-library' && (
          <WorkflowLibrary onImportWorkflow={handleImportWorkflow} />
        )}
      </Box>
    </Container>
  );
};

export default WorkflowBuilder;
