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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as ImportIcon,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
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
  blocks: WorkflowBlock[];
}

interface ImportedWorkflow {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  status: 'draft' | 'active' | 'archived';
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
  const [hoveredWorkflow, setHoveredWorkflow] = useState<string | null>(null);
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [editedWorkflowName, setEditedWorkflowName] = useState('');
  const [editedWorkflowDescription, setEditedWorkflowDescription] = useState('');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [workflowToDeleteId, setWorkflowToDeleteId] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const workflowStatuses = ['draft', 'active', 'archived'];

  const filteredWorkflows = importedWorkflows.filter(workflow => {
    const searchMatch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = selectedStatus === 'all' || workflow.status === selectedStatus;
    return searchMatch && statusMatch;
  });

  const handleEditWorkflow = (workflowId: string) => {
    const workflowToEdit = importedWorkflows.find(workflow => workflow.id === workflowId);
    if (workflowToEdit) {
      setEditingWorkflowId(workflowId);
      setEditedWorkflowName(workflowToEdit.name);
      setEditedWorkflowDescription(workflowToEdit.description);
    }
  };

  const handleSaveEdit = () => {
    setImportedWorkflows(prevWorkflows =>
      prevWorkflows.map(workflow =>
        workflow.id === editingWorkflowId
          ? { ...workflow, name: editedWorkflowName, description: editedWorkflowDescription }
          : workflow
      )
    );
    setEditingWorkflowId(null);
  };

  const handleCancelEdit = () => {
    setEditingWorkflowId(null);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflowToDeleteId(workflowId);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteWorkflow = () => {
    setImportedWorkflows(prevWorkflows =>
      prevWorkflows.filter(workflow => workflow.id !== workflowToDeleteId)
    );
    setDeleteConfirmationOpen(false);
    setWorkflowToDeleteId(null);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setWorkflowToDeleteId(null);
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
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {workflowStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

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
                  {editingWorkflowId === workflow.id ? (
                    <TextField
                      fullWidth
                      label="Workflow Name"
                      value={editedWorkflowName}
                      onChange={(e) => setEditedWorkflowName(e.target.value)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  ) : (
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
                  )}
                  {editingWorkflowId === workflow.id ? (
                    <TextField
                      fullWidth
                      label="Workflow Description"
                      value={editedWorkflowDescription}
                      onChange={(e) => setEditedWorkflowDescription(e.target.value)}
                      multiline
                      rows={2}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  ) : (
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
                  )}
                  <Chip 
                    label={workflow.status} 
                    size="small" 
                    color="default"
                    sx={{ fontSize: '0.75rem' }}
                  />
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
            <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', gap: 1 }}>
              {editingWorkflowId === workflow.id ? (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<SaveIcon />}
                    fullWidth
                    onClick={handleSaveEdit}
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CancelIcon />}
                    fullWidth
                    onClick={handleCancelEdit}
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    fullWidth
                    onClick={() => handleEditWorkflow(workflow.id)}
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    fullWidth
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Box>
          </Card>
        ))}
      </Box>

      {filteredWorkflows.length === 0 && (
        <Alert severity="warning" sx={{ mt: 3, fontSize: '1rem' }}>
          No workflows match your search criteria. Please adjust your search or filters.
        </Alert>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete Workflow?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this workflow? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteWorkflow} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyWorkflows;
