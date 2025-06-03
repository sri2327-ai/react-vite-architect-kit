import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  Tooltip,
  Fab,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FileCopy as CopyIcon,
  GetApp as ExportIcon,
  Publish as PublishIcon
} from '@mui/icons-material';
import { Template, TemplateSection, TemplateField, EditorTemplate, EditorTemplateSection, EditorTemplateField } from './types';
import TemplateEditor from './TemplateEditor';

interface FieldOption {
  id: string;
  text: string;
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
      },
      {
        id: 'section-2',
        title: 'Contact Information',
        description: 'How can we reach you?',
        content: 'Provide your preferred contact method.',
        type: 'text',
        fields: [
          {
            id: 'field-3',
            type: 'NUMBER',
            label: 'Phone Number',
            placeholder: 'Enter your phone number',
            required: true,
            validation: { minLength: 10, maxLength: 10 },
            description: 'Mobile or landline'
          },
          {
            id: 'field-4',
            type: 'TEXT',
            label: 'Email Address',
            placeholder: 'Enter your email address',
            required: true,
            validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
            description: 'A valid email for communication'
          }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const fieldTypes = [
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'DATE', label: 'Date' },
  { value: 'DROPDOWN', label: 'Dropdown' },
  { value: 'CHECKBOX', label: 'Checkbox' },
  { value: 'TEXTAREA', label: 'Textarea' },
  { value: 'RADIO', label: 'Radio' },
  { value: 'FILE_UPLOAD', label: 'File Upload' }
];

const TemplateBuilder: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [currentTemplate, setCurrentTemplate] = useState<EditorTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EditorTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);
  const [publishDialog, setPublishDialog] = useState(false);

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

  const handleExportTemplate = (template: Template) => {
    // Implement export logic here (e.g., JSON download)
    console.log('Exporting template:', template);
    setExportDialog(true);
  };

  const handlePublishTemplate = (template: Template) => {
    // Implement publish logic here (e.g., to a template library)
    console.log('Publishing template:', template);
    setPublishDialog(true);
  };

  const handleEditTemplate = (template: Template) => {
    const editorTemplate = convertToEditorTemplate(template);
    setEditingTemplate(editorTemplate);
    setCurrentTemplate(editorTemplate);
    setShowEditor(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      {!showEditor ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Template Library
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateTemplate}>
              Create Template
            </Button>
          </Box>
          <Grid container spacing={3}>
            {templates.map(template => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
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
              </Grid>
            ))}
          </Grid>
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

      <Dialog open={exportDialog} onClose={() => setExportDialog(false)}>
        <DialogTitle>Export Template</DialogTitle>
        <DialogContent>
          <Typography>
            Implement export logic here (e.g., JSON download).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={publishDialog} onClose={() => setPublishDialog(false)}>
        <DialogTitle>Publish Template</DialogTitle>
        <DialogContent>
          <Typography>
            Implement publish logic here (e.g., to a template library).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateBuilder;
