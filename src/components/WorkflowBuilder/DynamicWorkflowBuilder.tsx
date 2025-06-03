
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { templateService, WorkflowStep, TemplateTypeMapping } from '../../services/templateService';

interface DynamicWorkflow {
  id: string;
  name: string;
  templateType: string;
  visitTypes: string[];
  steps: WorkflowStep[];
  ehrFieldMappings: { [stepId: string]: string };
  isActive: boolean;
}

interface DynamicWorkflowBuilderProps {
  availableTemplates: string[];
  onSave?: (workflow: DynamicWorkflow) => void;
  onCancel?: () => void;
  existingWorkflow?: DynamicWorkflow;
}

const DynamicWorkflowBuilder: React.FC<DynamicWorkflowBuilderProps> = ({
  availableTemplates,
  onSave,
  onCancel,
  existingWorkflow
}) => {
  const [workflow, setWorkflow] = useState<DynamicWorkflow>({
    id: existingWorkflow?.id || `workflow-${Date.now()}`,
    name: existingWorkflow?.name || '',
    templateType: existingWorkflow?.templateType || '',
    visitTypes: existingWorkflow?.visitTypes || [],
    steps: existingWorkflow?.steps || [],
    ehrFieldMappings: existingWorkflow?.ehrFieldMappings || {},
    isActive: existingWorkflow?.isActive || false
  });

  const [templateMapping, setTemplateMapping] = useState<TemplateTypeMapping | null>(null);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [visitTypeInput, setVisitTypeInput] = useState('');

  // Updated EHR fields with more comprehensive list
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
    'Vital Signs',
    'Subjective Note',
    'Objective Note',
    'Diagnosis',
    'Preventive Care',
    'Major Events',
    'Ongoing Medical Problems'
  ];

  // Initialize template library data
  useEffect(() => {
    // Mock library templates data - in real app, this would come from API
    const mockLibraryTemplates = [
      {
        id: 1,
        title: "CLINICAL INTERVIEW",
        specality: "General Medicine",
        type: "SOAP",
        sections: [
          {
            name: "CHIEF COMPLAINT",
            type: "paragraph",
            description: "Capture the main reason for the visit"
          },
          {
            name: "HISTORY OF PRESENT ILLNESS",
            type: "paragraph", 
            description: "Detailed narrative of the current condition"
          },
          {
            name: "ALLERGIES",
            type: "bulleted_list",
            description: "List known allergies"
          }
        ]
      },
      {
        id: 2,
        title: "Dermatology Intake",
        specality: "Dermatology",
        type: "SOAP",
        sections: [
          {
            name: "CHIEF COMPLAINT",
            type: "paragraph",
            description: "Primary skin concern"
          },
          {
            name: "SKIN EXAMINATION",
            type: "paragraph",
            description: "Detailed skin assessment"
          }
        ]
      }
    ];

    // Register library templates with the service
    templateService.registerLibraryTemplates(mockLibraryTemplates);
  }, []);

  useEffect(() => {
    if (workflow.templateType) {
      const mapping = templateService.getEhrFieldMappings(workflow.templateType);
      setTemplateMapping(mapping);
      
      if (mapping && !existingWorkflow) {
        setWorkflow(prev => ({
          ...prev,
          steps: mapping.workflowSteps
        }));
      }
    }
  }, [workflow.templateType, existingWorkflow]);

  const handleTemplateTypeChange = (templateType: string) => {
    setWorkflow(prev => ({
      ...prev,
      templateType,
      name: `${templateType} Workflow`
    }));
  };

  const handleAddVisitType = () => {
    if (visitTypeInput.trim() && !workflow.visitTypes.includes(visitTypeInput.trim())) {
      setWorkflow(prev => ({
        ...prev,
        visitTypes: [...prev.visitTypes, visitTypeInput.trim()]
      }));
      setVisitTypeInput('');
    }
  };

  const handleRemoveVisitType = (visitType: string) => {
    setWorkflow(prev => ({
      ...prev,
      visitTypes: prev.visitTypes.filter(vt => vt !== visitType)
    }));
  };

  const handleStepToggle = (stepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, isEditable: !step.isEditable } : step
      )
    }));
  };

  const handleEhrMapping = (stepId: string, ehrField: string) => {
    setWorkflow(prev => ({
      ...prev,
      ehrFieldMappings: {
        ...prev.ehrFieldMappings,
        [stepId]: ehrField
      }
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(workflow);
    }
  };

  // Get available template types including library templates
  const getAvailableTemplateTypes = () => {
    const builderTemplates = availableTemplates || [];
    const libraryTemplateTypes = templateService.getTemplateTypes();
    return [...new Set([...builderTemplates, ...libraryTemplateTypes])];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {existingWorkflow ? 'Edit' : 'Create'} Dynamic Workflow
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Workflow Name"
              value={workflow.name}
              onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <FormControl fullWidth>
              <InputLabel>Template Type</InputLabel>
              <Select
                value={workflow.templateType}
                label="Template Type"
                onChange={(e) => handleTemplateTypeChange(e.target.value)}
              >
                {getAvailableTemplateTypes().map((template) => (
                  <MenuItem key={template} value={template}>
                    {template}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={workflow.isActive}
                onChange={(e) => setWorkflow(prev => ({ ...prev, isActive: e.target.checked }))}
              />
            }
            label="Active Workflow"
          />
        </CardContent>
      </Card>

      {/* Visit Types Configuration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Visit Types
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Add visit type..."
              value={visitTypeInput}
              onChange={(e) => setVisitTypeInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddVisitType();
                }
              }}
            />
            <Button variant="outlined" onClick={handleAddVisitType}>
              Add
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {workflow.visitTypes.map((visitType) => (
              <Chip
                key={visitType}
                label={visitType}
                onDelete={() => handleRemoveVisitType(visitType)}
                color="primary"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Template Information */}
      {templateMapping && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Template Information
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Template:</strong> {workflow.templateType}<br />
                <strong>Available EHR Fields:</strong> {templateMapping.ehrFields.join(', ')}<br />
                <strong>Total Steps:</strong> {workflow.steps.length}
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Workflow Steps */}
      {workflow.steps.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Workflow Steps
            </Typography>
            
            <Stepper orientation="vertical">
              {workflow.steps.map((step, index) => (
                <Step key={step.id} active={true}>
                  <StepLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">
                        {step.name}
                      </Typography>
                      <Chip 
                        label={step.type} 
                        size="small" 
                        color={step.type === 'trigger' ? 'primary' : step.type === 'action' ? 'secondary' : 'warning'}
                      />
                      {step.templateFieldId && (
                        <Chip label="Template Field" size="small" color="info" />
                      )}
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={step.isEditable}
                              onChange={() => handleStepToggle(step.id)}
                            />
                          }
                          label="Editable"
                        />
                        
                        {step.templateFieldId && (
                          <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>EHR Field Mapping</InputLabel>
                            <Select
                              value={workflow.ehrFieldMappings[step.id] || ''}
                              label="EHR Field Mapping"
                              onChange={(e) => handleEhrMapping(step.id, e.target.value)}
                            >
                              {ehrFields.map((field) => (
                                <MenuItem key={field} value={field}>
                                  {field}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </Box>
                      
                      {workflow.ehrFieldMappings[step.id] && (
                        <Alert severity="info" sx={{ mt: 1 }}>
                          This step will populate the "{workflow.ehrFieldMappings[step.id]}" field in your EHR
                        </Alert>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!workflow.name || !workflow.templateType || workflow.visitTypes.length === 0}
        >
          Save Workflow
        </Button>
      </Box>
    </Box>
  );
};

export default DynamicWorkflowBuilder;
