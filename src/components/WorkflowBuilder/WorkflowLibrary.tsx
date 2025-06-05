import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
  Rating,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as DownloadIcon,
  Visibility as PreviewIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Schedule as TimeIcon,
  People as PeopleIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  rating: number;
  downloads: number;
  steps: number;
  image: string;
}

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: '1',
    name: 'Patient Intake Form',
    description: 'A comprehensive form to collect patient information during intake.',
    category: 'patient-intake',
    author: 'HealthAI',
    rating: 4.5,
    downloads: 120,
    steps: 5,
    image: '/images/workflow-templates/patient-intake.png',
  },
  {
    id: '2',
    name: 'SOAP Note Generator',
    description: 'Generates a structured SOAP note based on patient encounter details.',
    category: 'documentation',
    author: 'Dr. Smith',
    rating: 4.2,
    downloads: 95,
    steps: 4,
    image: '/images/workflow-templates/soap-note.png',
  },
  {
    id: '3',
    name: 'Billing Code Automation',
    description: 'Automatically suggests billing codes based on diagnosis and procedures.',
    category: 'billing',
    author: 'MedBill Solutions',
    rating: 4.8,
    downloads: 150,
    steps: 3,
    image: '/images/workflow-templates/billing-automation.png',
  },
  {
    id: '4',
    name: 'Follow-up Appointment Scheduler',
    description: 'Schedules follow-up appointments and sends reminders to patients.',
    category: 'follow-up',
    author: 'CareConnect',
    rating: 4.0,
    downloads: 80,
    steps: 6,
    image: '/images/workflow-templates/follow-up.png',
  },
  {
    id: '5',
    name: 'Medication Reconciliation',
    description: 'Reconciles patient medications to prevent errors and improve safety.',
    category: 'patient-intake',
    author: 'PharmaCheck',
    rating: 4.6,
    downloads: 110,
    steps: 4,
    image: '/images/workflow-templates/medication-reconciliation.png',
  },
  {
    id: '6',
    name: 'Discharge Summary Generator',
    description: 'Generates a detailed discharge summary for patients leaving the hospital.',
    category: 'documentation',
    author: 'Hospital Systems Inc.',
    rating: 4.3,
    downloads: 100,
    steps: 5,
    image: '/images/workflow-templates/discharge-summary.png',
  },
  {
    id: '7',
    name: 'Insurance Pre-authorization',
    description: 'Automates the process of obtaining pre-authorization for medical procedures.',
    category: 'billing',
    author: 'InsureFast',
    rating: 4.7,
    downloads: 130,
    steps: 3,
    image: '/images/workflow-templates/insurance-preauth.png',
  },
  {
    id: '8',
    name: 'Patient Satisfaction Survey',
    description: 'Collects patient feedback to improve the quality of care.',
    category: 'follow-up',
    author: 'QualityCare Solutions',
    rating: 4.1,
    downloads: 90,
    steps: 6,
    image: '/images/workflow-templates/patient-satisfaction.png',
  },
];

const WorkflowLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredWorkflows = workflowTemplates.filter((workflow) => {
    const searchMatch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = categoryFilter === 'all' || workflow.category === categoryFilter;
    return searchMatch && categoryMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'newest':
        return 0;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handlePreview = (workflow: WorkflowTemplate) => {
    setSelectedWorkflow(workflow);
    setPreviewOpen(true);
  };

  const handleImport = (workflow: WorkflowTemplate) => {
    console.log('Importing workflow:', workflow.name);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Search and Filter Section */}
      <Box sx={{ 
        mb: { xs: 3, sm: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 3 },
        alignItems: { xs: 'stretch', sm: 'center' }
      }}>
        <TextField
          fullWidth
          placeholder="Search workflow templates..."
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
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="patient-intake">Patient Intake</MenuItem>
            <MenuItem value="documentation">Documentation</MenuItem>
            <MenuItem value="billing">Billing</MenuItem>
            <MenuItem value="follow-up">Follow-up</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Workflow Templates Grid */}
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
                  <Chip 
                    label={workflow.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ 
                      fontSize: { xs: '0.7rem', md: '0.75rem' },
                      height: { xs: 24, md: 28 }
                    }}
                  />
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
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 2,
                  flexWrap: 'wrap'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating 
                      value={workflow.rating} 
                      readOnly 
                      size="small"
                      precision={0.1}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        ml: 0.5,
                        fontSize: { xs: '0.7rem', md: '0.75rem' }
                      }}
                    >
                      ({workflow.downloads})
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.7rem', md: '0.75rem' }
                    }}
                  >
                    By {workflow.author}
                  </Typography>
                  <Chip 
                    label={`${workflow.steps} steps`} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      fontSize: { xs: '0.7rem', md: '0.75rem' },
                      height: { xs: 20, md: 24 }
                    }}
                  />
                </Box>
              </CardContent>

              <CardActions sx={{ 
                p: { xs: 2, md: 3 }, 
                pt: 0,
                gap: 1
              }}>
                <Button 
                  size="small" 
                  startIcon={<PreviewIcon />}
                  onClick={() => handlePreview(workflow)}
                  sx={{ 
                    fontSize: { xs: '0.75rem', md: '0.875rem' }
                  }}
                >
                  Preview
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleImport(workflow)}
                  sx={{ 
                    fontSize: { xs: '0.75rem', md: '0.875rem' }
                  }}
                >
                  Import
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
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
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          fontWeight: 600,
          pb: 1
        }}>
          <Box>
            {selectedWorkflow?.name}
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              by {selectedWorkflow?.author}
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setPreviewOpen(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedWorkflow && (
            <Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  lineHeight: 1.6
                }}
              >
                {selectedWorkflow.description}
              </Typography>

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: { xs: 2, md: 3 }, 
                  mb: 3,
                  borderRadius: { xs: 2, md: 3 }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    fontWeight: 600
                  }}
                >
                  Workflow Steps
                </Typography>
                <List dense>
                  {Array.from({ length: selectedWorkflow.steps }, (_, i) => (
                    <ListItem key={i} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <CheckIcon 
                          color="primary" 
                          sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Step ${i + 1}: Sample workflow step`}
                        primaryTypographyProps={{
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon 
                    color="primary" 
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {selectedWorkflow.rating} rating
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon 
                    color="primary" 
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    {selectedWorkflow.downloads} downloads
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon 
                    color="primary" 
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    ~{selectedWorkflow.steps * 2} min setup
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setPreviewOpen(false)}
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Close
          </Button>
          <Button 
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              if (selectedWorkflow) {
                handleImport(selectedWorkflow);
                setPreviewOpen(false);
              }
            }}
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Import Workflow
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
