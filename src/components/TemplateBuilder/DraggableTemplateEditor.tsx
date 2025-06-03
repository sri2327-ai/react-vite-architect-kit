
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  IconButton,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
  MenuList,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DragIndicator as DragIndicatorIcon,
  Close as CloseIcon,
  AutoFixHigh as AutoFixHighIcon,
  HelpOutline as HelpOutlineIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TemplateItem {
  id: string;
  name: string;
  type: string;
  content: string;
  description?: string;
  is_editing?: boolean;
  temp_description?: string;
  temp_template?: string;
  items?: Array<{
    content: string;
    name?: string;
  }>;
}

interface DraggableTemplateEditorProps {
  initialItems?: TemplateItem[];
  onSave?: (items: TemplateItem[]) => void;
}

interface SortableItemProps {
  item: TemplateItem;
  index: number;
  onEdit: (index: number, field: string, value: any) => void;
  onDelete: (index: number) => void;
  onAiEdit: (index: number) => void;
  onHelp: (index: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ 
  item, 
  index, 
  onEdit, 
  onDelete, 
  onAiEdit, 
  onHelp 
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const getDescriptionForType = (type: string): string => {
    switch (type) {
      case 'paragraph':
        return 'A.I. will write a descriptive block of text following the guidelines below.';
      case 'bulleted_list':
        return 'A.I. will create a bulleted list based on the instructions provided';
      case 'section_header':
        return 'A.I. will include the following section headers in the note';
      case 'static_text':
        return 'A.I. will insert the exact text below into the note.';
      default:
        return 'A.I. will craft content in a structured format, as instructed.';
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      elevation={3} 
      sx={{ 
        borderRadius: 2,
        '&:hover': {
          boxShadow: '0px 8px 16px rgba(0,0,0,0.1)'
        },
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              {...attributes}
              {...listeners}
              size="small"
              sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
            >
              <DragIndicatorIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" sx={{ color: "#343434", fontWeight: 600, mb: 0.5 }}>
                {item.name}
              </Typography>
              <Chip 
                label={item.type.replace('_', ' ')} 
                size="small" 
                variant="outlined"
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => onHelp(index)}
              title="Help Me"
            >
              <HelpOutlineIcon />
            </IconButton>
            
            <IconButton 
              size="small" 
              color="secondary"
              onClick={() => onAiEdit(index)}
              title="AI Edit"
            >
              <AutoFixHighIcon />
            </IconButton>
            
            <IconButton 
              size="small" 
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
            >
              <MenuList>
                <MenuItem onClick={() => { onEdit(index, "is_editing", true); handleMenuClose(); }}>
                  <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { onDelete(index); handleMenuClose(); }}>
                  <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {item.is_editing ? (
          <Stack spacing={2}>
            <TextField
              label="Section Name"
              value={item.temp_description || item.name}
              onChange={(e) => onEdit(index, "temp_description", e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Instructions for A.I."
              value={item.temp_template || item.content}
              onChange={(e) => onEdit(index, "temp_template", e.target.value)}
              multiline
              rows={4}
              fullWidth
              size="small"
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  onEdit(index, "name", item.temp_description || item.name);
                  onEdit(index, "content", item.temp_template || item.content);
                  onEdit(index, "is_editing", false);
                  onEdit(index, "temp_description", "");
                  onEdit(index, "temp_template", "");
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  onEdit(index, "is_editing", false);
                  onEdit(index, "temp_description", "");
                  onEdit(index, "temp_template", "");
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {item.description || getDescriptionForType(item.type)}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              {item.content}
            </Typography>

            {item.items && item.items.length > 0 && (
              <Box sx={{ ml: 2 }}>
                {item.items.map((subItem, subIdx) => (
                  <Stack key={subIdx} direction="row" alignItems="flex-start" spacing={1}>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2 }}>
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subItem.name ? `${subItem.name}: ` : ''}{subItem.content}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

const DraggableTemplateEditor: React.FC<DraggableTemplateEditorProps> = ({ 
  initialItems = [], 
  onSave 
}) => {
  const [sectionList, setSectionList] = useState<TemplateItem[]>(initialItems);
  const [addSectionDialog, setAddSectionDialog] = useState(false);
  const [aiEditDialog, setAiEditDialog] = useState(false);
  const [helpDialog, setHelpDialog] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const [newSectionType, setNewSectionType] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSectionList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const editItem = (index: number, field: string, value: any) => {
    setSectionList(prev => prev.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    ));
  };

  const deleteItem = (index: number) => {
    setSectionList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAiEdit = (index: number) => {
    setSelectedItemIndex(index);
    setAiEditDialog(true);
  };

  const handleHelp = (index: number) => {
    setSelectedItemIndex(index);
    setHelpDialog(true);
  };

  const applyAiEdit = () => {
    if (selectedItemIndex >= 0 && aiPrompt.trim()) {
      // Simulate AI enhancement
      const enhancedContent = `${sectionList[selectedItemIndex].content}\n\nAI Enhancement: ${aiPrompt}`;
      editItem(selectedItemIndex, "content", enhancedContent);
      setAiEditDialog(false);
      setAiPrompt('');
      setSelectedItemIndex(-1);
    }
  };

  const addNewSection = () => {
    if (!newSectionName || !newSectionType) return;
    
    const newSection: TemplateItem = {
      id: Date.now().toString(),
      name: newSectionName,
      type: newSectionType,
      content: newSectionContent,
      description: getDescriptionForType(newSectionType)
    };

    setSectionList(prev => [...prev, newSection]);
    setAddSectionDialog(false);
    setNewSectionName('');
    setNewSectionContent('');
    setNewSectionType('');
  };

  const getDescriptionForType = (type: string): string => {
    switch (type) {
      case 'paragraph':
        return 'A.I. will write a descriptive block of text following the guidelines below.';
      case 'bulleted_list':
        return 'A.I. will create a bulleted list based on the instructions provided';
      case 'section_header':
        return 'A.I. will include the following section headers in the note';
      case 'static_text':
        return 'A.I. will insert the exact text below into the note.';
      default:
        return 'A.I. will craft an examination list in a structured format, as instructed.';
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(sectionList);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1d4556', fontWeight: 600 }}>
          Draggable Template Editor
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddSectionDialog(true)}
            sx={{
              borderRadius: "5px",
              padding: "5px 10px",
              color: "#F4FCFF",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Add Section
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              borderRadius: "5px",
              padding: "5px 10px",
              color: "#F4FCFF",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Save Template
          </Button>
        </Stack>
      </Stack>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionList.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={2} sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            pr: 1
          }}>
            {sectionList.map((item, idx) => (
              <SortableItem
                key={item.id}
                item={item}
                index={idx}
                onEdit={editItem}
                onDelete={deleteItem}
                onAiEdit={handleAiEdit}
                onHelp={handleHelp}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      {/* Add Section Dialog */}
      <Dialog 
        open={addSectionDialog} 
        onClose={() => setAddSectionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add New Section</Typography>
            <IconButton onClick={() => setAddSectionDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Section Name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              fullWidth
              size="small"
            />
            
            <FormControl fullWidth size="small">
              <InputLabel>Section Type</InputLabel>
              <Select
                value={newSectionType}
                onChange={(e) => setNewSectionType(e.target.value)}
                label="Section Type"
              >
                <MenuItem value="paragraph">Paragraph</MenuItem>
                <MenuItem value="bulleted_list">Bulleted List</MenuItem>
                <MenuItem value="section_header">Section Header</MenuItem>
                <MenuItem value="static_text">Static Text</MenuItem>
                <MenuItem value="exam_list">Exam List</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Content/Instructions"
              value={newSectionContent}
              onChange={(e) => setNewSectionContent(e.target.value)}
              multiline
              rows={4}
              fullWidth
              size="small"
              helperText="Provide instructions for what the A.I. should generate in this section"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setAddSectionDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={addNewSection}
            disabled={!newSectionName || !newSectionType}
          >
            Add Section
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Edit Dialog */}
      <Dialog open={aiEditDialog} onClose={() => setAiEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">AI Edit Section</Typography>
            <IconButton onClick={() => setAiEditDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tell AI how to enhance this section:
            </Typography>
            <TextField
              label="AI Instructions"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              multiline
              rows={4}
              fullWidth
              placeholder="e.g., 'Make this more detailed', 'Add medical terminology', 'Simplify the language'"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setAiEditDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={applyAiEdit}
            disabled={!aiPrompt.trim()}
            startIcon={<AutoFixHighIcon />}
          >
            Apply AI Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={helpDialog} onClose={() => setHelpDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Section Help</Typography>
            <IconButton onClick={() => setHelpDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="h6">Tips for this section:</Typography>
            <Typography variant="body2">
              • Use clear, concise language
            </Typography>
            <Typography variant="body2">
              • Include specific instructions for AI
            </Typography>
            <Typography variant="body2">
              • Consider medical accuracy and compliance
            </Typography>
            <Typography variant="body2">
              • Drag sections to reorder them
            </Typography>
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setHelpDialog(false)} variant="contained">
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DraggableTemplateEditor;
