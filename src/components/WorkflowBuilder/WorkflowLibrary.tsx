import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

interface WorkflowLibraryProps {
  onImportWorkflow: (workflow: any) => void;
}

const WorkflowLibrary: React.FC<WorkflowLibraryProps> = ({ onImportWorkflow }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const workflows = [
    {
      id: 1,
      name: "Patient Intake Automation",
      description: "Streamlines patient registration and initial assessment processes",
      category: "Patient Management",
      triggers: ["New patient registration", "Appointment scheduled"],
      actions: ["Send welcome email", "Create medical record", "Schedule intake call"],
      popularity: 95,
      rating: 4.8,
      usageCount: 1234,
      tags: ["intake", "automation", "patient-care"]
    },
    {
      id: 2,
      name: "Lab Results Notification",
      description: "Automatically notifies providers and patients of lab results",
      category: "Clinical",
      triggers: ["Lab results received", "Critical values detected"],
      actions: ["Notify provider", "Send patient portal message", "Create follow-up task"],
      popularity: 89,
      rating: 4.7,
      usageCount: 987,
      tags: ["lab-results", "notifications", "clinical"]
    },
    {
      id: 3,
      name: "Appointment Reminder System",
      description: "Sends automated reminders to reduce no-shows",
      category: "Scheduling",
      triggers: ["Appointment scheduled", "24 hours before appointment"],
      actions: ["Send SMS reminder", "Send email reminder", "Update patient status"],
      popularity: 78,
      rating: 4.6,
      usageCount: 765,
      tags: ["reminders", "scheduling", "patient-engagement"]
    }
  ];

  const categories = ['all', 'Patient Management', 'Clinical', 'Scheduling', 'Billing'];

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, workflow: any) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedWorkflow(workflow);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedWorkflow(null);
  };

  const handlePreview = () => {
    setPreviewDialog(true);
    handleMenuClose();
  };

  const handleImport = (workflow: any) => {
    onImportWorkflow(workflow);
    handleMenuClose();
  };

  const toggleFavorite = (workflowId: number) => {
    setFavorites(prev => 
      prev.includes(workflowId) 
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 700, mb: 1 }}>
            Workflow Library
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse and import pre-built clinical workflows
          </Typography>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <TextField
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Box display="flex" gap={1} flexWrap="wrap">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category === 'all' ? 'All Categories' : category}
              variant={selectedCategory === category ? "filled" : "outlined"}
              onClick={() => setSelectedCategory(category)}
              sx={{
                backgroundColor: selectedCategory === category ? bravoColors.primaryFlat : 'transparent',
                color: selectedCategory === category ? 'white' : bravoColors.primaryFlat,
                borderColor: bravoColors.primaryFlat,
                '&:hover': {
                  backgroundColor: selectedCategory === category ? bravoColors.secondary : alpha(bravoColors.primaryFlat, 0.1)
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Workflows Grid */}
      <Grid container spacing={3}>
        {filteredWorkflows.map((workflow) => (
          <Grid item xs={12} md={6} lg={4} key={workflow.id}>
            <Card 
              sx={{ 
                borderRadius: 3,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
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
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(workflow.id);
                      }}
                      sx={{ color: favorites.includes(workflow.id) ? 'warning.main' : 'text.secondary' }}
                    >
                      {favorites.includes(workflow.id) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, workflow)}
                      sx={{ color: bravoColors.primaryFlat }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Chip 
                    label={workflow.category}
                    size="small"
                    sx={{ 
                      backgroundColor: alpha(bravoColors.primaryFlat, 0.1),
                      color: bravoColors.primaryFlat,
                      mb: 1
                    }}
                  />
                </Box>

                <Stack spacing={1} mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Triggers:</strong> {workflow.triggers.length} configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Actions:</strong> {workflow.actions.length} automated
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Used by:</strong> {workflow.usageCount.toLocaleString()} organizations
                  </Typography>
                </Stack>

                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {workflow.rating}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImport(workflow);
                    }}
                    sx={{
                      backgroundColor: bravoColors.secondary,
                      '&:hover': {
                        backgroundColor: bravoColors.primaryFlat
                      }
                    }}
                  >
                    Import
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem onClick={handlePreview} sx={{ py: 1.5 }}>
          <VisibilityIcon sx={{ mr: 2, fontSize: 20 }} />
          Preview Details
        </MenuItem>
        <MenuItem onClick={() => handleImport(selectedWorkflow)} sx={{ py: 1.5 }}>
          <DownloadIcon sx={{ mr: 2, fontSize: 20 }} />
          Import Workflow
        </MenuItem>
      </Menu>

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialog} 
        onClose={() => setPreviewDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        {selectedWorkflow && (
          <>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedWorkflow.name}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedWorkflow.description}
              </Typography>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Triggers
                  </Typography>
                  <Stack spacing={1}>
                    {selectedWorkflow.triggers.map((trigger: string, index: number) => (
                      <Box key={index} display="flex" alignItems="center" gap={1}>
                        <PlayArrowIcon sx={{ fontSize: 16, color: bravoColors.secondary }} />
                        <Typography variant="body2">{trigger}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
                
                <Divider />
                
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Actions
                  </Typography>
                  <Stack spacing={1}>
                    {selectedWorkflow.actions.map((action: string, index: number) => (
                      <Box key={index} display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="body2">{action}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewDialog(false)}>
                Close
              </Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  handleImport(selectedWorkflow);
                  setPreviewDialog(false);
                }}
                sx={{ backgroundColor: bravoColors.primaryFlat }}
              >
                Import Workflow
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
