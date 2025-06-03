import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Zoom
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Today as TodayIcon,
  Note as NoteIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisitIcon,
  Map as MapIcon,
  GetApp as ImportIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import DynamicWorkflowBuilder from './DynamicWorkflowBuilder';
import { templateService } from '../../services/templateService';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  ehrSystem: string;
  blocks: any[];
}

const initialWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: 'workflow-1',
    name: 'New Patient Onboarding',
    description: 'Workflow for onboarding new patients to the clinic.',
    category: 'Patient Management',
    ehrSystem: 'Epic',
    blocks: []
  },
  {
    id: 'workflow-2',
    name: 'Annual Physical Exam',
    description: 'Workflow for conducting annual physical exams.',
    category: 'Clinical Operations',
    ehrSystem: 'Cerner',
    blocks: []
  }
];

const WorkflowLibrary: React.FC = () => {
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>(initialWorkflowTemplates);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const handleCreateWorkflow = () => {
    const newWorkflow: WorkflowTemplate = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      category: '',
      ehrSystem: '',
      blocks: []
    };
    setWorkflowTemplates(prev => [...prev, newWorkflow]);
  };

  const handleEditWorkflow = (workflow: WorkflowTemplate) => {
    setSelectedWorkflow(workflow);
    setShowBuilder(true);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflowTemplates(prev => prev.filter(workflow => workflow.id !== workflowId));
  };

  const handleSaveWorkflow = (updatedWorkflow: any) => {
    // Convert the workflow to our WorkflowTemplate format
    const workflowTemplate: WorkflowTemplate = {
      id: updatedWorkflow.id || selectedWorkflow?.id || `workflow-${Date.now()}`,
      name: updatedWorkflow.name || 'Untitled Workflow',
      description: updatedWorkflow.description || '',
      category: updatedWorkflow.category || 'General',
      ehrSystem: updatedWorkflow.ehrSystem || 'Generic',
      blocks: updatedWorkflow.blocks || []
    };

    setWorkflowTemplates(prev =>
      prev.map(workflow =>
        workflow.id === workflowTemplate.id ? workflowTemplate : workflow
      )
    );
    setShowBuilder(false);
    setSelectedWorkflow(null);
  };

  const handleCancelWorkflow = () => {
    setShowBuilder(false);
    setSelectedWorkflow(null);
  };

  const handleImportWorkflow = () => {
    setShowImportDialog(true);
  };

  const handleCloseImportDialog = () => {
    setShowImportDialog(false);
  };

  const handleSettings = () => {
    setShowSettingsDialog(true);
  };

  const handleCloseSettingsDialog = () => {
    setShowSettingsDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Workflow Library
        </Typography>
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateWorkflow} sx={{ mr: 2 }}>
            Create Workflow
          </Button>
          <Button variant="outlined" startIcon={<ImportIcon />} onClick={handleImportWorkflow}>
            Import Workflow
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {workflowTemplates.map((workflow) => (
          <Box key={workflow.id} sx={{ width: { xs: '100%', sm: '48%', md: '31%' } }}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {workflow.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {workflow.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<ScheduleIcon />} 
                    label={workflow.ehrSystem} 
                    size="small" 
                    color="primary" 
                  />
                  <Chip 
                    icon={<PersonIcon />} 
                    label={workflow.category} 
                    size="small" 
                    color="secondary" 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {workflow.blocks.length} steps
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditWorkflow(workflow)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={showBuilder} onClose={handleCancelWorkflow} maxWidth="md" fullWidth>
        <DialogTitle>{selectedWorkflow ? `Edit Workflow: ${selectedWorkflow.name}` : 'Workflow Builder'}</DialogTitle>
        <DialogContent>
          {selectedWorkflow && (
            <DynamicWorkflowBuilder
              workflow={selectedWorkflow}
              onSave={handleSaveWorkflow}
              onCancel={handleCancelWorkflow}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelWorkflow}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showImportDialog} onClose={handleCloseImportDialog}>
        <DialogTitle>Import Workflow</DialogTitle>
        <DialogContent>
          <Typography>
            Implement import logic here (e.g., file upload).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showSettingsDialog} onClose={handleCloseSettingsDialog}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Implement settings options here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettingsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
