import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Paper,
  Grid,
  styled,
  Stack,
  Divider,
  InputAdornment,
  Autocomplete,
  Chip,
  Popper,
  Fade,
  Zoom,
  ClickAwayListener,
  MenuList,
  Grow,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  CopyAll,
  ContentPaste,
  ArrowUpward,
  ArrowDownward,
  DragHandle,
  Visibility,
  VisibilityOff,
  Save,
  Cancel,
  Search as SearchIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { isMobile } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

// Custom styles
const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
  transition: theme.transitions.create(['box-shadow']),
}));

const FieldPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  border: `1px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

const DragHandleIcon = styled(DragHandle)(({ theme }) => ({
  cursor: 'grab',
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.action.disabled,
  '&:hover': {
    color: theme.palette.action.active,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.background.paper,
  },
}));

// Enums and types
enum FieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  DROPDOWN = 'DROPDOWN',
  CHECKBOX = 'CHECKBOX',
  TEXTAREA = 'TEXTAREA',
}

enum SectionType {
  STANDARD = 'STANDARD',
  REPEATABLE = 'REPEATABLE',
}

interface FieldOption {
  id: string;
  label: string;
}

interface TemplateField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
  visible: boolean;
}

interface TemplateSection {
  id: string;
  label: string;
  type: SectionType;
  fields: TemplateField[];
  visible: boolean;
}

interface TemplateData {
  sections: TemplateSection[];
}

const ItemTypes = {
  SECTION: 'section',
  FIELD: 'field',
};

// Helper functions
const generateId = (): string => uuidv4();

const initialTemplateData: TemplateData = {
  sections: [
    {
      id: generateId(),
      label: 'Patient Information',
      type: SectionType.STANDARD,
      fields: [
        { id: generateId(), label: 'First Name', type: FieldType.TEXT, required: true, visible: true },
        { id: generateId(), label: 'Last Name', type: FieldType.TEXT, required: true, visible: true },
        { id: generateId(), label: 'Date of Birth', type: FieldType.DATE, required: false, visible: true },
      ],
      visible: true,
    },
    {
      id: generateId(),
      label: 'Medical History',
      type: SectionType.REPEATABLE,
      fields: [
        { id: generateId(), label: 'Condition', type: FieldType.TEXT, required: true, visible: true },
        { id: generateId(), label: 'Start Date', type: FieldType.DATE, required: false, visible: true },
      ],
      visible: true,
    },
  ],
};

// Drag and Drop functions
const useSectionDrag = (id: string) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SECTION,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return { isDragging, drag };
};

const useSectionDrop = (id: string, onMoveSection: (dragId: string, hoverId: string) => void) => {
  const [, drop] = useDrop({
    accept: ItemTypes.SECTION,
    hover: (item: any, monitor) => {
      if (!item || !id) return;
      if (item.id === id) return;

      const dragIndex = item.id;
      const hoverIndex = id;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = (monitor.getClientOffset() as any);
      if (!hoverBoundingRect) return;

      onMoveSection(dragIndex, hoverIndex);

      item.id = hoverIndex;
    },
  });

  return { drop };
};

const useFieldDrag = (id: string) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FIELD,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return { isDragging, drag };
};

const useFieldDrop = (id: string, onMoveField: (dragId: string, hoverId: string) => void) => {
  const [, drop] = useDrop({
    accept: ItemTypes.FIELD,
    hover: (item: any, monitor) => {
      if (!item || !id) return;
      if (item.id === id) return;

      const dragIndex = item.id;
      const hoverIndex = id;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = (monitor.getClientOffset() as any);
      if (!hoverBoundingRect) return;

      onMoveField(dragIndex, hoverIndex);

      item.id = hoverIndex;
    },
  });

  return { drop };
};

// Section Component
interface SectionProps {
  section: TemplateSection;
  index: number;
  onMoveSection: (dragId: string, hoverId: string) => void;
  onDeleteSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onFieldChange: (sectionId: string, fieldId: string, field: Partial<TemplateField>) => void;
  onMoveField: (sectionId: string, dragId: string, hoverId: string) => void;
  onAddField: (sectionId: string) => void;
  onDeleteField: (sectionId: string, fieldId: string) => void;
  onDuplicateField: (sectionId: string, fieldId: string) => void;
  onSectionChange: (id: string, section: Partial<TemplateSection>) => void;
}

const Section: React.FC<SectionProps> = ({
  section,
  index,
  onMoveSection,
  onDeleteSection,
  onDuplicateSection,
  onFieldChange,
  onMoveField,
  onAddField,
  onDeleteField,
  onDuplicateField,
  onSectionChange,
}) => {
  const { id, label, type, fields, visible } = section;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isEditing, setIsEditing] = useState(false);
  const [sectionLabel, setSectionLabel] = useState(label);
  const [sectionType, setSectionType] = useState(type);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditSection = () => {
    setIsEditing(true);
    handleClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSectionLabel(label);
    setSectionType(type);
  };

  const handleSaveSection = () => {
    onSectionChange(id, { label: sectionLabel, type: sectionType });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteSection(id);
    handleClose();
  };

  const handleDuplicate = () => {
    onDuplicateSection(id);
    handleClose();
  };

  const { isDragging, drag } = useSectionDrag(id);
  const { drop } = useSectionDrop(id, onMoveSection);

  const handleVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSectionChange(id, { visible: event.target.checked });
  };

  const sectionStyle = {
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '2px dashed gray' : '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: isDragging ? '#eee' : 'white',
  };

  drag(drop(document.getElementById(`section-${id}`) as any));

  return (
    <SectionPaper id={`section-${id}`} ref={(node) => drag(drop(node as any))} style={sectionStyle}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              label="Section Label"
              value={sectionLabel}
              onChange={(e) => setSectionLabel(e.target.value)}
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              select
              label="Section Type"
              value={sectionType}
              onChange={(e) => setSectionType(e.target.value as SectionType)}
              size="small"
            >
              <MenuItem value={SectionType.STANDARD}>Standard</MenuItem>
              <MenuItem value={SectionType.REPEATABLE}>Repeatable</MenuItem>
            </TextField>
          </Box>
        ) : (
          <Typography variant="h6">
            {label} ({type})
          </Typography>
        )}

        <Box>
          {isEditing ? (
            <Box>
              <Button onClick={handleSaveSection} variant="contained" color="primary" size="small">
                Save
              </Button>
              <Button onClick={handleCancelEdit} variant="outlined" color="secondary" size="small" sx={{ ml: 1 }}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Box>
              <Tooltip title="Section Actions">
                <IconButton
                  aria-label="section actions"
                  aria-controls={`section-menu-${id}`}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu
                id={`section-menu-${id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleEditSection}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDuplicate}>
                  <ListItemIcon>
                    <CopyAll fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Duplicate</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <ListItemIcon>
                    <Delete fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2">Section Visibility</Typography>
        <FormControlLabel
          control={<Checkbox checked={visible} onChange={handleVisibleChange} />}
          label={visible ? 'Visible' : 'Hidden'}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {fields.map((field, fieldIndex) => (
        <Field
          key={field.id}
          field={field}
          sectionId={id}
          index={fieldIndex}
          onFieldChange={onFieldChange}
          onMoveField={onMoveField}
          onDeleteField={onDeleteField}
          onDuplicateField={onDuplicateField}
        />
      ))}

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => onAddField(id)}
        sx={{ mt: 2 }}
      >
        Add Field
      </Button>
      <DragHandleIcon />
    </SectionPaper>
  );
};

