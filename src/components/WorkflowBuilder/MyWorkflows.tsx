import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Stack,
  Paper
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  MoreVert as MoreIcon,
  Download as ImportIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  Map as MapIcon,
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
  AccountTree as WorkflowIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Note as NoteIcon,
  History as HistoryIcon,
  Checklist as ChecklistIcon,
  Computer as EHRIcon,
  AccessTime as TimeIcon,
  LocalHospital as ClinicIcon,
  Psychology as AIIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { templateBuilderService } from '../../services/templateBuilderService';

interface WorkflowBlock {
  id: string;
  type: string;
  name: string;
  description: string;
  ehrField?: string;
  isEditable: boolean;
  config?: any;
}

interface ScheduleConfig {
  providerName: string;
  location: string;
  importPreviousNote: boolean;
  importPreviousNoteFor: 'all' | 'selected';
  selectedVisitTypes: string[];
}

interface VisitTypeMapping {
  visitType: string;
  templateFields: { [blockId: string]: string };
  scheduleConfig: ScheduleConfig;
  noteType: string;
  isConfigured: boolean;
}

interface ImportedWorkflow {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  status: 'draft' | 'configured' | 'active' | 'error';
  lastRun?: string;
  blocks: WorkflowBlock[];
  visitTypeMappings: VisitTypeMapping[];
  availableVisitTypes: string[];
}

interface MyWorkflowsProps {
  importedWorkflows?: any[];
  setImportedWorkflows?: (workflows: any[]) => void;
}

