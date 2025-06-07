import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Checkbox, Alert, LinearProgress, Stepper, Step, StepLabel, Tabs, Tab, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, FormControl, InputLabel, Select, Accordion, AccordionSummary, AccordionDetails, Stack, Paper, useTheme, useMediaQuery } from '@mui/material';
import { PlayArrow as PlayIcon, MoreVert as MoreIcon, Download as ImportIcon, Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckIcon, Error as ErrorIcon, Warning as WarningIcon, Settings as SettingsIcon, Map as MapIcon, Assignment as AssignmentIcon, ExpandMore as ExpandMoreIcon, AccountTree as WorkflowIcon, Schedule as ScheduleIcon, Person as PersonIcon, LocationOn as LocationIcon, Note as NoteIcon, History as HistoryIcon, Checklist as ChecklistIcon, Computer as EHRIcon, AccessTime as TimeIcon, LocalHospital as ClinicIcon, Psychology as AIIcon, Security as SecurityIcon } from '@mui/icons-material';
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
  templateFields: {
    [blockId: string]: string[];
  }; // Changed to array for multiple selections
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [workflows, setWorkflows] = useState<ImportedWorkflow[]>(importedWorkflows.length > 0 ? importedWorkflows : [{
    id: '1',
    name: 'Epic - Standard Patient Visit',
    description: 'Complete patient encounter workflow with automated note generation',
    ehrSystem: 'Epic',
    status: 'configured',
    lastRun: '2024-01-15 14:30',
    availableVisitTypes: templateBuilderService.getAllVisitTypeNames(),
    visitTypeMappings: [{
      visitType: 'Office Visit',
      templateFields: {
        'chief-complaint': ['Chief Complaint', 'Presenting Problem'],
        'subjective-note': ['History of Present Illness', 'Review of Systems'],
        'objective-note': ['Physical Examination', 'Vital Signs']
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
    }, {
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
    }],
    blocks: [{
      id: 'schedule-menu',
      type: 'schedule',
      name: 'Schedule Menu',
      description: 'Access provider schedule with date and location filters',
      isEditable: true
    }, {
      id: 'provider-filter',
      type: 'schedule',
      name: 'Provider Name Filter',
      description: 'Filter schedule by provider name',
      isEditable: true
    }, {
      id: 'date-filter',
      type: 'schedule',
      name: "Today's Date",
      description: 'Set schedule to current date',
      isEditable: false
    }, {
      id: 'location-filter',
      type: 'schedule',
      name: 'Location Filter',
      description: 'Filter schedule by clinic location',
      isEditable: true
    }, {
      id: 'patient-select',
      type: 'patient_select',
      name: 'Patient Selection',
      description: 'Select patient from filtered schedule',
      isEditable: false
    }, {
      id: 'encounter-open',
      type: 'encounter_open',
      name: 'Open Encounter Chart',
      description: 'Open patient encounter for current date and choose note type',
      isEditable: true
    }, {
      id: 'chief-complaint',
      type: 'note_entry',
      name: 'Chief Complaint Entry',
      description: 'Enter patient chief complaint',
      ehrField: 'chief_complaint',
      isEditable: true
    }, {
      id: 'subjective-note',
      type: 'note_entry',
      name: 'Subjective Note',
      description: 'Enter HPI, ROS, and subjective findings',
      ehrField: 'subjective',
      isEditable: true
    }]
  }]);
  const [executeDialog, setExecuteDialog] = useState(false);
  const [configureDialog, setConfigureDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ImportedWorkflow | null>(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [executionStep, setExecutionStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const executionSteps = ['EHR Login', 'Security Verification', 'AI Automation Running', 'Complete'];
  const handleExecuteWorkflow = (workflow: ImportedWorkflow) => {
    setSelectedWorkflow(workflow);
    setExecuteDialog(true);
    setExecutionStep(0);
    setCredentials({
      username: '',
      password: ''
    });
    setOtpCode('');
    setMfaEnabled(false);
  };
  const handleConfigureWorkflow = (workflow: ImportedWorkflow) => {
    setSelectedWorkflow(workflow);
    setConfigureDialog(true);
  };
  const handleStartExecution = async () => {
    if (!credentials.username || !credentials.password) return;
    setIsExecuting(true);
    setExecutionStep(1);

    // Simulate authentication
    setTimeout(() => {
      if (mfaEnabled) {
        setExecutionStep(1); // Wait for OTP
      } else {
        setExecutionStep(2);
        startWorkflowExecution();
      }
      setIsExecuting(false);
    }, 2000);
  };
  const handleMfaVerification = () => {
    if (!otpCode) return;
    setIsExecuting(true);
    setTimeout(() => {
      setExecutionStep(2);
      startWorkflowExecution();
    }, 1000);
  };
  const startWorkflowExecution = () => {
    setTimeout(() => {
      setExecutionStep(3);
      setIsExecuting(false);
      // Update workflow status
      if (selectedWorkflow) {
        setWorkflows(prev => prev.map(w => w.id === selectedWorkflow.id ? {
          ...w,
          status: 'active' as const,
          lastRun: new Date().toLocaleString()
        } : w));
      }
    }, 3000);
  };
  const handleFieldMapping = (visitType: string, blockId: string, templateFields: string[]) => {
    if (!selectedWorkflow) return;
    setSelectedWorkflow(prev => {
      if (!prev) return null;
      return {
        ...prev,
        visitTypeMappings: prev.visitTypeMappings.map(mapping => mapping.visitType === visitType ? {
          ...mapping,
          templateFields: {
            ...mapping.templateFields,
            [blockId]: templateFields
          },
          isConfigured: Object.keys({
            ...mapping.templateFields,
            [blockId]: templateFields
          }).length >= prev.blocks.filter(b => b.type === 'note_entry').length
        } : mapping)
      };
    });
  };
  const handleScheduleConfigChange = (visitType: string, field: keyof ScheduleConfig, value: string | boolean | string[]) => {
    if (!selectedWorkflow) return;
    setSelectedWorkflow(prev => {
      if (!prev) return null;
      return {
        ...prev,
        visitTypeMappings: prev.visitTypeMappings.map(mapping => mapping.visitType === visitType ? {
          ...mapping,
          scheduleConfig: {
            ...mapping.scheduleConfig,
            [field]: value
          }
        } : mapping)
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
        visitTypeMappings: prev.visitTypeMappings.map(mapping => mapping.visitType === visitType ? {
          ...mapping,
          noteType: noteType
        } : mapping)
      };
    });
  };
  const getTemplateSectionsForVisitType = (visitTypeName: string) => {
    const visitType = templateBuilderService.getVisitTypeByName(visitTypeName);
    return visitType?.template.sections || [];
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'configured':
        return 'info';
      case 'error':
        return 'error';
      default:
        return 'warning';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckIcon />;
      case 'configured':
        return <SettingsIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <WarningIcon />;
    }
  };
  const getConfigurationStatus = (workflow: ImportedWorkflow) => {
    const configuredMappings = workflow.visitTypeMappings.filter(m => m.isConfigured && m.noteType && Object.keys(m.templateFields).length >= workflow.blocks.filter(b => b.type === 'note_entry').length).length;
    const totalMappings = workflow.visitTypeMappings.length;
    return `${configuredMappings}/${totalMappings} visit types configured`;
  };
  const getBlockTypeIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <ScheduleIcon color="primary" />;
      case 'patient_select':
        return <PersonIcon color="primary" />;
      case 'encounter_open':
        return <NoteIcon color="primary" />;
      case 'note_entry':
        return <ChecklistIcon color="primary" />;
      default:
        return <AIIcon color="primary" />;
    }
  };
  const getBlockTypeLabel = (type: string) => {
    switch (type) {
      case 'schedule':
        return 'Schedule';
      case 'patient_select':
        return 'Patient';
      case 'encounter_open':
        return 'Chart';
      case 'note_entry':
        return 'Documentation';
      default:
        return 'Automation';
    }
  };
  return <Box sx={{
    width: '100%',
    height: '100vh',
    py: {
      xs: 2,
      sm: 3,
      md: 4
    },
    px: {
      xs: 2,
      sm: 3,
      md: 4
    }
  }}>
      {workflows.length === 0 ? <Box sx={{
      textAlign: 'center',
      py: {
        xs: 4,
        sm: 6,
        md: 8
      }
    }}>
          <Paper elevation={0} sx={{
        p: {
          xs: 3,
          sm: 4,
          md: 6
        },
        borderRadius: {
          xs: 3,
          sm: 4
        },
        backgroundColor: 'grey.50',
        border: '2px dashed',
        borderColor: 'grey.300'
      }}>
            <WorkflowIcon sx={{
          fontSize: {
            xs: 60,
            sm: 70,
            md: 80
          },
          color: 'text.secondary',
          mb: {
            xs: 2,
            sm: 3
          }
        }} />
            <Typography variant={isSmallMobile ? "h5" : isMobile ? "h4" : "h4"} gutterBottom color="text.primary" sx={{
          fontWeight: 600,
          fontSize: {
            xs: '1.5rem',
            sm: '2rem',
            md: '2.125rem'
          }
        }}>
              No Clinical Workflows Yet
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{
          mb: {
            xs: 3,
            sm: 4
          },
          maxWidth: {
            xs: 300,
            sm: 500
          },
          mx: 'auto',
          fontSize: {
            xs: '1rem',
            sm: '1.125rem',
            md: '1.25rem'
          }
        }}>
              Start automating your clinical documentation by importing workflows from our library
            </Typography>
            
            <Alert severity="info" sx={{
          mb: {
            xs: 3,
            sm: 4
          },
          maxWidth: {
            xs: 350,
            sm: 600,
            md: 700
          },
          mx: 'auto',
          fontSize: {
            xs: '0.875rem',
            sm: '1rem'
          },
          '& .MuiAlert-message': {
            textAlign: 'left'
          }
        }}>
              <Typography variant="subtitle1" sx={{
            fontWeight: 600,
            mb: 1,
            fontSize: {
              xs: '1rem',
              sm: '1.125rem'
            }
          }}>
                Quick Start Guide:
              </Typography>
              <Typography component="div" variant="body1" sx={{
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          }}>
                1. <strong>Browse Library:</strong> Go to Workflow Library tab<br />
                2. <strong>Import Workflow:</strong> Choose a clinical workflow template<br />
                3. <strong>Configure:</strong> Map to your visit types and EHR fields<br />
                4. <strong>Execute:</strong> Run automated documentation with your EHR
              </Typography>
            </Alert>
          </Paper>
        </Box> : <Box>
          <Box sx={{
        mb: {
          xs: 3,
          sm: 4
        }
      }}>
            
            
            
            
          </Box>

          <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(auto-fit, minmax(350px, 1fr))',
          md: 'repeat(auto-fit, minmax(400px, 1fr))',
          lg: 'repeat(auto-fit, minmax(450px, 1fr))'
        },
        gap: {
          xs: 2,
          sm: 3
        }
      }}>
            {workflows.map(workflow => <Card key={workflow.id} sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: {
            xs: 2,
            sm: 3
          },
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: {
              xs: 3,
              sm: 6
            },
            transform: {
              xs: 'none',
              sm: 'translateY(-2px)'
            }
          }
        }}>
                <CardContent sx={{
            flexGrow: 1,
            p: {
              xs: 2,
              sm: 3
            }
          }}>
                  {/* Header Section */}
                  <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: {
                xs: 'flex-start',
                sm: 'center'
              },
              mb: {
                xs: 2,
                sm: 3
              },
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              gap: {
                xs: 1,
                sm: 0
              }
            }}>
                    <Box sx={{
                flexGrow: 1,
                width: {
                  xs: '100%',
                  sm: 'auto'
                }
              }}>
                      <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: {
                    xs: 1,
                    sm: 2
                  },
                  mb: 1,
                  flexWrap: 'wrap'
                }}>
                        <EHRIcon color="primary" sx={{
                    fontSize: {
                      xs: 20,
                      sm: 24
                    }
                  }} />
                        <Typography variant={isSmallMobile ? "h6" : "h5"} sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: {
                      xs: '1.125rem',
                      sm: '1.25rem',
                      md: '1.5rem'
                    },
                    lineHeight: 1.2
                  }}>
                          {workflow.name}
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="text.secondary" sx={{
                  mb: 2,
                  lineHeight: 1.6,
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem'
                  }
                }}>
                        {workflow.description}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={e => setAnchorEl(e.currentTarget)} sx={{
                ml: {
                  xs: 0,
                  sm: 1
                },
                alignSelf: {
                  xs: 'flex-end',
                  sm: 'flex-start'
                }
              }}>
                      <MoreIcon />
                    </IconButton>
                  </Box>
                  
                  {/* Status and Info Chips */}
                  <Stack direction="row" spacing={1} sx={{
              mb: {
                xs: 2,
                sm: 3
              },
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiChip-root': {
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem'
                }
              }
            }}>
                    <Chip label={workflow.status === 'active' ? 'RUNNING' : workflow.status.toUpperCase()} color={getStatusColor(workflow.status)} size={isSmallMobile ? "small" : "medium"} icon={getStatusIcon(workflow.status)} sx={{
                fontWeight: 600
              }} />
                    <Chip label={workflow.ehrSystem} size={isSmallMobile ? "small" : "medium"} color="primary" variant="outlined" icon={<EHRIcon sx={{
                fontSize: {
                  xs: 16,
                  sm: 20
                }
              }} />} />
                    <Chip label={`${workflow.blocks.length} automation steps`} size={isSmallMobile ? "small" : "medium"} variant="outlined" icon={<AIIcon sx={{
                fontSize: {
                  xs: 16,
                  sm: 20
                }
              }} />} />
                  </Stack>

                  {/* Clinical Workflow Steps */}
                  <Box sx={{
              mb: {
                xs: 2,
                sm: 3
              }
            }}>
                    <Typography variant={isSmallMobile ? "subtitle1" : "h6"} sx={{
                mb: 2,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: {
                  xs: '1rem',
                  sm: '1.125rem',
                  md: '1.25rem'
                }
              }}>
                      <ChecklistIcon color="primary" sx={{
                  fontSize: {
                    xs: 18,
                    sm: 20
                  }
                }} />
                      Clinical Automation Steps
                    </Typography>
                    
                    <Paper elevation={0} sx={{
                bgcolor: 'grey.50',
                borderRadius: {
                  xs: 1,
                  sm: 2
                },
                p: {
                  xs: 1.5,
                  sm: 2
                }
              }}>
                      <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)'
                  },
                  gap: 1
                }}>
                        {workflow.blocks.slice(0, isSmallMobile ? 4 : 6).map((block, index) => <Box key={block.id} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: {
                      xs: 0.75,
                      sm: 1
                    },
                    borderRadius: 1,
                    backgroundColor: 'white',
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}>
                            <Box sx={{
                      minWidth: {
                        xs: 20,
                        sm: 24
                      },
                      height: {
                        xs: 20,
                        sm: 24
                      },
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: {
                        xs: '0.65rem',
                        sm: '0.75rem'
                      },
                      fontWeight: 600
                    }}>
                              {index + 1}
                            </Box>
                            <Box sx={{
                      flex: 1,
                      minWidth: 0
                    }}>
                              <Typography variant="body2" sx={{
                        fontWeight: 500,
                        fontSize: {
                          xs: '0.75rem',
                          sm: '0.875rem'
                        },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                                {block.name}
                              </Typography>
                              <Chip label={getBlockTypeLabel(block.type)} size="small" variant="outlined" sx={{
                        height: {
                          xs: 14,
                          sm: 16
                        },
                        fontSize: {
                          xs: '0.6rem',
                          sm: '0.65rem'
                        },
                        mt: 0.5
                      }} />
                            </Box>
                            {block.isEditable && <SettingsIcon sx={{
                      fontSize: {
                        xs: 14,
                        sm: 16
                      },
                      color: 'text.secondary'
                    }} />}
                          </Box>)}
                        {workflow.blocks.length > (isSmallMobile ? 4 : 6) && <Typography variant="caption" color="text.secondary" sx={{
                    textAlign: 'center',
                    display: 'block',
                    mt: 1,
                    fontSize: {
                      xs: '0.7rem',
                      sm: '0.75rem'
                    }
                  }}>
                            +{workflow.blocks.length - (isSmallMobile ? 4 : 6)} more automation steps
                          </Typography>}
                      </Box>
                    </Paper>
                  </Box>

                  {/* Configuration Status */}
                  <Box sx={{
              mb: 2
            }}>
                    <Typography variant="body1" sx={{
                fontWeight: 500,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem'
                }
              }}>
                      <MapIcon color="primary" sx={{
                  fontSize: {
                    xs: 16,
                    sm: 18
                  }
                }} />
                      Configuration Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem'
                }
              }}>
                      {getConfigurationStatus(workflow)}
                    </Typography>
                  </Box>

                  {/* Last Run Info */}
                  {workflow.lastRun && <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              flexWrap: 'wrap'
            }}>
                      <TimeIcon sx={{
                fontSize: {
                  xs: 14,
                  sm: 16
                },
                color: 'text.secondary'
              }} />
                      <Typography variant="caption" color="text.secondary" sx={{
                fontSize: {
                  xs: '0.7rem',
                  sm: '0.75rem'
                }
              }}>
                        Last executed: {workflow.lastRun}
                      </Typography>
                    </Box>}
                </CardContent>
                
                {/* Action Buttons */}
                <Box sx={{
            p: {
              xs: 2,
              sm: 3
            },
            pt: 0
          }}>
                  <Stack spacing={2}>
                    <Box sx={{
                display: 'flex',
                gap: 1,
                flexDirection: {
                  xs: 'column',
                  sm: 'row'
                }
              }}>
                      <Button variant="outlined" size={isSmallMobile ? "small" : "medium"} startIcon={<SettingsIcon sx={{
                  fontSize: {
                    xs: 16,
                    sm: 18
                  }
                }} />} onClick={() => handleConfigureWorkflow(workflow)} sx={{
                  flex: 1,
                  borderColor: '#81C784',
                  color: '#388E3C',
                  backgroundColor: '#F1F8E9',
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem'
                  },
                  '&:hover': {
                    borderColor: '#66BB6A',
                    backgroundColor: '#E8F5E8',
                    color: '#2E7D32'
                  }
                }}>
                        Configure
                      </Button>
                      <Button variant="contained" size={isSmallMobile ? "small" : "medium"} startIcon={<PlayIcon sx={{
                  fontSize: {
                    xs: 16,
                    sm: 18
                  }
                }} />} onClick={() => handleExecuteWorkflow(workflow)} disabled={workflow.status === 'error' || workflow.status === 'draft'} sx={{
                  flex: 1,
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem'
                  }
                }}>
                        Execute
                      </Button>
                    </Box>
                    
                    {/* Status Alerts */}
                    {workflow.status === 'draft' && <Alert severity="warning" sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem'
                },
                '& .MuiAlert-message': {
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem'
                  }
                }
              }}>
                        <strong>Setup Required:</strong> Configure visit type mappings to enable workflow execution
                      </Alert>}
                    
                    {workflow.status === 'configured' && <Alert severity="success" sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem'
                },
                '& .MuiAlert-message': {
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem'
                  }
                }
              }}>
                        <strong>Ready to Use:</strong> Workflow configured and ready for EHR execution
                      </Alert>}

                    {workflow.status === 'active' && <Alert severity="info" sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem'
                },
                '& .MuiAlert-message': {
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem'
                  }
                }
              }}>
                        <strong>Currently Running:</strong> AI automation is active in your EHR
                      </Alert>}
                  </Stack>
                </Box>
              </Card>)}
          </Box>
        </Box>}

      {/* Workflow Execution Dialog - Mobile Optimized */}
      <Dialog open={executeDialog} onClose={() => setExecuteDialog(false)} maxWidth="sm" fullWidth fullScreen={isSmallMobile} sx={{
      '& .MuiDialog-paper': {
        m: {
          xs: 1,
          sm: 2
        },
        maxHeight: {
          xs: '95vh',
          sm: '90vh'
        }
      }
    }}>
        <DialogTitle sx={{
        pb: 1,
        fontSize: {
          xs: '1.125rem',
          sm: '1.25rem'
        }
      }}>
          <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: {
            xs: 1,
            sm: 2
          },
          flexDirection: {
            xs: 'column',
            sm: 'row'
          },
          textAlign: {
            xs: 'center',
            sm: 'left'
          }
        }}>
            <EHRIcon color="primary" sx={{
            fontSize: {
              xs: 20,
              sm: 24
            }
          }} />
            <Typography variant={isSmallMobile ? "h6" : "h6"} sx={{
            fontSize: {
              xs: '1rem',
              sm: '1.125rem'
            }
          }}>
              Execute Workflow: {selectedWorkflow?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{
        pt: 1
      }}>
          <Box sx={{
          mb: {
            xs: 2,
            sm: 3
          }
        }}>
            <Stepper activeStep={executionStep} alternativeLabel={!isSmallMobile} orientation={isSmallMobile ? "vertical" : "horizontal"} sx={{
            '& .MuiStepLabel-label': {
              fontSize: {
                xs: '0.75rem',
                sm: '0.875rem'
              }
            }
          }}>
              {executionSteps.map(label => <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>)}
            </Stepper>
          </Box>

          {isExecuting && <LinearProgress sx={{
          mb: 2
        }} />}

          {executionStep === 0 && <Box>
              <Alert severity="info" sx={{
            mb: {
              xs: 2,
              sm: 3
            },
            '& .MuiAlert-message': {
              fontSize: {
                xs: '0.875rem',
                sm: '1rem'
              }
            }
          }}>
                <Typography variant="body1" sx={{
              fontWeight: 600,
              mb: 1,
              fontSize: {
                xs: '0.875rem',
                sm: '1rem'
              }
            }}>
                  Ready to Execute Clinical Workflow
                </Typography>
                <Typography variant="body2" sx={{
              fontSize: {
                xs: '0.75rem',
                sm: '0.875rem'
              }
            }}>
                  This workflow will execute across all configured visit types. Enter your {selectedWorkflow?.ehrSystem} credentials to authenticate and begin automation.
                </Typography>
              </Alert>
              
              <Box sx={{
            mb: {
              xs: 2,
              sm: 3
            },
            p: {
              xs: 1.5,
              sm: 2
            },
            backgroundColor: 'grey.50',
            borderRadius: 1
          }}>
                <Typography variant="subtitle2" sx={{
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: {
                xs: '0.875rem',
                sm: '1rem'
              }
            }}>
                  <WorkflowIcon color="primary" sx={{
                fontSize: {
                  xs: 16,
                  sm: 18
                }
              }} />
                  Configured Visit Types
                </Typography>
                <Stack direction="row" spacing={1} sx={{
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiChip-root': {
                fontSize: {
                  xs: '0.7rem',
                  sm: '0.75rem'
                }
              }
            }}>
                  {selectedWorkflow?.visitTypeMappings.filter(mapping => mapping.isConfigured).map(mapping => <Chip key={mapping.visitType} label={mapping.visitType} size="small" color="primary" variant="outlined" />)}
                </Stack>
              </Box>

              <TextField fullWidth label={`${selectedWorkflow?.ehrSystem} Username`} value={credentials.username} onChange={e => setCredentials(prev => ({
            ...prev,
            username: e.target.value
          }))} sx={{
            mb: 2
          }} size="small" InputLabelProps={{
            style: {
              fontSize: isSmallMobile ? '0.875rem' : '1rem'
            }
          }} />
              <TextField fullWidth label={`${selectedWorkflow?.ehrSystem} Password`} type="password" value={credentials.password} onChange={e => setCredentials(prev => ({
            ...prev,
            password: e.target.value
          }))} sx={{
            mb: 2
          }} size="small" InputLabelProps={{
            style: {
              fontSize: isSmallMobile ? '0.875rem' : '1rem'
            }
          }} />
              <FormControlLabel control={<Checkbox checked={mfaEnabled} onChange={e => setMfaEnabled(e.target.checked)} size={isSmallMobile ? "small" : "medium"} />} label={<Typography variant="body2" sx={{
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem'
            }
          }}>
                    My {selectedWorkflow?.ehrSystem} has Multi-Factor Authentication (MFA)
                  </Typography>} />
            </Box>}

          {executionStep === 1 && mfaEnabled && <Box>
              <Alert severity="warning" sx={{
            mb: {
              xs: 2,
              sm: 3
            },
            '& .MuiAlert-message': {
              fontSize: {
                xs: '0.875rem',
                sm: '1rem'
              }
            }
          }}>
                MFA detected. Please check your device for the OTP code and enter it below.
              </Alert>
              <TextField fullWidth label="Enter OTP Code" value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="123456" inputProps={{
            maxLength: 6
          }} size="small" InputLabelProps={{
            style: {
              fontSize: isSmallMobile ? '0.875rem' : '1rem'
            }
          }} />
            </Box>}

          {executionStep === 2 && <Box>
              <Alert severity="success" sx={{
            mb: 2,
            '& .MuiAlert-message': {
              fontSize: {
                xs: '0.875rem',
                sm: '1rem'
              }
            }
          }}>
                Authentication successful! Executing workflow automation...
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem'
            }
          }}>
                The workflow is now automating your {selectedWorkflow?.ehrSystem} system across all configured visit types. 
                You can monitor progress in the workflow dashboard.
              </Typography>
            </Box>}

          {executionStep === 3 && <Alert severity="success" sx={{
          '& .MuiAlert-message': {
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          }
        }}>
              Workflow executed successfully! Your {selectedWorkflow?.ehrSystem} encounters have been 
              automated according to your configured visit type mappings.
            </Alert>}
        </DialogContent>
        <DialogActions sx={{
        p: {
          xs: 2,
          sm: 3
        },
        flexDirection: {
          xs: 'column',
          sm: 'row'
        },
        gap: {
          xs: 1,
          sm: 0
        }
      }}>
          <Button onClick={() => setExecuteDialog(false)} fullWidth={isSmallMobile} sx={{
          fontSize: {
            xs: '0.875rem',
            sm: '1rem'
          }
        }}>
            {executionStep === 3 ? 'Close' : 'Cancel'}
          </Button>
          {executionStep === 0 && <Button variant="contained" onClick={handleStartExecution} disabled={!credentials.username || !credentials.password || isExecuting} fullWidth={isSmallMobile} sx={{
          fontSize: {
            xs: '0.875rem',
            sm: '1rem'
          }
        }}>
              Authenticate & Start
            </Button>}
          {executionStep === 1 && mfaEnabled && <Button variant="contained" onClick={handleMfaVerification} disabled={!otpCode || isExecuting} fullWidth={isSmallMobile} sx={{
          fontSize: {
            xs: '0.875rem',
            sm: '1rem'
          }
        }}>
              Verify OTP
            </Button>}
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog - Mobile Optimized */}
      <Dialog open={configureDialog} onClose={() => setConfigureDialog(false)} maxWidth="md" fullWidth fullScreen={isMobile} sx={{
      '& .MuiDialog-paper': {
        m: {
          xs: 0,
          md: 2
        },
        maxHeight: {
          xs: '100vh',
          md: '95vh'
        }
      }
    }}>
        <DialogTitle sx={{
        fontSize: {
          xs: '1.125rem',
          sm: '1.25rem'
        },
        pb: {
          xs: 1,
          sm: 2
        }
      }}>
          Configure Workflow: {selectedWorkflow?.name}
        </DialogTitle>
        <DialogContent sx={{
        px: {
          xs: 2,
          sm: 3
        }
      }}>
          <Alert severity="info" sx={{
          mb: {
            xs: 2,
            sm: 3
          },
          '& .MuiAlert-message': {
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          }
        }}>
            Configure schedule settings, note types, and map workflow blocks to template note sections for each visit type. 
            Visit types and template sections come from your Template Builder. You can select multiple note headings for each field.
          </Alert>
          
          {/* Common Schedule Configuration Section */}
          <Box sx={{
          mb: {
            xs: 3,
            sm: 4
          },
          p: {
            xs: 2,
            sm: 3
          },
          border: 1,
          borderColor: 'divider',
          borderRadius: {
            xs: 1,
            sm: 2
          }
        }}>
            <Typography variant="h6" sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: {
              xs: '1rem',
              sm: '1.125rem',
              md: '1.25rem'
            }
          }}>
              <ScheduleIcon color="primary" sx={{
              fontSize: {
                xs: 18,
                sm: 20
              }
            }} />
              Schedule Configuration (Common for all visit types)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{
            mb: {
              xs: 2,
              sm: 3
            },
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem'
            }
          }}>
              These settings will apply to all visit types in this workflow.
            </Typography>
            <Box sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row'
            },
            gap: 2,
            mb: {
              xs: 2,
              sm: 3
            }
          }}>
              <Box sx={{
              flex: 1
            }}>
                <TextField fullWidth size="small" label="Provider Name" value={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.providerName || ''} onChange={e => handleGlobalScheduleConfigChange('providerName', e.target.value)} placeholder="e.g., Dr. Smith" InputProps={{
                startAdornment: <PersonIcon sx={{
                  mr: 1,
                  color: 'text.secondary',
                  fontSize: {
                    xs: 16,
                    sm: 18
                  }
                }} />
              }} InputLabelProps={{
                style: {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                }
              }} />
              </Box>
              <Box sx={{
              flex: 1
            }}>
                <TextField fullWidth size="small" label="Location" value={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.location || ''} onChange={e => handleGlobalScheduleConfigChange('location', e.target.value)} placeholder="e.g., Main Clinic" InputProps={{
                startAdornment: <LocationIcon sx={{
                  mr: 1,
                  color: 'text.secondary',
                  fontSize: {
                    xs: 16,
                    sm: 18
                  }
                }} />
              }} InputLabelProps={{
                style: {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                }
              }} />
              </Box>
            </Box>
            
            {/* Previous Visit Note Import Option */}
            <Box sx={{
            p: {
              xs: 1.5,
              sm: 2
            },
            backgroundColor: 'grey.50',
            borderRadius: 1
          }}>
              <FormControlLabel control={<Checkbox checked={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.importPreviousNote || false} onChange={e => handleGlobalScheduleConfigChange('importPreviousNote', e.target.checked)} size={isSmallMobile ? "small" : "medium"} />} label={<Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
                    <ChecklistIcon color="primary" sx={{
                fontSize: {
                  xs: 16,
                  sm: 18
                }
              }} />
                    <Typography variant="body2" sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem'
                }
              }}>
                      Import previous visit note as checklist
                    </Typography>
                  </Box>} />
              <Typography variant="caption" color="text.secondary" sx={{
              ml: 4,
              display: 'block',
              mb: 2,
              fontSize: {
                xs: '0.7rem',
                sm: '0.75rem'
              }
            }}>
                Automatically import the last visit note to reference during the current encounter
              </Typography>
              
              {selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.importPreviousNote && <Box sx={{
              ml: {
                xs: 2,
                sm: 4
              },
              mt: 2
            }}>
                  <FormControl fullWidth size="small" sx={{
                mb: 2
              }}>
                    <InputLabel style={{
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                }}>
                      Import Note For
                    </InputLabel>
                    <Select value={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.importPreviousNoteFor || 'all'} label="Import Note For" onChange={e => handleGlobalScheduleConfigChange('importPreviousNoteFor', e.target.value)}>
                      <MenuItem value="all">All visit types</MenuItem>
                      <MenuItem value="selected">Selected visit types only</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.importPreviousNoteFor === 'selected' && <FormControl fullWidth size="small">
                      <InputLabel style={{
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                }}>
                        Select Visit Types
                      </InputLabel>
                      <Select multiple value={selectedWorkflow?.visitTypeMappings[0]?.scheduleConfig.selectedVisitTypes || []} label="Select Visit Types" onChange={e => handleGlobalScheduleConfigChange('selectedVisitTypes', e.target.value as string[])} renderValue={selected => <Box sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5
                        }}>
                            {(selected as string[]).map(value => <Chip key={value} label={value} size="small" sx={{
                                fontSize: {
                                  xs: '0.7rem',
                                  sm: '0.75rem'
                                }
                              }} />)}
                          </Box>}>
                        {selectedWorkflow?.availableVisitTypes.map(visitType => <MenuItem key={visitType} value={visitType}>
                            {visitType}
                          </MenuItem>)}
                      </Select>
                    </FormControl>}
                </Box>}
            </Box>
          </Box>

          {/* Visit Type Specific Configuration */}
          <Typography variant="h6" sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: {
            xs: '1rem',
            sm: '1.125rem',
            md: '1.25rem'
          }
        }}>
            <AssignmentIcon color="primary" sx={{
            fontSize: {
              xs: 18,
              sm: 20
            }
          }} />
            Visit Type Configuration
          </Typography>
          
          {selectedWorkflow?.visitTypeMappings.map(mapping => {
          const templateSections = getTemplateSectionsForVisitType(mapping.visitType);
          return <Accordion key={mapping.visitType} sx={{
            mb: 2,
            '& .MuiAccordionSummary-content': {
              margin: {
                xs: '8px 0',
                sm: '12px 0'
              }
            }
          }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{
                display: 'flex',
                alignItems: {
                  xs: 'flex-start',
                  sm: 'center'
                },
                gap: {
                  xs: 1,
                  sm: 2
                },
                width: '100%',
                flexDirection: {
                  xs: 'column',
                  sm: 'row'
                }
              }}>
                    <Typography variant="h6" sx={{
                  fontSize: {
                    xs: '1rem',
                    sm: '1.125rem'
                  }
                }}>
                      {mapping.visitType}
                    </Typography>
                    <Chip label={mapping.isConfigured ? 'Configured' : 'Needs Configuration'} color={mapping.isConfigured ? 'success' : 'warning'} size="small" sx={{
                  fontSize: {
                    xs: '0.7rem',
                    sm: '0.75rem'
                  }
                }} />
                    <Typography variant="caption" color="text.secondary" sx={{
                  fontSize: {
                    xs: '0.7rem',
                    sm: '0.75rem'
                  }
                }}>
                      ({templateSections.length} template sections available)
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{
              px: {
                xs: 1,
                sm: 2
              }
            }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                  mb: {
                    xs: 2,
                    sm: 3
                  },
                  fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem'
                  }
                }}>
                      Configure note type and map workflow blocks to template sections for {mapping.visitType}.
                      You can select multiple note headings for each workflow block.
                    </Typography>
                    
                    {/* Note Type Configuration */}
                    <Box sx={{
                  mb: {
                    xs: 2,
                    sm: 3
                  },
                  p: {
                    xs: 1.5,
                    sm: 2
                  },
                  backgroundColor: 'grey.50',
                  borderRadius: 1
                }}>
                      <Typography variant="subtitle2" sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem'
                    }
                  }}>
                        <NoteIcon color="primary" sx={{
                      fontSize: {
                        xs: 16,
                        sm: 18
                      }
                    }} />
                        Note Type Configuration
                      </Typography>
                      <TextField fullWidth size="small" label="EHR Note Type" value={mapping.noteType || ''} onChange={e => handleNoteTypeChange(mapping.visitType, e.target.value)} placeholder="e.g., Progress Note, SOAP Note, H&P Note" helperText="Specify the note type that will be selected in your EHR system for this visit type" InputLabelProps={{
                    style: {
                      fontSize: isSmallMobile ? '0.875rem' : '1rem'
                    }
                  }} FormHelperTextProps={{
                    style: {
                      fontSize: isSmallMobile ? '0.7rem' : '0.75rem'
                    }
                  }} />
                    </Box>

                    {/* Template Field Mapping */}
                    <Typography variant="subtitle2" sx={{
                  mb: 2,
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem'
                  }
                }}>
                      Template Field Mapping
                    </Typography>
                    
                    {selectedWorkflow.blocks.filter(block => block.type === 'note_entry').map(block => <Box key={block.id} sx={{
                  mb: {
                    xs: 2,
                    sm: 3
                  },
                  p: {
                    xs: 1.5,
                    sm: 2
                  },
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1
                }}>
                          <Typography variant="subtitle2" sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem'
                    }
                  }}>
                            {block.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                    mb: 2,
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.875rem'
                    }
                  }}>
                            {block.description}
                          </Typography>
                          <FormControl fullWidth size="small">
                            <InputLabel style={{
                      fontSize: isSmallMobile ? '0.875rem' : '1rem'
                    }}>
                              Select Template Note Sections (Multiple)
                            </InputLabel>
                            <Select multiple value={mapping.templateFields[block.id] || []} label="Select Template Note Sections (Multiple)" onChange={e => handleFieldMapping(mapping.visitType, block.id, e.target.value as string[])} renderValue={selected => <Box sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5
                    }}>
                                  {(selected as string[]).map(value => <Chip key={value} label={value} size="small" color="primary" variant="outlined" sx={{
                        fontSize: {
                          xs: '0.7rem',
                          sm: '0.75rem'
                        }
                      }} />)}
                                </Box>}>
                              {templateSections.map(section => <MenuItem key={section.id} value={section.name}>
                                  <Checkbox checked={(mapping.templateFields[block.id] || []).includes(section.name)} size="small" />
                                  <ListItemText primary={section.name} secondary={section.type} primaryTypographyProps={{
                          fontSize: isSmallMobile ? '0.875rem' : '1rem'
                        }} secondaryTypographyProps={{
                          fontSize: isSmallMobile ? '0.75rem' : '0.875rem'
                        }} />
                                </MenuItem>)}
                            </Select>
                          </FormControl>
                          {mapping.templateFields[block.id] && mapping.templateFields[block.id].length > 0 && <Typography variant="caption" color="text.secondary" sx={{
                    mt: 1,
                    display: 'block',
                    fontSize: {
                      xs: '0.7rem',
                      sm: '0.75rem'
                    }
                  }}>
                              Maps to: {mapping.templateFields[block.id].join(', ')}
                            </Typography>}
                        </Box>)}
                  </Box>
                </AccordionDetails>
              </Accordion>;
        })}
        </DialogContent>
        <DialogActions sx={{
        p: {
          xs: 2,
          sm: 3
        },
        flexDirection: {
          xs: 'column',
          sm: 'row'
        },
        gap: {
          xs: 1,
          sm: 0
        }
      }}>
          <Button onClick={() => setConfigureDialog(false)} fullWidth={isSmallMobile} sx={{
          fontSize: {
            xs: '0.875rem',
            sm: '1rem'
          }
        }}>
            Cancel
          </Button>
          <Button variant="contained" fullWidth={isSmallMobile} sx={{
          fontSize: {
            xs: '0.875rem',
            sm: '1rem'
          }
        }}>
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{
        fontSize: {
          xs: '0.875rem',
          sm: '1rem'
        }
      }}>
          <EditIcon sx={{
          mr: 1,
          fontSize: {
            xs: 16,
            sm: 18
          }
        }} />
          Edit Workflow
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{
        fontSize: {
          xs: '0.875rem',
          sm: '1rem'
        }
      }}>
          <DeleteIcon sx={{
          mr: 1,
          fontSize: {
            xs: 16,
            sm: 18
          }
        }} />
          Delete Workflow
        </MenuItem>
      </Menu>
    </Box>;
};
export default MyWorkflows;
