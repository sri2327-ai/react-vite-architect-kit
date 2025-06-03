import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DragDropList from './DragDropList';
import { Template, TemplateSection, TemplateField, EditorTemplate, EditorTemplateSection, EditorTemplateField } from './types';

const TemplateBuilder: React.FC = () => {
  // State for the template
  const [template, setTemplate] = useState<EditorTemplate>({
    id: '',
    name: '',
    description: '',
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // State for dialogs (e.g., preview, save)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // State for alerts (e.g., success, error)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Handlers for dialogs
  const handlePreviewOpen = () => setPreviewDialogOpen(true);
  const handlePreviewClose = () => setPreviewDialogOpen(false);
  const handleSaveOpen = () => setSaveDialogOpen(true);
  const handleSaveClose = () => setSaveDialogOpen(false);

  const convertToEditorTemplate = (baseTemplate: Template): EditorTemplate => {
    return {
      ...baseTemplate,
      sections: baseTemplate.sections.map((section): EditorTemplateSection => ({
        ...section,
        visible: true,
        fields: section.fields?.map((field): EditorTemplateField => ({
          ...field,
          visible: true
        })) || []
      }))
    };
  };

  const convertFromEditorTemplate = (editorTemplate: EditorTemplate): Template => {
    return {
      ...editorTemplate,
      sections: editorTemplate.sections.map((section): TemplateSection => ({
        id: section.id,
        title: section.title,
        description: section.description,
        content: section.content,
        type: section.type,
        fields: section.fields?.map((field): TemplateField => ({
          id: field.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          options: field.options,
          validation: field.validation,
          description: field.description,
          defaultValue: field.defaultValue
        })) || []
      }))
    };
  };

  // Handler to add a new section
  const handleSectionAdd = () => {
    const newSection: EditorTemplateSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      content: '',
      type: 'text',
      visible: true,
      fields: []
    };
    setTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  // Handler to update a section
  const handleSectionUpdate = (sectionId: string, updates: Partial<EditorTemplateSection>) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  // Handler to delete a section
  const handleSectionDelete = (sectionId: string) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  // Handler to add a new field to a section
  const handleFieldAdd = (sectionId: string) => {
    const newField: EditorTemplateField = {
      id: `field-${Date.now()}`,
      type: 'TEXT',
      label: 'New Field',
      placeholder: '',
      required: false,
      visible: true
    };
    
    handleSectionUpdate(sectionId, {
      fields: [...(template.sections.find(s => s.id === sectionId)?.fields || []), newField]
    });
  };

  // Handler to update a field in a section
  const handleFieldUpdate = (sectionId: string, fieldId: string, updates: Partial<EditorTemplateField>) => {
    const section = template.sections.find(s => s.id === sectionId);
    if (section) {
      const updatedFields = section.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      );
      handleSectionUpdate(sectionId, { fields: updatedFields });
    }
  };

  // Handler to delete a field from a section
  const handleFieldDelete = (sectionId: string, fieldId: string) => {
    const section = template.sections.find(s => s.id === sectionId);
    if (section) {
      const updatedFields = section.fields.filter(field => field.id !== fieldId);
      handleSectionUpdate(sectionId, { fields: updatedFields });
    }
  };

  const addSection = () => {
    const newSection: EditorTemplateSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      content: '',
      type: 'text',
      visible: true,
      fields: []
    };
    setTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<EditorTemplateSection>) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const deleteSection = (sectionId: string) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const addField = (sectionId: string) => {
    const newField: EditorTemplateField = {
      id: `field-${Date.now()}`,
      type: 'TEXT',
      label: 'New Field',
      placeholder: '',
      required: false,
      visible: true
    };
    
    updateSection(sectionId, {
      fields: [...(template.sections.find(s => s.id === sectionId)?.fields || []), newField]
    });
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<EditorTemplateField>) => {
    const section = template.sections.find(s => s.id === sectionId);
    if (section) {
      const updatedFields = section.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      );
      updateSection(sectionId, { fields: updatedFields });
    }
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    const section = template.sections.find(s => s.id === sectionId);
    if (section) {
      const updatedFields = section.fields.filter(field => field.id !== fieldId);
      updateSection(sectionId, { fields: updatedFields });
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTemplate(prev => {
        const oldIndex = prev.sections.findIndex(section => section.id === active.id);
        const newIndex = prev.sections.findIndex(section => section.id === over.id);
        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex)
        };
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Template Builder
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Template Name"
              value={template.name}
              onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              value={template.description}
              onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={template.sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {template.sections.map((section) => (
              <Card key={section.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <DragIcon sx={{ cursor: 'grab' }} />
                    <TextField
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      variant="outlined"
                      size="small"
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => addField(section.id)}
                      size="small"
                      variant="outlined"
                    >
                      Add Field
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteSection(section.id)}
                      size="small"
                      color="error"
                    >
                      Delete
                    </Button>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Section Description"
                    value={section.description}
                    onChange={(e) => updateSection(section.id, { description: e.target.value })}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  {section.fields.map((field) => (
                    <Card key={field.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Field Label"
                            value={field.label}
                            onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Field Type</InputLabel>
                            <Select
                              value={field.type}
                              label="Field Type"
                              onChange={(e) => updateField(section.id, field.id, { type: e.target.value as any })}
                            >
                              <MenuItem value="TEXT">Text</MenuItem>
                              <MenuItem value="NUMBER">Number</MenuItem>
                              <MenuItem value="DATE">Date</MenuItem>
                              <MenuItem value="DROPDOWN">Dropdown</MenuItem>
                              <MenuItem value="CHECKBOX">Checkbox</MenuItem>
                              <MenuItem value="TEXTAREA">Textarea</MenuItem>
                              <MenuItem value="RADIO">Radio</MenuItem>
                              <MenuItem value="FILE_UPLOAD">File Upload</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Placeholder"
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(section.id, field.id, { placeholder: e.target.value })}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={field.required}
                                onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                              />
                            }
                            label="Required"
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => deleteField(section.id, field.id)}
                            size="small"
                            color="error"
                          >
                            Delete
                          </Button>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={addSection}
          variant="outlined"
          size="large"
        >
          Add Section
        </Button>
        <Button
          startIcon={<SaveIcon />}
          onClick={() => console.log('Saving template:', convertFromEditorTemplate(template))}
          variant="contained"
          size="large"
        >
          Save Template
        </Button>
        <Button
          startIcon={<PreviewIcon />}
          onClick={() => console.log('Previewing template:', template)}
          variant="outlined"
          size="large"
        >
          Preview
        </Button>
      </Box>
    </Box>
  );
};

export default TemplateBuilder;
