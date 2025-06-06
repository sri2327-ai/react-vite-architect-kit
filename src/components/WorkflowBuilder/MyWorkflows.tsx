import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Collapse
} from '@mui/material';
import {
  PlayCircle as PlayCircleIcon,
  StopCircle as StopCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  runs: number;
}

interface MyWorkflowsProps {
  sidebarCollapsed?: boolean;
}

const MyWorkflows: React.FC<MyWorkflowsProps> = ({ sidebarCollapsed = false }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Lead Qualification Workflow',
      description: 'Automatically qualifies leads based on predefined criteria.',
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      runs: 125
    },
    {
      id: '2',
      name: 'Customer Onboarding Sequence',
      description: 'A sequence of actions to onboard new customers effectively.',
      status: 'inactive',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-10',
      runs: 50
    },
    {
      id: '3',
      name: 'Email Marketing Campaign',
      description: 'Automated email campaign to engage potential customers.',
      status: 'draft',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-05',
      runs: 0
    },
    {
      id: '4',
      name: 'Sales Follow-up Workflow',
      description: 'Follow-up sequence for sales leads to close deals faster.',
      status: 'active',
      createdAt: '2024-04-01',
      updatedAt: '2024-04-12',
      runs: 200
    },
    {
      id: '5',
      name: 'Support Ticket Automation',
      description: 'Automatically assigns and categorizes support tickets.',
      status: 'inactive',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-08',
      runs: 75
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate available width based on sidebar state
  const sidebarWidth = sidebarCollapsed ? 72 : 280;
  const availableWidth = `calc(100vw - ${sidebarWidth}px)`;

  // More accurate responsive breakpoints considering sidebar
  const effectiveWidth = window.innerWidth - sidebarWidth;
  const useCardView = effectiveWidth < 900 || isMobile;
  const useCompactGrid = effectiveWidth < 1200;

  const summaryStats = [
    {
      title: 'Active Workflows',
      value: workflows.filter(wf => wf.status === 'active').length.toString(),
      subtitle: 'Currently running',
      icon: <PlayCircleIcon />,
      color: 'success.main'
    },
    {
      title: 'Inactive Workflows',
      value: workflows.filter(wf => wf.status === 'inactive').length.toString(),
      subtitle: 'Paused or completed',
      icon: <StopCircleIcon />,
      color: 'warning.main'
    },
    {
      title: 'Draft Workflows',
      value: workflows.filter(wf => wf.status === 'draft').length.toString(),
      subtitle: 'Under development',
      icon: <SettingsIcon />,
      color: 'primary.main'
    },
    {
      title: 'Total Workflows',
      value: workflows.length.toString(),
      subtitle: 'All time',
      icon: <TrendingUpIcon />,
      color: 'primary.main'
    }
  ];

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setNewWorkflowName('');
    setNewWorkflowDescription('');
  };

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim() === '') {
      alert('Workflow name is required.');
      return;
    }

    const newWorkflow: Workflow = {
      id: String(Date.now()),
      name: newWorkflowName,
      description: newWorkflowDescription,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runs: 0
    };

    setWorkflows([...workflows, newWorkflow]);
    handleCreateDialogClose();
  };

  const MobileWorkflowCard = ({ workflow }: { workflow: Workflow }) => {
    const isExpanded = expandedCard === workflow.id;

    return (
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  wordBreak: 'break-word'
                }}
              >
                {workflow.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                Created: {formatDate(workflow.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                Runs: {workflow.runs}
              </Typography>
              <Button
                size="small"
                onClick={() => setExpandedCard(isExpanded ? null : workflow.id)}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Button>
            </Box>
          </Box>

          <Collapse in={isExpanded}>
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                {workflow.description}
              </Typography>
              <Box sx={{
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<PlayCircleIcon />}
                  onClick={() => console.log('Run workflow', workflow.name)}
                  sx={{
                    flex: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Run
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => console.log('Edit workflow', workflow.name)}
                  sx={{
                    flex: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => console.log('Delete workflow', workflow.name)}
                  sx={{
                    flex: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ 
      width: availableWidth,
      maxWidth: '100%',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        p: { xs: 1, sm: 2, md: useCompactGrid ? 1.5 : 3 }
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: { xs: 2, md: 3 },
            textAlign: { xs: 'center', md: 'left' },
            fontSize: { 
              xs: '1.25rem', 
              sm: '1.5rem', 
              md: useCompactGrid ? '1.75rem' : '2rem' 
            }
          }}
        >
          My Workflows
        </Typography>

        {/* Summary Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: useCompactGrid ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
            md: useCompactGrid ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'
          }, 
          gap: { xs: 1, sm: useCompactGrid ? 1 : 1.5, md: useCompactGrid ? 1.5 : 2 }, 
          mb: { xs: 3, md: 4 }
        }}>
          {summaryStats.map((stat, index) => (
            <Card key={index} sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}>
              <CardContent sx={{ 
                p: { 
                  xs: 1, 
                  sm: useCompactGrid ? 1 : 1.5, 
                  md: useCompactGrid ? 1.5 : 2 
                } 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                  <Box sx={{ color: stat.color, mr: 1, flexShrink: 0 }}>
                    {stat.icon}
                  </Box>
                  <Typography 
                    variant={isMobile ? "caption" : "h6"} 
                    fontWeight={600}
                    sx={{ 
                      fontSize: { 
                        xs: '0.65rem', 
                        sm: '0.75rem', 
                        md: useCompactGrid ? '0.75rem' : '1.1rem'
                      },
                      lineHeight: { xs: 1.2, md: 1.4 },
                      wordBreak: 'break-word'
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
                <Typography 
                  variant={isMobile ? "h6" : "h4"} 
                  sx={{ 
                    color: stat.color, 
                    fontWeight: 700,
                    fontSize: { 
                      xs: '0.9rem', 
                      sm: '1.1rem', 
                      md: useCompactGrid ? '1.25rem' : '2rem'
                    }
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' },
                    lineHeight: 1.2
                  }}
                >
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Workflows Header and Controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            mb: { xs: 1, sm: 0 }
          }}>
            Manage Workflows
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <TextField
              size="small"
              placeholder="Search workflows..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{
                width: { xs: '100%', sm: 'auto', md: 240 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateDialogOpen}
              sx={{
                fontWeight: 600,
                borderRadius: 1,
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              Create Workflow
            </Button>
          </Box>
        </Box>

        {/* Workflow Listing or Cards */}
        {filteredWorkflows.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2, mt: 2 }}>
            No workflows found. Try adjusting your search or create a new workflow.
          </Alert>
        ) : (
          <Box>
            {useCardView ? (
              // Card View for narrow screens
              <Box>
                {filteredWorkflows.map((workflow) => (
                  <MobileWorkflowCard key={workflow.id} workflow={workflow} />
                ))}
              </Box>
            ) : (
              // Grid View for larger screens
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2
              }}>
                {filteredWorkflows.map((workflow) => (
                  <Card key={workflow.id} sx={{
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent sx={{
                      p: 2,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, fontSize: '1.1rem' }}>
                          {workflow.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                          {workflow.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Created: {formatDate(workflow.createdAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Runs: {workflow.runs}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{
                      p: 1,
                      display: 'flex',
                      justifyContent: 'space-around',
                      borderTop: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Tooltip title="Run Workflow">
                        <IconButton color="success" onClick={() => console.log('Run workflow', workflow.name)}>
                          <PlayCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Workflow">
                        <IconButton color="primary" onClick={() => console.log('Edit workflow', workflow.name)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Workflow">
                        <IconButton color="error" onClick={() => console.log('Delete workflow', workflow.name)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Create Workflow Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCreateDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New Workflow</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Workflow Name"
            fullWidth
            variant="outlined"
            value={newWorkflowName}
            onChange={(e) => setNewWorkflowName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newWorkflowDescription}
            onChange={(e) => setNewWorkflowDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button onClick={handleCreateWorkflow} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyWorkflows;
