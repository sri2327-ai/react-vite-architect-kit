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
  alpha
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
import TemplateCard from './TemplateCard';
import TemplateFilters from './TemplateFilters';
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

interface ConsultType {
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
  const [currentScreen, setCurrentScreen] = useState<'consultTypes' | 'templates' | 'templateEditor' | 'templateView'>('consultTypes');
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultType | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<TemplateData | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);
  
  // Modal states
  const [openCreateTemplate, setOpenCreateTemplate] = useState(false);
  const [openAddType, setOpenAddType] = useState(false);
  const [sectionList, setSectionList] = useState<TemplateItem[]>([]);
  const [newTypeName, setNewTypeName] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'recent'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const templatesPerPage = 12;

  // Enhanced sample data with better clinical context
  const [consultTypes, setConsultTypes] = useState<ConsultType[]>([
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
  const handleConsultTypeSelect = (consultType: ConsultType) => {
    setSelectedConsultType(consultType);
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

  const handleBackToConsultTypes = () => {
    setCurrentScreen('consultTypes');
    setSelectedConsultType(null);
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
        specialty: templateData.specialty || selectedConsultType?.name || 'General',
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
      const newType: ConsultType = {
        id: consultTypes.length + 1,
        name: newTypeName.trim().toUpperCase(),
        isNew: true,
        templateCount: 0,
        description: `Custom ${newTypeName.trim()} documentation type`
      };
      setConsultTypes([...consultTypes, newType]);
      setNewTypeName('');
      setOpenAddType(false);
    }
  };

  const handleSaveTemplate = (items: TemplateItem[]) => {
    console.log('Saving template with items:', items);
    setSectionList(items);
    handleBackToTemplates();
  };

  const handleToggleFavorite = (template: TemplateData) => {
    setTemplates(prev => 
      prev.map(t => 
        t.id === template.id 
          ? { ...t, isFavorite: !t.isFavorite }
          : t
      )
    );
  };

  const handleCopyTemplate = (template: TemplateData) => {
    const copiedTemplate: TemplateData = {
      ...template,
      id: templates.length + 1,
      title: `${template.title} (Copy)`,
      lastUsed: 'Just created',
      usageCount: 0,
      isFavorite: false
    };
    setTemplates(prev => [...prev, copiedTemplate]);
  };

  // Filter and search logic
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || template.specialty === selectedSpecialty;
    const matchesType = selectedType === 'All Types' || template.type === selectedType;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => template.tags?.includes(tag));
    const matchesViewMode = viewMode === 'all' || 
                           (viewMode === 'favorites' && template.isFavorite) ||
                           (viewMode === 'recent' && template.lastUsed?.includes('day') || template.lastUsed?.includes('hour'));

    return matchesSearch && matchesSpecialty && matchesType && matchesTags && matchesViewMode;
  });

  // Sorting logic
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'usage':
        return (b.usageCount || 0) - (a.usageCount || 0);
      case 'specialty':
        return a.specialty.localeCompare(b.specialty);
      case 'recent':
      default:
        // Simple recent sorting (in real app, would use actual dates)
        return (b.usageCount || 0) - (a.usageCount || 0);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedTemplates.length / templatesPerPage);
  const paginatedTemplates = sortedTemplates.slice(
    (currentPage - 1) * templatesPerPage,
    currentPage * templatesPerPage
  );

  const hasActiveFilters = searchTerm || 
                          selectedSpecialty !== 'All Specialties' || 
                          selectedType !== 'All Types' || 
                          selectedTags.length > 0 ||
                          viewMode !== 'all';

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('All Specialties');
    setSelectedType('All Types');
    setSelectedTags([]);
    setViewMode('all');
    setSortBy('recent');
    setCurrentPage(1);
  };

  // Render Consult Types Screen with enhanced design
  const renderConsultTypes = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 700, mb: 1 }}>
            Template Categories
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a documentation type to view and manage your templates
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
          Add Category
        </Button>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: 3 
      }}>
        {consultTypes.map((consultType) => (
          <Card
            key={consultType.id}
            sx={{
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                borderColor: bravoColors.primaryFlat,
                boxShadow: '0 8px 25px rgba(20, 49, 81, 0.15)',
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => handleConsultTypeSelect(consultType)}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: bravoColors.primaryFlat,
                      fontWeight: 700,
                      fontSize: '1.3rem',
                      mb: 1
                    }}
                  >
                    {consultType.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {consultType.description}
                  </Typography>
                </Box>
                {consultType.isNew && (
                  <Chip
                    label="New"
                    size="small"
                    sx={{
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Box>
              
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  icon={<AssignmentIcon />}
                  label={`${consultType.templateCount} templates`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: bravoColors.secondary,
                    color: bravoColors.secondary
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  // Render Templates Screen with enhanced filters and cards
  const renderTemplates = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <IconButton 
              onClick={handleBackToConsultTypes}
              sx={{ 
                backgroundColor: alpha(bravoColors.primaryFlat, 0.1),
                '&:hover': { backgroundColor: alpha(bravoColors.primaryFlat, 0.2) }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 700 }}>
              {selectedConsultType?.name} Templates
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage your {selectedConsultType?.name.toLowerCase()} documentation templates
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

      {/* Template Statistics */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={3}>
          <Card sx={{ p: 2, borderRadius: 2, minWidth: 140 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <AssignmentIcon sx={{ color: bravoColors.primaryFlat }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {sortedTemplates.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Templates
                </Typography>
              </Box>
            </Box>
          </Card>
          
          <Card sx={{ p: 2, borderRadius: 2, minWidth: 140 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUpIcon sx={{ color: bravoColors.secondary }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {sortedTemplates.filter(t => t.isFavorite).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Favorites
                </Typography>
              </Box>
            </Box>
          </Card>

          <Card sx={{ p: 2, borderRadius: 2, minWidth: 140 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <ScheduleIcon sx={{ color: bravoColors.tertiary }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {sortedTemplates.filter(t => t.lastUsed?.includes('day') || t.lastUsed?.includes('hour')).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recently Used
                </Typography>
              </Box>
            </Box>
          </Card>
        </Stack>
      </Box>

      {/* Filters */}
      <TemplateFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={setSelectedSpecialty}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Summary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedTemplates.length} of {filteredTemplates.length} templates
          {hasActiveFilters && ' (filtered)'}
        </Typography>
      </Box>

      {/* Template Grid */}
      {isLoading ? (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: 3 
        }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={80} sx={{ mb: 2 }} />
                <Box display="flex" gap={1}>
                  <Skeleton variant="rectangular" width={80} height={32} />
                  <Skeleton variant="rectangular" width={80} height={32} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : paginatedTemplates.length > 0 ? (
        <>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: 3,
            mb: 4
          }}>
            {paginatedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onView={handleTemplateView}
                onEdit={handleTemplateEdit}
                onCopy={handleCopyTemplate}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    fontWeight: 600
                  },
                  '& .Mui-selected': {
                    backgroundColor: bravoColors.primaryFlat,
                    color: 'white'
                  }
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            No templates found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {hasActiveFilters 
              ? 'Try adjusting your filters or search terms'
              : 'Create your first template to get started'
            }
          </Typography>
          {hasActiveFilters ? (
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              sx={{ borderRadius: 2 }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => setOpenCreateTemplate(true)}
              sx={{ borderRadius: 2 }}
            >
              Create Template
            </Button>
          )}
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

    return renderConsultTypes();
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

      {/* Add Consult Type Dialog */}
      <Dialog open={openAddType} onClose={() => setOpenAddType(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Template Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="e.g., Progress Note, Discharge Summary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddType(false)}>Cancel</Button>
          <Button onClick={handleAddType} variant="contained">Add Category</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateBuilder;
