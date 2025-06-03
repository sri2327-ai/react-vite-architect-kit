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
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Visibility as VisitIcon,
  GetApp as ImportIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  AccountTree as WorkflowIcon,
  LocalHospital as EHRIcon,
  Assignment as TaskIcon,
  LocationOn as LocationIcon,
  Today as TodayIcon
} from '@mui/icons-material';

interface WorkflowBlock {
  id: string;
  type: 'schedule' | 'patient_select' | 'encounter_open' | 'note_entry' | 'diagnosis' | 'save';
  name: string;
  description: string;
  ehrField?: string;
  isEditable: boolean;
  config?: any;
}

interface PredefinedWorkflow {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  category: string;
  blocks: WorkflowBlock[];
  supportedVisitTypes: string[];
}

const predefinedWorkflows: PredefinedWorkflow[] = [
  {
    id: 'epic-standard-visit',
    name: 'Epic - Standard Patient Visit',
    description: 'Complete patient encounter workflow for Epic EHR system',
    ehrSystem: 'Epic',
    category: 'Patient Encounters',
    supportedVisitTypes: ['Office Visit', 'Follow-up', 'Annual Physical', 'Consultation'],
    blocks: [
      {
        id: 'schedule-menu',
        type: 'schedule',
        name: 'Schedule Menu',
        description: 'Access provider schedule with date and location filters',
        isEditable: true,
        config: {
          filters: ['Provider Name', 'Date', 'Location']
        }
      },
      {
        id: 'provider-filter',
        type: 'schedule',
        name: 'Provider Name Filter',
        description: 'Filter schedule by provider name',
        isEditable: true
      },
      {
        id: 'date-filter',
        type: 'schedule',
        name: "Today's Date",
        description: 'Set schedule to current date',
        isEditable: false
      },
      {
        id: 'location-filter',
        type: 'schedule',
        name: 'Location Filter',
        description: 'Filter schedule by clinic location',
        isEditable: true
      },
      {
        id: 'patient-select',
        type: 'patient_select', 
        name: 'Patient Selection',
        description: 'Select patient from filtered schedule',
        isEditable: false
      },
      {
        id: 'encounter-open',
        type: 'encounter_open',
        name: 'Open Encounter Chart',
        description: 'Open patient encounter for current date',
        isEditable: false
      },
      {
        id: 'chief-complaint',
        type: 'note_entry',
        name: 'Chief Complaint Entry',
        description: 'Enter patient chief complaint',
        ehrField: 'chief_complaint',
        isEditable: true
      },
      {
        id: 'subjective-note',
        type: 'note_entry',
        name: 'Subjective Note',
        description: 'Enter HPI, ROS, and subjective findings',
        ehrField: 'subjective',
        isEditable: true
      },
      {
        id: 'objective-note',
        type: 'note_entry',
        name: 'Objective Note', 
        description: 'Enter physical exam and objective findings',
        ehrField: 'objective',
        isEditable: true
      },
      {
        id: 'assessment-plan',
        type: 'note_entry',
        name: 'Assessment & Plan',
        description: 'Enter assessment and treatment plan',
        ehrField: 'assessment_plan',
        isEditable: true
      },
      {
        id: 'care-plan',
        type: 'note_entry',
        name: 'Care Plan',
        description: 'Enter ongoing care plan',
        ehrField: 'care_plan',
        isEditable: true
      },
      {
        id: 'diagnosis-entry',
        type: 'diagnosis',
        name: 'Diagnosis Entry',
        description: 'Enter ICD-10 diagnoses',
        isEditable: true
      },
      {
        id: 'save-encounter',
        type: 'save',
        name: 'Save Encounter',
        description: 'Save and close encounter',
        isEditable: false
      }
    ]
  },
  {
    id: 'cerner-standard-visit',
    name: 'Cerner - Standard Patient Visit',
    description: 'Complete patient encounter workflow for Cerner EHR system',
    ehrSystem: 'Cerner',
    category: 'Patient Encounters',
    supportedVisitTypes: ['Office Visit', 'Follow-up', 'Consultation'],
    blocks: [
      {
        id: 'schedule-access',
        type: 'schedule',
        name: 'Schedule Menu',
        description: 'Navigate to provider schedule',
        isEditable: true
      },
      {
        id: 'provider-name-filter',
        type: 'schedule',
        name: 'Provider Name Filter',
        description: 'Filter by provider name',
        isEditable: true
      },
      {
        id: 'current-date',
        type: 'schedule',
        name: "Today's Date",
        description: 'Set to current date',
        isEditable: false
      },
      {
        id: 'location-select',
        type: 'schedule',
        name: 'Location Filter',
        description: 'Select clinic location',
        isEditable: true
      },
      {
        id: 'patient-chart',
        type: 'patient_select',
        name: 'Open Patient Chart',
        description: 'Select and open patient chart from schedule',
        isEditable: false
      },
      {
        id: 'note-creation',
        type: 'encounter_open',
        name: 'Create Progress Note',
        description: 'Create new progress note for current date',
        isEditable: false
      },
      {
        id: 'complaint-entry',
        type: 'note_entry',
        name: 'Chief Complaint',
        description: 'Document chief complaint',
        ehrField: 'chief_complaint',
        isEditable: true
      },
      {
        id: 'history-entry',
        type: 'note_entry',
        name: 'History & Review',
        description: 'Document history and review of systems',
        ehrField: 'history_ros',
        isEditable: true
      },
      {
        id: 'exam-entry',
        type: 'note_entry',
        name: 'Physical Examination',
        description: 'Document physical exam findings',
        ehrField: 'physical_exam',
        isEditable: true
      },
      {
        id: 'impression-plan',
        type: 'note_entry',
        name: 'Impression & Plan',
        description: 'Document clinical impression and plan',
        ehrField: 'impression_plan',
        isEditable: true
      },
      {
        id: 'diagnosis-codes',
        type: 'diagnosis',
        name: 'Diagnosis Coding',
        description: 'Add diagnosis codes',
        isEditable: true
      }
    ]
  }
];

