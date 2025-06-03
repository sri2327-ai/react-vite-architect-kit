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
  AccordionDetails
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
  LocationOn as LocationIcon
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
}

interface VisitTypeMapping {
  visitType: string;
  templateFields: { [blockId: string]: string };
  scheduleConfig: ScheduleConfig;
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
              location: 'Main Clinic'
            },
            isConfigured: true
          },
          {
            visitType: 'Follow-up',
            templateFields: {},
            scheduleConfig: {
              providerName: '',
              location: ''
            },
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
    'Visit Type Selection',
    'EHR Authentication', 
    'MFA Verification',
    'Workflow Execution',
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

  const handleScheduleConfigChange = (visitType: string, field: keyof ScheduleConfig, value: string) => {
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
    const configuredMappings = workflow.visitTypeMappings.filter(m => m.isConfigured).length;
    const totalMappings = workflow.visitTypeMappings.length;
    return `${configuredMappings}/${totalMappings} visit types configured`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {workflows.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <WorkflowIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            No Workflows Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Import workflows from the Workflow Library to get started with EHR automation
          </Typography>
          <Alert severity="info" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="body2">
              <strong>Next Steps:</strong> Go to Workflow Library → Browse predefined EHR workflows → 
              Import to My Workflows → Configure visit type mappings (from your Template Builder) → Execute with your EHR
            </Typography>
          </Alert>
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              My Workflows
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure and execute your imported EHR automation workflows using visit types from Template Builder
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: 3 
          }}>
            {workflows.map((workflow) => (
              <Card key={workflow.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {workflow.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {workflow.description}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={workflow.status.toUpperCase()}
                      color={getStatusColor(workflow.status)}
                      size="small"
                      icon={getStatusIcon(workflow.status)}
                    />
                    <Chip 
                      label={workflow.ehrSystem} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`${workflow.blocks.length} blocks`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Configuration:</strong> {getConfigurationStatus(workflow)}
                  </Typography>

                  {workflow.lastRun && (
                    <Typography variant="caption" color="text.secondary">
                      Last run: {workflow.lastRun}
                    </Typography>
                  )}
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<MapIcon />}
                      onClick={() => handleConfigureWorkflow(workflow)}
                      sx={{ flex: 1 }}
                    >
                      Configure
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayIcon />}
                      onClick={() => handleExecuteWorkflow(workflow)}
                      disabled={workflow.status === 'error' || workflow.status === 'draft'}
                      sx={{ flex: 1 }}
                    >
                      Execute
                    </Button>
                  </Box>
                  
                  {workflow.status === 'draft' && (
                    <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>
                      Configure visit type mappings to enable execution
                    </Alert>
                  )}
                  
                  {workflow.status === 'configured' && (
                    <Typography variant="caption" color="success.main" sx={{ display: 'block', textAlign: 'center' }}>
                      ✓ Ready to execute with your EHR credentials
                    </Typography>
                  )}
                </Box>
              </Card>
            ))}
          </Box>
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
            Configure schedule settings and map workflow blocks to template note sections for each visit type. 
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
              gap: 2 
            }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Provider Name"
                  value={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.providerName || ''}
                  onChange={(e) => {
                    // Update all visit types with the same provider name
                    if (selectedWorkflow) {
                      setSelectedWorkflow(prev => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          visitTypeMappings: prev.visitTypeMappings.map(mapping => ({
                            ...mapping,
                            scheduleConfig: {
                              ...mapping.scheduleConfig,
                              providerName: e.target.value
                            }
                          }))
                        };
                      });
                    }
                  }}
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
                  onChange={(e) => {
                    // Update all visit types with the same location
                    if (selectedWorkflow) {
                      setSelectedWorkflow(prev => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          visitTypeMappings: prev.visitTypeMappings.map(mapping => ({
                            ...mapping,
                            scheduleConfig: {
                              ...mapping.scheduleConfig,
                              location: e.target.value
                            }
                          }))
                        };
                      });
                    }
                  }}
                  placeholder="e.g., Main Clinic"
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Visit Type Specific Template Mappings */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" />
            Template Field Mapping by Visit Type
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
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Map workflow note blocks to template sections for {mapping.visitType}. 
                      Template sections come from your Template Builder.
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
