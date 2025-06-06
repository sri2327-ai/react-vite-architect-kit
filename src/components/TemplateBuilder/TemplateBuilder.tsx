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
  ListItemButton,
  Menu,
  MenuItem,
  Divider,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import TemplateEditor from './TemplateEditor';
import ImprovedTemplateCreationDialog from './ImprovedTemplateCreationDialog';
import TemplateLibraryTab from './TemplateLibraryTab';
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
}

interface LibraryTemplate {
  id: string;
  title: string;
  specialty: string;
  noteType: string;
  content: string;
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
  
  // Menu states for edit/delete
  const [visitTypeMenuAnchor, setVisitTypeMenuAnchor] = useState<null | HTMLElement>(null);
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMenuVisitType, setSelectedMenuVisitType] = useState<VisitType | null>(null);
  const [selectedMenuTemplate, setSelectedMenuTemplate] = useState<TemplateData | null>(null);
  
  // Edit dialogs
  const [editVisitTypeDialog, setEditVisitTypeDialog] = useState(false);
  const [editTemplateDialog, setEditTemplateDialog] = useState(false);
  const [editingVisitTypeName, setEditingVisitTypeName] = useState('');
  const [editingTemplateName, setEditingTemplateName] = useState('');

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
      isNew: false
    },
    { 
      id: 2, 
      name: "CONSULTATION NOTE", 
      isNew: true
    },
    { 
      id: 3, 
      name: "PROCEDURE NOTE", 
      isNew: false
    },
    { 
      id: 4, 
      name: "H&P", 
      isNew: false
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
    setCurrentPage(1);
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

  // Enhanced template creation handler with better debugging
  const handleCreateTemplateFromDialog = (templateData: any) => {
    console.log('Creating template with full data:', templateData);
    setIsLoading(true);
    
    setTimeout(() => {
      // More robust content generation
      let content = '';
      let sections = [];
      
      if (templateData.sections && templateData.sections.length > 0) {
        // If sections are provided, use them
        sections = templateData.sections;
        content = templateData.sections.map((section: any) => `${section.name}:\n${section.description || section.content || '[To be filled]'}\n`).join('\n');
      } else if (templateData.templateType && templateData.templateType !== 'Custom') {
        // Generate from template service
        content = templateService.generateTemplateContent(templateData.templateType, templateData.customFields);
      } else {
        // Default content
        content = templateData.content || 'New template content';
      }
      
      // Create new template with robust data handling
      const newTemplate: TemplateData = {
        id: Date.now(),
        title: templateData.title || templateData.name || 'New Template',
        specialty: templateData.specialty || selectedVisitType?.name || 'General',
        type: selectedVisitType?.name || templateData.templateType || 'Custom',
        fields: templateData.fields || templateData.ehrFields || sections || [],
        content: content,
        lastUsed: 'Just created',
        usageCount: 0,
        isFavorite: false,
        createdBy: 'Current User',
        tags: templateData.tags || []
      };
      
      console.log('New template being created:', newTemplate);
      
      // Add template to the list
      setTemplates(prev => {
        const updatedTemplates = [...prev, newTemplate];
        console.log('Templates after update:', updatedTemplates);
        return updatedTemplates;
      });
      
      setIsLoading(false);
      setOpenCreateTemplate(false);
      
      // Show success message
      console.log('Template created successfully:', newTemplate);
    }, 300);
  };

  const handleAddType = () => {
    if (newTypeName.trim()) {
      const newType: VisitType = {
        id: visitTypes.length + 1,
        name: newTypeName.trim().toUpperCase(),
        isNew: true
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

  // Menu handlers
  const handleVisitTypeMenuClick = (event: React.MouseEvent<HTMLElement>, visitType: VisitType) => {
    event.stopPropagation();
    setVisitTypeMenuAnchor(event.currentTarget);
    setSelectedMenuVisitType(visitType);
  };

  const handleTemplateMenuClick = (event: React.MouseEvent<HTMLElement>, template: TemplateData) => {
    event.stopPropagation();
    setTemplateMenuAnchor(event.currentTarget);
    setSelectedMenuTemplate(template);
  };

  const handleMenuClose = () => {
    setVisitTypeMenuAnchor(null);
    setTemplateMenuAnchor(null);
    setSelectedMenuVisitType(null);
    setSelectedMenuTemplate(null);
  };

  // Edit/Delete handlers
  const handleEditVisitType = () => {
    if (selectedMenuVisitType) {
      setEditingVisitTypeName(selectedMenuVisitType.name);
      setEditVisitTypeDialog(true);
    }
    handleMenuClose();
  };

  const handleDeleteVisitType = () => {
    if (selectedMenuVisitType) {
      setVisitTypes(prev => prev.filter(vt => vt.id !== selectedMenuVisitType.id));
    }
    handleMenuClose();
  };

  const handleEditTemplate = () => {
    if (selectedMenuTemplate) {
      setEditingTemplateName(selectedMenuTemplate.title);
      setEditTemplateDialog(true);
    }
    handleMenuClose();
  };

  const handleDeleteTemplate = () => {
    if (selectedMenuTemplate) {
      setTemplates(prev => prev.filter(t => t.id !== selectedMenuTemplate.id));
    }
    handleMenuClose();
  };

  const handleSaveEditVisitType = () => {
    if (selectedMenuVisitType && editingVisitTypeName.trim()) {
      setVisitTypes(prev => prev.map(vt => 
        vt.id === selectedMenuVisitType.id 
          ? { ...vt, name: editingVisitTypeName.trim().toUpperCase() }
          : vt
      ));
      setEditVisitTypeDialog(false);
      setEditingVisitTypeName('');
    }
  };

  const handleSaveEditTemplate = () => {
    if (selectedMenuTemplate && editingTemplateName.trim()) {
      setTemplates(prev => prev.map(t => 
        t.id === selectedMenuTemplate.id 
          ? { ...t, title: editingTemplateName.trim() }
          : t
      ));
      setEditTemplateDialog(false);
      setEditingTemplateName('');
    }
  };

  // Handle adding template from library to visit type
  const handleAddLibraryTemplate = (libraryTemplate: LibraryTemplate, visitTypeName: string) => {
    const newTemplate: TemplateData = {
      id: templates.length + 1,
      title: libraryTemplate.title,
      specialty: libraryTemplate.specialty,
      type: visitTypeName,
      fields: [],
      content: libraryTemplate.content,
      lastUsed: 'Just added',
      usageCount: 0,
      isFavorite: false,
      createdBy: 'Library Import',
      tags: [libraryTemplate.specialty, libraryTemplate.noteType]
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    
    console.log(`Added template "${libraryTemplate.title}" to visit type "${visitTypeName}"`);
  };

  // Filter and search logic
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisitType = !selectedVisitType || template.type === selectedVisitType.name;
    return matchesSearch && matchesVisitType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * templatesPerPage,
    currentPage * templatesPerPage
  );

  // Render Visit Types Screen with edit/delete functionality
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

      <Paper elevation={1} sx={{ borderRadius: 3 }}>
        <List sx={{ p: 0 }}>
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
                      <Box display="flex" alignItems="center" justifyContent="space-between">
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
                        <IconButton
                          size="small"
                          onClick={(e) => handleVisitTypeMenuClick(e, visitType)}
                          sx={{ color: bravoColors.primaryFlat }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < visitTypes.length - 1 && (
                <Divider sx={{ mx: 3 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );

  // Render Templates Screen with edit/delete functionality
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
        <Paper elevation={1} sx={{ borderRadius: 3 }}>
          <List sx={{ p: 0 }}>
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
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {template.specialty} • {template.type}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
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
                        <IconButton
                          onClick={(e) => handleTemplateMenuClick(e, template)}
                          sx={{ color: bravoColors.primaryFlat }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
                {index < paginatedTemplates.length - 1 && (
                  <Divider sx={{ mx: 3 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
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
          <Tab label="TEMPLATE LIBRARY" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 0 && renderMyTemplatesContent()}
      {currentTab === 1 && (
        <TemplateLibraryTab 
          visitTypes={visitTypes.map(vt => vt.name)}
          onAddTemplate={handleAddLibraryTemplate}
        />
      )}

      {/* Enhanced Template Creation Dialog */}
      <ImprovedTemplateCreationDialog
        open={openCreateTemplate}
        onClose={() => {
          console.log('Closing template creation dialog');
          setOpenCreateTemplate(false);
        }}
        onCreateTemplate={handleCreateTemplateFromDialog}
      />

      {/* Enhanced Add Visit Type Dialog */}
      <Dialog 
        open={openAddType} 
        onClose={() => setOpenAddType(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            minHeight: '200px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: bravoColors.primaryFlat }}>
            Add New Visit Type
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Visit Type Name"
            fullWidth
            variant="outlined"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="e.g., Progress Note, Discharge Summary"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: bravoColors.primaryFlat
                  }
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenAddType(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              borderColor: bravoColors.primaryFlat,
              color: bravoColors.primaryFlat,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddType} 
            variant="contained"
            disabled={!newTypeName.trim()}
            sx={{ 
              borderRadius: 2,
              backgroundColor: bravoColors.primaryFlat,
              px: 3,
              '&:hover': {
                backgroundColor: bravoColors.secondary
              }
            }}
          >
            Add Visit Type
          </Button>
        </DialogActions>
      </Dialog>

      {/* Visit Type Menu */}
      <Menu
        anchorEl={visitTypeMenuAnchor}
        open={Boolean(visitTypeMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            borderRadius: 2,
            minWidth: 150,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem onClick={handleEditVisitType} sx={{ py: 1.5 }}>
          <EditIcon sx={{ mr: 2, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteVisitType} sx={{ py: 1.5, color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Template Menu */}
      <Menu
        anchorEl={templateMenuAnchor}
        open={Boolean(templateMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            borderRadius: 2,
            minWidth: 150,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem onClick={handleEditTemplate} sx={{ py: 1.5 }}>
          <EditIcon sx={{ mr: 2, fontSize: 20 }} />
          Edit Name
        </MenuItem>
        <MenuItem onClick={handleDeleteTemplate} sx={{ py: 1.5, color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Visit Type Dialog */}
      <Dialog 
        open={editVisitTypeDialog} 
        onClose={() => setEditVisitTypeDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            minHeight: '200px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: bravoColors.primaryFlat }}>
            Edit Visit Type
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Visit Type Name"
            fullWidth
            variant="outlined"
            value={editingVisitTypeName}
            onChange={(e) => setEditingVisitTypeName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: bravoColors.primaryFlat
                  }
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setEditVisitTypeDialog(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              borderColor: bravoColors.primaryFlat,
              color: bravoColors.primaryFlat,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEditVisitType} 
            variant="contained"
            disabled={!editingVisitTypeName.trim()}
            sx={{ 
              borderRadius: 2,
              backgroundColor: bravoColors.primaryFlat,
              px: 3,
              '&:hover': {
                backgroundColor: bravoColors.secondary
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog 
        open={editTemplateDialog} 
        onClose={() => setEditTemplateDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            minHeight: '200px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: bravoColors.primaryFlat }}>
            Edit Template Name
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            fullWidth
            variant="outlined"
            value={editingTemplateName}
            onChange={(e) => setEditingTemplateName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: bravoColors.primaryFlat
                  }
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setEditTemplateDialog(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              borderColor: bravoColors.primaryFlat,
              color: bravoColors.primaryFlat,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEditTemplate} 
            variant="contained"
            disabled={!editingTemplateName.trim()}
            sx={{ 
              borderRadius: 2,
              backgroundColor: bravoColors.primaryFlat,
              px: 3,
              '&:hover': {
                backgroundColor: bravoColors.secondary
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateBuilder;