interface WorkflowLibraryProps {
  onImportWorkflow?: (workflow: PredefinedWorkflow) => void;
}

const WorkflowLibrary: React.FC<WorkflowLibraryProps> = ({ onImportWorkflow }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<PredefinedWorkflow | null>(null);
  const [showWorkflowDetails, setShowWorkflowDetails] = useState(false);
  const [importDialog, setImportDialog] = useState(false);
  const [selectedVisitTypes, setSelectedVisitTypes] = useState<string[]>([]);

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'schedule': return <ScheduleIcon />;
      case 'patient_select': return <PersonIcon />;
      case 'encounter_open': return <VisitIcon />;
      case 'note_entry': return <EditIcon />;
      case 'diagnosis': return <TaskIcon />;
      case 'save': return <PlayIcon />;
      default: return <WorkflowIcon />;
    }
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'schedule': return 'primary';
      case 'patient_select': return 'secondary';
      case 'encounter_open': return 'info';
      case 'note_entry': return 'success';
      case 'diagnosis': return 'warning';
      case 'save': return 'error';
      default: return 'default';
    }
  };

  const handleViewWorkflow = (workflow: PredefinedWorkflow) => {
    setSelectedWorkflow(workflow);
    setShowWorkflowDetails(true);
  };

  const handleImportClick = (workflow: PredefinedWorkflow) => {
    setSelectedWorkflow(workflow);
    setSelectedVisitTypes([]);
    setImportDialog(true);
  };

  const handleImport = () => {
    if (selectedWorkflow && onImportWorkflow) {
      onImportWorkflow(selectedWorkflow);
      setImportDialog(false);
      setSelectedWorkflow(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Workflow Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pre-built EHR workflows with schedule setup and automation blocks
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Enhanced workflows:</strong> All workflows now include schedule setup blocks 
          (Schedule Menu, Provider Filter, Date Filter, Location Filter) before patient selection. 
          Import and configure these with your provider name and location preferences.
        </Typography>
      </Alert>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
        {predefinedWorkflows.map((workflow) => (
          <Card 
            key={workflow.id}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EHRIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  {workflow.name}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {workflow.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<EHRIcon />} 
                  label={workflow.ehrSystem} 
                  size="small" 
                  color="primary" 
                />
                <Chip 
                  label={workflow.category} 
                  size="small" 
                  color="secondary" 
                />
                <Badge badgeContent={workflow.blocks.length} color="primary">
                  <Chip 
                    icon={<WorkflowIcon />}
                    label="Automation Blocks" 
                    size="small" 
                    variant="outlined"
                  />
                </Badge>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Supported Visit Types:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {workflow.supportedVisitTypes.map((visitType) => (
                  <Chip 
                    key={visitType}
                    label={visitType}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
            
            <Box sx={{ p: 2, pt: 0 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewWorkflow(workflow)}
                  sx={{ flex: 1 }}
                >
                  View Blocks
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ImportIcon />}
                  onClick={() => handleImportClick(workflow)}
                  sx={{ flex: 1 }}
                >
                  Import
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Workflow Details Dialog */}
      <Dialog 
        open={showWorkflowDetails} 
        onClose={() => setShowWorkflowDetails(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkflowIcon color="primary" />
            {selectedWorkflow?.name} - Automation Blocks
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedWorkflow && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                This workflow contains {selectedWorkflow.blocks.length} automation blocks that will 
                execute in sequence when you run the workflow in your EHR.
              </Alert>
              
              <Stepper orientation="vertical">
                {selectedWorkflow.blocks.map((block, index) => (
                  <Step key={block.id} active={true}>
                    <StepLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          icon={getBlockIcon(block.type)}
                          label={block.name}
                          color={getBlockColor(block.type) as any}
                          size="small"
                        />
                        {block.isEditable && (
                          <Chip label="Editable" size="small" variant="outlined" />
                        )}
                        {block.ehrField && (
                          <Chip 
                            label={`Maps to: ${block.ehrField}`} 
                            size="small" 
                            color="info"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {block.description}
                      </Typography>
                      {block.config && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Configuration: {JSON.stringify(block.config)}
                          </Typography>
                        </Box>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWorkflowDetails(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<ImportIcon />}
            onClick={() => {
              setShowWorkflowDetails(false);
              if (selectedWorkflow) {
                handleImportClick(selectedWorkflow);
              }
            }}
          >
            Import This Workflow
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialog} onClose={() => setImportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Workflow</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>{selectedWorkflow?.name}</strong> will be imported to "My Workflows" where you can:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>Map it to your specific visit types</li>
              <li>Customize field mappings to your templates</li>
              <li>Edit automation blocks as needed</li>
              <li>Execute the workflow with your EHR credentials</li>
            </Box>
          </Alert>
          
          <Typography variant="body2" color="text.secondary">
            After import, you'll be able to configure this workflow for each of your visit types 
            and map the note fields to your template fields for seamless automation.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleImport}
            startIcon={<ImportIcon />}
          >
            Import to My Workflows
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
