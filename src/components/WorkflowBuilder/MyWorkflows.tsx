import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Alert,
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Checkbox,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Play as PlayIcon,
  CheckCircle as CheckCircleIcon,
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
  Settings as SettingsIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon
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

interface ImportedWorkflow {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  status: 'draft' | 'active' | 'paused';
  blocks: WorkflowBlock[];
  availableVisitTypes: string[];
  visitTypeMappings: VisitTypeMapping[];
}

interface VisitTypeMapping {
  visitType: string;
  templateFields: { [key: string]: string };
  scheduleConfig: {
    providerName: string;
    location: string;
  };
  isConfigured: boolean;
}

interface MyWorkflowsProps {
  importedWorkflows: ImportedWorkflow[];
  setImportedWorkflows: React.Dispatch<React.SetStateAction<ImportedWorkflow[]>>;
}

const MyWorkflows: React.FC<MyWorkflowsProps> = ({ importedWorkflows, setImportedWorkflows }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedWorkflowId, setExpandedWorkflowId] = useState<string | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configuringWorkflow, setConfiguringWorkflow] = useState<ImportedWorkflow | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedVisitTypes, setSelectedVisitTypes] = useState<string[]>([]);
  const [isVisitTypeConfigured, setIsVisitTypeConfigured] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const workflowStatusOptions = ['draft', 'active', 'paused'];

  const filteredWorkflows = importedWorkflows.filter(workflow => {
    const searchMatch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = selectedStatus === 'all' || workflow.status === selectedStatus;
    return searchMatch && statusMatch;
  });

  const handleWorkflowToggle = (workflowId: string) => {
    setExpandedWorkflowId(prevId => (prevId === workflowId ? null : workflowId));
  };

  const handleConfigureWorkflow = (workflow: ImportedWorkflow) => {
    setConfiguringWorkflow(workflow);
    setIsConfiguring(true);
    setActiveStep(0);

    // Initialize selected visit types based on existing configuration
    const configuredVisitTypes = workflow.visitTypeMappings
      .filter(mapping => mapping.isConfigured)
      .map(mapping => mapping.visitType);
    setSelectedVisitTypes(configuredVisitTypes);
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleVisitTypeToggle = (visitType: string) => {
    setSelectedVisitTypes(prev =>
      prev.includes(visitType) ? prev.filter(vt => vt !== visitType) : [...prev, visitType]
    );
  };

  const handleSaveConfiguration = () => {
    if (!configuringWorkflow) return;

    // Update visit type mappings based on selected visit types
    const updatedVisitTypeMappings = configuringWorkflow.visitTypeMappings.map(mapping => ({
      ...mapping,
      isConfigured: selectedVisitTypes.includes(mapping.visitType)
    }));

    // Update the workflow with the new visit type mappings
    const updatedWorkflows = importedWorkflows.map(wf =>
      wf.id === configuringWorkflow.id
        ? { ...configuringWorkflow, visitTypeMappings: updatedVisitTypeMappings }
        : wf
    );

    setImportedWorkflows(updatedWorkflows);
    setIsConfiguring(false);
    setConfiguringWorkflow(null);
    setSelectedVisitTypes([]);
    setActiveStep(0);
  };

  const handleCancelConfiguration = () => {
    setIsConfiguring(false);
    setConfiguringWorkflow(null);
    setSelectedVisitTypes([]);
    setActiveStep(0);
  };

  const handleDeleteConfirmation = (workflowId: string) => {
    setWorkflowToDelete(workflowId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteWorkflow = () => {
    if (!workflowToDelete) return;
    const updatedWorkflows = importedWorkflows.filter(wf => wf.id !== workflowToDelete);
    setImportedWorkflows(updatedWorkflows);
    setDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  };

  const handleStatusChange = (workflowId: string, newStatus: string) => {
    const updatedWorkflows = importedWorkflows.map(wf =>
      wf.id === workflowId ? { ...wf, status: newStatus as 'draft' | 'active' | 'paused' } : wf
    );
    setImportedWorkflows(updatedWorkflows);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Search and Filter Controls */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2
        }}>
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
              flex: { sm: 2 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper'
              }
            }}
          />
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: { xs: '100%', sm: 150 },
              flex: { sm: 1 }
            }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={(e) => setSelectedStatus(e.target.value)}
              startAdornment={<FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Workflow Cards */}
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
                      label={workflow.ehrSystem} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                    <Chip 
                      label={workflow.status} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </Stack>
                </Box>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={workflow.status}
                    label="Status"
                    onChange={(e) => handleStatusChange(workflow.id, e.target.value)}
                  >
                    {workflowStatusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SettingsIcon />}
                fullWidth
                onClick={() => handleConfigureWorkflow(workflow)}
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Configure
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                fullWidth
                onClick={() => handleDeleteConfirmation(workflow.id)}
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Delete
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

      {/* Configuration Dialog */}
      <Dialog
        open={isConfiguring}
        onClose={handleCancelConfiguration}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Configure Workflow</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step key={1}>
              <StepLabel>
                Select Visit Types
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Choose the visit types this workflow should apply to.
                </Typography>
                <List>
                  {configuringWorkflow?.availableVisitTypes.map((visitType) => (
                    <ListItem key={visitType}>
                      <ListItemButton onClick={() => handleVisitTypeToggle(visitType)}>
                        <ListItemIcon>
                          <Checkbox
                            checked={selectedVisitTypes.includes(visitType)}
                            edge="start"
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText primary={visitType} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
            <Step key={2}>
              <StepLabel>
                Configure Template Fields
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Map template fields to the workflow steps for automated data entry.
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  This feature is under development and will be available soon.
                </Alert>
                <Box sx={{ mb: 2 }}>
                  <Button
                    disabled
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
            <Step key={3}>
              <StepLabel>
                Schedule Configuration
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Set up scheduling parameters for automated workflow activation.
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  This feature is under development and will be available soon.
                </Alert>
                <Box sx={{ mb: 2 }}>
                  <Button
                    disabled
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfiguration} startIcon={<CancelIcon />} color="error">
            Cancel
          </Button>
          <Button onClick={handleSaveConfiguration} startIcon={<SaveIcon />} color="success" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Workflow?"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this workflow? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteWorkflow} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyWorkflows;
