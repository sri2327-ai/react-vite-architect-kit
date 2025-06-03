import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Dialog,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button,
  Modal,
  Typography,
  Stack,
  DialogTitle,
  DialogContent,
  Divider,
  Autocomplete,
  useTheme,
  useMediaQuery,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  ReceiptLong as ReceiptLongIcon,
  Visibility as VisibilityIcon,
  DoDisturb as DoDisturbIcon,
  ArrowBack as ArrowBackIcon,
  AutoFixHigh as AutoFixHighIcon,
  EditNote as EditNoteIcon,
  ContentCopy as ContentCopyIcon,
  CopyAll as CopyAllIcon,
  LibraryBooks as LibraryBooksIcon,
  Description as DescriptionIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Circle as CircleIcon,
  Preview as PreviewIcon,
  Note as NoteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { bravoColors } from '@/theme/colors';
import TemplateEditor from './TemplateEditor';
import TemplateCreationDialog from './TemplateCreationDialog';
import { templateService } from '@/services/templateService';
import { templateBuilderService } from '@/services/templateBuilderService';

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
}

interface ConsultType {
  id: number;
  name: string;
  isNew?: boolean;
}

interface LibraryTemplate {
  id: number;
  name: string;
  specialty: string;
  noteType: string;
  content?: string;
}

