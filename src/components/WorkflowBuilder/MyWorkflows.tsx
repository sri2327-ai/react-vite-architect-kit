
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
  Grid
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as ImportIcon,
  CheckCircle as CheckIcon,
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
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon
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

interface MyWorkflowsProps {
  onEditWorkflow?: (workflow: Workflow) => void;
}

const mockUserWorkflows: Workflow[] = [
  {
    id: 'user-1',
    name: 'My Custom Patient Visit',
    description: 'Customized workflow for my standard patient check-ups with personalized templates.',
    category: 'General Medicine',
    ehrSystem: 'Epic',
    avgTimeSaved: '18-22 minutes',
    successRate: 97,
    trendingScore: 91,
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
      }
    ]
  },
  {
    id: 'user-2',
    name: 'Pediatric Vaccination - Modified',
    description: 'Modified version of the standard pediatric vaccination workflow with added safety checks.',
    category: 'Pediatrics',
    ehrSystem: 'Allscripts',
    avgTimeSaved: '15-20 minutes',
    successRate: 94,
    trendingScore: 87,
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
      }
    ]
  }
];

const MyWorkflows: React.FC<MyWorkflowsProps> = ({ onEditWorkflow }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEHR, setSelectedEHR] = useState('all');
  const [workflows, setWorkflows] = useState<Workflow[]>(mockUserWorkflows);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dynamicCategories = [...new Set(workflows.map(workflow => workflow.category))];
  const dynamicEHRSystems = [...new Set(workflows.map(workflow => workflow.ehrSystem))];

  const filteredWorkflows = workflows.filter(workflow => {
    const searchMatch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === 'all' || workflow.category === selectedCategory;
    const ehrMatch = selectedEHR === 'all' || workflow.ehrSystem === selectedEHR;
    return searchMatch && categoryMatch && ehrMatch;
  });

  const handleEdit = (workflow: Workflow) => {
    if (onEditWorkflow) {
      onEditWorkflow(workflow);
    }
    console.log('Edit workflow:', workflow);
  };

  const handleDelete = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    console.log('Delete workflow:', workflowId);
  };

  const handleRun = (workflow: Workflow) => {
    console.log('Run workflow:', workflow);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          My Workflows
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
          }}
        >
          Manage your custom automation workflows and templates
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
            <strong>Your Custom Workflows:</strong> Edit, delete, or run your personalized 
            automation workflows. Each workflow can be customized to fit your specific practice needs.
          </Typography>
        </Alert>
      </Box>

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
            placeholder="Search your workflows..."
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
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: { xs: '100%', sm: 150 },
              flex: { sm: 1 }
            }}
          >
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
        </Box>
      </Box>

      {/* Workflow Cards Grid */}
      <Grid container spacing={3}>
        {filteredWorkflows.map((workflow) => (
          <Grid xs={12} md={6} lg={4} key={workflow.id}>
            <Card 
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
                    Workflow Performance
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
                      <CheckIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
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
                        Performance Score: {workflow.trendingScore}
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
                    Workflow Steps ({workflow.blocks.length})
                  </Typography>
                  <List dense sx={{ py: 0 }}>
                    {workflow.blocks.slice(0, 2).map((block) => (
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
                    {workflow.blocks.length > 2 && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          display: 'block', 
                          textAlign: 'right',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      >
                        +{workflow.blocks.length - 2} more steps
                      </Typography>
                    )}
                  </List>
                </Box>
              </CardContent>
              
              {/* Action Buttons */}
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayIcon />}
                    onClick={() => handleRun(workflow)}
                    sx={{ 
                      flex: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Run
                  </Button>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(workflow)}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'primary.main',
                      borderRadius: 1
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(workflow.id)}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'error.main',
                      borderRadius: 1
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredWorkflows.length === 0 && (
        <Alert severity="warning" sx={{ mt: 3, fontSize: '1rem' }}>
          No workflows match your search criteria. Please adjust your search or filters.
        </Alert>
      )}

      {workflows.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <WorkflowIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Custom Workflows Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by importing a workflow from the library and customizing it to your needs.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default MyWorkflows;
