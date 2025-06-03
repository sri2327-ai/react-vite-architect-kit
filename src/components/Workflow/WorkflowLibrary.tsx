import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
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
  Switch,
  FormControlLabel,
  Alert,
  Grid2 as Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as VisibilityIcon,
  FileCopy as CopyIcon
} from '@mui/icons-material';
import DynamicWorkflowBuilder from './DynamicWorkflowBuilder';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  category: string;
  blocks: WorkflowBlock[];
  isActive: boolean;
  templateType: string;
  visitTypes: string[];
  steps: WorkflowBlock[];
}

interface WorkflowBlock {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  name: string;
  description: string;
  icon: React.ReactNode;
  isEditable?: boolean;
  isNoteField?: boolean;
  config: any;
}

const WorkflowLibrary: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [configurationDialog, setConfigurationDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitTypes, setVisitTypes] = useState<string[]>(['Initial Consultation', 'Follow-up Visit', 'Annual Physical', 'Urgent Care']);
  const [selectedVisitTypes, setSelectedVisitTypes] = useState<string[]>([]);
  const [ehrFieldMappings, setEhrFieldMappings] = useState<{[key: string]: string}>({});
  const [editableBlocks, setEditableBlocks] = useState<{[key: string]: boolean}>({});
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowTemplate | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<WorkflowTemplate[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);

  // Mock user EHR - this would come from user profile
  const userEHR = 'Practice Fusion';

  // Mock EHR fields for mapping
  const ehrFields = [
    'Chief Complaint',
    'History of Present Illness',
    'Past Medical History',
    'Social History',
    'Family History',
    'Review of Systems',
    'Physical Examination',
    'Assessment',
    'Plan',
    'Medications',
    'Allergies',
    'Vital Signs'
  ];

  const categories = [
    'Patient Encounter',
    'Prescription',
    'Lab Review',
    'Imaging Review',
    'Care Coordination'
  ];

  const workflowBlocks: WorkflowBlock[] = [
    {
      id: 'schedule-menu',
      type: 'trigger',
      name: 'Access Schedule',
      description: 'Navigate to patient schedule interface',
      icon: <ScheduleIcon />,
      config: { automated: true },
      isEditable: false,
      isNoteField: false
    },
    {
      id: 'provider-filter',
      type: 'action',
      name: 'Filter by Provider',
      description: 'Select your name from provider list',
      icon: <PersonIcon />,
      config: { dynamic: true, userInput: 'provider_name' },
      isEditable: true,
      isNoteField: false
    },
    {
      id: 'date-filter',
      type: 'action',
      name: 'Select Date',
      description: 'Choose appointment date',
      icon: <TodayIcon />,
      config: { automated: true, value: 'current_date' },
      isEditable: true,
      isNoteField: false
    },
    {
      id: 'patient-select',
      type: 'action',
      name: 'Select Patient',
      description: 'Click on patient from schedule',
      icon: <PersonIcon />,
      config: { userAction: true },
      isEditable: false,
      isNoteField: false
    },
    {
      id: 'chief-complaint',
      type: 'action',
      name: 'Chief Complaint',
      description: 'Document primary reason for visit - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, required: true },
      isEditable: true,
      isNoteField: true
    },
    {
      id: 'subjective',
      type: 'action',
      name: 'History & Review',
      description: 'Document patient history and symptoms - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, multiline: true },
      isEditable: true,
      isNoteField: true
    },
    {
      id: 'objective',
      type: 'action',
      name: 'Physical Exam',
      description: 'Record examination findings - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, multiline: true },
      isEditable: true,
      isNoteField: true
    },
    {
      id: 'assessment',
      type: 'action',
      name: 'Clinical Assessment',
      description: 'Document clinical impression - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, multiline: true },
      isEditable: true,
      isNoteField: true
    },
    {
      id: 'plan',
      type: 'action',
      name: 'Treatment Plan',
      description: 'Outline treatment approach - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, multiline: true },
      isEditable: true,
      isNoteField: true
    }
  ];

  // Predefined EHR workflows (not visit-type specific)
  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'pf-complete-encounter',
      name: 'Complete Patient Encounter',
      description: 'Full patient encounter workflow with comprehensive documentation',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      blocks: workflowBlocks,
      isActive: true,
      templateType: 'Default',
      visitTypes: ['Initial Consultation', 'Follow-up Visit'],
      steps: workflowBlocks
    },
    {
      id: 'pf-quick-visit',
      name: 'Quick Visit Documentation',
      description: 'Streamlined workflow for brief encounters',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      blocks: workflowBlocks.slice(0, 7),
      isActive: true,
      templateType: 'Default',
      visitTypes: ['Initial Consultation', 'Follow-up Visit'],
      steps: workflowBlocks.slice(0, 7)
    },
    {
      id: 'pf-prescription-only',
      name: 'Prescription Focused Visit',
      description: 'Workflow optimized for medication management visits',
      ehrSystem: 'Practice Fusion',
      category: 'Prescription',
      blocks: workflowBlocks.slice(0, 6),
      isActive: true,
      templateType: 'Default',
      visitTypes: ['Initial Consultation', 'Follow-up Visit'],
      steps: workflowBlocks.slice(0, 6)
    },
    {
      id: 'pf-follow-up',
      name: 'Follow-up Visit Workflow',
      description: 'Efficient workflow for follow-up appointments',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      blocks: workflowBlocks.slice(0, 8),
      isActive: true,
      templateType: 'Default',
      visitTypes: ['Initial Consultation', 'Follow-up Visit'],
      steps: workflowBlocks.slice(0, 8)
    }
  ];

  useEffect(() => {
    // Fetch available templates and workflows from API
    setAvailableTemplates(workflowTemplates);
    setWorkflows(workflowTemplates);
  }, []);

  const filteredWorkflows = workflows.filter(wf => {
    const ehrMatch = wf.ehrSystem === userEHR;
    const categoryMatch = selectedCategory === 'all' || wf.category === selectedCategory;
    return ehrMatch && categoryMatch;
  });

  const handleViewWorkflow = (workflow: WorkflowTemplate) => {
    setSelectedWorkflow(workflow);
    setViewDialog(true);
  };

  const handleImportWorkflow = (workflow: WorkflowTemplate) => {
    setSelectedWorkflow(workflow);
    setViewDialog(false);
    setConfigurationDialog(true);
    setCurrentStep(0);
    setSelectedVisitTypes([]);
    setEhrFieldMappings({});
    setEditableBlocks({});
    setImportComplete(false);
    
    // Initialize editable blocks based on workflow
    const initialEditableBlocks: {[key: string]: boolean} = {};
    workflow.blocks.forEach(block => {
      initialEditableBlocks[block.id] = block.isEditable || false;
    });
    setEditableBlocks(initialEditableBlocks);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinalImport = async () => {
    setIsImporting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsImporting(false);
    setImportComplete(true);
    
    console.log('Importing workflow with configuration:', {
      workflow: selectedWorkflow?.name,
      visitTypes: selectedVisitTypes,
      ehrMappings: ehrFieldMappings,
      editableBlocks
    });
    
    // Close dialog after showing success
    setTimeout(() => {
      setConfigurationDialog(false);
      setImportComplete(false);
    }, 2000);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Visit Types
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose which visit types this workflow should be available for:
            </Typography>
            
            <Grid container spacing={2}>
              {visitTypes.map((visitType) => (
                <Grid xs={12} sm={6} key={visitType}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedVisitTypes.includes(visitType) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      '&:hover': { borderColor: '#1976d2' }
                    }}
                    onClick={() => {
                      setSelectedVisitTypes(prev => 
                        prev.includes(visitType) 
                          ? prev.filter(v => v !== visitType)
                          : [...prev, visitType]
                      );
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body1">{visitType}</Typography>
                        {selectedVisitTypes.includes(visitType) && (
                          <CheckCircleIcon color="primary" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add custom visit type..."
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                    const newType = (e.target as HTMLInputElement).value.trim();
                    setVisitTypes(prev => [...prev, newType]);
                    setSelectedVisitTypes(prev => [...prev, newType]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </Box>
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configure Editable Steps
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose which workflow steps users can customize:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedWorkflow?.blocks.map((block, index) => (
                <Card key={block.id} variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box sx={{ color: 'primary.main' }}>
                          {block.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2">
                            {index + 1}. {block.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {block.description}
                          </Typography>
                        </Box>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editableBlocks[block.id] || false}
                            onChange={(e) => setEditableBlocks(prev => ({
                              ...prev,
                              [block.id]: e.target.checked
                            }))}
                          />
                        }
                        label="Editable"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Map EHR Fields
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Map note blocks to your EHR fields:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {selectedWorkflow?.blocks
                .filter(block => block.isNoteField)
                .map((block) => (
                  <Paper key={block.id} sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box sx={{ color: 'primary.main' }}>
                        {block.icon}
                      </Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {block.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {block.description}
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel>Select EHR Field</InputLabel>
                      <Select
                        value={ehrFieldMappings[block.id] || ''}
                        label="Select EHR Field"
                        onChange={(e) => setEhrFieldMappings(prev => ({
                          ...prev,
                          [block.id]: e.target.value
                        }))}
                      >
                        {ehrFields.map((field) => (
                          <MenuItem key={field} value={field}>{field}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Paper>
                ))}
            </Box>
          </Box>
        );
        
      case 3:
        return (
          <Box>
            {!isImporting && !importComplete ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Review Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Please review your workflow configuration:
                </Typography>
                
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Visit Types ({selectedVisitTypes.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {selectedVisitTypes.map((type) => (
                        <Chip key={type} label={type} color="primary" size="small" />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Editable Steps ({Object.values(editableBlocks).filter(Boolean).length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {selectedWorkflow?.blocks
                        .filter(block => editableBlocks[block.id])
                        .map((block) => (
                          <Typography key={block.id} variant="body2">
                            • {block.name}
                          </Typography>
                        ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      EHR Field Mappings ({Object.keys(ehrFieldMappings).length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {Object.entries(ehrFieldMappings).map(([blockId, ehrField]) => {
                        const block = selectedWorkflow?.blocks.find(b => b.id === blockId);
                        return (
                          <Typography key={blockId} variant="body2">
                            • {block?.name} → {ehrField}
                          </Typography>
                        );
                      })}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </>
            ) : isImporting ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LinearProgress sx={{ mb: 3 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Importing Workflow...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Setting up your workflow with the specified configuration.
                </Typography>
              </Box>
            ) : (
              <Fade in={importComplete}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Zoom in={importComplete}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />
                  </Zoom>
                  <Typography variant="h5" sx={{ mb: 2, color: 'green' }}>
                    Import Successful!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Your workflow has been configured and is ready to use.
                  </Typography>
                </Box>
              </Fade>
            )}
          </Box>
        );
        
      default:
        return null;
    }
  };

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'primary';
      case 'action': return 'secondary';
      case 'condition': return 'warning';
      default: return 'default';
    }
  };

  const handleEditWorkflow = (workflow: WorkflowTemplate) => {
    setEditingWorkflow(workflow);
    setShowBuilder(true);
  };

  const handleCloneWorkflow = (workflow: WorkflowTemplate) => {
    const newWorkflow = { ...workflow, id: `clone-${workflow.id}`, isActive: false };
    setWorkflows(prev => [...prev, newWorkflow]);
    setShowBuilder(true);
  };

  const handlePreviewWorkflow = (workflow: WorkflowTemplate) => {
    setSelectedWorkflow(workflow);
    setViewDialog(true);
  };

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(wf => {
      if (wf.id === workflowId) {
        return { ...wf, isActive: !wf.isActive };
      }
      return wf;
    }));
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(wf => wf.id !== workflowId));
  };

  const handleSaveWorkflow = (updatedWorkflow: WorkflowTemplate) => {
    setWorkflows(prev => {
      const updatedWorkflows = prev.map(wf => {
        if (wf.id === updatedWorkflow.id) {
          return updatedWorkflow;
        }
        return wf;
      });
      return updatedWorkflows;
    });
    setShowBuilder(false);
    setEditingWorkflow(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {!showBuilder ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Workflow Library
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowBuilder(true)}
            >
              Create Workflow
            </Button>
          </Box>

          <Grid container spacing={3}>
            {workflows.map(workflow => (
              <Grid size={{ xs: 12, sm: 6 }} key={workflow.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {workflow.name}
                      </Typography>
                      <Chip 
                        label={workflow.isActive ? 'Active' : 'Inactive'} 
                        color={workflow.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Template: {workflow.templateType}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" display="block" gutterBottom>
                        Visit Types:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {workflow.visitTypes.map((visitType) => (
                          <Chip key={visitType} label={visitType} size="small" />
                        ))}
                      </Box>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {workflow.steps.length} steps configured
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <IconButton onClick={() => handleEditWorkflow(workflow)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleCloneWorkflow(workflow)} size="small">
                        <CopyIcon />
                      </IconButton>
                      <IconButton onClick={() => handlePreviewWorkflow(workflow)} size="small">
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton 
                        onClick={() => handleToggleWorkflow(workflow.id)} 
                        size="small"
                        color={workflow.isActive ? 'success' : 'default'}
                      >
                        {workflow.isActive ? <PauseIcon /> : <PlayIcon />}
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteWorkflow(workflow.id)} 
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <DynamicWorkflowBuilder
          availableTemplates={availableTemplates}
          existingWorkflow={editingWorkflow}
          onSave={handleSaveWorkflow}
          onCancel={() => {
            setShowBuilder(false);
            setEditingWorkflow(null);
          }}
        />
      )}

      {/* Workflow Details Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisitIcon color="primary" />
            {selectedWorkflow?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {selectedWorkflow?.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip label={`Category: ${selectedWorkflow?.category}`} color="secondary" />
            <Chip label={`${selectedWorkflow?.blocks.filter(b => b.isEditable).length} Editable Steps`} size="small" color="primary" />
            <Chip label={`${selectedWorkflow?.blocks.filter(b => b.isNoteField).length} Note Fields`} size="small" color="warning" />
          </Box>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Configuration Required:</strong> After importing, you'll need to:
              <br />• Map this workflow to your specific visit types
              <br />• Configure which EHR fields each note block should populate
              <br />• Customize editable steps for your practice patterns
            </Typography>
          </Alert>

          <Typography variant="h6" gutterBottom>
            Workflow Steps ({selectedWorkflow?.blocks.length})
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
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
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip 
                        label={block.type} 
                        size="small" 
                        color={getBlockTypeColor(block.type)}
                      />
                      {block.isEditable && (
                        <Chip 
                          label="Editable" 
                          size="small" 
                          color="success"
                          icon={<EditIcon />}
                        />
                      )}
                      {block.isNoteField && (
                        <Chip 
                          label="Note Field" 
                          size="small" 
                          color="warning"
                          icon={<MapIcon />}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {block.description}
                </Typography>
              </Card>
            ))}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Next Steps:</strong> Import this workflow to start customizing it for your practice. 
              You'll be able to map it to multiple visit types and configure all EHR field mappings.
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
            Import & Configure
          </Button>
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog 
        open={configurationDialog} 
        onClose={() => setConfigurationDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, minHeight: '600px' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon color="primary" />
              Configure Workflow: {selectedWorkflow?.name}
            </Box>
            <IconButton onClick={() => setConfigurationDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3 }}>
          <Stepper activeStep={currentStep} orientation="horizontal" sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Visit Types</StepLabel>
            </Step>
            <Step>
              <StepLabel>Editable Steps</StepLabel>
            </Step>
            <Step>
              <StepLabel>EHR Mapping</StepLabel>
            </Step>
            <Step>
              <StepLabel>Review & Import</StepLabel>
            </Step>
          </Stepper>
          
          {getStepContent(currentStep)}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button
            onClick={currentStep === 0 ? () => setConfigurationDialog(false) : handlePrevStep}
            disabled={isImporting || importComplete}
            startIcon={currentStep === 0 ? <CloseIcon /> : <ArrowBackIcon />}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            variant="contained"
            onClick={currentStep === 3 ? handleFinalImport : handleNextStep}
            disabled={
              isImporting || 
              importComplete ||
              (currentStep === 0 && selectedVisitTypes.length === 0) ||
              (currentStep === 2 && Object.keys(ehrFieldMappings).length === 0)
            }
            startIcon={currentStep === 3 ? <SaveIcon /> : undefined}
            sx={{
              background: currentStep === 3 ? 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)' : undefined
            }}
          >
            {currentStep === 3 ? (isImporting ? 'Importing...' : 'Import Workflow') : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
