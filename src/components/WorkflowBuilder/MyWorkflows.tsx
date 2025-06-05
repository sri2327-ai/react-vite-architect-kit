
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid2 as Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
  Pagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

interface MyWorkflowsProps {
  importedWorkflows: any[];
  setImportedWorkflows: React.Dispatch<React.SetStateAction<any[]>>;
}

const MyWorkflows: React.FC<MyWorkflowsProps> = ({ importedWorkflows, setImportedWorkflows }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Patient Intake Workflow",
      description: "Automated patient registration and intake process",
      status: "active",
      lastRun: "2 hours ago",
      triggers: 3,
      actions: 7,
      category: "Patient Management"
    },
    {
      id: 2,
      name: "Lab Results Processing",
      description: "Process and notify lab results to providers",
      status: "paused",
      lastRun: "1 day ago",
      triggers: 2,
      actions: 5,
      category: "Clinical"
    }
  ]);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const workflowsPerPage = 6;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, workflow: any) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedWorkflow(workflow);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedWorkflow(null);
  };

  const handleEdit = () => {
    if (selectedWorkflow) {
      setEditingName(selectedWorkflow.name);
      setEditDialog(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialog(true);
    handleMenuClose();
  };

  const handleSaveEdit = () => {
    if (selectedWorkflow && editingName.trim()) {
      setWorkflows(prev => prev.map(w => 
        w.id === selectedWorkflow.id 
          ? { ...w, name: editingName.trim() }
          : w
      ));
      setEditDialog(false);
      setEditingName('');
    }
  };

  const handleConfirmDelete = () => {
    if (selectedWorkflow) {
      setWorkflows(prev => prev.filter(w => w.id !== selectedWorkflow.id));
    }
    setDeleteDialog(false);
  };

  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredWorkflows.length / workflowsPerPage);
  const paginatedWorkflows = filteredWorkflows.slice(
    (currentPage - 1) * workflowsPerPage,
    currentPage * workflowsPerPage
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'paused':
        return <PauseIcon sx={{ color: 'warning.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <ScheduleIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 700, mb: 1 }}>
            My Clinical Workflows
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor your automated clinical workflows
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: bravoColors.secondary,
            color: 'white',
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(56, 126, 137, 0.3)',
            '&:hover': {
              backgroundColor: bravoColors.primaryFlat,
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(56, 126, 137, 0.4)'
            }
          }}
        >
          Create Workflow
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search workflows..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Workflows Grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid xs={12} md={6} lg={4} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} width="80%" sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={40} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : paginatedWorkflows.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {paginatedWorkflows.map((workflow) => (
              <Grid xs={12} md={6} lg={4} key={workflow.id}>
                <Card 
                  sx={{ 
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {workflow.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {workflow.description}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, workflow)}
                        sx={{ color: bravoColors.primaryFlat }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      {getStatusIcon(workflow.status)}
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {workflow.status}
                      </Typography>
                    </Box>

                    <Stack spacing={1}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Triggers: {workflow.triggers}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Actions: {workflow.actions}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Last run: {workflow.lastRun}
                      </Typography>
                    </Stack>

                    <Box mt={2}>
                      <Chip 
                        label={workflow.category}
                        size="small"
                        sx={{ 
                          backgroundColor: alpha(bravoColors.primaryFlat, 0.1),
                          color: bravoColors.primaryFlat
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'white',
                    backgroundColor: bravoColors.primaryFlat,
                    '&:hover': {
                      backgroundColor: bravoColors.secondary,
                    },
                    '&.Mui-selected': {
                      backgroundColor: bravoColors.secondary,
                      color: 'white',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            No workflows found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first workflow to get started'
            }
          </Typography>
          <Button variant="contained" sx={{ borderRadius: 2 }}>
            Create Workflow
          </Button>
        </Card>
      )}

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            borderRadius: 2,
            minWidth: 150,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
          <EditIcon sx={{ mr: 2, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ py: 1.5, color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Workflow</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Workflow Name"
            fullWidth
            variant="outlined"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Workflow</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedWorkflow?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyWorkflows;
