
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { bravoColors } from '@/theme/colors';

interface TemplateSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'checkbox' | 'dropdown';
  options?: string[];
}

interface TemplateEditorProps {
  templateName: string;
  initialSections?: TemplateSection[];
  onSave: (sections: TemplateSection[]) => void;
  onBack: () => void;
}

const SortableSection: React.FC<{
  section: TemplateSection;
  onEdit: (section: TemplateSection) => void;
  onDelete: (id: string) => void;
}> = ({ section, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <IconButton
            {...attributes}
            {...listeners}
            sx={{ 
              cursor: 'grab',
              color: bravoColors.text.secondary,
              mt: -1,
              '&:active': { cursor: 'grabbing' }
            }}
          >
            <DragIndicatorIcon />
          </IconButton>
          
          <Box flex={1}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: bravoColors.text.primary }}>
                {section.title}
              </Typography>
              <Box display="flex" gap={1}>
                <Chip 
                  label={section.type.toUpperCase()} 
                  size="small"
                  sx={{ 
                    backgroundColor: bravoColors.primaryFlat,
                    color: 'white',
                    fontSize: '0.75rem'
                  }}
                />
                <IconButton size="small" onClick={() => onEdit(section)}>
                  <EditIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(section.id)}>
                  <DeleteIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ color: bravoColors.text.secondary, mb: 1 }}>
              {section.content}
            </Typography>
            
            {section.options && section.options.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                {section.options.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateName,
  initialSections = [],
  onSave,
  onBack
}) => {
  const [sections, setSections] = useState<TemplateSection[]>(initialSections);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<TemplateSection | null>(null);
  const [sectionForm, setSectionForm] = useState({
    title: '',
    content: '',
    type: 'text' as 'text' | 'list' | 'checkbox' | 'dropdown',
    options: ['']
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddSection = () => {
    setEditingSection(null);
    setSectionForm({
      title: '',
      content: '',
      type: 'text',
      options: ['']
    });
    setOpenAddSection(true);
  };

  const handleEditSection = (section: TemplateSection) => {
    setEditingSection(section);
    setSectionForm({
      title: section.title,
      content: section.content,
      type: section.type,
      options: section.options || ['']
    });
    setOpenAddSection(true);
  };

  const handleDeleteSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
  };

  const handleSaveSection = () => {
    const newSection: TemplateSection = {
      id: editingSection?.id || `section-${Date.now()}`,
      title: sectionForm.title,
      content: sectionForm.content,
      type: sectionForm.type,
      options: sectionForm.type !== 'text' ? sectionForm.options.filter(opt => opt.trim()) : undefined
    };

    if (editingSection) {
      setSections(prev => prev.map(section => 
        section.id === editingSection.id ? newSection : section
      ));
    } else {
      setSections(prev => [...prev, newSection]);
    }

    setOpenAddSection(false);
  };

  const handleOptionChange = (index: number, value: string) => {
    setSectionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleAddOption = () => {
    setSectionForm(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index: number) => {
    setSectionForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="between" mb={4}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={onBack} sx={{ mr: 2, color: bravoColors.primaryFlat }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
            Editing: {templateName}
          </Typography>
        </Box>
        
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddSection}
            sx={{
              borderColor: bravoColors.secondary,
              color: bravoColors.secondary,
              borderRadius: 2,
              '&:hover': {
                borderColor: bravoColors.primaryFlat,
                backgroundColor: bravoColors.background?.light
              }
            }}
          >
            ADD SECTION
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => onSave(sections)}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat
              }
            }}
          >
            SAVE TEMPLATE
          </Button>
        </Box>
      </Box>

      {/* Instructions */}
      <Typography variant="body2" sx={{ color: bravoColors.text.secondary, mb: 4 }}>
        Drag and drop sections to reorder them. Click the edit icon to modify a section or the delete icon to remove it.
      </Typography>

      {/* Sections List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onEdit={handleEditSection}
              onDelete={handleDeleteSection}
            />
          ))}
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            border: '2px dashed #ccc',
            borderRadius: 2,
            backgroundColor: '#f9f9f9'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: bravoColors.text.secondary }}>
            No sections added yet
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: bravoColors.text.secondary }}>
            Start building your template by adding sections
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSection}
            sx={{
              backgroundColor: bravoColors.primaryFlat,
              color: 'white',
              borderRadius: 2
            }}
          >
            ADD FIRST SECTION
          </Button>
        </Box>
      )}

      {/* Add/Edit Section Dialog */}
      <Dialog
        open={openAddSection}
        onClose={() => setOpenAddSection(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </Typography>
            <IconButton onClick={() => setOpenAddSection(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Section Title *"
              value={sectionForm.title}
              onChange={(e) => setSectionForm(prev => ({ ...prev, title: e.target.value }))}
              variant="outlined"
              size="small"
            />
            
            <FormControl fullWidth size="small">
              <InputLabel>Section Type</InputLabel>
              <Select
                value={sectionForm.type}
                label="Section Type"
                onChange={(e) => setSectionForm(prev => ({ 
                  ...prev, 
                  type: e.target.value as any,
                  options: e.target.value === 'text' ? [] : ['']
                }))}
              >
                <MenuItem value="text">Text Field</MenuItem>
                <MenuItem value="list">Bullet List</MenuItem>
                <MenuItem value="checkbox">Checkbox List</MenuItem>
                <MenuItem value="dropdown">Dropdown Menu</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Section Content/Description"
              value={sectionForm.content}
              onChange={(e) => setSectionForm(prev => ({ ...prev, content: e.target.value }))}
              variant="outlined"
              size="small"
              placeholder="Enter the content or instructions for this section..."
            />
            
            {sectionForm.type !== 'text' && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Options (for {sectionForm.type})
                </Typography>
                {sectionForm.options.map((option, index) => (
                  <Box key={index} display="flex" gap={1} mb={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    {sectionForm.options.length > 1 && (
                      <IconButton onClick={() => handleRemoveOption(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddOption}
                  sx={{ mt: 1 }}
                >
                  Add Option
                </Button>
              </Box>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenAddSection(false)}
            variant="outlined"
            sx={{
              borderColor: bravoColors.secondary,
              color: bravoColors.secondary
            }}
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSaveSection}
            variant="contained"
            disabled={!sectionForm.title.trim() || !sectionForm.content.trim()}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat
              }
            }}
          >
            {editingSection ? 'UPDATE' : 'ADD'} SECTION
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateEditor;
