import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Dialog,
  Chip,
  Typography,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  IconButton,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
  Pagination,
  Skeleton,
  alpha,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import TemplateEditor from './TemplateEditor';
import ImprovedTemplateCreationDialog from './ImprovedTemplateCreationDialog';
import { templateService } from '@/services/templateService';

interface TemplateItem {
  id: string;
  name: string;
  content: string;
  type: string;
  description?: string;
  is_editing?: boolean;
  temp_description?: string;
  temp_template?: string;
  items?: Array<{
    name?: string;
    content: string;
  }>;
}

interface TemplateData {
  id: number;
  title: string;
  specialty: string;
  type: string;
  fields: any[];
  content?: string;
  lastUsed?: string;
  usageCount?: number;
  isFavorite?: boolean;
  createdBy?: string;
  tags?: string[];
}

interface VisitType {
  id: number;
  name: string;
  isNew?: boolean;
  templateCount?: number;
  description?: string;
}

const TemplateBuilder: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Tab and navigation state
  const [currentTab, setCurrentTab] = useState(0);
  const [currentScreen, setCurrentScreen] = useState<'visitTypes' | 'templates' | 'templateEditor' | 'templateView'>('visitTypes');
  const [selectedVisitType, setSelectedVisitType] = useState<VisitType | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<TemplateData | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);
  
  // Modal states
  const [openCreateTemplate, setOpenCreateTemplate] = useState(false);
  const [openAddType, setOpenAddType] = useState(false);
  const [sectionList, setSectionList] = useState<TemplateItem[]>([]);
  const [newTypeName, setNewTypeName] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const templatesPerPage = 12;

  // Enhanced sample data with better clinical context
  const [visitTypes, setVisitTypes] = useState<VisitType[]>([
    { 
      id: 1, 
      name: "SOAP NOTE", 
      isNew: false,
      templateCount: 12,
      description: "Subjective, Objective, Assessment, Plan documentation"
    },
    { 
      id: 2, 
      name: "CONSULTATION NOTE", 
      isNew: true,
      templateCount: 8,
      description: "Specialist consultation documentation"
    },
    { 
      id: 3, 
      name: "PROCEDURE NOTE", 
      isNew: false,
      templateCount: 15,
      description: "Medical procedure documentation"
    },
    { 
      id: 4, 
      name: "H&P", 
      isNew: false,
      templateCount: 6,
      description: "History and Physical examination"
    }
  ]);

  const [templates, setTemplates] = useState<TemplateData[]>([
    {
      id: 1,
      title: "Cardiology Consultation",
      specialty: "Cardiology",
      type: "Consultation",
      fields: [],
      content: templateService.generateTemplateContent('Consultation Note'),
      lastUsed: "2 days ago",
      usageCount: 45,
      isFavorite: true,
      createdBy: "Dr. Smith",
      tags: ["Cardiac", "Consultation", "New Patient"]
    },
    {
      id: 2,
      title: "General Medicine SOAP",
      specialty: "General Medicine",
      type: "SOAP",
      fields: [],
      content: templateService.generateTemplateContent('SOAP Note'),
      lastUsed: "1 day ago",
      usageCount: 89,
      isFavorite: false,
      createdBy: "Dr. Johnson",
      tags: ["Primary Care", "Routine", "Follow-up"]
    },
    {
      id: 3,
      title: "Dermatology Exam",
      specialty: "Dermatology",
      type: "SOAP",
      fields: [],
      content: templateService.generateTemplateContent('SOAP Note'),
      lastUsed: "5 days ago",
      usageCount: 23,
      isFavorite: true,
      createdBy: "Dr. Davis",
      tags: ["Dermatology", "Skin", "Annual Exam"]
    },
    {
      id: 4,
      title: "Emergency Department Note",
      specialty: "Emergency Medicine",
      type: "SOAP",
      fields: [],
      content: templateService.generateTemplateContent('SOAP Note'),
      lastUsed: "3 hours ago",
      usageCount: 156,
      isFavorite: false,
      createdBy: "Dr. Wilson",
      tags: ["Emergency", "Urgent Care", "Triage"]
    }
  ]);

  // Event handlers
  const handleVisitTypeSelect = (visitType: VisitType) => {
    setSelectedVisitType(visitType);
    setCurrentScreen('templates');
    setCurrentPage(1); // Reset pagination
  };

  const handleTemplateEdit = (template: TemplateData) => {
    setEditingTemplate(template);
    setCurrentScreen('templateEditor');
    
    const defaultSections: TemplateItem[] = [
      {
        id: 'section-1',
        name: 'Template Content',
        content: template.content || 'No content available',
        type: 'text'
      }
    ];
    setSectionList(defaultSections);
  };

  const handleTemplateView = (template: TemplateData) => {
    setViewingTemplate(template);
    setCurrentScreen('templateView');
  };

  const handleBackToVisitTypes = () => {
    setCurrentScreen('visitTypes');
    setSelectedVisitType(null);
    setCurrentPage(1);
  };

  const handleBackToTemplates = () => {
    setCurrentScreen('templates');
    setViewingTemplate(null);
    setEditingTemplate(null);
  };

  const handleCreateTemplateFromDialog = (templateData: any) => {
    setIsLoading(true);
    
    // Simulate creation delay
    setTimeout(() => {
      let content = templateData.content;
      
      if (templateData.templateType) {
        content = templateService.generateTemplateContent(templateData.templateType, templateData.customFields);
      }
      
      const newTemplate: TemplateData = {
        id: templates.length + 1,
        title: templateData.name,
        specialty: templateData.specialty || selectedVisitType?.name || 'General',
        type: templateData.templateType || 'Custom',
        fields: templateData.ehrFields || [],
        content: content || 'New template content',
        lastUsed: 'Just created',
        usageCount: 0,
        isFavorite: false,
        createdBy: 'Current User',
        tags: templateData.tags || []
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      setIsLoading(false);
      
      console.log('Created new template:', templateData);
    }, 1500);
  };

  const handleAddType = () => {
    if (newTypeName.trim()) {
      const newType: VisitType = {
        id: visitTypes.length + 1,
        name: newTypeName.trim().toUpperCase(),
        isNew: true,
        templateCount: 0,
        description: `Custom ${newTypeName.trim()} documentation type`
      };
      setVisitTypes([...visitTypes, newType]);
      setNewTypeName('');
      setOpenAddType(false);
    }
  };

  const handleSaveTemplate = (items: TemplateItem[]) => {
    console.log('Saving template with items:', items);
    setSectionList(items);
    handleBackToTemplates();
  };

  // Filter and search logic
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * templatesPerPage,
    currentPage * templatesPerPage
  );

  // Render Visit Types Screen with simplified design
  const renderVisitTypes = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 700, mb: 1 }}>
            Visit Types
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a visit type to view and manage your templates
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddType(true)}
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
          Add Visit Type
        </Button>
      </Box>

      <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
        {visitTypes.map((visitType, index) => (
          <React.Fragment key={visitType.id}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleVisitTypeSelect(visitType)}
                sx={{
                  py: 3,
                  px: 3,
                  '&:hover': {
                    backgroundColor: alpha(bravoColors.primaryFlat, 0.05)
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: bravoColors.primaryFlat,
                        fontSize: '1.1rem'
                      }}
                    >
                      {visitType.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            {index < visitTypes.length - 1 && (
              <Box sx={{ px: 3 }}>
                <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
              </Box>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  // Render Templates Screen with simplified design
  const renderTemplates = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <IconButton 
              onClick={handleBackToVisitTypes}
              sx={{ 
                backgroundColor: alpha(bravoColors.primaryFlat, 0.1),
                '&:hover': { backgroundColor: alpha(bravoColors.primaryFlat, 0.2) }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 700 }}>
              {selectedVisitType?.name} Templates
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Click add template to create a new template
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateTemplate(true)}
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
          Create Template
        </Button>
      </Box>

      {/* Search Bar Only */}
      <TextField
        fullWidth
        placeholder="Search templates by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.default',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: bravoColors.primaryFlat
              }
            }
          }
        }}
      />

      {/* Simple Template List */}
      {isLoading ? (
        <Box>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="60%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : paginatedTemplates.length > 0 ? (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          {paginatedTemplates.map((template, index) => (
            <React.Fragment key={template.id}>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleTemplateView(template)}
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      backgroundColor: alpha(bravoColors.primaryFlat, 0.05)
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} sx={{ flex: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: bravoColors.primaryFlat,
                          fontSize: '1.1rem'
                        }}
                      >
                        {template.title}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateEdit(template);
                      }}
                      sx={{
                        backgroundColor: bravoColors.primaryFlat,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: bravoColors.primaryDark
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </ListItemButton>
              </ListItem>
              {index < paginatedTemplates.length - 1 && (
                <Box sx={{ px: 3 }}>
                  <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
                </Box>
              )}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            No templates found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first template to get started'
            }
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setOpenCreateTemplate(true)}
            sx={{ borderRadius: 2 }}
          >
            Create Template
          </Button>
        </Card>
      )}
    </Box>
  );

  // Render Template View Screen
  const renderTemplateView = () => (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton 
          onClick={handleBackToTemplates}
          sx={{ mr: 2, color: bravoColors.primaryFlat }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
          Template: {viewingTemplate?.title}
        </Typography>
      </Box>
      
      {viewingTemplate && (
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Template Content:
          </Typography>
          <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {viewingTemplate.content || 'No content available for this template.'}
            </Typography>
          </Box>
          
          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => handleTemplateEdit(viewingTemplate)}
              sx={{
                backgroundColor: bravoColors.primaryFlat,
                color: 'white',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: '0.9rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: bravoColors.secondary,
                }
              }}
            >
              EDIT TEMPLATE
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );

  // Main render logic for My Templates tab
  const renderMyTemplatesContent = () => {
    if (currentScreen === 'templateEditor' && editingTemplate) {
      return (
        <Box>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton 
              onClick={handleBackToTemplates}
              sx={{ mr: 2, color: bravoColors.primaryFlat }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Template Editor: {editingTemplate.title}
            </Typography>
          </Box>
          
          <TemplateEditor 
            initialItems={sectionList}
            onSave={handleSaveTemplate}
          />
        </Box>
      );
    }

    if (currentScreen === 'templateView') {
      return renderTemplateView();
    }

    if (currentScreen === 'templates') {
      return renderTemplates();
    }

    return renderVisitTypes();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={currentTab} 
          onChange={(event, newValue) => setCurrentTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              color: bravoColors.text?.secondary || '#666',
              px: 4,
              py: 2,
              '&.Mui-selected': {
                color: bravoColors.primaryFlat,
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: bravoColors.primaryFlat,
              height: 3,
              borderRadius: 2
            }
          }}
        >
          <Tab label="My Templates" />
          <Tab label="Template Library" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 0 && renderMyTemplatesContent()}
      {currentTab === 1 && (
        <Alert severity="info" sx={{ textAlign: 'center' }}>
          Template Library functionality will be implemented here
        </Alert>
      )}

      {/* Enhanced Template Creation Dialog */}
      <ImprovedTemplateCreationDialog
        open={openCreateTemplate}
        onClose={() => setOpenCreateTemplate(false)}
        onCreateTemplate={handleCreateTemplateFromDialog}
      />

      {/* Add Visit Type Dialog */}
      <Dialog open={openAddType} onClose={() => setOpenAddType(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Visit Type</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Visit Type Name"
            fullWidth
            variant="outlined"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="e.g., Progress Note, Discharge Summary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddType(false)}>Cancel</Button>
          <Button onClick={handleAddType} variant="contained">Add Visit Type</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateBuilder;
