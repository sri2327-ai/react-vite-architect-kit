
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
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
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Alert,
  AlertTitle,
  Snackbar
} from '@mui/material';
import { Delete, Plus, Edit, GripVertical } from 'lucide-react';
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
      { id: uuidv4(), type: 'text', label: 'Chief Complaint', required: true, placeholder: 'Enter chief complaint' },
      { id: uuidv4(), type: 'textarea', label: 'History of Present Illness', required: true, placeholder: 'Describe the history of present illness' },
      { id: uuidv4(), type: 'textarea', label: 'Past Medical History', required: false, placeholder: 'List past medical conditions' },
      { id: uuidv4(), type: 'textarea', label: 'Current Medications', required: false, placeholder: 'List current medications' },
      { id: uuidv4(), type: 'textarea', label: 'Allergies', required: false, placeholder: 'List any allergies' }
    ]
  },
  {
    id: 'physical_exam',
    name: 'Physical Exam',
    description: 'A structured section for documenting physical examination findings.',
    elements: [
      { id: uuidv4(), type: 'text', label: 'General Appearance', required: false, placeholder: 'Describe general appearance' },
      { id: uuidv4(), type: 'text', label: 'Vital Signs', required: false, placeholder: 'Record vital signs' },
      { id: uuidv4(), type: 'text', label: 'Skin', required: false, placeholder: 'Describe skin condition' },
      { id: uuidv4(), type: 'text', label: 'HEENT', required: false, placeholder: 'Describe head, eyes, ears, nose, and throat' },
      { id: uuidv4(), type: 'text', label: 'Cardiovascular', required: false, placeholder: 'Describe cardiovascular findings' },
      { id: uuidv4(), type: 'text', label: 'Respiratory', required: false, placeholder: 'Describe respiratory findings' },
      { id: uuidv4(), type: 'text', label: 'Gastrointestinal', required: false, placeholder: 'Describe gastrointestinal findings' },
      { id: uuidv4(), type: 'text', label: 'Neurological', required: false, placeholder: 'Describe neurological findings' },
      { id: uuidv4(), type: 'text', label: 'Musculoskeletal', required: false, placeholder: 'Describe musculoskeletal findings' }
    ]
  },
  {
    id: 'assessment_plan',
    name: 'Assessment and Plan',
    description: 'A section for summarizing the assessment and outlining the treatment plan.',
    elements: [
      { id: uuidv4(), type: 'textarea', label: 'Assessment', required: true, placeholder: 'Summarize the assessment' },
      { id: uuidv4(), type: 'textarea', label: 'Plan', required: true, placeholder: 'Outline the treatment plan' },
      { id: uuidv4(), type: 'textarea', label: 'Follow-up', required: false, placeholder: 'Describe follow-up instructions' }
    ]
  },
  {
    id: 'lab_results',
    name: 'Lab Results',
    description: 'A section for recording and interpreting laboratory results.',
    elements: [
      { id: uuidv4(), type: 'text', label: 'Lab Name', required: true, placeholder: 'Enter lab name' },
      { id: uuidv4(), type: 'text', label: 'Result', required: true, placeholder: 'Enter result' },
      { id: uuidv4(), type: 'textarea', label: 'Interpretation', required: false, placeholder: 'Provide interpretation' }
    ]
  },
  {
    id: 'imaging_reports',
    name: 'Imaging Reports',
    description: 'A section for documenting imaging reports and findings.',
    elements: [
      { id: uuidv4(), type: 'text', label: 'Imaging Type', required: true, placeholder: 'Enter imaging type' },
      { id: uuidv4(), type: 'text', label: 'Report Date', required: true, placeholder: 'Enter report date' },
      { id: uuidv4(), type: 'textarea', label: 'Findings', required: false, placeholder: 'Describe findings' }
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
    onChange({ ...template, name: event.target.value });
  };

  const handleTemplateDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!template) return;
    onChange({ ...template, description: event.target.value });
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
              label="Exam Options (comma-separated)"
              fullWidth
              margin="normal"
              value={element.options ? element.options.join(', ') : ''}
              onChange={(e) => {
                const options = e.target.value.split(',').map(option => option.trim());
                handleOptionsChange(element.id, options);
              }}
            />
            <Typography variant="caption" color="textSecondary">
              Enter exam options separated by commas.
            </Typography>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Template Editor
        </Typography>
        <TextField
          label="Template Name"
          fullWidth
          margin="normal"
          value={template ? template.name : ''}
          onChange={handleTemplateNameChange}
        />
        <TextField
          label="Template Description"
          fullWidth
          margin="normal"
          value={template ? template.description : ''}
          onChange={handleTemplateDescriptionChange}
        />
      </Box>

      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        <Typography variant="subtitle1" gutterBottom>
          Elements:
        </Typography>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="elements">
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ bgcolor: 'background.paper', mb: 2 }}
              >
                {template && template.elements.map((element, index) => (
                  <Draggable key={element.id} draggableId={element.id} index={index}>
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        disableGutters
                        secondaryAction={
                          <Box {...provided.dragHandleProps}>
                            <GripVertical color={theme.palette.action.active} />
                          </Box>
                        }
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                          bgcolor: 'background.default',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          },
                          cursor: 'grab'
                        }}
                      >
                        <ListItemText
                          primary={element.label}
                          secondary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Chip label={element.type} size="small" color="primary" />
                              {element.required && <Chip label="Required" size="small" color="secondary" />}
                            </Stack>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title="Edit">
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEditElement(element)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>

        <Typography variant="subtitle1" gutterBottom>
          Add New Element:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="Element Name"
            size="small"
            value={newElementName}
            onChange={handleElementNameChange}
            sx={{ flexGrow: 1 }}
          />
          <Button variant="contained" color="primary" onClick={() => handleAddElement('text')}>
            Text
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleAddElement('textarea')}>
            Textarea
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleAddElement('select')}>
            Select
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleAddElement('exam_list')}>
            Exam List
          </Button>
        </Box>

        <Button variant="outlined" onClick={() => setShowPredefinedSections(true)}>
          Add Predefined Section
        </Button>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'right' }}>
        <Button variant="contained" color="primary" onClick={onSave}>
          Save Template
        </Button>
      </Box>
      
      {showPredefinedSections && (
        <Dialog open={showPredefinedSections} onClose={() => setShowPredefinedSections(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add Predefined Section</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {PREDEFINED_SECTIONS.map((section) => (
                <Grid key={section.id} xs={12} md={4}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                      height: '100%'
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
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPredefinedSections(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Element</DialogTitle>
        <DialogContent>
          {selectedElement && (
            <Box>
              <FormControl fullWidth margin="normal">
                <InputLabel id="element-type-label">Element Type</InputLabel>
                <Select
                  labelId="element-type-label"
                  id="element-type-select"
                  value={selectedElement.type}
                  label="Element Type"
                  onChange={(e) => {
                    handleElementTypeChange(selectedElement.id, e.target.value);
                  }}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="textarea">Textarea</MenuItem>
                  <MenuItem value="select">Select</MenuItem>
                  <MenuItem value="exam_list">Exam List</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Label"
                fullWidth
                margin="normal"
                value={selectedElement.label}
                onChange={(e) => handleLabelChange(selectedElement.id, e.target.value)}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedElement.required}
                    onChange={(e) => handleRequiredChange(selectedElement.id, e.target.checked)}
                    name="required"
                    color="primary"
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (selectedElement) {
                handleUpdateElement(selectedElement);
              }
            }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (selectedElement) {
                handleRemoveElement(selectedElement.id);
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplateEditor;
