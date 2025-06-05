
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme,
  Paper,
  Container
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useWorkflowData } from '../../hooks/useWorkflowData';
import { useApiContext } from '../../contexts/ApiContext';
import { templateBuilderService } from '../../services/templateBuilderService';
import { useResponsive } from '../../hooks/useResponsive';

interface MyWorkflowsProps {
  importedWorkflows: any[];
  setImportedWorkflows: React.Dispatch<React.SetStateAction<any[]>>;
}

const MyWorkflows: React.FC<MyWorkflowsProps> = ({ 
  importedWorkflows, 
  setImportedWorkflows 
}) => {
  const theme = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const { useApiData } = useApiContext();
  const {
    workflows: apiWorkflows,
    loading,
    error,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  } = useWorkflowData(useApiData);

  // Combine API workflows with imported workflows
  const allWorkflows = [...apiWorkflows, ...importedWorkflows];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    ehrSystem: '',
    availableVisitTypes: [] as string[],
    visitTypeMappings: [] as any[]
  });

  // Dynamic EHR systems - can be fetched from API
  const [ehrSystems, setEhrSystems] = useState([
    'Epic',
    'Cerner',
    'AllScripts',
    'eClinicalWorks',
    'NextGen',
    'Athenahealth',
    'Practice Fusion',
    'Other'
  ]);

  // Dynamic visit types from template service
  const [availableVisitTypes, setAvailableVisitTypes] = useState<string[]>([]);

  useEffect(() => {
    // Load dynamic data
    const visitTypes = templateBuilderService.getAllVisitTypeNames();
    setAvailableVisitTypes(visitTypes);
    
    // If using API, fetch EHR systems
    if (useApiData) {
      // This would fetch from API in real implementation
      // fetchEhrSystems().then(setEhrSystems);
    }
  }, [useApiData]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, workflow: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkflow(workflow);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkflow(null);
  };

  const handleCreateWorkflow = async () => {
    try {
      const workflowData = {
        ...newWorkflow,
        status: 'draft' as const,
        blocks: [],
        visitTypeMappings: availableVisitTypes.map(visitType => ({
          visitType,
          templateFields: {},
          scheduleConfig: {
            providerName: '',
            location: ''
          },
          isConfigured: false
        }))
      };

      if (useApiData) {
        await createWorkflow(workflowData);
      } else {
        // Add to imported workflows if not using API
        const newImportedWorkflow = {
          ...workflowData,
          id: `manual-${Date.now()}`,
          lastModified: new Date().toISOString(),
          isConfigured: false
        };
        setImportedWorkflows(prev => [...prev, newImportedWorkflow]);
      }

      setCreateDialogOpen(false);
      setNewWorkflow({
        name: '',
        description: '',
        ehrSystem: '',
        availableVisitTypes: [],
        visitTypeMappings: []
      });
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const handleConfigureWorkflow = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setConfigDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    try {
      if (useApiData) {
        await deleteWorkflow(workflowId);
      } else {
        // Remove from imported workflows
        setImportedWorkflows(prev => prev.filter(w => w.id !== workflowId));
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
    handleMenuClose();
  };

  const handleToggleStatus = async (workflow: any) => {
    const newStatus = workflow.status === 'active' ? 'paused' : 'active';
    try {
      if (useApiData) {
        await updateWorkflow(workflow.id, { status: newStatus });
      } else {
        // Update in imported workflows
        setImportedWorkflows(prev => 
          prev.map(w => w.id === workflow.id ? { ...w, status: newStatus } : w)
        );
      }
    } catch (error) {
      console.error('Failed to update workflow status:', error);
    }
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'paused': return theme.palette.warning.main;
      case 'draft': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'paused': return <PauseIcon sx={{ fontSize: 16 }} />;
      case 'draft': return <EditIcon sx={{ fontSize: 16 }} />;
      default: return <InfoIcon sx={{ fontSize: 16 }} />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Loading workflows...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: { xs: 2, md: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{ 
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            My Workflows
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            {allWorkflows.length} workflow{allWorkflows.length !== 1 ? 's' : ''} configured
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            borderRadius: { xs: 2, md: 3 },
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Create New Workflow
        </Button>
      </Box>

      {/* Workflows Grid */}
      {allWorkflows.length === 0 ? (
        <Paper 
          sx={{ 
            textAlign: 'center', 
            py: { xs: 6, md: 8 },
            px: { xs: 2, md: 4 },
            borderRadius: { xs: 2, md: 3 },
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.02)
          }}
        >
          <AssignmentIcon 
            sx={{ 
              fontSize: { xs: 60, md: 80 }, 
              color: alpha(theme.palette.primary.main, 0.3),
              mb: 2
            }} 
          />
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            No Workflows Yet
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.text.secondary,
              mb: { xs: 3, md: 4 },
              maxWidth: { xs: '100%', sm: 500 },
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              lineHeight: { xs: 1.4, md: 1.6 }
            }}
          >
            Create your first workflow to automate EHR tasks or import one from the Workflow Library.
          </Typography>
          <Button
            variant="contained"
            size={isMobile ? "medium" : "large"}
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              borderRadius: { xs: 2, md: 3 },
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Create Your First Workflow
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {allWorkflows.map((workflow) => (
            <Grid item xs={12} sm={6} lg={4} key={workflow.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: { xs: 2, md: 3 },
                  transition: 'all 0.3s ease',
                  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
                  {/* Card Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 2 
                  }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          mb: 0.5,
                          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {workflow.name}
                      </Typography>
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center"
                        flexWrap="wrap"
                        sx={{ gap: 1 }}
                      >
                        <Chip
                          icon={getStatusIcon(workflow.status)}
                          label={workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getStatusColor(workflow.status), 0.15),
                            color: getStatusColor(workflow.status),
                            fontWeight: 600,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                        <Chip
                          label={workflow.ehrSystem}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                      </Stack>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, workflow)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      mb: 2,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {workflow.description || 'No description provided'}
                  </Typography>

                  {/* Workflow Details Accordion */}
                  <Accordion 
                    elevation={0}
                    sx={{ 
                      backgroundColor: 'transparent',
                      '&:before': { display: 'none' },
                      '& .MuiAccordionSummary-root': {
                        px: 0,
                        minHeight: { xs: 32, sm: 40 }
                      }
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ 
                        '& .MuiAccordionSummary-content': { 
                          my: 0,
                          alignItems: 'center'
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        Workflow Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0, pt: 0 }}>
                      <Stack spacing={1.5}>
                        {/* Blocks */}
                        <Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          >
                            Blocks: {workflow.blocks?.length || 0}
                          </Typography>
                        </Box>

                        {/* Visit Types */}
                        <Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              display: 'block',
                              mb: 0.5,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          >
                            Visit Types:
                          </Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                            {workflow.availableVisitTypes?.slice(0, 3).map((visitType: string, index: number) => (
                              <Chip
                                key={index}
                                label={visitType}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                  height: { xs: 18, sm: 20 }
                                }}
                              />
                            ))}
                            {workflow.availableVisitTypes?.length > 3 && (
                              <Chip
                                label={`+${workflow.availableVisitTypes.length - 3}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                  height: { xs: 18, sm: 20 }
                                }}
                              />
                            )}
                          </Stack>
                        </Box>

                        {/* Last Modified */}
                        {workflow.lastModified && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: theme.palette.text.secondary,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          >
                            Modified: {new Date(workflow.lastModified).toLocaleDateString()}
                          </Typography>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>

                  {/* Action Buttons */}
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      startIcon={<SettingsIcon />}
                      onClick={() => handleConfigureWorkflow(workflow)}
                      sx={{
                        textTransform: 'none',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        px: { xs: 1, sm: 2 }
                      }}
                    >
                      Configure
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}
      >
        <MenuItem onClick={() => handleConfigureWorkflow(selectedWorkflow)}>
          <SettingsIcon sx={{ mr: 1, fontSize: 20 }} />
          Configure
        </MenuItem>
        <MenuItem onClick={() => handleToggleStatus(selectedWorkflow)}>
          {selectedWorkflow?.status === 'active' ? (
            <>
              <PauseIcon sx={{ mr: 1, fontSize: 20 }} />
              Pause
            </>
          ) : (
            <>
              <PlayIcon sx={{ mr: 1, fontSize: 20 }} />
              Activate
            </>
          )}
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDeleteWorkflow(selectedWorkflow?.id)}
          sx={{ color: theme.palette.error.main }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Workflow Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: { xs: '100vh', sm: '90vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}>
          Create New Workflow
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Workflow Name"
              value={newWorkflow.name}
              onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
            
            <TextField
              fullWidth
              label="Description"
              value={newWorkflow.description}
              onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
              multiline
              rows={3}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
            
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>EHR System</InputLabel>
              <Select
                value={newWorkflow.ehrSystem}
                label="EHR System"
                onChange={(e) => setNewWorkflow({...newWorkflow, ehrSystem: e.target.value})}
              >
                {ehrSystems.map((system) => (
                  <MenuItem key={system} value={system}>{system}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                Visit types and workflow blocks can be configured after creation.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setCreateDialogOpen(false)}
            size={isMobile ? "small" : "medium"}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateWorkflow}
            disabled={!newWorkflow.name || !newWorkflow.ehrSystem}
            size={isMobile ? "small" : "medium"}
          >
            Create Workflow
          </Button>
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog 
        open={configDialogOpen} 
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: { xs: '100vh', sm: '90vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}>
          Configure: {selectedWorkflow?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Advanced workflow configuration coming soon. This will include:
          </Typography>
          <Stack spacing={1} sx={{ ml: 2 }}>
            <Typography variant="body2">• Visit type mapping configuration</Typography>
            <Typography variant="body2">• Template field assignments</Typography>
            <Typography variant="body2">• Schedule and provider settings</Typography>
            <Typography variant="body2">• Workflow block sequencing</Typography>
            <Typography variant="body2">• AI automation rules</Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setConfigDialogOpen(false)}
            size={isMobile ? "small" : "medium"}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyWorkflows;
