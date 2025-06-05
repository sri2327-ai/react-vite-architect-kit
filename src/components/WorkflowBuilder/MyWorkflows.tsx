import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Grid2 as Grid,
  Menu,
  MenuItem as MenuItemComponent,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Checkbox
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Share as ShareIcon,
  GetApp as ExportIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Note as NoteIcon,
  Computer as EHRIcon,
  Psychology as AIIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  TrendingUp as TrendingIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  AccountTree as WorkflowIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  LocalHospital as HospitalIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckBox as ChecklistIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
  MoreHoriz as MoreIcon
} from '@mui/icons-material';
import { templateService } from '../../services/templateService';

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
  blocks: WorkflowBlock[];
}

const workflowData: Workflow[] = [
  {
    id: '1',
    name: 'Standard Patient Visit',
    description: 'Automated workflow for routine patient check-ups, including vitals, history, and assessment.',
    category: 'General Medicine',
    ehrSystem: 'Epic',
    avgTimeSaved: '15-20 minutes',
    successRate: 95,
    trendingScore: 88,
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
  },
  {
    id: '4',
    name: 'Pediatric Vaccination Visit',
    description: 'Efficient workflow for pediatric vaccination appointments and immunization records.',
    category: 'Pediatrics',
    ehrSystem: 'Allscripts',
    avgTimeSaved: '12-18 minutes',
    successRate: 90,
    trendingScore: 85,
    blocks: [
      {
        id: '401',
        type: 'schedule',
        name: 'View Schedule',
        description: 'Access provider schedule with date and location filters',
        isEditable: true
      },
      {
        id: '402',
        type: 'patient_select',
        name: 'Select Patient',
        description: 'Select patient from filtered schedule',
        isEditable: false
      },
      {
        id: '403',
        type: 'encounter_open',
        name: 'Open Encounter',
        description: 'Open patient encounter for current date and choose note type',
        isEditable: true
      },
      {
        id: '404',
        type: 'note_entry',
        name: 'Vaccination Record',
        description: 'Document vaccinations administered during visit',
        ehrField: 'vaccination_record',
        isEditable: true
      },
      {
        id: '405',
        type: 'note_entry',
        name: 'Adverse Reactions',
        description: 'Record any adverse reactions to vaccinations',
        ehrField: 'adverse_reactions',
        isEditable: true
      }
    ]
  },
  {
    id: '5',
    name: 'Cardiology Consultation',
    description: 'Specialized workflow for cardiology consultations and cardiac risk assessments.',
    category: 'Cardiology',
    ehrSystem: 'NextGen',
    avgTimeSaved: '25-30 minutes',
    successRate: 93,
    trendingScore: 81,
    blocks: [
      {
        id: '501',
        type: 'schedule',
        name: 'View Schedule',
        description: 'Access provider schedule with date and location filters',
        isEditable: true
      },
      {
        id: '502',
        type: 'patient_select',
        name: 'Select Patient',
        description: 'Select patient from filtered schedule',
        isEditable: false
      },
      {
        id: '503',
        type: 'encounter_open',
        name: 'Open Encounter',
        description: 'Open patient encounter for current date and choose note type',
        isEditable: true
      },
      {
        id: '504',
        type: 'note_entry',
        name: 'Cardiac History',
        description: 'Record patient cardiac history and risk factors',
        ehrField: 'cardiac_history',
        isEditable: true
      },
      {
        id: '505',
        type: 'note_entry',
        name: 'ECG Analysis',
        description: 'Analyze and document ECG findings',
        ehrField: 'ecg_analysis',
        isEditable: true
      }
    ]
  }
];

const MyWorkflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(workflowData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEHR, setSelectedEHR] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
  const [configWorkflow, setConfigWorkflow] = useState<Workflow | null>(null);
  const [importPreviousNote, setImportPreviousNote] = useState('none');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dynamicCategories = [...new Set(workflowData.map(workflow => workflow.category))];
  const dynamicEHRSystems = [...new Set(workflowData.map(workflow => workflow.ehrSystem))];

  const filteredWorkflows = workflows.filter(workflow => {
    const searchMatch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === 'all' || workflow.category === selectedCategory;
    const ehrMatch = selectedEHR === 'all' || workflow.ehrSystem === selectedEHR;
    return searchMatch && categoryMatch && ehrMatch;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, workflow: Workflow) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkflow(workflow);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkflow(null);
  };

  const handleConfigure = (workflow: Workflow) => {
    setConfigWorkflow(workflow);
    setConfigureDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveConfiguration = () => {
    setConfigureDialogOpen(false);
    // Save configuration logic here
  };

  const handleDelete = (workflow: Workflow) => {
    // Delete workflow logic here
    handleMenuClose();
  };

  const handleDuplicate = (workflow: Workflow) => {
    // Duplicate workflow logic here
    handleMenuClose();
  };

  const handleShare = (workflow: Workflow) => {
    // Share workflow logic here
    handleMenuClose();
  };

  const handleExport = (workflow: Workflow) => {
    // Export workflow logic here
    handleMenuClose();
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography 
          variant="h4"
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            fontSize: '2rem'
          }}
        >
          My Clinical Workflows
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            fontSize: '1.25rem'
          }}
        >
          Manage and execute your custom clinical automation workflows
        </Typography>
        
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            '& .MuiAlert-message': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        >
          <Typography variant="body1">
            <strong>Personalized Automation:</strong> Tailor workflows to match your clinical practice. 
            Automate documentation, scheduling, and more.
          </Typography>
        </Alert>
      </Box>

      {/* Search and Filter Controls */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper'
                }
              }}
            />
          </Grid>
          <Grid xs={12} sm={3} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                startAdornment={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {dynamicCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={3} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>EHR System</InputLabel>
              <Select
                value={selectedEHR}
                label="EHR System"
                onChange={(e) => setSelectedEHR(e.target.value)}
                startAdornment={<EHRIcon sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="all">All Systems</MenuItem>
                {dynamicEHRSystems.map((ehr) => (
                  <MenuItem key={ehr} value={ehr}>
                    {ehr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Configure Workflow Dialog */}
      <Dialog
        open={configureDialogOpen}
        onClose={() => setConfigureDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600
        }}>
          Configure Workflow
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
              Workflow Settings
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Workflow Name"
                value={configWorkflow?.name || ''}
                size="small"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Description"
                value={configWorkflow?.description || ''}
                multiline
                rows={3}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
              Template Configuration
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Import previous visit note</InputLabel>
                <Select
                  value={importPreviousNote}
                  label="Import previous visit note"
                  onChange={(e) => setImportPreviousNote(e.target.value)}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="last_visit">Last Visit Note</MenuItem>
                  <MenuItem value="specific_date">Specific Date</MenuItem>
                </Select>
              </FormControl>
              
              {importPreviousNote === 'specific_date' && (
                <TextField
                  fullWidth
                  label="Enter Date"
                  type="date"
                  size="small"
                  variant="outlined"
                />
              )}
              <FormControl fullWidth size="small">
                <InputLabel>Template</InputLabel>
                <Select
                  value=""
                  label="Template"
                >
                  <MenuItem value="default">Default Template</MenuItem>
                  <MenuItem value="custom">Custom Template</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="AI Prompt"
                multiline
                rows={3}
                size="small"
                variant="outlined"
                placeholder="Enter a prompt to guide AI-powered content generation"
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
              Automation Steps
            </Typography>
            <Stepper orientation="vertical" nonLinear>
              {configWorkflow?.blocks.map((block, index) => (
                <Step key={block.id} completed={index < 2}>
                  <StepLabel
                    optional={index === 3 ? (
                      <Typography variant="caption" color="textSecondary">
                        Last step
                      </Typography>
                    ) : null}
                  >
                    {block.name}
                  </StepLabel>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">Step {index + 1} Configuration</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Configure the settings for step {index + 1} here.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          pt: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button 
            onClick={() => setConfigureDialogOpen(false)}
            variant="outlined"
            fullWidth={isMobile}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveConfiguration}
            variant="contained"
            fullWidth={isMobile}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Workflow Cards Grid */}
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
        {filteredWorkflows.map((workflow) => (
          <Card 
            key={workflow.id}
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: { xs: 2, sm: 3 },
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: { xs: 3, sm: 6 },
                transform: { xs: 'none', sm: 'translateY(-2px)' }
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
              {/* Header Section */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                mb: { xs: 2, sm: 3 } 
              }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      fontSize: { xs: '1.125rem', sm: '1.25rem' }
                    }}
                  >
                    {workflow.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1, 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      lineHeight: 1.6
                    }}
                  >
                    {workflow.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip 
                      label={workflow.category} 
                      size="small" 
                      color="info" 
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                    <Chip 
                      label={workflow.ehrSystem} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </Stack>
                </Box>
                <IconButton 
                  aria-label="settings"
                  onClick={(event) => handleMenuOpen(event, workflow)}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedWorkflow?.id === workflow.id}
                  onClose={handleMenuClose}
                >
                  <MenuItemComponent onClick={() => handleConfigure(workflow)}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Configure</ListItemText>
                  </MenuItemComponent>
                  <MenuItemComponent onClick={() => handleDuplicate(workflow)}>
                    <ListItemIcon>
                      <CopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Duplicate</ListItemText>
                  </MenuItemComponent>
                  <MenuItemComponent onClick={() => handleShare(workflow)}>
                    <ListItemIcon>
                      <ShareIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Share</ListItemText>
                  </MenuItemComponent>
                  <MenuItemComponent onClick={() => handleExport(workflow)}>
                    <ListItemIcon>
                      <ExportIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export</ListItemText>
                  </MenuItemComponent>
                  <Divider />
                  <MenuItemComponent onClick={() => handleDelete(workflow)}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItemComponent>
                </Menu>
              </Box>

              {/* Workflow Highlights */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Workflow Highlights
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
                    <TrendingIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Trending Score: {workflow.trendingScore}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Workflow Steps Preview */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Workflow Steps
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {workflow.blocks.slice(0, 3).map((block) => (
                    <ListItem key={block.id} disableGutters sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                        <AssignmentIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={block.name} 
                        secondary={block.description}
                        primaryTypographyProps={{
                          fontSize: isMobile ? '0.875rem' : '1rem'
                        }}
                        secondaryTypographyProps={{
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}
                      />
                    </ListItem>
                  ))}
                  {workflow.blocks.length > 3 && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'block', 
                        textAlign: 'right',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}
                    >
                      +{workflow.blocks.length - 3} more steps
                    </Typography>
                  )}
                </List>
              </Box>
            </CardContent>
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayIcon />}
                fullWidth
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Execute Workflow
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {filteredWorkflows.length === 0 && (
        <Alert severity="warning" sx={{ mt: 3, fontSize: '1rem' }}>
          No workflows match your search criteria. Please adjust your search or filters.
        </Alert>
      )}
    </Container>
  );
};

export default MyWorkflows;