const TemplateBuilder: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Tab state
  const [currentTab, setCurrentTab] = useState(0);
  
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<'consultTypes' | 'templates' | 'templateEditor' | 'templateView'>('consultTypes');
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultType | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<TemplateData | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);
  
  // Modal states
  const [openCreateTemplate, setOpenCreateTemplate] = useState(false);
  const [openModifyTemplate, setOpenModifyTemplate] = useState(false);
  const [openAddType, setOpenAddType] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [templateMethod, setTemplateMethod] = useState<any>({});
  const [sectionList, setSectionList] = useState<TemplateItem[]>([]);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Library and filter states
  const [libraryFilters, setLibraryFilters] = useState({
    specialty: '',
    noteType: ''
  });
  const [newTypeName, setNewTypeName] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<LibraryTemplate | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewType, setPreviewType] = useState<'template' | 'sample'>('template');
  const [openImportConfirm, setOpenImportConfirm] = useState(false);
  const [selectedImportType, setSelectedImportType] = useState<string>('');

  // Form controls
  const { control, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

  // Sample data with template service integration
  const [consultTypes, setConsultTypes] = useState<ConsultType[]>([
    { id: 1, name: "SOAP NOTE", isNew: true },
    { id: 2, name: "SOAP NOTE VIRTUAL", isNew: true },
  ]);

  const [templates, setTemplates] = useState<TemplateData[]>([
    {
      id: 1,
      title: "General Consultation",
      specialty: "General Medicine",
      type: "Standard",
      fields: [],
      content: templateService.generateTemplateContent('SOAP Note')
    },
    {
      id: 2,
      title: "Follow-up Visit",
      specialty: "General Medicine",
      type: "Follow-up",
      fields: [],
      content: templateService.generateTemplateContent('Progress Note')
    }
  ]);

  // Enhanced library templates using templateService
  const libraryTemplates: LibraryTemplate[] = [
    {
      id: 1,
      name: "Cardiology Consultation",
      specialty: "cardiologist",
      noteType: "Consultation Note",
      content: templateService.generateTemplateContent('Consultation Note', {
        reason: 'Cardiac evaluation',
        examination: 'Cardiovascular system examination',
        impression: 'Cardiac assessment findings',
        recommendations: 'Cardiology-specific recommendations'
      })
    },
    {
      id: 2,
      name: "Psychology Assessment",
      specialty: "psychologist",
      noteType: "SOAP Note",
      content: templateService.generateTemplateContent('SOAP Note', {
        chief_complaint: 'Mental health concerns',
        history_of_present_illness: 'Psychological history',
        physical_examination: 'Mental status examination',
        assessment: 'Psychological assessment',
        plan: 'Treatment plan and recommendations'
      })
    },
    {
      id: 3,
      name: "Dermatology Exam",
      specialty: "Dermatology",
      noteType: "SOAP Note",
      content: templateService.generateTemplateContent('SOAP Note', {
        chief_complaint: 'Skin concerns',
        physical_examination: 'Dermatological examination',
        assessment: 'Dermatologic diagnosis',
        plan: 'Treatment recommendations'
      })
    }
  ];

  // Initialize template service with library templates
  useEffect(() => {
    const initTemplates = libraryTemplates.map(template => ({
      title: template.noteType,
      sections: templateService.getEhrFieldMappings(template.noteType)?.ehrFields.map(field => ({
        name: field,
        type: 'text'
      })) || []
    }));
    templateService.registerLibraryTemplates(initTemplates);
  }, []);

  // Event handlers
  const handleConsultTypeSelect = (consultType: ConsultType) => {
    setSelectedConsultType(consultType);
    setCurrentScreen('templates');
  };

  const handleTemplateEdit = (template: TemplateData) => {
    setEditingTemplate(template);
    setCurrentScreen('templateEditor');
    
    // Convert template content to sections for the editor
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
  };

  const handleBackToTemplates = () => {
    setCurrentScreen('templates');
    setOpenModifyTemplate(false);
    setShowTemplate(false);
    setViewingTemplate(null);
    setEditingTemplate(null);
  };

  const handleCreateTemplateFromDialog = (templateData: any) => {
    // Enhanced template creation with template service
    let content = templateData.content;
    
    // If template type is specified, generate structured content
    if (templateData.templateType) {
      content = templateService.generateTemplateContent(templateData.templateType, templateData.customFields);
    }
    
    const newTemplate: TemplateData = {
      id: templates.length + 1,
      title: templateData.name,
      specialty: selectedConsultType?.name || 'General',
      type: templateData.templateType || 'Custom',
      fields: templateData.ehrFields || [],
      content: content || 'New template content'
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    
    // Register the new template type if it's custom
    if (templateData.templateType && !templateService.getEhrFieldMappings(templateData.templateType)) {
      templateService.addCustomTemplateMapping(
        templateData.templateType,
        templateData.ehrFields || ['Content'],
        templateData.workflowSteps
      );
    }
    
    console.log('Created new template with template service integration:', templateData);
  };

  const handleAddType = () => {
    if (newTypeName.trim()) {
      const newType: ConsultType = {
        id: consultTypes.length + 1,
        name: newTypeName.trim(),
        isNew: true
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

  const handleLibraryTemplatePreview = (template: LibraryTemplate) => {
    setPreviewTemplate(template);
    setOpenPreview(true);
  };

  const handleImportToMyTemplates = () => {
    if (previewTemplate) {
      setOpenPreview(false);
      setOpenImportConfirm(true);
    }
  };

  const handleConfirmImport = () => {
    if (previewTemplate && selectedImportType) {
      console.log("Importing template to:", selectedImportType, previewTemplate);
      setOpenImportConfirm(false);
      setSelectedImportType('');
      setPreviewTemplate(null);
    }
  };

  // Render Consult Types Screen
  const renderConsultTypes = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
          Consult Type List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddType(true)}
          sx={{
            backgroundColor: bravoColors.secondary,
            color: 'white',
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontSize: '0.9rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: bravoColors.primaryFlat,
            }
          }}
        >
          ADD TYPE
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {consultTypes.map((consultType) => (
          <Card
            key={consultType.id}
            sx={{
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-2px)',
              },
            }}
            onClick={() => handleConsultTypeSelect(consultType)}
          >
            <CardContent sx={{ py: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography
                  variant="h5"
                  sx={{
                    color: bravoColors.primaryFlat,
                    fontWeight: 600,
                    fontSize: '1.2rem'
                  }}
                >
                  {consultType.name}
                </Typography>
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
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  // Render Templates Screen
  const renderTemplates = () => (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
          {selectedConsultType?.name}
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToConsultTypes}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat,
              }
            }}
          >
            BACK
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateTemplate(true)}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat,
              }
            }}
          >
            ADD TEMPLATE
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {templates.map((template) => (
          <Card
            key={template.id}
            sx={{
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: bravoColors.primaryFlat,
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      mb: 1
                    }}
                  >
                    {template.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Specialty: {template.specialty} • Type: {template.type}
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <IconButton
                    onClick={() => handleTemplateView(template)}
                    sx={{
                      color: bravoColors.secondary,
                      '&:hover': {
                        backgroundColor: bravoColors.highlight?.hover || '#f0f0f0',
                      }
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleTemplateEdit(template)}
                    sx={{
                      color: bravoColors.primaryFlat,
                      '&:hover': {
                        backgroundColor: bravoColors.highlight?.hover || '#f0f0f0',
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
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

  // Render Template Library Tab
  const renderTemplateLibrary = () => (
    <Box>
      <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600, mb: 4 }}>
        Template Library
      </Typography>
      
      {/* Template Service Info */}
      <Card sx={{ mb: 3, p: 2, backgroundColor: bravoColors.background?.light || '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          Available Template Types
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {templateService.getTemplateTypes().map((type) => (
            <Chip 
              key={type}
              label={type}
              variant="outlined"
              size="small"
              sx={{ 
                borderColor: bravoColors.primaryFlat,
                color: bravoColors.primaryFlat
              }}
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Total workflow steps available: {templateService.getAllWorkflowSteps().length}
        </Typography>
      </Card>
      
      <Box display="flex" gap={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Specialty</InputLabel>
          <Select
            value={libraryFilters.specialty}
            label="Specialty"
            onChange={(e) => setLibraryFilters(prev => ({ ...prev, specialty: e.target.value }))}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="cardiologist">Cardiologist</MenuItem>
            <MenuItem value="psychologist">Psychologist</MenuItem>
            <MenuItem value="Dermatology">Dermatology</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Template Type</InputLabel>
          <Select
            value={libraryFilters.noteType}
            label="Template Type"
            onChange={(e) => setLibraryFilters(prev => ({ ...prev, noteType: e.target.value }))}
          >
            <MenuItem value="">All</MenuItem>
            {templateService.getTemplateTypes().map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3
        }}
      >
        {libraryTemplates
          .filter(template => {
            const specialtyMatch = !libraryFilters.specialty || template.specialty === libraryFilters.specialty;
            const noteTypeMatch = !libraryFilters.noteType || template.noteType === libraryFilters.noteType;
            return specialtyMatch && noteTypeMatch;
          })
          .map((template) => {
            const mapping = templateService.getEhrFieldMappings(template.noteType || '');
            return (
              <Card
                key={template.id}
                sx={{
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderColor: bravoColors.secondary
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: bravoColors.text?.primary || '#000' }}>
                    {template.name}
                  </Typography>
                  
                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip 
                      label={`Specialty: ${template.specialty}`} 
                      size="small" 
                      sx={{ 
                        backgroundColor: bravoColors.primaryFlat, 
                        color: 'white',
                        fontSize: '0.75rem'
                      }} 
                    />
                    <Chip 
                      label={`Type: ${template.noteType}`} 
                      size="small" 
                      sx={{ 
                        backgroundColor: bravoColors.secondary, 
                        color: 'white',
                        fontSize: '0.75rem'
                      }} 
                    />
                  </Box>

                  {mapping && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        EHR Fields: {mapping.ehrFields.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Workflow Steps: {mapping.workflowSteps.length}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box display="flex" gap={1} mt={3}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleLibraryTemplatePreview(template)}
                      sx={{
                        borderColor: bravoColors.secondary,
                        color: bravoColors.secondary,
                        '&:hover': {
                          borderColor: bravoColors.primaryFlat,
                          backgroundColor: bravoColors.background?.light || '#f0f0f0'
                        }
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setPreviewTemplate(template);
                        setOpenImportConfirm(true);
                      }}
                      sx={{
                        backgroundColor: bravoColors.primaryFlat,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: bravoColors.secondary
                        }
                      }}
                    >
                      Import
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
      </Box>
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
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(event, newValue) => setCurrentTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: bravoColors.text?.secondary || '#666',
              '&.Mui-selected': {
                color: bravoColors.primaryFlat,
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: bravoColors.primaryFlat,
              height: 3,
            }
          }}
        >
          <Tab label="My Templates" />
          <Tab label="Template Library" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 0 && renderMyTemplatesContent()}
      {currentTab === 1 && renderTemplateLibrary()}

      {/* Template Creation Dialog */}
      <TemplateCreationDialog
        open={openCreateTemplate}
        onClose={() => setOpenCreateTemplate(false)}
        onCreateTemplate={handleCreateTemplateFromDialog}
      />

      {/* Add Consult Type Dialog */}
      <Dialog open={openAddType} onClose={() => setOpenAddType(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Consult Type</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Consult Type Name"
            fullWidth
            variant="outlined"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddType(false)}>Cancel</Button>
          <Button onClick={handleAddType} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{previewTemplate?.name}</Typography>
            <Box>
              <Tabs value={previewType === 'template' ? 0 : 1} onChange={(e, v) => setPreviewType(v === 0 ? 'template' : 'sample')}>
                <Tab label="Template" />
                <Tab label="Sample Note" />
              </Tabs>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            p: 3, 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            backgroundColor: '#f8f9fa',
            minHeight: 300
          }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontFamily: 'monospace' }}>
              {previewType === 'template' 
                ? previewTemplate?.content || 'No template content available'
                : 'Sample clinical note would appear here based on the template structure...'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Close</Button>
          <Button onClick={handleImportToMyTemplates} variant="contained">
            Import to My Templates
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Import Confirmation Dialog */}
      <Dialog open={openImportConfirm} onClose={() => setOpenImportConfirm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Template</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Where would you like to import "{previewTemplate?.name}"?
          </Typography>
          
          {previewTemplate?.noteType && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Template Type: {previewTemplate.noteType}
              </Typography>
              {templateService.getEhrFieldMappings(previewTemplate.noteType) && (
                <Typography variant="body2" color="text.secondary">
                  Will include: {templateService.getEhrFieldMappings(previewTemplate.noteType)?.ehrFields.join(', ')}
                </Typography>
              )}
            </Box>
          )}
          
          <FormControl fullWidth>
            <InputLabel>Select Consult Type</InputLabel>
            <Select
              value={selectedImportType}
              onChange={(e) => setSelectedImportType(e.target.value)}
              label="Select Consult Type"
            >
              {consultTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImportConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmImport} variant="contained" disabled={!selectedImportType}>
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateBuilder;
