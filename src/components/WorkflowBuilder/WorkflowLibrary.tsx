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
  Badge,
  Stack,
  useTheme,
  useMediaQuery,
  Grid2 as Grid
} from '@mui/material';
import { alpha } from '@mui/material/styles';
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
  Today as TodayIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

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

// Dynamic workflows data - can be loaded from API
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

// Dynamic categories and EHR systems - can be loaded from API
const availableCategories = ['Patient Encounters', 'Billing & Coding', 'Documentation', 'Clinical Decision Support'];
const availableEHRSystems = ['Epic', 'Cerner', 'Allscripts', 'NextGen', 'eClinicalWorks'];

interface WorkflowLibraryProps {
  onImportWorkflow?: (workflow: PredefinedWorkflow) => void;
}

const WorkflowLibrary: React.FC<WorkflowLibraryProps> = ({ onImportWorkflow }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<PredefinedWorkflow | null>(null);
  const [showWorkflowDetails, setShowWorkflowDetails] = useState(false);
  const [importDialog, setImportDialog] = useState(false);
  const [selectedVisitTypes, setSelectedVisitTypes] = useState<string[]>([]);
  
  // Dynamic filter states - all ready for API integration
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEHRSystem, setSelectedEHRSystem] = useState('all');
  const [filteredWorkflows, setFilteredWorkflows] = useState<PredefinedWorkflow[]>(predefinedWorkflows);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Dynamic filtering effect - ready for API data
  useEffect(() => {
    let filtered = predefinedWorkflows;

    if (searchTerm) {
      filtered = filtered.filter(workflow =>
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.ehrSystem.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(workflow => workflow.category === selectedCategory);
    }

    if (selectedEHRSystem !== 'all') {
      filtered = filtered.filter(workflow => workflow.ehrSystem === selectedEHRSystem);
    }

    setFilteredWorkflows(filtered);
  }, [searchTerm, selectedCategory, selectedEHRSystem]);

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

  const getBlockGradient = (type: string) => {
    // Use variations of the bravo gradient for different block types
    switch (type) {
      case 'schedule': return 'linear-gradient(135deg, #143151 0%, #2c5a7a 100%)';
      case 'patient_select': return 'linear-gradient(135deg, #1a3a5c 0%, #387E89 100%)'; 
      case 'encounter_open': return 'linear-gradient(135deg, #2a4d6b 0%, #4a8fa3 100%)';
      case 'note_entry': return 'linear-gradient(135deg, #143151 20%, #387E89 80%)';
      case 'diagnosis': return 'linear-gradient(135deg, #0f2842 0%, #2c6269 100%)';
      case 'save': return 'linear-gradient(135deg, #1f4660 0%, #4a9fb0 100%)';
      default: return bravoColors.button.gradient;
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedEHRSystem('all');
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant={isSmallMobile ? "h5" : "h4"} gutterBottom sx={{ 
          color: bravoColors.primaryFlat, 
          fontWeight: 700,
          mb: 1,
          fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' }
        }}>
          Workflow Library
        </Typography>
        <Typography variant={isSmallMobile ? "body2" : "h6"} color="text.secondary" sx={{ 
          mb: 3,
          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
        }}>
          Pre-built EHR workflows with schedule setup and automation blocks
        </Typography>
        
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: { xs: 2, md: 3 }, 
          bgcolor: alpha('#2196F3', 0.05),
          border: `1px solid ${alpha('#2196F3', 0.2)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <EHRIcon sx={{ color: '#2196F3', mr: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
            <Typography variant={isSmallMobile ? "subtitle1" : "h6"} sx={{ 
              fontWeight: 600, 
              color: '#2196F3',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              Enhanced Workflows
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ 
            lineHeight: 1.6,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            All workflows include comprehensive schedule setup blocks (Schedule Menu, Provider Filter, 
            Date Filter, Location Filter) before patient selection. Import and configure these with 
            your provider name and location preferences for seamless automation.
          </Typography>
        </Box>
      </Box>

      {/* Dynamic Search and Filter Controls */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
          </Grid>
          <Grid xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {availableCategories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>EHR System</InputLabel>
              <Select
                value={selectedEHRSystem}
                onChange={(e) => setSelectedEHRSystem(e.target.value)}
                label="EHR System"
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                <MenuItem value="all">All Systems</MenuItem>
                {availableEHRSystems.map((system) => (
                  <MenuItem key={system} value={system}>{system}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {(searchTerm || selectedCategory !== 'all' || selectedEHRSystem !== 'all') && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredWorkflows.length} of {predefinedWorkflows.length} workflows
            </Typography>
            <Button
              size="small"
              onClick={clearFilters}
              sx={{ textTransform: 'none', fontSize: '0.75rem' }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(auto-fit, minmax(300px, 1fr))', 
          md: 'repeat(auto-fit, minmax(400px, 1fr))',
          lg: 'repeat(auto-fit, minmax(450px, 1fr))'
        }, 
        gap: { xs: 2, sm: 3, md: 4 }
      }}>
        {filteredWorkflows.map((workflow) => (
          <Card 
            key={workflow.id}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: alpha(bravoColors.primaryFlat, 0.1),
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                borderColor: bravoColors.primaryFlat
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
                <Box sx={{
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: 2,
                  bgcolor: alpha(bravoColors.primaryFlat, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <EHRIcon sx={{ 
                    color: bravoColors.primaryFlat, 
                    fontSize: { xs: 20, sm: 24 } 
                  }} />
                </Box>
                <Box>
                  <Typography variant={isSmallMobile ? "h6" : "h5"} sx={{ 
                    fontWeight: 700,
                    color: bravoColors.primaryFlat,
                    lineHeight: 1.2,
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                  }}>
                    {workflow.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mt: 0.5,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    {workflow.ehrSystem} • {workflow.category}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" color="text.secondary" paragraph sx={{ 
                lineHeight: 1.6,
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                {workflow.description}
              </Typography>
              
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Stack 
                  direction="row" 
                  spacing={1} 
                  sx={{ 
                    mb: 2, 
                    flexWrap: 'wrap', 
                    gap: { xs: 0.5, sm: 1 }
                  }}
                >
                  <Chip 
                    icon={<EHRIcon />} 
                    label={workflow.ehrSystem} 
                    size={isSmallMobile ? "small" : "medium"}
                    sx={{ 
                      bgcolor: alpha(bravoColors.primaryFlat, 0.1),
                      color: bravoColors.primaryFlat,
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.875rem' }
                    }}
                  />
                  <Chip 
                    label={workflow.category} 
                    size={isSmallMobile ? "small" : "medium"}
                    sx={{ 
                      bgcolor: alpha(bravoColors.secondary, 0.1),
                      color: bravoColors.secondary,
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.875rem' }
                    }}
                  />
                  <Chip 
                    icon={<WorkflowIcon />}
                    label={`${workflow.blocks.length} Blocks`}
                    size={isSmallMobile ? "small" : "medium"}
                    sx={{ 
                      bgcolor: alpha('#4CAF50', 0.1),
                      color: '#4CAF50',
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.875rem' }
                    }}
                  />
                </Stack>
              </Box>

              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  color: bravoColors.primaryFlat,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Supported Visit Types
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
                  {workflow.supportedVisitTypes.map((visitType) => (
                    <Chip 
                      key={visitType}
                      label={visitType}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: alpha(bravoColors.primaryFlat, 0.3),
                        color: bravoColors.primaryFlat,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        '&:hover': {
                          bgcolor: alpha(bravoColors.primaryFlat, 0.05)
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
            
            <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
              <Stack 
                direction={isSmallMobile ? "column" : "row"} 
                spacing={isSmallMobile ? 1 : 2}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleViewWorkflow(workflow)}
                  sx={{ 
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  View Blocks
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ImportIcon />}
                  onClick={() => handleImportClick(workflow)}
                  sx={{ 
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Import
                </Button>
              </Stack>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Enhanced Workflow Details Dialog */}
      <Dialog 
        open={showWorkflowDetails} 
        onClose={() => setShowWorkflowDetails(false)} 
        maxWidth="lg" 
        fullWidth
        fullScreen={isSmallMobile}
        PaperProps={{
          sx: {
            borderRadius: isSmallMobile ? 0 : 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            maxHeight: isSmallMobile ? '100vh' : '90vh',
            margin: isSmallMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 0,
          background: bravoColors.button.gradient,
          color: 'white',
          position: 'relative'
        }}>
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Box sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <WorkflowIcon sx={{ 
                  color: 'white', 
                  fontSize: { xs: 20, sm: 24 } 
                }} />
              </Box>
              <Box>
                <Typography variant={isSmallMobile ? "h6" : "h5"} sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  fontSize: { xs: '1.125rem', sm: '1.5rem' }
                }}>
                  {selectedWorkflow?.name}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}>
                  Automation Blocks Overview
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={() => setShowWorkflowDetails(false)}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          bgcolor: '#f8fafc',
          overflow: 'auto'
        }}>
          {selectedWorkflow && (
            <Box>
              <Alert 
                severity="info" 
                sx={{ 
                  mb: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  bgcolor: alpha(bravoColors.primaryFlat, 0.08),
                  border: `1px solid ${alpha(bravoColors.primaryFlat, 0.2)}`,
                  '& .MuiAlert-icon': { color: bravoColors.primaryFlat },
                  '& .MuiAlert-message': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  This workflow contains <strong>{selectedWorkflow.blocks.length} automation blocks</strong> that will 
                  execute in sequence when you run the workflow in your EHR system.
                </Typography>
              </Alert>
              
              <Box sx={{ position: 'relative' }}>
                {selectedWorkflow.blocks.map((block, index) => (
                  <Box key={block.id} sx={{ 
                    display: 'flex', 
                    mb: { xs: 2, sm: 3 }, 
                    position: 'relative',
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    {/* Step Number */}
                    <Box sx={{ 
                      minWidth: { xs: 'auto', sm: 40 }, 
                      display: 'flex', 
                      flexDirection: { xs: 'row', sm: 'column' }, 
                      alignItems: 'center',
                      mr: { xs: 0, sm: 3 },
                      mb: { xs: 1, sm: 0 }
                    }}>
                      <Box sx={{
                        width: { xs: 28, sm: 32 },
                        height: { xs: 28, sm: 32 },
                        borderRadius: '50%',
                        background: getBlockGradient(block.type),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        mr: { xs: 2, sm: 0 }
                      }}>
                        {index + 1}
                      </Box>
                      {index < selectedWorkflow.blocks.length - 1 && (
                        <Box sx={{
                          width: { xs: 40, sm: 2 },
                          height: { xs: 2, sm: 40 },
                          background: `linear-gradient(135deg, ${alpha(bravoColors.primaryFlat, 0.3)} 0%, ${alpha(bravoColors.secondary, 0.3)} 100%)`,
                          mt: { xs: 0, sm: 1 },
                          ml: { xs: 0, sm: 0 },
                          borderRadius: 1
                        }} />
                      )}
                    </Box>

                    {/* Block Content */}
                    <Paper sx={{ 
                      flex: 1, 
                      p: { xs: 2, sm: 3 }, 
                      borderRadius: 2,
                      border: `1px solid ${alpha(bravoColors.primaryFlat, 0.1)}`,
                      bgcolor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        transform: 'translateY(-1px)'
                      }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: { xs: 1, sm: 2 }, 
                        mb: 2,
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        <Box sx={{
                          width: { xs: 32, sm: 36 },
                          height: { xs: 32, sm: 36 },
                          borderRadius: 1.5,
                          background: `linear-gradient(135deg, ${alpha(bravoColors.primaryFlat, 0.1)} 0%, ${alpha(bravoColors.secondary, 0.1)} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: bravoColors.primaryFlat
                        }}>
                          {getBlockIcon(block.type)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant={isSmallMobile ? "subtitle2" : "h6"} sx={{ 
                            fontWeight: 600, 
                            color: bravoColors.primaryFlat,
                            mb: 0.5,
                            fontSize: { xs: '0.875rem', sm: '1.125rem' }
                          }}>
                            {block.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            lineHeight: 1.5,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}>
                            {block.description}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: { xs: 0.5, sm: 1 }
                      }}>
                        <Chip 
                          label={block.type.replace('_', ' ').toUpperCase()}
                          size="small"
                          sx={{
                            background: `linear-gradient(135deg, ${alpha(bravoColors.primaryFlat, 0.1)} 0%, ${alpha(bravoColors.secondary, 0.1)} 100%)`,
                            color: bravoColors.primaryFlat,
                            fontWeight: 600,
                            fontSize: { xs: '0.6rem', sm: '0.7rem' }
                          }}
                        />
                        {block.isEditable && (
                          <Chip 
                            label="Configurable" 
                            size="small" 
                            variant="outlined"
                            sx={{
                              borderColor: alpha(bravoColors.secondary, 0.3),
                              color: bravoColors.secondary,
                              fontSize: { xs: '0.6rem', sm: '0.7rem' }
                            }}
                          />
                        )}
                        {block.ehrField && (
                          <Chip 
                            label={`Maps to: ${block.ehrField}`} 
                            size="small" 
                            sx={{
                              background: `linear-gradient(135deg, ${alpha(bravoColors.secondary, 0.1)} 0%, ${alpha(bravoColors.primaryFlat, 0.1)} 100%)`,
                              color: bravoColors.secondary,
                              fontSize: { xs: '0.6rem', sm: '0.7rem' }
                            }}
                          />
                        )}
                      </Box>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          bgcolor: '#f8fafc', 
          borderTop: '1px solid rgba(0,0,0,0.08)',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={() => setShowWorkflowDetails(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              order: { xs: 2, sm: 1 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
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
            sx={{ 
              borderRadius: 2,
              order: { xs: 1, sm: 2 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Import This Workflow
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog 
        open={importDialog} 
        onClose={() => setImportDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isSmallMobile}
        PaperProps={{
          sx: {
            borderRadius: isSmallMobile ? 0 : 2,
            margin: isSmallMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
          Import Workflow
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              <strong>{selectedWorkflow?.name}</strong> will be imported to "My Workflows" where you can:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              <li>Map it to your specific visit types</li>
              <li>Customize field mappings to your templates</li>
              <li>Edit automation blocks as needed</li>
              <li>Execute the workflow with your EHR credentials</li>
            </Box>
          </Alert>
          
          <Typography variant="body2" color="text.secondary" sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            After import, you'll be able to configure this workflow for each of your visit types 
            and map the note fields to your template fields for seamless automation.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={() => setImportDialog(false)}
            sx={{ 
              order: { xs: 2, sm: 1 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleImport}
            startIcon={<ImportIcon />}
            sx={{ 
              order: { xs: 1, sm: 2 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Import to My Workflows
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