const MyWorkflows: React.FC<MyWorkflowsProps> = ({ 
  importedWorkflows = [], 
  setImportedWorkflows 
}) => {
  const [workflows, setWorkflows] = useState<ImportedWorkflow[]>(
    importedWorkflows.length > 0 ? importedWorkflows : [
      {
        id: '1',
        name: 'Epic - Standard Patient Visit',
        description: 'Complete patient encounter workflow with automated note generation',
        ehrSystem: 'Epic',
        status: 'configured',
        lastRun: '2024-01-15 14:30',
        availableVisitTypes: templateBuilderService.getAllVisitTypeNames(),
        visitTypeMappings: [
          {
            visitType: 'Office Visit',
            templateFields: {
              'chief-complaint': 'Chief Complaint',
              'subjective-note': 'History of Present Illness',
              'objective-note': 'Physical Examination'
            },
            scheduleConfig: {
              providerName: 'Dr. Smith',
              location: 'Main Clinic',
              importPreviousNote: false,
              importPreviousNoteFor: 'all',
              selectedVisitTypes: []
            },
            noteType: 'Progress Note',
            isConfigured: true
          },
          {
            visitType: 'Follow-up',
            templateFields: {},
            scheduleConfig: {
              providerName: '',
              location: '',
              importPreviousNote: false,
              importPreviousNoteFor: 'all',
              selectedVisitTypes: []
            },
            noteType: '',
            isConfigured: false
          }
        ],
        blocks: [
          {
            id: 'schedule-menu',
            type: 'schedule',
            name: 'Schedule Menu',
            description: 'Access provider schedule with date and location filters',
            isEditable: true
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
            description: 'Open patient encounter for current date and choose note type',
            isEditable: true
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
          }
        ]
      }
    ]
  );
  
  const [executeDialog, setExecuteDialog] = useState(false);
  const [configureDialog, setConfigureDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ImportedWorkflow | null>(null);
  const [selectedVisitType, setSelectedVisitType] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [executionStep, setExecutionStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const executionSteps = [
    'Select Visit Type',
    'EHR Login', 
    'Security Verification',
    'AI Automation Running',
    'Complete'
  ];

  const handleExecuteWorkflow = (workflow: ImportedWorkflow) => {
    setSelectedWorkflow(workflow);
    setExecuteDialog(true);
    setExecutionStep(0);
    setCredentials({ username: '', password: '' });
    setOtpCode('');
    setMfaEnabled(false);
    setSelectedVisitType('');
  };

  const handleConfigureWorkflow = (workflow: ImportedWorkflow) => {
    setSelectedWorkflow(workflow);
    setConfigureDialog(true);
  };

  const handleVisitTypeSelection = () => {
    if (!selectedVisitType) return;
    setExecutionStep(1);
  };

  const handleStartExecution = async () => {
    if (!credentials.username || !credentials.password) return;
    
    setIsExecuting(true);
    setExecutionStep(2);
    
    // Simulate authentication
    setTimeout(() => {
      if (mfaEnabled) {
        setExecutionStep(2); // Wait for OTP
      } else {
        setExecutionStep(3);
        startWorkflowExecution();
      }
      setIsExecuting(false);
    }, 2000);
  };

  const handleMfaVerification = () => {
    if (!otpCode) return;
    
    setIsExecuting(true);
    setTimeout(() => {
      setExecutionStep(3);
      startWorkflowExecution();
    }, 1000);
  };

  const startWorkflowExecution = () => {
    setTimeout(() => {
      setExecutionStep(4);
      setIsExecuting(false);
      // Update workflow status
      if (selectedWorkflow) {
        setWorkflows(prev => prev.map(w => 
          w.id === selectedWorkflow.id 
            ? { ...w, status: 'active' as const, lastRun: new Date().toLocaleString() }
            : w
        ));
      }
    }, 3000);
  };

  const handleFieldMapping = (visitType: string, blockId: string, templateField: string) => {
    if (!selectedWorkflow) return;
    
    setSelectedWorkflow(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        visitTypeMappings: prev.visitTypeMappings.map(mapping =>
          mapping.visitType === visitType
            ? {
                ...mapping,
                templateFields: {
                  ...mapping.templateFields,
                  [blockId]: templateField
                },
                isConfigured: Object.keys({
                  ...mapping.templateFields,
                  [blockId]: templateField
                }).length >= prev.blocks.filter(b => b.type === 'note_entry').length
              }
            : mapping
        )
      };
    });
  };

  const handleScheduleConfigChange = (visitType: string, field: keyof ScheduleConfig, value: string | boolean | string[]) => {
    if (!selectedWorkflow) return;
    
    setSelectedWorkflow(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        visitTypeMappings: prev.visitTypeMappings.map(mapping =>
          mapping.visitType === visitType
            ? {
                ...mapping,
                scheduleConfig: {
                  ...mapping.scheduleConfig,
                  [field]: value
                }
              }
            : mapping
        )
      };
    });
  };

  const handleGlobalScheduleConfigChange = (field: keyof ScheduleConfig, value: string | boolean | string[]) => {
    if (!selectedWorkflow) return;
    
    setSelectedWorkflow(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        visitTypeMappings: prev.visitTypeMappings.map(mapping => ({
          ...mapping,
          scheduleConfig: {
            ...mapping.scheduleConfig,
            [field]: value
          }
        }))
      };
    });
  };

  const handleNoteTypeChange = (visitType: string, noteType: string) => {
    if (!selectedWorkflow) return;
    
    setSelectedWorkflow(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        visitTypeMappings: prev.visitTypeMappings.map(mapping =>
          mapping.visitType === visitType
            ? {
                ...mapping,
                noteType: noteType
              }
            : mapping
        )
      };
    });
  };

  const getTemplateSectionsForVisitType = (visitTypeName: string) => {
    const visitType = templateBuilderService.getVisitTypeByName(visitTypeName);
    return visitType?.template.sections || [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'configured': return 'info';
      case 'error': return 'error';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckIcon />;
      case 'configured': return <SettingsIcon />;
      case 'error': return <ErrorIcon />;
      default: return <WarningIcon />;
    }
  };

  const getConfigurationStatus = (workflow: ImportedWorkflow) => {
    const configuredMappings = workflow.visitTypeMappings.filter(m => 
      m.isConfigured && 
      m.noteType && 
      Object.keys(m.templateFields).length >= workflow.blocks.filter(b => b.type === 'note_entry').length
    ).length;
    const totalMappings = workflow.visitTypeMappings.length;
    return `${configuredMappings}/${totalMappings} visit types configured`;
  };

  const getBlockTypeIcon = (type: string) => {
    switch (type) {
      case 'schedule': return <ScheduleIcon color="primary" />;
      case 'patient_select': return <PersonIcon color="primary" />;
      case 'encounter_open': return <NoteIcon color="primary" />;
      case 'note_entry': return <ChecklistIcon color="primary" />;
      default: return <AIIcon color="primary" />;
    }
  };

  const getBlockTypeLabel = (type: string) => {
    switch (type) {
      case 'schedule': return 'Schedule';
      case 'patient_select': return 'Patient';
      case 'encounter_open': return 'Chart';
      case 'note_entry': return 'Documentation';
      default: return 'Automation';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {workflows.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, 
              borderRadius: 4, 
              backgroundColor: 'grey.50',
              border: '2px dashed',
              borderColor: 'grey.300'
            }}
          >
            <WorkflowIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
              No Clinical Workflows Yet
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Start automating your clinical documentation by importing workflows from our library
            </Typography>
            
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4, 
                maxWidth: 700, 
                mx: 'auto',
                fontSize: '1rem',
                '& .MuiAlert-message': {
                  textAlign: 'left'
                }
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Quick Start Guide:
              </Typography>
              <Typography component="div" variant="body1">
                1. <strong>Browse Library:</strong> Go to Workflow Library tab<br />
                2. <strong>Import Workflow:</strong> Choose a clinical workflow template<br />
                3. <strong>Configure:</strong> Map to your visit types and EHR fields<br />
                4. <strong>Execute:</strong> Run automated documentation with your EHR
              </Typography>
            </Alert>
          </Paper>
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              My Clinical Workflows
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              AI-powered automation for your EHR documentation and clinical workflows
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>For Clinicians:</strong> These workflows automate repetitive EHR tasks, allowing you to focus on patient care. 
                Each workflow connects to your visit types from Template Builder and executes common documentation patterns.
              </Typography>
            </Alert>
          </Box>

          <Grid container spacing={3}>
            {workflows.map((workflow) => (
              <Grid item xs={12} lg={6} xl={4} key={workflow.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Header Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <EHRIcon sx={{ color: '#6B7280' }} />
                          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {workflow.name}
                          </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                          {workflow.description}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{ ml: 1 }}
                      >
                        <MoreIcon />
                      </IconButton>
                    </Box>
                    
                    {/* Status and Info Chips */}
                    <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        label={workflow.status === 'active' ? 'RUNNING' : workflow.status.toUpperCase()}
                        color={getStatusColor(workflow.status)}
                        size="medium"
                        icon={getStatusIcon(workflow.status)}
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip 
                        label={workflow.ehrSystem} 
                        size="medium" 
                        sx={{ 
                          color: '#6B7280',
                          borderColor: '#6B7280'
                        }}
                        variant="outlined"
                        icon={<EHRIcon />}
                      />
                      <Chip 
                        label={`${workflow.blocks.length} automation steps`} 
                        size="medium" 
                        variant="outlined"
                        sx={{ 
                          color: '#6B7280',
                          borderColor: '#6B7280'
                        }}
                        icon={<AIIcon />}
                      />
                    </Stack>

                    {/* Clinical Workflow Steps */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ChecklistIcon sx={{ color: '#6B7280' }} />
                        Clinical Automation Steps
                      </Typography>
                      
                      <Paper elevation={0} sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
                        <Grid container spacing={1}>
                          {workflow.blocks.slice(0, 6).map((block, index) => (
                            <Grid item xs={12} sm={6} key={block.id}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                p: 1,
                                borderRadius: 1,
                                backgroundColor: 'white',
                                border: '1px solid',
                                borderColor: 'grey.200'
                              }}>
                                <Box sx={{ 
                                  minWidth: 24, 
                                  height: 24, 
                                  borderRadius: '50%', 
                                  backgroundColor: '#6B7280', 
                                  color: 'white', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}>
                                  {index + 1}
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="body2" sx={{ 
                                    fontWeight: 500, 
                                    fontSize: '0.875rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {block.name}
                                  </Typography>
                                  <Chip 
                                    label={getBlockTypeLabel(block.type)} 
                                    size="small" 
                                    variant="outlined" 
                                    sx={{ height: 16, fontSize: '0.65rem', mt: 0.5 }}
                                  />
                                </Box>
                                {block.isEditable && (
                                  <SettingsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                )}
                              </Box>
                            </Grid>
                          ))}
                          {workflow.blocks.length > 6 && (
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 1 }}>
                                +{workflow.blocks.length - 6} more automation steps
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    </Box>

                    {/* Configuration Status */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapIcon sx={{ color: '#6B7280' }} />
                        Configuration Status
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getConfigurationStatus(workflow)}
                      </Typography>
                    </Box>

                    {/* Last Run Info */}
                    {workflow.lastRun && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Last executed: {workflow.lastRun}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  {/* Action Buttons */}
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="medium"
                          startIcon={<SettingsIcon />}
                          onClick={() => handleConfigureWorkflow(workflow)}
                          sx={{ flex: 1 }}
                        >
                          Configure
                        </Button>
                        <Button
                          variant="contained"
                          size="medium"
                          startIcon={<PlayIcon />}
                          onClick={() => handleExecuteWorkflow(workflow)}
                          disabled={workflow.status === 'error' || workflow.status === 'draft'}
                          sx={{ flex: 1 }}
                        >
                          Execute
                        </Button>
                      </Box>
                      
                      {workflow.status === 'draft' && (
                        <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
                          <strong>Setup Required:</strong> Configure visit type mappings to enable workflow execution
                        </Alert>
                      )}
                      
                      {workflow.status === 'configured' && (
                        <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                          <strong>Ready to Use:</strong> Workflow configured and ready for EHR execution
                        </Alert>
                      )}

                      {workflow.status === 'active' && (
                        <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                          <strong>Currently Running:</strong> AI automation is active in your EHR
                        </Alert>
                      )}
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Workflow Execution Dialog */}
      <Dialog open={executeDialog} onClose={() => setExecuteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Execute Workflow: {selectedWorkflow?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={executionStep} alternativeLabel>
              {executionSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {isExecuting && <LinearProgress sx={{ mb: 2 }} />}

          {executionStep === 0 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Select the visit type for this workflow execution. Visit types come from your Template Builder.
              </Alert>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Visit Type</InputLabel>
                <Select
                  value={selectedVisitType}
                  label="Visit Type"
                  onChange={(e) => setSelectedVisitType(e.target.value)}
                >
                  {selectedWorkflow?.availableVisitTypes.map((visitType) => (
                    <MenuItem key={visitType} value={visitType}>
                      {visitType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {executionStep === 1 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Enter your {selectedWorkflow?.ehrSystem} credentials to authenticate and execute the workflow
              </Alert>
              <TextField
                fullWidth
                label={`${selectedWorkflow?.ehrSystem} Username`}
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />
              <TextField
                fullWidth
                label={`${selectedWorkflow?.ehrSystem} Password`}
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mfaEnabled}
                    onChange={(e) => setMfaEnabled(e.target.checked)}
                  />
                }
                label={`My ${selectedWorkflow?.ehrSystem} has Multi-Factor Authentication (MFA)`}
              />
            </Box>
          )}

          {executionStep === 2 && mfaEnabled && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3 }}>
                MFA detected. Please check your device for the OTP code and enter it below.
              </Alert>
              <TextField
                fullWidth
                label="Enter OTP Code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                inputProps={{ maxLength: 6 }}
                size="small"
              />
            </Box>
          )}

          {executionStep === 3 && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Authentication successful! Executing workflow for {selectedVisitType}...
              </Alert>
              <Typography variant="body2" color="text.secondary">
                The workflow is now automating your {selectedWorkflow?.ehrSystem} system. 
                You can monitor progress in the workflow dashboard.
              </Typography>
            </Box>
          )}

          {executionStep === 4 && (
            <Alert severity="success">
              Workflow executed successfully! Your {selectedWorkflow?.ehrSystem} encounter has been 
              automated according to the {selectedVisitType} configuration.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExecuteDialog(false)}>
            {executionStep === 4 ? 'Close' : 'Cancel'}
          </Button>
          {executionStep === 0 && (
            <Button
              variant="contained"
              onClick={handleVisitTypeSelection}
              disabled={!selectedVisitType}
            >
              Continue
            </Button>
          )}
          {executionStep === 1 && (
            <Button
              variant="contained"
              onClick={handleStartExecution}
              disabled={!credentials.username || !credentials.password || isExecuting}
            >
              Authenticate & Start
            </Button>
          )}
          {executionStep === 2 && mfaEnabled && (
            <Button
              variant="contained"
              onClick={handleMfaVerification}
              disabled={!otpCode || isExecuting}
            >
              Verify OTP
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={configureDialog} onClose={() => setConfigureDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Configure Workflow: {selectedWorkflow?.name}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Configure schedule settings, note types, and map workflow blocks to template note sections for each visit type. 
            Visit types and template sections come from your Template Builder.
          </Alert>
          
          {/* Common Schedule Configuration Section */}
          <Box sx={{ mb: 4, p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon color="primary" />
              Schedule Configuration (Common for all visit types)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              These settings will apply to all visit types in this workflow.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: 2,
              mb: 3
            }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Provider Name"
                  value={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.providerName || ''}
                  onChange={(e) => handleGlobalScheduleConfigChange('providerName', e.target.value)}
                  placeholder="e.g., Dr. Smith"
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Location"
                  value={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.location || ''}
                  onChange={(e) => handleGlobalScheduleConfigChange('location', e.target.value)}
                  placeholder="e.g., Main Clinic"
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>
            </Box>
            
            {/* Previous Visit Note Import Option */}
            <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.importPreviousNote || false}
                    onChange={(e) => handleGlobalScheduleConfigChange('importPreviousNote', e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChecklistIcon color="primary" />
                    <Typography variant="body2">
                      Import previous visit note as checklist
                    </Typography>
                  </Box>
                }
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mb: 2 }}>
                Automatically import the last visit note to reference during the current encounter
              </Typography>
              
              {selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.importPreviousNote && (
                <Box sx={{ ml: 4, mt: 2 }}>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Import Note For</InputLabel>
                    <Select
                      value={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.importPreviousNoteFor || 'all'}
                      label="Import Note For"
                      onChange={(e) => handleGlobalScheduleConfigChange('importPreviousNoteFor', e.target.value)}
                    >
                      <MenuItem value="all">All visit types</MenuItem>
                      <MenuItem value="selected">Selected visit types only</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.importPreviousNoteFor === 'selected' && (
                    <FormControl fullWidth size="small">
                      <InputLabel>Select Visit Types</InputLabel>
                      <Select
                        multiple
                        value={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.selectedVisitTypes || []}
                        label="Select Visit Types"
                        onChange={(e) => handleGlobalScheduleConfigChange('selectedVisitTypes', e.target.value as string[])}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {selectedWorkflow?.availableVisitTypes.map((visitType) => (
                          <MenuItem key={visitType} value={visitType}>
                            {visitType}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Visit Type Specific Configuration */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" />
            Visit Type Configuration
          </Typography>
          
          {selectedWorkflow?.visitTypeMappings.map((mapping) => {
            const templateSections = getTemplateSectionsForVisitType(mapping.visitType);
            
            return (
              <Accordion key={mapping.visitType} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography variant="h6">{mapping.visitType}</Typography>
                    <Chip 
                      label={mapping.isConfigured ? 'Configured' : 'Needs Configuration'}
                      color={mapping.isConfigured ? 'success' : 'warning'}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      ({templateSections.length} template sections available)
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Configure note type and map workflow blocks to template sections for {mapping.visitType}.
                    </Typography>
                    
                    {/* Note Type Configuration */}
                    <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NoteIcon color="primary" />
                        Note Type Configuration
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        label="EHR Note Type"
                        value={mapping.noteType || ''}
                        onChange={(e) => handleNoteTypeChange(mapping.visitType, e.target.value)}
                        placeholder="e.g., Progress Note, SOAP Note, H&P Note"
                        helperText="Specify the note type that will be selected in your EHR system for this visit type"
                      />
                    </Box>

                    {/* Template Field Mapping */}
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Template Field Mapping
                    </Typography>
                    
                    {selectedWorkflow.blocks
                      .filter(block => block.type === 'note_entry')
                      .map((block) => (
                        <Box key={block.id} sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {block.name}
                          </Typography>
                          <FormControl fullWidth size="small">
                            <InputLabel>Template Note Section</InputLabel>
                            <Select
                              value={mapping.templateFields[block.id] || ''}
                              label="Template Note Section"
                              onChange={(e) => handleFieldMapping(mapping.visitType, block.id, e.target.value)}
                            >
                              {templateSections.map((section) => (
                                <MenuItem key={section.id} value={section.name}>
                                  {section.name} ({section.type})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {mapping.templateFields[block.id] && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Maps to: {mapping.templateFields[block.id]}
                            </Typography>
                          )}
                        </Box>
                      ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigureDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Workflow
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Workflow
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MyWorkflows;
