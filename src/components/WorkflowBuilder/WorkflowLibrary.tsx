import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

interface WorkflowLibraryProps {
  onImportWorkflow: (workflow: any) => void;
}

const WorkflowLibrary: React.FC<WorkflowLibraryProps> = ({ onImportWorkflow }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [libraryWorkflows, setLibraryWorkflows] = useState([
    {
      id: 1,
      name: "Patient Registration Automation",
      description: "Streamline patient intake and registration process",
      category: "Patient Management",
      popularity: 95,
      difficulty: "Beginner",
      estimatedTime: "15 min",
      tags: ["Registration", "Intake", "Automation"],
      triggers: ["New patient form", "Insurance verification"],
      actions: ["Create patient record", "Schedule appointment", "Send welcome email"]
    },
    {
      id: 2,
      name: "Lab Results Notification",
      description: "Automatically notify providers when lab results are available",
      category: "Clinical",
      popularity: 88,
      difficulty: "Intermediate",
      estimatedTime: "20 min",
      tags: ["Lab Results", "Notifications", "Clinical"],
      triggers: ["Lab result received", "Critical value detected"],
      actions: ["Notify primary provider", "Flag urgent results", "Update patient chart"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [importDialog, setImportDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);

  const workflowsPerPage = 6;
  const categories = ['All', 'Patient Management', 'Clinical', 'Billing', 'Quality Assurance'];

  const handleImport = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setImportDialog(true);
  };

  const handleConfirmImport = () => {
    if (selectedWorkflow) {
      onImportWorkflow(selectedWorkflow);
      setImportDialog(false);
      setSelectedWorkflow(null);
    }
  };

  const filteredWorkflows = libraryWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || workflow.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredWorkflows.length / workflowsPerPage);
  const paginatedWorkflows = filteredWorkflows.slice(
    (currentPage - 1) * workflowsPerPage,
    currentPage * workflowsPerPage
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPopularityIcon = (popularity: number) => {
    if (popularity >= 90) return <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />;
    if (popularity >= 70) return <AssignmentIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
    return <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 700, mb: 1 }}>
            Clinical Workflow Library
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover and import pre-built clinical workflows
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexDirection={isMobile ? 'column' : 'row'}>
        <TextField
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Workflows Grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} width="80%" sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
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
              <Grid item xs={12} md={6} lg={4} key={workflow.id}>
                <Card 
                  sx={{ 
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {workflow.name}
                      </Typography>
                      {getPopularityIcon(workflow.popularity)}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                      {workflow.description}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Chip 
                        label={workflow.difficulty}
                        size="small"
                        color={getDifficultyColor(workflow.difficulty) as any}
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {workflow.estimatedTime}
                      </Typography>
                    </Box>

                    <Box mb={2}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Triggers:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {workflow.triggers.slice(0, 2).map((trigger, index) => (
                          <Chip 
                            key={index}
                            label={trigger}
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(bravoColors.primaryFlat, 0.1),
                              color: bravoColors.primaryFlat,
                              fontSize: '0.75rem'
                            }}
                          />
                        ))}
                        {workflow.triggers.length > 2 && (
                          <Chip 
                            label={`+${workflow.triggers.length - 2} more`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                      </Stack>
                    </Box>

                    <Box display="flex" alignItems="center" justifyContent="space-between" mt="auto">
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {workflow.popularity}% adoption
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleImport(workflow)}
                        sx={{
                          backgroundColor: bravoColors.secondary,
                          color: 'white',
                          borderRadius: 2,
                          px: 2,
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
          <Typography variant="body2" color="text.secondary">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'Browse available workflows in different categories'
            }
          </Typography>
        </Card>
      )}

      {/* Import Confirmation Dialog */}
      <Dialog open={importDialog} onClose={() => setImportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Import Workflow
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedWorkflow && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  This will add "{selectedWorkflow.name}" to your workflows. You can customize it after importing.
                </Typography>
              </Alert>
              
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Workflow Details:
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Category:</strong> {selectedWorkflow.category}
                </Typography>
                <Typography variant="body2">
                  <strong>Difficulty:</strong> {selectedWorkflow.difficulty}
                </Typography>
                <Typography variant="body2">
                  <strong>Setup Time:</strong> {selectedWorkflow.estimatedTime}
                </Typography>
              </Stack>

              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Included Components:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  • {selectedWorkflow.triggers.length} triggers
                </Typography>
                <Typography variant="body2">
                  • {selectedWorkflow.actions.length} actions
                </Typography>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmImport} 
            variant="contained"
            sx={{
              backgroundColor: bravoColors.primaryFlat,
              '&:hover': {
                backgroundColor: bravoColors.secondary
              }
            }}
          >
            Import Workflow
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
