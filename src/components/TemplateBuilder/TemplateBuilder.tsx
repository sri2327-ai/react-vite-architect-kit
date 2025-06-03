
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  FileCopy as CopyIcon,
  GetApp as ExportIcon,
  Publish as PublishIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import DraggableGrid from './DraggableGrid';
import { Template, TemplateSection, TemplateField, EditorTemplate, EditorTemplateSection, EditorTemplateField } from './types';
import TemplateEditor from './TemplateEditor';
import { templateService } from '../../services/templateService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`template-tabpanel-${index}`}
      aria-labelledby={`template-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `template-tab-${index}`,
    'aria-controls': `template-tabpanel-${index}`,
  };
}

const initialTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Patient Intake Form',
    description: 'Standard form for new patient information',
    sections: [
      {
        id: 'section-1',
        title: 'Personal Information',
        description: 'Enter your basic details',
        content: 'Please fill out all required fields.',
        type: 'text',
        fields: [
          {
            id: 'field-1',
            type: 'TEXT',
            label: 'First Name',
            placeholder: 'Enter your first name',
            required: true,
            validation: { maxLength: 50 },
            description: 'Your given name'
          },
          {
            id: 'field-2',
            type: 'TEXT',
            label: 'Last Name',
            placeholder: 'Enter your last name',
            required: true,
            validation: { maxLength: 50 },
            description: 'Your family name'
          }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Template Library Data from TemplateLibrary.jsx
const templateLibraryData = [
  { id: 1, title: "CLINICAL INTERVIEW1", specialty: "cardiologist", type: "SOAP", fields: [] },
  { id: 2, title: "CLINICAL INTERVIEW2", specialty: "psychologist", type: "SOAP", fields: [] },
  { id: 3, title: "CLINICAL INTERVIEW3", specialty: "cardiologist", type: "DPD", fields: [] },
  { id: 4, title: "Dermatology Intake", specialty: "Dermatology", type: "SOAP", fields: [] },
  { id: 5, title: "Neurology Followup", specialty: "psychologist", type: "SOAP", fields: [] },
  { id: 6, title: "Dermatology Intake1", specialty: "cardiologist", type: "DPD", fields: [] },
];

const TemplateBuilder: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [currentTemplate, setCurrentTemplate] = useState<EditorTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EditorTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showLibraryPreview, setShowLibraryPreview] = useState(false);
  const [selectedLibraryTemplate, setSelectedLibraryTemplate] = useState<any>(null);
  const [exportDialog, setExportDialog] = useState(false);
  const [publishDialog, setPublishDialog] = useState(false);
  
  // Template Library filters
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Helper function to convert Template to EditorTemplate
  const convertToEditorTemplate = useCallback((template: Template): EditorTemplate => {
    return {
      ...template,
      sections: template.sections.map(section => ({
        ...section,
        visible: true,
        fields: section.fields?.map(field => ({
          ...field,
          visible: true
        })) || []
      }))
    };
  }, []);

  // Helper function to convert EditorTemplate to Template
  const convertToTemplate = useCallback((editorTemplate: EditorTemplate): Template => {
    return {
      ...editorTemplate,
      sections: editorTemplate.sections.map(section => ({
        ...section,
        fields: section.fields?.map(field => {
          const { visible, ...fieldData } = field;
          return fieldData;
        })
      }))
    };
  }, []);

  const handleCreateTemplate = () => {
    const newTemplate: EditorTemplate = {
      id: `template-${Date.now()}`,
      name: 'New Template',
      description: '',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCurrentTemplate(newTemplate);
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleCloneTemplate = (template: Template) => {
    const clonedTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Clone)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTemplates(prev => [...prev, clonedTemplate]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
  };

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleEditTemplate = (template: Template) => {
    const editorTemplate = convertToEditorTemplate(template);
    setEditingTemplate(editorTemplate);
    setCurrentTemplate(editorTemplate);
    setShowEditor(true);
  };

  const handlePreviewLibraryTemplate = (template: any) => {
    setSelectedLibraryTemplate(template);
    setShowLibraryPreview(true);
  };

  // Register templates with the service when they change
  React.useEffect(() => {
    templateService.registerTemplates(templates);
  }, [templates]);

  // Filter library templates
  const filteredLibraryTemplates = templateLibraryData.filter(template => {
    return (
      (specialtyFilter === '' || template.specialty === specialtyFilter) &&
      (typeFilter === '' || template.type === typeFilter)
    );
  });

  const uniqueSpecialties = [...new Set(templateLibraryData.map(t => t.specialty))];
  const uniqueTypes = [...new Set(templateLibraryData.map(t => t.type))];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="template builder tabs">
          <Tab label="My Templates" {...a11yProps(0)} />
          <Tab label="Template Library" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {!showEditor ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                My Templates
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateTemplate}>
                Create Template
              </Button>
            </Box>

            {/* Draggable Grid for My Templates */}
            <DraggableGrid />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 3 }}>
              {templates.map(template => (
                <Box key={template.id} sx={{ width: { xs: '100%', sm: '48%', md: '31%' } }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {template.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {template.description}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditTemplate(template)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Clone">
                          <IconButton onClick={() => handleCloneTemplate(template)}>
                            <CopyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Preview">
                          <IconButton onClick={() => handlePreviewTemplate(template)}>
                            <PreviewIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteTemplate(template.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <TemplateEditor
            templateName={currentTemplate?.name}
            initialSections={currentTemplate?.sections}
            onSave={(sections) => {
              if (currentTemplate) {
                const updatedTemplate: EditorTemplate = {
                  ...currentTemplate,
                  sections
                };
                const templateToSave = convertToTemplate(updatedTemplate);
                if (editingTemplate) {
                  setTemplates(prev => prev.map(t => 
                    t.id === editingTemplate.id ? templateToSave : t
                  ));
                } else {
                  setTemplates(prev => [...prev, templateToSave]);
                }
              }
              setShowEditor(false);
              setCurrentTemplate(null);
              setEditingTemplate(null);
            }}
            onBack={() => {
              setShowEditor(false);
              setCurrentTemplate(null);
              setEditingTemplate(null);
            }}
          />
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Template Library
            </Typography>
          </Box>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Specialty</InputLabel>
              <Select
                value={specialtyFilter}
                label="Specialty"
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {uniqueSpecialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {uniqueTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Template Library Grid */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'stretch', flexWrap: "wrap", justifyContent: "flex-start" }}>
            {filteredLibraryTemplates.map((item) => (
              <Card
                key={item.id}
                sx={{
                  width: 250,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 1,
                  border: '1px solid #ddd',
                  boxShadow: 'none',
                  cursor: "pointer",
                  "&:hover": {
                    border: "2px solid #408DA9",
                  },
                }}
                onClick={() => handlePreviewLibraryTemplate(item)}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography sx={{ color: "#343434", fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#808080", fontSize: 12, fontWeight: 400, textAlign: 'center' }}>
                    Specialty: {item.specialty}
                  </Typography>
                  <Typography sx={{ color: "#808080", fontSize: 12, fontWeight: 400, textAlign: 'center' }}>
                    Note Type: {item.type}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </TabPanel>

      {/* Preview Dialog for My Templates */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Template Preview</DialogTitle>
        <DialogContent>
          {previewTemplate && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>{previewTemplate.name}</Typography>
              <Typography variant="body1" paragraph>{previewTemplate.description}</Typography>
              {previewTemplate.sections.map(section => (
                <Box key={section.id} sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>{section.title}</Typography>
                  <Typography variant="body2" paragraph>{section.description}</Typography>
                  {section.fields?.map(field => (
                    <Box key={field.id} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">{field.label}</Typography>
                      <TextField
                        fullWidth
                        placeholder={field.placeholder}
                        required={field.required}
                        disabled
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog for Library Templates */}
      <Dialog open={showLibraryPreview} onClose={() => setShowLibraryPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Template Library Preview</DialogTitle>
        <DialogContent>
          {selectedLibraryTemplate && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>{selectedLibraryTemplate.title}</Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={`Specialty: ${selectedLibraryTemplate.specialty}`} sx={{ mr: 1 }} />
                <Chip label={`Type: ${selectedLibraryTemplate.type}`} />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">
                This is a sample template from the library. You can import this template to your collection.
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLibraryPreview(false)}>Close</Button>
          <Button variant="contained" onClick={() => {
            // Import template functionality
            setShowLibraryPreview(false);
          }}>
            Import Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateBuilder;
