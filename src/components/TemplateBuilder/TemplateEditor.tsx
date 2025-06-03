
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControlLabel,
  Switch,
  Alert,
  AlertTitle,
  Snackbar
} from '@mui/material';
import { Edit, GripVertical, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface TemplateEditorProps {
  template: Template | null;
  onChange: (template: Template) => void;
  onSave: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  elements: TemplateElement[];
}

interface TemplateElement {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

const PREDEFINED_SECTIONS = [
  {
    id: 'medical_history',
    name: 'Medical History',
    description: 'A comprehensive section for gathering patient medical history.',
    elements: [
      {
        id: uuidv4(),
        type: 'text',
        label: 'Chief Complaint',
        required: true,
        placeholder: 'Enter chief complaint'
      },
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'History of Present Illness',
        required: true,
        placeholder: 'Describe the history of present illness'
      },
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'Past Medical History',
        required: false,
        placeholder: 'List past medical conditions'
      },
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'Current Medications',
        required: false,
        placeholder: 'List current medications'
      },
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'Allergies',
        required: false,
        placeholder: 'List any allergies'
      }
    ]
  },
  {
    id: 'physical_exam',
    name: 'Physical Exam',
    description: 'A structured section for documenting physical examination findings.',
    elements: [
      {
        id: uuidv4(),
        type: 'text',
        label: 'General Appearance',
        required: false,
        placeholder: 'Describe general appearance'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'Vital Signs',
        required: false,
        placeholder: 'Record vital signs'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'Skin',
        required: false,
        placeholder: 'Describe skin condition'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'HEENT',
        required: false,
        placeholder: 'Describe head, eyes, ears, nose, and throat'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'Cardiovascular',
        required: false,
        placeholder: 'Describe cardiovascular findings'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'Respiratory',
        required: false,
        placeholder: 'Describe respiratory findings'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'Gastrointestinal',
        required: false,
        placeholder: 'Describe gastrointestinal findings'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'Neurological',
        required: false,
        placeholder: 'Describe neurological findings'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'Musculoskeletal',
        required: false,
        placeholder: 'Describe musculoskeletal findings'
      }
    ]
  },
  {
    id: 'assessment_plan',
    name: 'Assessment and Plan',
    description: 'A section for summarizing the assessment and outlining the treatment plan.',
    elements: [
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'Assessment',
        required: true,
        placeholder: 'Summarize the assessment'
      },
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'Plan',
        required: true,
        placeholder: 'Outline the treatment plan'
      },
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'Follow-up',
        required: false,
        placeholder: 'Describe follow-up instructions'
      }
    ]
  },
  {
    id: 'lab_results',
    name: 'Lab Results',
    description: 'A section for recording and interpreting laboratory results.',
    elements: [
      {
        id: uuidv4(),
        type: 'text',
        label: 'Lab Name',
        required: true,
        placeholder: 'Enter lab name'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'Result',
        required: true,
        placeholder: 'Enter result'
      },
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'Interpretation',
        required: false,
        placeholder: 'Provide interpretation'
      }
    ]
  },
  {
    id: 'imaging_reports',
    name: 'Imaging Reports',
    description: 'A section for documenting imaging reports and findings.',
    elements: [
      {
        id: uuidv4(),
        type: 'text',
        label: 'Imaging Type',
        required: true,
        placeholder: 'Enter imaging type'
      },
      {
        id: uuidv4(),
        type: 'text',
        label: 'Report Date',
        required: true,
        placeholder: 'Enter report date'
      },
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'Findings',
        required: false,
        placeholder: 'Describe findings'
      }
    ]
  }
];

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  template, 
  onChange, 
  onSave 
}) => {
  const [selectedElement, setSelectedElement] = useState<TemplateElement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newElementName, setNewElementName] = useState('');
  const [showPredefinedSections, setShowPredefinedSections] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const theme = useTheme();

  const handleTemplateNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!template) return;
    onChange({
      ...template,
      name: event.target.value
    });
  };

  const handleTemplateDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!template) return;
    onChange({
      ...template,
      description: event.target.value
    });
  };

  const handleAddElement = (type: string) => {
    if (!template) return;
    const newElement: TemplateElement = {
      id: uuidv4(),
      type: type,
      label: newElementName || 'New Element',
      required: false,
      placeholder: '',
      options: type === 'select' ? [] : undefined
    };
    onChange({ ...template, elements: [...template.elements, newElement] });
    setNewElementName('');
    handleOpenSnackbar('Element added successfully!', 'success');
  };

  const handleAddPredefinedSection = (section: any) => {
    if (!template) return;
    const newElements = section.elements.map((element: any) => ({
      ...element,
      id: uuidv4()
    }));
    onChange({ ...template, elements: [...template.elements, ...newElements] });
    setShowPredefinedSections(false);
    handleOpenSnackbar(`${section.name} added successfully!`, 'success');
  };

  const handleRemoveElement = (elementId: string) => {
    if (!template) return;
    const updatedElements = template.elements.filter(element => element.id !== elementId);
    onChange({ ...template, elements: updatedElements });
    handleCloseEditDialog();
    handleOpenSnackbar('Element removed successfully!', 'success');
  };

  const handleEditElement = (element: TemplateElement) => {
    setSelectedElement(element);
    setIsEditDialogOpen(true);
  };

  const handleUpdateElement = (updatedElement: TemplateElement) => {
    if (!template) return;
    const updatedElements = template.elements.map(element => {
      return element.id === updatedElement.id ? updatedElement : element;
    });
    onChange({ ...template, elements: updatedElements });
    handleCloseEditDialog();
    handleOpenSnackbar('Element updated successfully!', 'success');
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedElement(null);
  };

  const handleElementNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewElementName(event.target.value);
  };

  const handleOnDragEnd = (result: any) => {
    if (!template || !result.destination) return;

    const items = Array.from(template.elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ ...template, elements: items });
  };

  const handleRequiredChange = (elementId: string, required: boolean) => {
    if (!template) return;

    const updatedElements = template.elements.map(element => {
      if (element.id === elementId) {
        return { ...element, required: required };
      }
      return element;
    });

    onChange({
      ...template,
      elements: updatedElements
    });
  };

  const handleLabelChange = (elementId: string, label: string) => {
    if (!template) return;

    const updatedElements = template.elements.map(element => {
      if (element.id === elementId) {
        return { ...element, label: label };
      }
      return element;
    });

    onChange({
      ...template,
      elements: updatedElements
    });
  };

  const handlePlaceholderChange = (elementId: string, placeholder: string) => {
    if (!template) return;

    const updatedElements = template.elements.map(element => {
      if (element.id === elementId) {
        return { ...element, placeholder: placeholder };
      }
      return element;
    });

    onChange({
      ...template,
      elements: updatedElements
    });
  };

  const handleOptionsChange = (elementId: string, options: string[]) => {
    if (!template) return;

    const updatedElements = template.elements.map(element => {
      if (element.id === elementId) {
        return { ...element, options: options };
      }
      return element;
    });

    onChange({
      ...template,
      elements: updatedElements
    });
  };

  const handleElementTypeChange = (elementId: string, newType: string) => {
    if (!template) return;

    const updatedElements = template.elements.map(element => {
      if (element.id === elementId) {
        if (newType === 'exam_list' || element.type === 'exam_list') {
          return {
            ...element,
            type: newType,
            options: newType === 'exam_list' ? (element.options || []) : undefined
          };
        }
        return {
          ...element,
          type: newType,
          options: undefined
        };
      }
      return element;
    });

    onChange({
      ...template,
      elements: updatedElements
    });
  };

  const handleOpenSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  };

  const renderElementSettings = (element: TemplateElement) => {
    switch (element.type) {
      case 'text':
      case 'textarea':
        return (
          <TextField
            label="Placeholder"
            fullWidth
            margin="normal"
            value={element.placeholder || ''}
            onChange={(e) => handlePlaceholderChange(element.id, e.target.value)}
          />
        );
      case 'select':
        return (
          <>
            <TextField
              label="Options (comma-separated)"
              fullWidth
              margin="normal"
              value={element.options ? element.options.join(', ') : ''}
              onChange={(e) => {
                const options = e.target.value.split(',').map(option => option.trim());
                handleOptionsChange(element.id, options);
              }}
            />
            <Typography variant="caption" color="textSecondary">
              Enter options separated by commas.
            </Typography>
          </>
        );
      case 'exam_list':
        return (
          <>
            <TextField
              label="Exam Items (comma-separated)"
              fullWidth
              margin="normal"
              value={element.options ? element.options.join(', ') : ''}
              onChange={(e) => {
                const options = e.target.value.split(',').map(option => option.trim());
                handleOptionsChange(element.id, options);
              }}
            />
            <Typography variant="caption" color="textSecondary">
              Enter exam items separated by commas (e.g., Normal, Abnormal, Not examined).
            </Typography>
          </>
        );
      default:
        return null;
    }
  };

  if (!template) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Select a template to edit
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Template Editor
      </Typography>

      <TextField
        label="Template Name"
        fullWidth
        margin="normal"
        value={template.name}
        onChange={handleTemplateNameChange}
      />

      <TextField
        label="Template Description"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={template.description}
        onChange={handleTemplateDescriptionChange}
      />

      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Elements
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Element Name"
            value={newElementName}
            onChange={handleElementNameChange}
            size="small"
          />
          <Button
            variant="outlined"
            onClick={() => handleAddElement('text')}
            startIcon={<Plus />}
          >
            Add Text
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleAddElement('textarea')}
            startIcon={<Plus />}
          >
            Add Textarea
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleAddElement('select')}
            startIcon={<Plus />}
          >
            Add Select
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowPredefinedSections(true)}
            startIcon={<Plus />}
          >
            Add Section
          </Button>
        </Stack>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="elements">
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ bgcolor: 'background.paper', mb: 2 }}
              >
                {template.elements.map((element, index) => (
                  <Draggable key={element.id} draggableId={element.id} index={index}>
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        disablePadding
                        secondaryAction={
                          <Box {...provided.dragHandleProps}>
                            <GripVertical color={theme.palette.action.active} />
                          </Box>
                        }
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                          bgcolor: 'background.paper'
                        }}
                      >
                        <Box sx={{ flex: 1, p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="subtitle1">
                                {element.label}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                Type: {element.type} | Required: {element.required ? 'Yes' : 'No'}
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton onClick={() => handleEditElement(element)}>
                                <Edit size={16} />
                              </IconButton>
                              <IconButton onClick={() => handleRemoveElement(element.id)} color="error">
                                <Trash2 size={16} />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={onSave}>
          Save Template
        </Button>
      </Box>

      {/* Predefined Sections */}
      {showPredefinedSections && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add Predefined Sections
            </Typography>
            <Grid container spacing={2}>
              {PREDEFINED_SECTIONS.map((section) => (
                <Grid item key={section.id} xs={12} md={6}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                    onClick={() => handleAddPredefinedSection(section)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {section.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {section.description}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                        {section.elements.length} elements
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => setShowPredefinedSections(false)}
              >
                Cancel
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Element Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Element</DialogTitle>
        <DialogContent>
          {selectedElement && (
            <Box>
              <TextField
                label="Label"
                fullWidth
                margin="normal"
                value={selectedElement.label}
                onChange={(e) => handleLabelChange(selectedElement.id, e.target.value)}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedElement.type}
                  label="Type"
                  onChange={(e) => handleElementTypeChange(selectedElement.id, e.target.value)}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="textarea">Textarea</MenuItem>
                  <MenuItem value="select">Select</MenuItem>
                  <MenuItem value="exam_list">Exam List</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={selectedElement.required}
                    onChange={(e) => handleRequiredChange(selectedElement.id, e.target.checked)}
                  />
                }
                label="Required"
              />

              {renderElementSettings(selectedElement)}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={() => handleUpdateElement(selectedElement)} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplateEditor;
