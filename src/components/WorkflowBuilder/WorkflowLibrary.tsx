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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  Container,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  LibraryBooks as LibraryBooksIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useWorkflowData } from '../../hooks/useWorkflowData';
import { useApiContext } from '../../contexts/ApiContext';
import { useResponsive } from '../../hooks/useResponsive';

interface WorkflowLibraryProps {
  onImportWorkflow: (workflow: any) => void;
}

interface LibraryWorkflow {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  tags: string[];
  isPopular?: boolean;
  blocks: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    order: number;
  }>;
  downloadCount?: number;
  rating?: number;
  category?: string;
}

const WorkflowLibrary: React.FC<WorkflowLibraryProps> = ({ onImportWorkflow }) => {
  const theme = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const { useApiData } = useApiContext();
  const { libraryWorkflows, loading } = useWorkflowData(useApiData);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEhrSystem, setSelectedEhrSystem] = useState('all');
  const [viewBlocksDialog, setViewBlocksDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<LibraryWorkflow | null>(null);

  // Enhanced library workflows with more dynamic data
  const [enhancedLibraryWorkflows, setEnhancedLibraryWorkflows] = useState<LibraryWorkflow[]>([]);

  // Dynamic categories and EHR systems
  const [categories, setCategories] = useState([
    'Clinical Documentation',
    'Pre-Visit Planning', 
    'Post-Visit Tasks',
    'Administrative',
    'Quality Measures',
    'Patient Communication'
  ]);

  const [ehrSystems, setEhrSystems] = useState([
    'Epic', 'Cerner', 'AllScripts', 'eClinicalWorks', 'NextGen', 'Athenahealth'
  ]);

  useEffect(() => {
    // Enhance library workflows with additional dynamic data
    const enhanced = libraryWorkflows.map((workflow, index) => ({
      ...workflow,
      downloadCount: Math.floor(Math.random() * 1000) + 50,
      rating: (Math.random() * 2 + 3).toFixed(1),
      category: categories[index % categories.length],
      blocks: [
        {
          id: '1',
          name: 'Patient Chart Review',
          description: 'Review patient chart and previous visit notes',
          type: 'review',
          order: 1
        },
        {
          id: '2', 
          name: 'Template Population',
          description: 'Auto-populate visit template with patient data',
          type: 'template',
          order: 2
        },
        {
          id: '3',
          name: 'Clinical Decision Support',
          description: 'Apply clinical guidelines and decision rules',
          type: 'decision',
          order: 3
        },
        {
          id: '4',
          name: 'Documentation Generation',
          description: 'Generate clinical documentation from visit data',
          type: 'documentation',
          order: 4
        }
      ]
    }));
    setEnhancedLibraryWorkflows(enhanced);

    // If using API, fetch dynamic data
    if (useApiData) {
      // fetchCategories().then(setCategories);
      // fetchEhrSystems().then(setEhrSystems);
    }
  }, [libraryWorkflows, useApiData]);

  // Filter workflows based on search and filters
  const filteredWorkflows = enhancedLibraryWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;
    const matchesEhrSystem = selectedEhrSystem === 'all' || workflow.ehrSystem === selectedEhrSystem;

    return matchesSearch && matchesCategory && matchesEhrSystem;
  });

  const handleViewBlocks = (workflow: LibraryWorkflow) => {
    setSelectedWorkflow(workflow);
    setViewBlocksDialog(true);
  };

  const handleImport = (workflow: LibraryWorkflow) => {
    onImportWorkflow(workflow);
    // Close dialog if open
    if (viewBlocksDialog) {
      setViewBlocksDialog(false);
    }
  };

  const getBlockTypeColor = (type: string) => {
    const gradients = [
      `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
      `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.dark, 0.9)} 100%)`,
      `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.8)} 0%, ${alpha(theme.palette.success.dark, 0.9)} 100%)`,
      `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.8)} 0%, ${alpha(theme.palette.warning.dark, 0.9)} 100%)`,
      `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.8)} 0%, ${alpha(theme.palette.info.dark, 0.9)} 100%)`
    ];
    
    const typeIndex = ['review', 'template', 'decision', 'documentation', 'other'].indexOf(type);
    return gradients[typeIndex] || gradients[0];
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedEhrSystem('all');
  };

  const popularWorkflows = enhancedLibraryWorkflows.filter(w => w.isPopular);

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}
        >
          Workflow Library
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary,
            mb: { xs: 2, md: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Choose from pre-built workflows or customize them for your practice
        </Typography>

        {/* Search and Filters */}
        <Paper 
          sx={{ 
            p: { xs: 2, md: 3 },
            borderRadius: { xs: 2, md: 3 },
            backgroundColor: alpha(theme.palette.background.default, 0.7),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Stack spacing={{ xs: 2, md: 3 }}>
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: { xs: 2, md: 3 },
                  backgroundColor: theme.palette.background.paper
                }
              }}
            />

            {/* Filter Chips */}
            <Box>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={{ xs: 2, sm: 3 }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
              >
                {/* Category Filter */}
                <Box sx={{ minWidth: { sm: 200 } }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      display: 'block',
                      color: 'text.primary',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  >
                    Category
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    <Chip
                      label="All"
                      onClick={() => setSelectedCategory('all')}
                      variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
                      size="small"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    />
                    {categories.slice(0, isMobile ? 2 : 4).map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => setSelectedCategory(category)}
                        variant={selectedCategory === category ? 'filled' : 'outlined'}
                        size="small"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* EHR System Filter */}
                <Box sx={{ minWidth: { sm: 150 } }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      display: 'block',
                      color: 'text.primary',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  >
                    EHR System
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    <Chip
                      label="All"
                      onClick={() => setSelectedEhrSystem('all')}
                      variant={selectedEhrSystem === 'all' ? 'filled' : 'outlined'}
                      size="small"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    />
                    {ehrSystems.slice(0, isMobile ? 2 : 3).map((system) => (
                      <Chip
                        key={system}
                        label={system}
                        onClick={() => setSelectedEhrSystem(system)}
                        variant={selectedEhrSystem === system ? 'filled' : 'outlined'}
                        size="small"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory !== 'all' || selectedEhrSystem !== 'all') && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    startIcon={<FilterListIcon />}
                    onClick={clearFilters}
                    sx={{ 
                      textTransform: 'none',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              )}
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Popular Workflows Section */}
      {popularWorkflows.length > 0 && searchTerm === '' && selectedCategory === 'all' && selectedEhrSystem === 'all' && (
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <TrendingUpIcon sx={{ color: theme.palette.warning.main }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
              }}
            >
              Popular Workflows
            </Typography>
          </Stack>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {popularWorkflows.slice(0, isMobile ? 2 : 3).map((workflow) => (
              <Grid item xs={12} sm={6} md={4} key={`popular-${workflow.id}`}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: { xs: 2, md: 3 },
                    border: `2px solid ${theme.palette.warning.light}`,
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  {/* Popular Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: 16,
                      backgroundColor: theme.palette.warning.main,
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <StarIcon sx={{ fontSize: 16 }} />
                    Popular
                  </Box>

                  <CardContent sx={{ p: { xs: 2, md: 3 }, pt: { xs: 3, md: 4 } }}>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                      }}
                    >
                      {workflow.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        mb: 2,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }}
                    >
                      {workflow.description}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 2 }}>
                      <Chip
                        label={workflow.ehrSystem}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      />
                      {workflow.tags.slice(0, 2).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        />
                      ))}
                    </Stack>

                    <Stack direction="row" spacing={1} justifyContent="space-between">
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewBlocks(workflow)}
                        sx={{
                          textTransform: 'none',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      >
                        View Blocks
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleImport(workflow)}
                        sx={{
                          textTransform: 'none',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                        }}
                      >
                        Import
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* All Workflows */}
      <Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
          }}
        >
          All Workflows ({filteredWorkflows.length})
        </Typography>

        {filteredWorkflows.length === 0 ? (
          <Paper 
            sx={{ 
              textAlign: 'center', 
              py: { xs: 6, md: 8 },
              borderRadius: { xs: 2, md: 3 },
              backgroundColor: alpha(theme.palette.info.main, 0.02),
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}
          >
            <LibraryBooksIcon 
              sx={{ 
                fontSize: { xs: 60, md: 80 }, 
                color: alpha(theme.palette.info.main, 0.3),
                mb: 2
              }} 
            />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ 
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              No Workflows Found
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary,
                mb: 3,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Try adjusting your search terms or filters
            </Typography>
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{
                textTransform: 'none',
                borderRadius: { xs: 2, md: 3 }
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {filteredWorkflows.map((workflow) => (
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
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      mb: 2 
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          lineHeight: 1.3,
                          flex: 1
                        }}
                      >
                        {workflow.name}
                      </Typography>
                      {workflow.isPopular && (
                        <StarIcon 
                          sx={{ 
                            color: theme.palette.warning.main,
                            ml: 1,
                            fontSize: { xs: 16, sm: 20 }
                          }} 
                        />
                      )}
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        mb: 2,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        lineHeight: 1.5
                      }}
                    >
                      {workflow.description}
                    </Typography>

                    {/* Category and EHR System */}
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 2 }}>
                      <Chip
                        label={workflow.category}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      />
                      <Chip
                        label={workflow.ehrSystem}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                      />
                    </Stack>

                    {/* Tags */}
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5, mb: 2 }}>
                      {workflow.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                      ))}
                    </Stack>

                    {/* Stats */}
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          ⭐ {workflow.rating} • 📥 {workflow.downloadCount}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewBlocks(workflow)}
                        sx={{
                          textTransform: 'none',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          flex: 1
                        }}
                      >
                        View Blocks
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleImport(workflow)}
                        sx={{
                          textTransform: 'none',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          flex: 1
                        }}
                      >
                        Import
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* View Blocks Dialog */}
      <Dialog 
        open={viewBlocksDialog} 
        onClose={() => setViewBlocksDialog(false)}
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
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedWorkflow?.name} - Workflow Blocks
          </Typography>
          <IconButton onClick={() => setViewBlocksDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            This workflow contains {selectedWorkflow?.blocks?.length || 0} automated blocks that will execute in sequence.
          </Alert>

          <Stack spacing={2}>
            {selectedWorkflow?.blocks?.map((block, index) => (
              <Card 
                key={block.id}
                sx={{ 
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    background: getBlockTypeColor(block.type),
                    p: { xs: 1.5, md: 2 },
                    color: 'white'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: { xs: 32, md: 40 },
                        height: { xs: 32, md: 40 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 0.5,
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }}
                      >
                        {block.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        {block.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setViewBlocksDialog(false)}
            size={isMobile ? "small" : "medium"}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={() => selectedWorkflow && handleImport(selectedWorkflow)}
            size={isMobile ? "small" : "medium"}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
            }}
          >
            Import This Workflow
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkflowLibrary;
