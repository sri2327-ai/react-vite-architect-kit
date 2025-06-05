import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Grid,
  Stack,
  Paper,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
  Fab
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Download as ExportIcon,
  Upload as ImportIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  PlayCircleOutline as PlayCircleIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp as TrendingIcon,
  AccessTime as TimeIcon,
  Computer as EHRIcon,
  Psychology as AIIcon,
  AccountTree as WorkflowIcon,
  LocalHospital as HospitalIcon,
  Note as NoteIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

interface WorkflowBlock {
  id: string;
  type: string;
  name: string;
  description: string;
  ehrField?: string;
  isEditable: boolean;
  config?: any;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  ehrSystem: string;
  avgTimeSaved: string;
  successRate: number;
  trendingScore: number;
  isActive: boolean;
  isFavorite: boolean;
  lastRun?: string;
  totalRuns: number;
  blocks: WorkflowBlock[];
  createdAt: string;
  updatedAt: string;
}

interface MyWorkflowsProps {
  onEditWorkflow: (workflow: Workflow) => void;
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Standard Patient Visit',
    description: 'Automated workflow for routine patient check-ups, including vitals, history, and assessment.',
    category: 'General Medicine',
    ehrSystem: 'Epic',
    avgTimeSaved: '15-20 minutes',
    successRate: 95,
    trendingScore: 88,
    isActive: true,
    isFavorite: true,
    lastRun: '2024-01-15T10:30:00Z',
    totalRuns: 342,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    blocks: [
      {
        id: '101',
        type: 'schedule',
        name: 'View Schedule',
        description: 'Access provider schedule with date and location filters',
        isEditable: true
      },
      {
        id: '102',
        type: 'patient_select',
        name: 'Select Patient',
        description: 'Select patient from filtered schedule',
        isEditable: false
      },
      {
        id: '103',
        type: 'encounter_open',
        name: 'Open Encounter',
        description: 'Open patient encounter for current date and choose note type',
        isEditable: true
      },
      {
        id: '104',
        type: 'note_entry',
        name: 'Chief Complaint',
        description: 'Enter patient chief complaint',
        ehrField: 'chief_complaint',
        isEditable: true
      },
      {
        id: '105',
        type: 'note_entry',
        name: 'Subjective Note',
        description: 'Enter HPI, ROS, and subjective findings',
        ehrField: 'subjective',
        isEditable: true
      }
    ]
  },
  {
    id: '2',
    name: 'Post-Op Follow-Up',
    description: 'Streamlined workflow for post-operative evaluations and documentation.',
    category: 'Surgery',
    ehrSystem: 'Cerner',
    avgTimeSaved: '10-15 minutes',
    successRate: 92,
    trendingScore: 79,
    isActive: false,
    isFavorite: false,
    lastRun: '2024-01-10T14:20:00Z',
    totalRuns: 156,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    blocks: [
      {
        id: '201',
        type: 'schedule',
        name: 'View Schedule',
        description: 'Access provider schedule with date and location filters',
        isEditable: true
      },
      {
        id: '202',
        type: 'patient_select',
        name: 'Select Patient',
        description: 'Select patient from filtered schedule',
        isEditable: false
      },
      {
        id: '203',
        type: 'encounter_open',
        name: 'Open Encounter',
        description: 'Open patient encounter for current date and choose note type',
        isEditable: true
      },
      {
        id: '204',
        type: 'note_entry',
        name: 'Incision Check',
        description: 'Document incision appearance and healing',
        ehrField: 'incision_check',
        isEditable: true
      },
      {
        id: '205',
        type: 'note_entry',
        name: 'Pain Level',
        description: 'Assess and document patient pain level',
        ehrField: 'pain_level',
        isEditable: true
      }
    ]
  },
  {
    id: '3',
    name: 'Mental Health Assessment',
    description: 'Comprehensive workflow for mental health evaluations and treatment planning.',
    category: 'Mental Health',
    ehrSystem: 'Athenahealth',
    avgTimeSaved: '20-25 minutes',
    successRate: 88,
    trendingScore: 92,
    isActive: true,
    isFavorite: true,
    lastRun: '2024-01-16T09:15:00Z',
    totalRuns: 78,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    blocks: [
      {
        id: '301',
        type: 'schedule',
        name: 'View Schedule',
        description: 'Access provider schedule with date and location filters',
        isEditable: true
      },
      {
        id: '302',
        type: 'patient_select',
        name: 'Select Patient',
        description: 'Select patient from filtered schedule',
        isEditable: false
      },
      {
        id: '303',
        type: 'encounter_open',
        name: 'Open Encounter',
        description: 'Open patient encounter for current date and choose note type',
        isEditable: true
      },
      {
        id: '304',
        type: 'note_entry',
        name: 'Mood Assessment',
        description: 'Evaluate and document patient mood and affect',
        ehrField: 'mood_assessment',
        isEditable: true
      },
      {
        id: '305',
        type: 'note_entry',
        name: 'Risk Factors',
        description: 'Identify and document potential risk factors',
        ehrField: 'risk_factors',
        isEditable: true
      }
    ]
  }
];