// Field Component
interface FieldProps {
  field: TemplateField;
  sectionId: string;
  index: number;
  onFieldChange: (sectionId: string, fieldId: string, field: Partial<TemplateField>) => void;
  onMoveField: (sectionId: string, dragId: string, hoverId: string) => void;
  onDeleteField: (sectionId: string, fieldId: string) => void;
  onDuplicateField: (sectionId: string, fieldId: string) => void;
}

const Field: React.FC<FieldProps> = ({
  field,
  sectionId,
  index,
  onFieldChange,
  onMoveField,
  onDeleteField,
  onDuplicateField,
}) => {
  const { id, label, type, required, placeholder, options, visible } = field;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isEditing, setIsEditing] = useState(false);
  const [fieldLabel, setFieldLabel] = useState(label);
  const [fieldType, setFieldType] = useState(type);
  const [fieldRequired, setFieldRequired] = useState(required);
  const [fieldPlaceholder, setFieldPlaceholder] = useState(placeholder || '');
  const [fieldOptions, setFieldOptions] = useState<FieldOption[]>(options || []);
  const [newOption, setNewOption] = useState('');
  const [visibleState, setVisibleState] = useState(visible);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditField = () => {
    setIsEditing(true);
    handleClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFieldLabel(label);
    setFieldType(type);
    setFieldRequired(required);
    setFieldPlaceholder(placeholder || '');
    setFieldOptions(options || []);
    setVisibleState(visible);
  };

  const handleSaveField = () => {
    onFieldChange(sectionId, id, {
      label: fieldLabel,
      type: fieldType,
      required: fieldRequired,
      placeholder: fieldPlaceholder,
      options: fieldOptions,
      visible: visibleState,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteField(sectionId, id);
    handleClose();
  };

  const handleDuplicate = () => {
    onDuplicateField(sectionId, id);
    handleClose();
  };

  const handleOptionAdd = () => {
    if (newOption.trim() !== '') {
      const newOptionObj: FieldOption = { id: generateId(), label: newOption.trim() };
      setFieldOptions([...fieldOptions, newOptionObj]);
      setNewOption('');
    }
  };

  const handleOptionDelete = (optionId: string) => {
    setFieldOptions(fieldOptions.filter((option) => option.id !== optionId));
  };

  const { isDragging, drag } = useFieldDrag(id);
  const { drop } = useFieldDrop(id, (dragId, hoverId) => onMoveField(sectionId, dragId, hoverId));

  const handleVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisibleState(event.target.checked);
  };

  const fieldStyle = {
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '2px dashed gray' : '1px dashed #ddd',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: isDragging ? '#eee' : 'white',
  };

  drag(drop(document.getElementById(`field-${id}`) as any));

  return (
    <FieldPaper id={`field-${id}`} ref={(node) => drag(drop(node as any))} style={fieldStyle}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              label="Field Label"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              select
              label="Field Type"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value as FieldType)}
              size="small"
              sx={{ mb: 1 }}
            >
              <MenuItem value={FieldType.TEXT}>Text</MenuItem>
              <MenuItem value={FieldType.NUMBER}>Number</MenuItem>
              <MenuItem value={FieldType.DATE}>Date</MenuItem>
              <MenuItem value={FieldType.DROPDOWN}>Dropdown</MenuItem>
              <MenuItem value={FieldType.CHECKBOX}>Checkbox</MenuItem>
              <MenuItem value={FieldType.TEXTAREA}>Textarea</MenuItem>
            </TextField>
            <FormControlLabel
              control={<Checkbox checked={fieldRequired} onChange={(e) => setFieldRequired(e.target.checked)} />}
              label="Required"
              sx={{ mb: 1 }}
            />
            <TextField
              label="Placeholder"
              value={fieldPlaceholder}
              onChange={(e) => setFieldPlaceholder(e.target.value)}
              size="small"
              sx={{ mb: 1 }}
            />
            {fieldType === FieldType.DROPDOWN && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Options:</Typography>
                {fieldOptions.map((option) => (
                  <Chip
                    key={option.id}
                    label={option.label}
                    onDelete={() => handleOptionDelete(option.id)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="New Option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    size="small"
                  />
                  <IconButton onClick={handleOptionAdd}>
                    <Add />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="subtitle1">
            {label} ({type})
          </Typography>
        )}

        <Box>
          {isEditing ? (
            <Box>
              <Button onClick={handleSaveField} variant="contained" color="primary" size="small">
                Save
              </Button>
              <Button onClick={handleCancelEdit} variant="outlined" color="secondary" size="small" sx={{ ml: 1 }}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Box>
              <Tooltip title="Field Actions">
                <IconButton
                  aria-label="field actions"
                  aria-controls={`field-menu-${id}`}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu
                id={`field-menu-${id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleEditField}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDuplicate}>
                  <ListItemIcon>
                    <CopyAll fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Duplicate</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <ListItemIcon>
                    <Delete fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2">Field Visibility</Typography>
        <FormControlLabel
          control={<Checkbox checked={visibleState} onChange={handleVisibleChange} />}
          label={visibleState ? 'Visible' : 'Hidden'}
        />
      </Box>
      <DragHandleIcon />
    </FieldPaper>
  );
};

// Template Builder Component
const TemplateBuilder: React.FC = () => {
  const [sections, setSections] = useState<TemplateSection[]>(initialTemplateData.sections);

  const handleMoveSection = useCallback(
    (dragId: string, hoverId: string) => {
      const dragIndex = sections.findIndex((section) => section.id === dragId);
      const hoverIndex = sections.findIndex((section) => section.id === hoverId);

      if (dragIndex === -1 || hoverIndex === -1) {
        return;
      }

      const newSections = [...sections];
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, sections[dragIndex]);

      setSections(newSections);
    },
    [sections]
  );

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const handleDuplicateSection = (id: string) => {
    const sectionToDuplicate = sections.find((section) => section.id === id);
    if (sectionToDuplicate) {
      const newSection: TemplateSection = { ...sectionToDuplicate, id: generateId(), label: `${sectionToDuplicate.label} Copy` };
      setSections([...sections, newSection]);
    }
  };

  const handleSectionChange = (id: string, section: Partial<TemplateSection>) => {
    setSections(
      sections.map((s) => {
        if (s.id === id) {
          return { ...s, ...section };
        }
        return s;
      })
    );
  };

  const handleFieldChange = (sectionId: string, fieldId: string, field: Partial<TemplateField>) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const updatedFields = section.fields.map((f) => (f.id === fieldId ? { ...f, ...field } : f));
          return { ...section, fields: updatedFields };
        }
        return section;
      })
    );
  };

  const handleMoveField = useCallback(
    (sectionId: string, dragId: string, hoverId: string) => {
      setSections(
        sections.map((section) => {
          if (section.id === sectionId) {
            const dragIndex = section.fields.findIndex((field) => field.id === dragId);
            const hoverIndex = section.fields.findIndex((field) => field.id === hoverId);

            if (dragIndex === -1 || hoverIndex === -1) {
              return section;
            }

            const newFields = [...section.fields];
            newFields.splice(dragIndex, 1);
            newFields.splice(hoverIndex, 0, section.fields[dragIndex]);

            return { ...section, fields: newFields };
          }
          return section;
        })
      );
    },
    [sections]
  );

  const handleAddField = (sectionId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const newField: TemplateField = {
            id: generateId(),
            label: 'New Field',
            type: FieldType.TEXT,
            required: false,
            visible: true,
          };
          return { ...section, fields: [...section.fields, newField] };
        }
        return section;
      })
    );
  };

  const handleDeleteField = (sectionId: string, fieldId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const updatedFields = section.fields.filter((field) => field.id !== fieldId);
          return { ...section, fields: updatedFields };
        }
        return section;
      })
    );
  };

  const handleDuplicateField = (sectionId: string, fieldId: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const fieldToDuplicate = section.fields.find((field) => field.id === fieldId);
          if (fieldToDuplicate) {
            const newField: TemplateField = { ...fieldToDuplicate, id: generateId(), label: `${fieldToDuplicate.label} Copy` };
            return { ...section, fields: [...section.fields, newField] };
          }
        }
        return section;
      })
    );
  };

  const handleAddSection = () => {
    const newSection: TemplateSection = {
      id: generateId(),
      label: 'New Section',
      type: SectionType.STANDARD,
      fields: [],
      visible: true,
    };
    setSections([...sections, newSection]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Template Builder
        </Typography>
        {sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            index={index}
            onMoveSection={handleMoveSection}
            onDeleteSection={handleDeleteSection}
            onDuplicateSection={handleDuplicateSection}
            onSectionChange={handleSectionChange}
            onFieldChange={handleFieldChange}
            onMoveField={handleMoveField}
            onAddField={handleAddField}
            onDeleteField={handleDeleteField}
            onDuplicateField={handleDuplicateField}
          />
        ))}
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddSection}>
          Add Section
        </Button>
      </Box>
    </DndProvider>
  );
};

export default TemplateBuilder;
