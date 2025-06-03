import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider
} from '@mui/material';
import {
  Download as ImportIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Today as TodayIcon,
  LocationOn as LocationIcon,
  Description as NoteIcon,
  Assignment as ChartIcon
} from '@mui/icons-material';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  category: string;
  blocks: WorkflowBlock[];
}

interface WorkflowBlock {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  name: string;
  description: string;
  icon: React.ReactNode;
  templateMapping?: string;
  config: any;
}

const WorkflowLibrary: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  
  // Mock user EHR - this would come from user profile
  const userEHR = 'Practice Fusion';

  const workflowBlocks: WorkflowBlock[] = [
    {
      id: 'schedule-menu',
      type: 'trigger',
      name: 'Schedule Menu',
      description: 'Access patient schedule interface',
      icon: <ScheduleIcon />,
      config: { automated: true }
    },
    {
      id: 'provider-filter',
      type: 'action',
      name: 'Provider Name Filter',
      description: 'Filter schedule by provider name',
      icon: <PersonIcon />,
      config: { dynamic: true, userInput: 'provider_name' }
    },
    {
      id: 'date-filter',
      type: 'action',
      name: "Today's Date Filter",
      description: 'Filter appointments for current date',
      icon: <TodayIcon />,
      config: { automated: true, value: 'current_date' }
    },
    {
      id: 'location-filter',
      type: 'action',
      name: 'Location Filter',
      description: 'Filter by clinic location',
      icon: <LocationIcon />,
      config: { dynamic: true, userInput: 'location' }
    },
    {
      id: 'patient-select',
      type: 'action',
      name: 'Patient Selection from Schedule',
      description: 'Click patient name from filtered schedule',
      icon: <PersonIcon />,
      config: { userAction: true }
    },
    {
      id: 'chart-open',
      type: 'action',
      name: 'Open Encounter Chart',
      description: 'Open patient chart for current date encounter',
      icon: <ChartIcon />,
      config: { automated: true, context: 'current_date' }
    },
    {
      id: 'chief-complaint',
      type: 'action',
      name: 'Enter Chief Complaint',
      description: 'Input chief complaint into designated field',
      icon: <NoteIcon />,
      templateMapping: 'chief_complaint_block',
      config: { templateField: true, required: true }
    },
    {
      id: 'subjective',
      type: 'action',
      name: 'Enter Subjective (HPI & ROS)',
      description: 'Input history and review of systems',
      icon: <NoteIcon />,
      templateMapping: 'subjective_block',
      config: { templateField: true, multiline: true }
    },
    {
      id: 'objective',
      type: 'action',
      name: 'Enter Objective',
      description: 'Input physical examination findings',
      icon: <NoteIcon />,
      templateMapping: 'objective_block',
      config: { templateField: true, multiline: true }
    },
    {
      id: 'assessment',
      type: 'action',
      name: 'Enter Assessment',
      description: 'Input clinical assessment',
      icon: <NoteIcon />,
      templateMapping: 'assessment_block',
      config: { templateField: true, multiline: true }
    },
    {
      id: 'plan',
      type: 'action',
      name: 'Enter Plan',
      description: 'Input treatment plan',
      icon: <NoteIcon />,
      templateMapping: 'plan_block',
      config: { templateField: true, multiline: true }
    },
    {
      id: 'care-plan',
      type: 'action',
      name: 'Enter Care Plan',
      description: 'Input ongoing care plan',
      icon: <NoteIcon />,
      templateMapping: 'care_plan_block',
      config: { templateField: true, multiline: true }
    },
    {
      id: 'diagnosis',
      type: 'action',
      name: 'Enter Diagnosis',
      description: 'Input ICD-10 diagnosis codes',
      icon: <NoteIcon />,
      templateMapping: 'diagnosis_block',
      config: { templateField: true, icd10: true }
    }
  ];

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'pf-patient-visit',
      name: 'Practice Fusion - Complete Patient Visit Workflow',
      description: 'End-to-end patient encounter workflow with automated SOAP note generation',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      blocks: workflowBlocks
    },
    {
      id: 'pf-prescription',
      name: 'Practice Fusion - Prescription Management Workflow',
      description: 'Streamlined prescription creation and management workflow',
      ehrSystem: 'Practice Fusion',
      category: 'Prescription',
      blocks: workflowBlocks.slice(0, 6) // Simplified for prescription workflow
    },
    {
      id: 'pf-lab-review',
      name: 'Practice Fusion - Lab Results Review Workflow',
      description: 'Systematic lab results review and documentation workflow',
      ehrSystem: 'Practice Fusion',
      category: 'Lab Review',
      blocks: workflowBlocks.slice(0, 8)
    }
  ];

  const filteredWorkflows = workflowTemplates.filter(wf => wf.ehrSystem === userEHR);

  const handleViewWorkflow = (workflow: WorkflowTemplate) => {
    setSelectedWorkflow(workflow);
    setViewDialog(true);
  };

  const handleImportWorkflow = (workflow: WorkflowTemplate) => {
    // This would import the workflow to "My Workflows"
    console.log('Importing workflow:', workflow.name);
    setViewDialog(false);
    // Show success message or navigate to My Workflows
  };

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'primary';
      case 'action': return 'secondary';
      case 'condition': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>EHR System:</strong> {userEHR} - Showing workflows optimized for your EHR system
        </Typography>
      </Alert>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 3 
      }}>
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {workflow.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {workflow.description}
                </Typography>
                <Chip label={workflow.category} size="small" color="primary" />
              </Box>
              
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Workflow Blocks: {workflow.blocks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Includes automated scheduling, patient selection, and SOAP note generation
              </Typography>
            </CardContent>
            
            <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ViewIcon />}
                onClick={() => handleViewWorkflow(workflow)}
                size="small"
                sx={{ flex: 1 }}
              >
                View Details
              </Button>
              <Button
                variant="contained"
                startIcon={<ImportIcon />}
                onClick={() => handleImportWorkflow(workflow)}
                size="small"
                sx={{ flex: 1 }}
              >
                Import
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Workflow Details Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedWorkflow?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {selectedWorkflow?.description}
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            This workflow will map to your Template Builder components for seamless note generation
          </Alert>

          <Typography variant="h6" gutterBottom>
            Workflow Blocks ({selectedWorkflow?.blocks.length})
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 2 
          }}>
            {selectedWorkflow?.blocks.map((block, index) => (
              <Card key={block.id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>
                    {block.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">
                      {index + 1}. {block.name}
                    </Typography>
                    <Chip 
                      label={block.type} 
                      size="small" 
                      color={getBlockTypeColor(block.type)}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {block.description}
                </Typography>
                {block.templateMapping && (
                  <Typography variant="caption" color="primary">
                    Maps to: {block.templateMapping}
                  </Typography>
                )}
              </Card>
            ))}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Template Integration:</strong> This workflow automatically maps note entries to your Template Builder components, ensuring consistent documentation across all patient encounters.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<ImportIcon />}
            onClick={() => handleImportWorkflow(selectedWorkflow!)}
          >
            Import to My Workflows
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
