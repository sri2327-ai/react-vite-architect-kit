import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  IconButton,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditorTemplateField, EditorTemplateSection, EditorTemplate } from './types';

interface TemplateEditorProps {
  templateName?: string;
  initialSections?: EditorTemplateSection[];
  onSave?: (sections: EditorTemplateSection[]) => void;
  onBack?: () => void;
}

const FIELD_TYPES = [
  { value: 'TEXT', label: 'Text Input' },
  { value: 'NUMBER', label: 'Number Input' },
  { value: 'DATE', label: 'Date Picker' },
  { value: 'DROPDOWN', label: 'Dropdown' },
  { value: 'CHECKBOX', label: 'Checkbox' },
  { value: 'TEXTAREA', label: 'Text Area' },
  { value: 'RADIO', label: 'Radio Button' },
  { value: 'FILE_UPLOAD', label: 'File Upload' }
];

interface DraggableFieldProps {
  field: EditorTemplateField;
  index: number;
  sectionId: string;
  onEdit: (field: EditorTemplateField) => void;
  onDelete: (fieldId: string) => void;
  onDuplicate: (field: EditorTemplateField) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onToggleVisibility: (fieldId: string) => void;
}

const DraggableField: React.FC<DraggableFieldProps> = ({
  field,
  index,
  sectionId,
  onEdit,
  onDelete,
  onDuplicate,
  onMove,
  onToggleVisibility
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { index, sectionId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'field',
    hover: (item: { index: number; sectionId: string }) => {
      if (!ref.current || item.sectionId !== sectionId) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  drag(drop(ref));

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'TEXT': return '📝';
      case 'NUMBER': return '🔢';
      case 'DATE': return '📅';
      case 'DROPDOWN': return '📋';
      case 'CHECKBOX': return '☑️';
      case 'TEXTAREA': return '📄';
      case 'RADIO': return '🔘';
      case 'FILE_UPLOAD': return '📎';
      default: return '❓';
    }
  };

  return (
    <Paper
      ref={ref}
      sx={{
        p: 2,
        mb: 1,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        border: field.visible ? '1px solid' : '1px dashed',
        borderColor: field.visible ? 'primary.main' : 'grey.400',
        backgroundColor: field.visible ? 'background.paper' : 'grey.50',
        '&:hover': {
          boxShadow: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <DragIcon sx={{ mr: 1, color: 'grey.500' }} />
          <Typography variant="body2" sx={{ mr: 1, fontSize: '1.2em' }}>
            {getFieldTypeIcon(field.type)}
          </Typography>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {field.label}
              {field.required && <span style={{ color: theme.palette.error.main }}> *</span>}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {FIELD_TYPES.find(t => t.value === field.type)?.label}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={field.visible ? "Hide field" : "Show field"}>
            <IconButton 
              size="small" 
              onClick={() => onToggleVisibility(field.id)}
              color={field.visible ? "primary" : "default"}
            >
              {field.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit field">
            <IconButton size="small" onClick={() => onEdit(field)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Duplicate field">
            <IconButton size="small" onClick={() => onDuplicate(field)}>
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete field">
            <IconButton size="small" onClick={() => onDelete(field.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {field.description && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {field.description}
        </Typography>
      )}
    </Paper>
  );
};

interface DropZoneProps {
  sectionId: string;
}

const DropZone: React.FC<DropZoneProps> = ({ sectionId }) => {
  const [, drop] = useDrop({
    accept: 'field',
    drop: (item: { index: number; sectionId: string }) => {
      console.log('Dropped item:', item);
    },
  });

  return (
    <Box
      ref={drop}
      sx={{
        p: 3,
        textAlign: 'center',
        border: '2px dashed',
        borderColor: 'grey.300',
        borderRadius: 1,
        backgroundColor: 'grey.50',
        '&:hover': {
          backgroundColor: 'grey.100'
        }
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Drag and drop fields here
      </Typography>
    </Box>
  );
};

interface FieldEditorProps {
  field: EditorTemplateField;
  onSave: (field: EditorTemplateField) => void;
  onCancel: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onSave, onCancel }) => {
  const [editedField, setEditedField] = useState<EditorTemplateField>({ ...field });
  const [newOption, setNewOption] = useState('');

  const handleAddOption = () => {
    if (newOption.trim()) {
      setEditedField(prev => ({
        ...prev,
        options: [...(prev.options || []), newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setEditedField(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(editedField);
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: 2,
        mb: 2
      }}>
        <TextField
          fullWidth
          label="Field Label"
          value={editedField.label}
          onChange={(e) => setEditedField(prev => ({ ...prev, label: e.target.value }))}
          size="small"
        />
        <FormControl fullWidth size="small">
          <InputLabel>Field Type</InputLabel>
          <Select
            value={editedField.type}
            label="Field Type"
            onChange={(e) => setEditedField(prev => ({ 
              ...prev, 
              type: e.target.value as EditorTemplateField['type']
            }))}
          >
            {FIELD_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Placeholder Text"
          value={editedField.placeholder || ''}
          onChange={(e) => setEditedField(prev => ({ ...prev, placeholder: e.target.value }))}
          size="small"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Description"
          value={editedField.description || ''}
          onChange={(e) => setEditedField(prev => ({ ...prev, description: e.target.value }))}
          multiline
          rows={2}
          size="small"
        />
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
        gap: 2,
        mb: 2
      }}>
        <FormControlLabel
          control={
            <Switch
              checked={editedField.required}
              onChange={(e) => setEditedField(prev => ({ ...prev, required: e.target.checked }))}
            />
          }
          label="Required Field"
        />
        <FormControlLabel
          control={
            <Switch
              checked={editedField.visible}
              onChange={(e) => setEditedField(prev => ({ ...prev, visible: e.target.checked }))}
            />
          }
          label="Visible"
        />
      </Box>

      {(editedField.type === 'DROPDOWN' || editedField.type === 'RADIO') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Options
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add new option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddOption();
                }
              }}
            />
            <Button variant="outlined" onClick={handleAddOption}>
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {editedField.options?.map((option, index) => (
              <Chip
                key={index}
                label={option}
                onDelete={() => handleRemoveOption(index)}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Field
        </Button>
      </Box>
    </Box>
  );
};

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  templateName = 'Medical Exam Template',
  initialSections = [
    {
      id: 'section-1',
      title: 'Patient Information',
      description: 'Basic patient details',
      content: '',
      type: 'text',
      visible: true,
      fields: [
        {
          id: 'field-1',
          type: 'TEXT',
          label: 'Patient Name',
          placeholder: 'Enter patient full name',
          required: true,
          visible: true
        },
        {
          id: 'field-2',
          type: 'DATE',
          label: 'Date of Birth',
          required: true,
          visible: true
        }
      ]
    }
  ],
  onSave,
  onBack
}) => {
  const [template, setTemplate] = useState<EditorTemplate>({
    id: '1',
    name: templateName,
    description: 'Comprehensive medical examination form',
    sections: initialSections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [editingField, setEditingField] = useState<EditorTemplateField | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string>('');
  const [showFieldDialog, setShowFieldDialog] = useState(false);

  const handleAddSection = () => {
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
      sections: [...prev.sections, newSection],
      updatedAt: new Date().toISOString()
    }));
  };

  const handleAddField = (sectionId: string) => {
    setEditingSectionId(sectionId);
    setEditingField({
      id: `field-${Date.now()}`,
      type: 'TEXT',
      label: 'New Field',
      placeholder: '',
      required: false,
      visible: true
    });
    setShowFieldDialog(true);
  };

  const handleEditField = (field: EditorTemplateField, sectionId: string) => {
    setEditingSectionId(sectionId);
    setEditingField({ ...field });
    setShowFieldDialog(true);
  };

  const handleSaveField = (field: EditorTemplateField) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === editingSectionId
          ? {
              ...section,
              fields: section.fields.find(f => f.id === field.id)
                ? section.fields.map(f => f.id === field.id ? field : f)
                : [...section.fields, field]
            }
          : section
      ),
      updatedAt: new Date().toISOString()
    }));
    
    setShowFieldDialog(false);
    setEditingField(null);
    setEditingSectionId('');
  };

  const handleDeleteField = (sectionId: string, fieldId: string) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, fields: section.fields.filter(f => f.id !== fieldId) }
          : section
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleDuplicateField = (sectionId: string, field: EditorTemplateField) => {
    const duplicatedField: EditorTemplateField = {
      ...field,
      id: `field-${Date.now()}`,
      label: `${field.label} (Copy)`
    };
    
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, duplicatedField] }
          : section
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleMoveField = (sectionId: string, dragIndex: number, hoverIndex: number) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          const newFields = [...section.fields];
          const draggedField = newFields[dragIndex];
          newFields.splice(dragIndex, 1);
          newFields.splice(hoverIndex, 0, draggedField);
          return { ...section, fields: newFields };
        }
        return section;
      }),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleToggleFieldVisibility = (sectionId: string, fieldId: string) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, visible: !field.visible } : field
              )
            }
          : section
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
          gap: 3 
        }}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Template Editor
              </Typography>
              <TextField
                fullWidth
                label="Template Name"
                value={template.name}
                onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Template Description"
                value={template.description || ''}
                onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {template.sections.map((section) => (
              <Paper key={section.id} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{section.title}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddField(section.id)}
                  >
                    Add Field
                  </Button>
                </Box>

                {section.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {section.description}
                  </Typography>
                )}

                <Box>
                  {section.fields.map((field, index) => (
                    <DraggableField
                      key={field.id}
                      field={field}
                      index={index}
                      sectionId={section.id}
                      onEdit={(field) => handleEditField(field, section.id)}
                      onDelete={(fieldId) => handleDeleteField(section.id, fieldId)}
                      onDuplicate={(field) => handleDuplicateField(section.id, field)}
                      onMove={(dragIndex, hoverIndex) => handleMoveField(section.id, dragIndex, hoverIndex)}
                      onToggleVisibility={(fieldId) => handleToggleFieldVisibility(section.id, fieldId)}
                    />
                  ))}

                  {section.fields.length === 0 && (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        backgroundColor: 'grey.50'
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No fields in this section. Click "Add Field" to get started.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddSection}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Section
            </Button>
          </Paper>

          <Paper sx={{ p: 3, position: 'sticky', top: 0 }}>
            <Typography variant="h6" gutterBottom>
              Template Preview
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              This is how your template will appear to users
            </Alert>
            
            {/* Template Preview Content */}
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {template.name}
              </Typography>
              {template.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {template.description}
                </Typography>
              )}
              
              {template.sections.filter(s => s.visible).map((section) => (
                <Box key={section.id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {section.title}
                  </Typography>
                  {section.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {section.description}
                    </Typography>
                  )}
                  
                  {section.fields.filter(f => f.visible).map((field) => (
                    <Box key={field.id} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {field.label}
                        {field.required && <span style={{ color: 'red' }}> *</span>}
                      </Typography>
                      {field.type === 'TEXT' && (
                        <TextField
                          fullWidth
                          size="small"
                          placeholder={field.placeholder}
                          disabled
                        />
                      )}
                      {field.type === 'TEXTAREA' && (
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          rows={3}
                          placeholder={field.placeholder}
                          disabled
                        />
                      )}
                      {field.type === 'NUMBER' && (
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          placeholder={field.placeholder}
                          disabled
                        />
                      )}
                      {field.type === 'DATE' && (
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          disabled
                        />
                      )}
                      {field.type === 'DROPDOWN' && (
                        <Select
                          fullWidth
                          size="small"
                          disabled
                          displayEmpty
                        >
                          <MenuItem value="">
                            {field.placeholder || 'Select an option'}
                          </MenuItem>
                          {field.options?.map((option, idx) => (
                            <MenuItem key={idx} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                      {field.type === 'CHECKBOX' && (
                        <FormControlLabel
                          control={<Switch disabled size="small" />}
                          label={field.placeholder || 'Check this option'}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Field Editor Dialog */}
        <Dialog 
          open={showFieldDialog} 
          onClose={() => setShowFieldDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingField?.id.startsWith('field-' + Date.now().toString().slice(-6)) ? 'Add Field' : 'Edit Field'}
          </DialogTitle>
          <DialogContent>
            {editingField && (
              <FieldEditor
                field={editingField}
                onSave={handleSaveField}
                onCancel={() => setShowFieldDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </DndProvider>
  );
};

export default TemplateEditor;
