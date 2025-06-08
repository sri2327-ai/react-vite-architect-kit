
import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import WorkflowLibrary from './WorkflowLibrary';
import MyWorkflows from './MyWorkflows';
import { templateBuilderService } from '../../services/templateBuilderService';
import TemplateBuilderHeader from '../TemplateBuilder/TemplateBuilderHeader';

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
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }} data-tour-id="workflow-overview">
      {/* Header */}
      <TemplateBuilderHeader 
        title={currentTab === 'my-workflows' ? 'My Workflows' : 'Workflow Library'} 
        showBackButton={false}
      />
      
      {/* Content */}
      <Container maxWidth="xl" sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          {currentTab === 'my-workflows' && (
            <Box data-tour-id="my-workflows-view">
              <MyWorkflows 
                importedWorkflows={importedWorkflows} 
                setImportedWorkflows={setImportedWorkflows} 
              />
            </Box>
          )}
          {currentTab === 'workflow-library' && (
            <Box data-tour-id="workflow-library">
              <WorkflowLibrary onImportWorkflow={handleImportWorkflow} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default WorkflowBuilder;
