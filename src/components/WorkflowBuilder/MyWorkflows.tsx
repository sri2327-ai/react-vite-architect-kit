import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useWorkflowData } from '@/hooks/useWorkflowData';
import { useApiContext } from '@/contexts/ApiContext';

interface Workflow {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  status: 'draft' | 'active' | 'paused';
  blocks: any[];
  availableVisitTypes: string[];
  visitTypeMappings: any[];
  lastModified?: string;
  isConfigured?: boolean;
}

const MyWorkflows: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { useApiData } = useApiContext();
  const { workflows, createWorkflow, updateWorkflow, deleteWorkflow } = useWorkflowData(useApiData);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [configData, setConfigData] = useState({
    availableVisitTypes: [] as string[],
    visitTypeMappings: [] as any[]
  });

  // Available visit types for configuration
  const availableVisitTypes = [
    'Annual Physical',
    'Follow-up Visit',
    'Sick Visit',
    'Preventive Care',
    'Consultation',
    'Emergency Visit'
  ];

  const handleConfigureWorkflow = (workflow: Workflow) => {
    console.log('MyWorkflows: Opening configuration for workflow:', workflow);
    setSelectedWorkflow(workflow);
    setConfigData({
      availableVisitTypes: workflow.availableVisitTypes || [],
      visitTypeMappings: workflow.visitTypeMappings || []
    });
    setIsConfigDialogOpen(true);
  };

  const handleCloseConfigDialog = () => {
    console.log('MyWorkflows: Closing configuration dialog');
    setIsConfigDialogOpen(false);
    setSelectedWorkflow(null);
    setConfigData({
      availableVisitTypes: [],
      visitTypeMappings: []
    });
  };

  const handleVisitTypeToggle = (visitType: string) => {
    console.log('MyWorkflows: Toggling visit type:', visitType);
    setConfigData(prev => {
      const newAvailableVisitTypes = prev.availableVisitTypes.includes(visitType)
        ? prev.availableVisitTypes.filter(vt => vt !== visitType)
        : [...prev.availableVisitTypes, visitType];
      
      console.log('MyWorkflows: Updated available visit types:', newAvailableVisitTypes);
      return {
        ...prev,
        availableVisitTypes: newAvailableVisitTypes
      };
    });
  };

  const handleSaveConfiguration = async () => {
    console.log('MyWorkflows: handleSaveConfiguration called');
    console.log('MyWorkflows: Selected workflow:', selectedWorkflow);
    console.log('MyWorkflows: Config data to save:', configData);
    
    if (!selectedWorkflow) {
      console.error('MyWorkflows: No selected workflow to save configuration for');
      return;
    }

    try {
      const updatedWorkflow = {
        ...selectedWorkflow,
        availableVisitTypes: configData.availableVisitTypes,
        visitTypeMappings: configData.visitTypeMappings,
        isConfigured: true,
        lastModified: new Date().toISOString()
      };
      
      console.log('MyWorkflows: Updating workflow with data:', updatedWorkflow);
      
      const result = await updateWorkflow(selectedWorkflow.id, updatedWorkflow);
      console.log('MyWorkflows: Update workflow result:', result);
      
      handleCloseConfigDialog();
      console.log('MyWorkflows: Configuration saved successfully');
    } catch (error) {
      console.error('MyWorkflows: Error saving configuration:', error);
    }
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    // Logic to handle editing the workflow
    console.log('Editing workflow:', workflow);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    // Logic to handle deleting the workflow
    console.log('Deleting workflow with ID:', workflowId);
    deleteWorkflow(workflowId);
  };

  const handleToggleWorkflowStatus = (workflow: Workflow) => {
    // Logic to handle toggling the workflow status (active/paused)
    const newStatus = workflow.status === 'active' ? 'paused' : 'active';
    console.log(`Toggling workflow status for ${workflow.id} from ${workflow.status} to ${newStatus}`);

    const updatedWorkflow = {
      ...workflow,
      status: newStatus,
      lastModified: new Date().toISOString()
    };

    updateWorkflow(workflow.id, updatedWorkflow);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Workflows
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {}}
          sx={{ minWidth: { xs: 'auto', sm: 'auto' } }}
        >
          {isMobile ? <AddIcon /> : 'Create Workflow'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} sm={6} md={4} key={workflow.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1 }}>
                    {workflow.name}
                  </Typography>
                  <Chip
                    label={workflow.status}
                    color={workflow.status === 'active' ? 'success' : workflow.status === 'paused' ? 'warning' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {workflow.description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  EHR System: {workflow.ehrSystem}
                </Typography>
                {workflow.lastModified && (
                  <Typography variant="caption" color="text.secondary">
                    Last modified: {new Date(workflow.lastModified).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Box>
                  <IconButton 
                    size="small" 
                    onClick={() => handleConfigureWorkflow(workflow)}
                    title="Configure"
                  >
                    <SettingsIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    title="Edit"
                    onClick={() => handleEditWorkflow(workflow)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    title="Delete"
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <IconButton 
                  size="small" 
                  color={workflow.status === 'active' ? 'warning' : 'success'}
                  title={workflow.status === 'active' ? 'Pause' : 'Activate'}
                  onClick={() => handleToggleWorkflowStatus(workflow)}
                >
                  {workflow.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Configuration Dialog */}
      <Dialog 
        open={isConfigDialogOpen} 
        onClose={handleCloseConfigDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pr: 1
        }}>
          Configure Workflow: {selectedWorkflow?.name}
          <IconButton
            onClick={handleCloseConfigDialog}
            size="small"
            sx={{ ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Visit Types
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select which visit types this workflow should be available for:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {availableVisitTypes.map((visitType) => (
                <FormControlLabel
                  key={visitType}
                  control={
                    <Checkbox
                      checked={configData.availableVisitTypes.includes(visitType)}
                      onChange={() => handleVisitTypeToggle(visitType)}
                    />
                  }
                  label={visitType}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleSaveConfiguration}
            variant="contained"
            disabled={configData.availableVisitTypes.length === 0}
          >
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyWorkflows;
