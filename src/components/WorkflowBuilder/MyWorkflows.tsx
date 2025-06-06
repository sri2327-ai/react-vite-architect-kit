
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Alert,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Tooltip,
  Stack,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  lastModified: string;
  createdBy: string;
  tags: string[];
  executions: number;
  successRate: number;
  category: string;
  estimatedTime: string;
  complexity: 'low' | 'medium' | 'high';
}

interface MyWorkflowsProps {
  onCreateNew: () => void;
}

const MyWorkflows: React.FC<MyWorkflowsProps> = ({ onCreateNew }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data
  useEffect(() => {
    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Patient Intake Workflow',
        description: 'Automated patient registration and initial assessment process',
        status: 'active',
        lastModified: '2024-01-15',
        createdBy: 'Dr. Smith',
        tags: ['intake', 'registration', 'assessment'],
        executions: 1245,
        successRate: 98.5,
        category: 'Patient Management',
        estimatedTime: '5-8 minutes',
        complexity: 'medium'
      },
      {
        id: '2',
        name: 'Lab Results Processing',
        description: 'Streamlined lab result review and patient notification',
        status: 'active',
        lastModified: '2024-01-12',
        createdBy: 'Dr. Johnson',
        tags: ['lab', 'results', 'notifications'],
        executions: 892,
        successRate: 99.2,
        category: 'Clinical Operations',
        estimatedTime: '3-5 minutes',
        complexity: 'low'
      },
      {
        id: '3',
        name: 'Prescription Refill Automation',
        description: 'Automated prescription refill requests and approvals',
        status: 'inactive',
        lastModified: '2024-01-10',
        createdBy: 'Dr. Williams',
        tags: ['prescription', 'refill', 'pharmacy'],
        executions: 567,
        successRate: 97.8,
        category: 'Medication Management',
        estimatedTime: '2-4 minutes',
        complexity: 'low'
      },
      {
        id: '4',
        name: 'Insurance Verification Flow',
        description: 'Comprehensive insurance verification and pre-authorization',
        status: 'draft',
        lastModified: '2024-01-08',
        createdBy: 'Admin User',
        tags: ['insurance', 'verification', 'authorization'],
        executions: 0,
        successRate: 0,
        category: 'Administrative',
        estimatedTime: '10-15 minutes',
        complexity: 'high'
      },
      {
        id: '5',
        name: 'Appointment Scheduling',
        description: 'Smart appointment scheduling with conflict resolution',
        status: 'active',
        lastModified: '2024-01-14',
        createdBy: 'Dr. Brown',
        tags: ['scheduling', 'appointments', 'calendar'],
        executions: 2134,
        successRate: 96.7,
        category: 'Scheduling',
        estimatedTime: '3-6 minutes',
        complexity: 'medium'
      },
      {
        id: '6',
        name: 'Discharge Planning Workflow',
        description: 'Comprehensive patient discharge planning and follow-up',
        status: 'active',
        lastModified: '2024-01-13',
        createdBy: 'Dr. Davis',
        tags: ['discharge', 'planning', 'follow-up'],
        executions: 456,
        successRate: 99.1,
        category: 'Patient Management',
        estimatedTime: '15-20 minutes',
        complexity: 'high'
      }
    ];

    setTimeout(() => {
      setWorkflows(mockWorkflows);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, workflow: Workflow) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkflow(workflow);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkflow(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleCopy = () => {
    if (selectedWorkflow) {
      const newWorkflow = {
        ...selectedWorkflow,
        id: Date.now().toString(),
        name: `${selectedWorkflow.name} (Copy)`,
        status: 'draft' as const,
        lastModified: new Date().toISOString().split('T')[0],
        executions: 0,
        successRate: 0
      };
      setWorkflows([newWorkflow, ...workflows]);
    }
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    if (selectedWorkflow) {
      const newStatus = selectedWorkflow.status === 'active' ? 'inactive' : 'active';
      setWorkflows(workflows.map(w => 
        w.id === selectedWorkflow.id 
          ? { ...w, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
          : w
      ));
    }
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedWorkflow) {
      setWorkflows(workflows.filter(w => w.id !== selectedWorkflow.id));
    }
    setDeleteDialogOpen(false);
    setSelectedWorkflow(null);
  };

  const handleEditSave = () => {
    if (selectedWorkflow) {
      setWorkflows(workflows.map(w => 
        w.id === selectedWorkflow.id 
          ? { ...selectedWorkflow, lastModified: new Date().toISOString().split('T')[0] }
          : w
      ));
    }
    setEditDialogOpen(false);
    setSelectedWorkflow(null);
  };

  const getStatusChip = (status: Workflow['status']) => {
    const statusConfig = {
      active: { label: 'Active', color: 'success' as const, icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
      inactive: { label: 'Inactive', color: 'error' as const, icon: <ErrorIcon sx={{ fontSize: 16 }} /> },
      draft: { label: 'Draft', color: 'warning' as const, icon: <WarningIcon sx={{ fontSize: 16 }} /> }
    };

    const config = statusConfig[status];
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        variant="filled"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  const getComplexityChip = (complexity: Workflow['complexity']) => {
    const complexityConfig = {
      low: { label: 'Low', color: 'success' as const },
      medium: { label: 'Medium', color: 'warning' as const },
      high: { label: 'High', color: 'error' as const }
    };

    const config = complexityConfig[complexity];
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500, fontSize: '0.75rem' }}
      />
    );
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || workflow.category === filterCategory;
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(workflows.map(w => w.category)));

  const getWorkflowStats = () => {
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter(w => w.status === 'active').length;
    const totalExecutions = workflows.reduce((sum, w) => sum + w.executions, 0);
    const avgSuccessRate = workflows.length > 0 
      ? workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length 
      : 0;

    return { totalWorkflows, activeWorkflows, totalExecutions, avgSuccessRate };
  };

  const stats = getWorkflowStats();

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>My Workflows</Typography>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Loading your workflows...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3 
      }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ mb: 0.5 }}>
            My Workflows
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor your custom workflows
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
          size={isMobile ? "medium" : "large"}
          sx={{
            borderRadius: 2,
            px: 3,
            alignSelf: { xs: 'stretch', sm: 'auto' }
          }}
        >
          Create New Workflow
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <AssignmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                {stats.totalWorkflows}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Total Workflows
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                {stats.activeWorkflows}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Active
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <TrendingUpIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                {stats.totalExecutions.toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Total Runs
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <SpeedIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                {stats.avgSuccessRate.toFixed(1)}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Avg Success
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ backgroundColor: 'background.default' }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e: SelectChangeEvent) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e: SelectChangeEvent) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PsychologyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {workflows.length === 0 ? 'No Workflows Yet' : 'No Matching Workflows'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {workflows.length === 0 
              ? 'Create your first workflow to automate your processes'
              : 'Try adjusting your filters or search terms'
            }
          </Typography>
          {workflows.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateNew}
              size="large"
            >
              Create Your First Workflow
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredWorkflows.map((workflow, index) => (
            <Grid item xs={12} sm={6} lg={4} key={workflow.id}>
              <Fade in timeout={300 + index * 100}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ flex: 1, p: 2.5 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          mb: 0.5,
                          fontSize: '1.1rem',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {workflow.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          {getStatusChip(workflow.status)}
                          {getComplexityChip(workflow.complexity)}
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, workflow)}
                        size="small"
                        sx={{ ml: 1, flexShrink: 0 }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4
                    }}>
                      {workflow.description}
                    </Typography>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {workflow.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                      ))}
                      {workflow.tags.length > 3 && (
                        <Chip
                          label={`+${workflow.tags.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                      )}
                    </Box>

                    {/* Stats */}
                    <Divider sx={{ my: 1.5 }} />
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" fontWeight={600}>
                            {workflow.executions.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Runs
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" fontWeight={600} color={
                            workflow.successRate >= 95 ? 'success.main' : 
                            workflow.successRate >= 85 ? 'warning.main' : 'error.main'
                          }>
                            {workflow.successRate}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Success
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" fontWeight={600}>
                            {workflow.estimatedTime}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Duration
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Meta Info */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', mr: 1 }}>
                          {workflow.createdBy.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {workflow.createdBy}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(workflow.lastModified).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      fullWidth
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      startIcon={workflow.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                      fullWidth
                      variant="contained"
                      color={workflow.status === 'active' ? 'warning' : 'primary'}
                      onClick={handleToggleStatus}
                    >
                      {workflow.status === 'active' ? 'Pause' : 'Start'}
                    </Button>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          <CopyIcon sx={{ mr: 1, fontSize: 20 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedWorkflow?.status === 'active' ? (
            <>
              <PauseIcon sx={{ mr: 1, fontSize: 20 }} />
              Deactivate
            </>
          ) : (
            <>
              <PlayIcon sx={{ mr: 1, fontSize: 20 }} />
              Activate
            </>
          )}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedWorkflow?.name}"? This action cannot be undone.
          </Typography>
          {selectedWorkflow?.status === 'active' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This workflow is currently active and may affect ongoing processes.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Workflow
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Workflow Name"
                value={selectedWorkflow?.name || ''}
                onChange={(e) => setSelectedWorkflow(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={selectedWorkflow?.description || ''}
                onChange={(e) => setSelectedWorkflow(prev => 
                  prev ? { ...prev, description: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedWorkflow?.status || 'draft'}
                  label="Status"
                  onChange={(e: SelectChangeEvent) => setSelectedWorkflow(prev => 
                    prev ? { ...prev, status: e.target.value as Workflow['status'] } : null
                  )}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedWorkflow?.category || ''}
                  label="Category"
                  onChange={(e: SelectChangeEvent) => setSelectedWorkflow(prev => 
                    prev ? { ...prev, category: e.target.value } : null
                  )}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyWorkflows;
