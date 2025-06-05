import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Menu,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Settings as ConfigIcon,
  Search as SearchIcon
} from '@mui/icons-material';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  steps: number;
  lastModified: string;
  type: string;
}

const sampleWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Patient Intake Workflow',
    description: 'A comprehensive workflow for new patient onboarding, including demographics, medical history, and consent forms.',
    status: 'active',
    steps: 7,
    lastModified: '2024-07-15',
    type: 'patient-intake'
  },
  {
    id: '2',
    name: 'Post-Op Follow-Up',
    description: 'Automated follow-up workflow for post-operative patients, including pain assessment and medication reminders.',
    status: 'draft',
    steps: 5,
    lastModified: '2024-07-10',
    type: 'follow-up'
  },
  {
    id: '3',
    name: 'Billing and Claims Submission',
    description: 'Streamlined workflow for generating and submitting billing claims to insurance providers.',
    status: 'active',
    steps: 9,
    lastModified: '2024-07-01',
    type: 'billing'
  },
  {
    id: '4',
    name: 'Clinical Documentation',
    description: 'Workflow to automate clinical documentation.',
    status: 'archived',
    steps: 6,
    lastModified: '2024-06-20',
    type: 'clinical-documentation'
  }
];

const MyWorkflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [newWorkflow, setNewWorkflow] = useState<Omit<Workflow, 'id' | 'lastModified'>>({
    name: '',
    description: '',
    status: 'draft',
    steps: 0,
    type: 'patient-intake'
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Simulate fetching workflows from an API
    // In a real application, you would fetch data from an API endpoint here
    // and update the workflows state with the fetched data.
  }, []);

  const handleCreateWorkflow = () => {
    // Simulate creating a new workflow
    const newId = Math.random().toString(36).substring(7);
    const now = new Date();
    const newWorkflowWithId: Workflow = {
      id: newId,
      name: newWorkflow.name,
      description: newWorkflow.description,
      status: 'draft',
      steps: 0,
      lastModified: now.toISOString().slice(0, 10),
      type: newWorkflow.type
    };
    setWorkflows([...workflows, newWorkflowWithId]);
    setCreateDialogOpen(false);
    setNewWorkflow({
      name: '',
      description: '',
      status: 'draft',
      steps: 0,
      type: 'patient-intake'
    });
  };

  const handleEdit = (id: string) => {
    // Simulate editing an existing workflow
    console.log(`Editing workflow with id ${id}`);
    // In a real application, you would open a form or dialog to edit the workflow details.
  };

  const handleDelete = (id: string) => {
    // Simulate deleting an existing workflow
    setWorkflows(workflows.filter((workflow) => workflow.id !== id));
    console.log(`Deleting workflow with id ${id}`);
  };

  const handleConfigure = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setConfigDialogOpen(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkflowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkflowId(null);
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatches = workflow.name.toLowerCase().includes(searchTermLower);
    const descriptionMatches = workflow.description.toLowerCase().includes(searchTermLower);
    const statusMatches = statusFilter === 'all' || workflow.status === statusFilter;

    return (nameMatches || descriptionMatches) && statusMatches;
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Search and Filter Section */}
      <Box sx={{ 
        mb: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 3 },
        alignItems: { xs: 'stretch', sm: 'center' }
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
            maxWidth: { sm: 300, md: 400 },
            '& .MuiOutlinedInput-root': {
              fontSize: { xs: '0.875rem', md: '1rem' }
            }
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ 
            minWidth: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.875rem', md: '1rem' },
            py: { xs: 1, md: 1.2 }
          }}
        >
          New Workflow
        </Button>
      </Box>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: { xs: 2, md: 3 },
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          No workflows found. Create your first workflow to get started!
        </Alert>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {filteredWorkflows.map((workflow) => (
            <Grid item xs={12} sm={6} lg={4} key={workflow.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: { xs: 2, md: 3 },
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 2 
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        lineHeight: 1.3,
                        mb: 1
                      }}
                    >
                      {workflow.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, workflow.id)}
                      sx={{ 
                        ml: 1,
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {workflow.description}
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mb: 2 
                  }}>
                    <Chip 
                      label={workflow.status} 
                      size="small"
                      color={workflow.status === 'active' ? 'success' : 'default'}
                      sx={{ 
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        height: { xs: 24, md: 28 }
                      }}
                    />
                    <Chip 
                      label={`${workflow.steps} steps`} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        height: { xs: 24, md: 28 }
                      }}
                    />
                  </Box>

                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.7rem', md: '0.75rem' }
                    }}
                  >
                    Last modified: {workflow.lastModified}
                  </Typography>
                </CardContent>

                <CardActions sx={{ 
                  p: { xs: 2, md: 3 }, 
                  pt: 0,
                  gap: 1
                }}>
                  <Button 
                    size="small" 
                    startIcon={<PlayIcon />}
                    sx={{ 
                      fontSize: { xs: '0.75rem', md: '0.875rem' }
                    }}
                  >
                    Run
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(workflow.id)}
                    sx={{ 
                      fontSize: { xs: '0.75rem', md: '0.875rem' }
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<ConfigIcon />}
                    onClick={() => handleConfigure(workflow)}
                    sx={{ 
                      fontSize: { xs: '0.75rem', md: '0.875rem' }
                    }}
                  >
                    Configure
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: { xs: 150, md: 180 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            handleEdit(selectedWorkflowId!);
            handleMenuClose();
          }}
          sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
        >
          <EditIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleDelete(selectedWorkflowId!);
            handleMenuClose();
          }}
          sx={{ 
            color: 'error.main',
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Workflow Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isSmallMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            maxHeight: { xs: '100vh', sm: '90vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          fontWeight: 600,
          pb: 1
        }}>
          Create New Workflow
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Workflow Name"
              fullWidth
              size="small"
              value={newWorkflow.name}
              onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              size="small"
              value={newWorkflow.description}
              onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }
              }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={newWorkflow.type}
                label="Type"
                onChange={(e) => setNewWorkflow({...newWorkflow, type: e.target.value})}
                sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
              >
                <MenuItem value="patient-intake">Patient Intake</MenuItem>
                <MenuItem value="clinical-documentation">Clinical Documentation</MenuItem>
                <MenuItem value="billing">Billing</MenuItem>
                <MenuItem value="follow-up">Follow-up</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setCreateDialogOpen(false)}
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateWorkflow}
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Configure Workflow Dialog */}
      <Dialog 
        open={configDialogOpen} 
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isSmallMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            maxHeight: { xs: '100vh', sm: '90vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          fontWeight: 600,
          pb: 1
        }}>
          Configure Workflow: {selectedWorkflow?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Basic Settings */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    fontWeight: 600
                  }}
                >
                  Basic Settings
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Workflow Name"
                    fullWidth
                    size="small"
                    value={selectedWorkflow?.name || ''}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }
                    }}
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    value={selectedWorkflow?.description || ''}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }
                    }}
                  />
                  <FormControlLabel
                    control={<Switch size="small" />}
                    label={
                      <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        Auto-start workflow
                      </Typography>
                    }
                  />
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Data Sources */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    fontWeight: 600
                  }}
                >
                  Data Sources
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {[
                    'Patient demographics',
                    'Medical history',
                    'Import previous visit note',
                    'Lab results',
                    'Imaging reports'
                  ].map((source) => (
                    <ListItem key={source} dense>
                      <Checkbox size="small" />
                      <ListItemText 
                        primary={source}
                        primaryTypographyProps={{
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Output Settings */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    fontWeight: 600
                  }}
                >
                  Output Settings
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Output Format</InputLabel>
                    <Select
                      defaultValue="structured"
                      label="Output Format"
                      sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                      <MenuItem value="structured">Structured Note</MenuItem>
                      <MenuItem value="narrative">Narrative</MenuItem>
                      <MenuItem value="template">Template-based</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={<Switch size="small" defaultChecked />}
                    label={
                      <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        Include timestamps
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Switch size="small" />}
                    label={
                      <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                        Auto-save to EHR
                      </Typography>
                    }
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setConfigDialogOpen(false)}
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyWorkflows;