const MyWorkflows: React.FC<MyWorkflowsProps> = ({ onEditWorkflow }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, workflowId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkflow(workflowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkflow(null);
  };

  const handleToggleActive = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, isActive: !workflow.isActive }
        : workflow
    ));
    handleMenuClose();
  };

  const handleToggleFavorite = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, isFavorite: !workflow.isFavorite }
        : workflow
    ));
  };

  const handleDuplicate = (workflowId: string) => {
    const workflowToDuplicate = workflows.find(w => w.id === workflowId);
    if (workflowToDuplicate) {
      const newWorkflow: Workflow = {
        ...workflowToDuplicate,
        id: Date.now().toString(),
        name: `${workflowToDuplicate.name} (Copy)`,
        isActive: false,
        isFavorite: false,
        lastRun: undefined,
        totalRuns: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setWorkflows(prev => [...prev, newWorkflow]);
    }
    handleMenuClose();
  };

  const handleDelete = (workflowId: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowId));
    handleMenuClose();
  };

  const handleRunWorkflow = (workflowId: string) => {
    console.log('Running workflow:', workflowId);
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { 
            ...workflow, 
            lastRun: new Date().toISOString(),
            totalRuns: workflow.totalRuns + 1
          }
        : workflow
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusChip = (workflow: Workflow) => {
    if (workflow.isActive) {
      return (
        <Chip
          label="Active"
          size="small"
          color="success"
          icon={<CheckCircleIcon />}
          variant="filled"
          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
        />
      );
    } else {
      return (
        <Chip
          label="Inactive"
          size="small"
          color="default"
          icon={<PauseIcon />}
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
        />
      );
    }
  };

  const activeWorkflows = workflows.filter(w => w.isActive);
  const favoriteWorkflows = workflows.filter(w => w.isFavorite);

  if (workflows.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            p: { xs: 2, sm: 4 }
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 6 },
              borderRadius: 3,
              backgroundColor: 'background.paper',
              border: '2px dashed',
              borderColor: 'grey.300'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, sm: 3 } }}>
              <WorkflowIcon 
                sx={{ fontSize: { xs: 60, sm: 70, md: 80 }, color: 'text.secondary' }}
              />
            </Box>
            <Typography 
              variant={isSmallMobile ? "h5" : isMobile ? "h4" : "h4"} 
              gutterBottom 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              No Workflows Yet
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: { xs: 3, sm: 4 },
                maxWidth: 500,
                mx: 'auto',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Create your first clinical workflow or import from our library to automate your EHR documentation tasks.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                size={isSmallMobile ? "medium" : "large"}
                startIcon={<AddIcon />}
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Create New Workflow
              </Button>
              <Button
                variant="outlined"
                size={isSmallMobile ? "medium" : "large"}
                startIcon={<ImportIcon />}
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Browse Library
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ position: 'relative' }}>
        <Box>
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography 
              variant={isSmallMobile ? "h6" : isMobile ? "h5" : "h5"} 
              gutterBottom 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              My Clinical Workflows
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
              }}
            >
              Manage and execute your personalized clinical automation workflows
            </Typography>
          </Box>

          {/* Summary Stats */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            }, 
            gap: { xs: 1.5, sm: 2, md: 3 }, 
            mb: { xs: 3, sm: 4 }
          }}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkflowIcon sx={{ color: 'primary.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                  <Typography 
                    variant="caption" 
                    fontWeight={600}
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    Total Workflows
                  </Typography>
                </Box>
                <Typography 
                  variant={isSmallMobile ? "h5" : "h4"} 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                  }}
                >
                  {workflows.length}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                  <Typography 
                    variant="caption" 
                    fontWeight={600}
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    Active
                  </Typography>
                </Box>
                <Typography 
                  variant={isSmallMobile ? "h5" : "h4"} 
                  sx={{ 
                    color: 'success.main', 
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                  }}
                >
                  {activeWorkflows.length}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FavoriteIcon sx={{ color: 'error.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                  <Typography 
                    variant="caption" 
                    fontWeight={600}
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    Favorites
                  </Typography>
                </Box>
                <Typography 
                  variant={isSmallMobile ? "h5" : "h4"} 
                  sx={{ 
                    color: 'error.main', 
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                  }}
                >
                  {favoriteWorkflows.length}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimeIcon sx={{ color: 'info.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                  <Typography 
                    variant="caption" 
                    fontWeight={600}
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    Avg. Time Saved
                  </Typography>
                </Box>
                <Typography 
                  variant={isSmallMobile ? "h5" : "h4"} 
                  sx={{ 
                    color: 'info.main', 
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                  }}
                >
                  18min
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Workflows Grid */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fit, minmax(350px, 1fr))',
              md: 'repeat(auto-fit, minmax(400px, 1fr))',
              lg: 'repeat(auto-fit, minmax(450px, 1fr))'
            },
            gap: { xs: 2, sm: 3 },
            mb: 4
          }}>
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: workflow.isActive ? 'success.light' : 'divider',
                  borderRadius: { xs: 2, sm: 3 },
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  backgroundColor: workflow.isFavorite ? alpha(theme.palette.warning.light, 0.05) : 'background.paper',
                  '&:hover': {
                    boxShadow: { xs: 3, sm: 6 },
                    transform: { xs: 'none', sm: 'translateY(-2px)' }
                  }
                }}
              >
                {/* Favorite Indicator */}
                {workflow.isFavorite && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    zIndex: 1 
                  }}>
                    <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                  {/* Header Section */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    mb: { xs: 2, sm: 3 } 
                  }}>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary',
                          fontSize: { xs: '1.125rem', sm: '1.25rem' },
                          lineHeight: 1.3
                        }}
                      >
                        {workflow.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 1.5, 
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          lineHeight: 1.5
                        }}
                      >
                        {workflow.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {getStatusChip(workflow)}
                        <Chip 
                          label={workflow.category} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Chip 
                          label={workflow.ehrSystem} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Stack>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, workflow.id)}
                      sx={{ mt: -1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  {/* Workflow Statistics */}
                  <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      Performance Metrics
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Avg. Time Saved: {workflow.avgTimeSaved}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Success Rate: {workflow.successRate}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PlayCircleIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Total Runs: {workflow.totalRuns}
                        </Typography>
                      </Box>
                      {workflow.lastRun && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon sx={{ color: 'info.main', fontSize: '1rem' }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            Last Run: {formatDate(workflow.lastRun)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Workflow Steps Preview */}
                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 1 
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        Configured Visit Types
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setExpandedWorkflow(
                          expandedWorkflow === workflow.id ? null : workflow.id
                        )}
                      >
                        {expandedWorkflow === workflow.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                    
                    <List dense sx={{ py: 0 }}>
                      {workflow.blocks.slice(0, 2).map((block) => (
                        <ListItem key={block.id} disableGutters sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <WorkflowIcon 
                                sx={{ 
                                  color: 'primary.main',
                                  fontSize: { xs: 16, sm: 18 }
                                }}
                              />
                            </Box>
                          </ListItemIcon>
                          <ListItemText 
                            primary={block.name} 
                            secondary={block.description}
                            primaryTypographyProps={{
                              fontSize: isMobile ? '0.875rem' : '1rem',
                              fontWeight: 500
                            }}
                            secondaryTypographyProps={{
                              fontSize: isMobile ? '0.75rem' : '0.875rem'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Collapse in={expandedWorkflow === workflow.id}>
                      <List dense sx={{ py: 0 }}>
                        {workflow.blocks.slice(2).map((block) => (
                          <ListItem key={block.id} disableGutters sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                              <AssignmentIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={block.name} 
                              secondary={block.description}
                              primaryTypographyProps={{
                                fontSize: isMobile ? '0.875rem' : '1rem',
                                fontWeight: 500
                              }}
                              secondaryTypographyProps={{
                                fontSize: isMobile ? '0.75rem' : '0.875rem'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>

                    {workflow.blocks.length > 2 && expandedWorkflow !== workflow.id && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          display: 'block', 
                          textAlign: 'right',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      >
                        +{workflow.blocks.length - 2} more steps
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                {/* Action Buttons */}
                <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<PlayIcon />}
                      onClick={() => handleRunWorkflow(workflow.id)}
                      disabled={!workflow.isActive}
                      sx={{ 
                        flex: 1, 
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        py: { xs: 0.75, sm: 1 }
                      }}
                    >
                      Run
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => onEditWorkflow(workflow)}
                      sx={{ 
                        flex: 1, 
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        py: { xs: 0.75, sm: 1 }
                      }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleFavorite(workflow.id)}
                      sx={{ 
                        color: workflow.isFavorite ? 'warning.main' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: workflow.isFavorite ? alpha(theme.palette.warning.main, 0.1) : 'action.hover'
                        }
                      }}
                    >
                      {workflow.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Stack>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && Boolean(selectedWorkflow)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => selectedWorkflow && handleToggleActive(selectedWorkflow)}>
            {selectedWorkflow && workflows.find(w => w.id === selectedWorkflow)?.isActive ? (
              <>
                <PauseIcon sx={{ mr: 1, fontSize: 18 }} />
                Deactivate
              </>
            ) : (
              <>
                <PlayIcon sx={{ mr: 1, fontSize: 18 }} />
                Activate
              </>
            )}
          </MenuItem>
          <MenuItem onClick={() => selectedWorkflow && handleDuplicate(selectedWorkflow)}>
            <CopyIcon sx={{ mr: 1, fontSize: 18 }} />
            Duplicate
          </MenuItem>
          <MenuItem onClick={() => selectedWorkflow && onEditWorkflow(workflows.find(w => w.id === selectedWorkflow)!)}>
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            Edit
          </MenuItem>
          <MenuItem>
            <ExportIcon sx={{ mr: 1, fontSize: 18 }} />
            Export
          </MenuItem>
          <MenuItem>
            <ShareIcon sx={{ mr: 1, fontSize: 18 }} />
            Share
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => selectedWorkflow && handleDelete(selectedWorkflow)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add workflow"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>
    </Container>
  );
};

export default MyWorkflows;
