import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Fade,
  Tooltip,
  Chip,
  useMediaQuery,
  Stack
} from '@mui/material';
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
import {
  DragIndicator as DragIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
  AutoFixHigh as AutoFixHighIcon,
  Help as HelpIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import AddSectionOverlay from './AddSectionOverlay';
import HelpDialog from './HelpDialog';

interface TemplateItem {
  id: string;
  name: string;
  type: string;
  content: string;
  description?: string;
  paste_template?: string;
  is_editing?: boolean;
  is_editing_template?: boolean;
  temp_description?: string;
  temp_template?: string;
  items?: Array<{
    content: string;
    name?: string;
  }>;
  examItems?: Array<{
    id: string;
    title: string;
    instructions: string;
    normalText: string;
  }>;
  checklistItems?: Array<{
    id: string;
    buttonName: string;
    text: string;
  }>;
  notDiscussedBehavior?: string;
  normalLimitsBehavior?: string;
  hideEmptyItems?: boolean;
  instructions?: string;
}

interface SortableItemProps {
  item: TemplateItem;
  index: number;
  totalItems: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAiEdit: (id: string) => void;
  onHelp: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  index,
  totalItems,
  onEdit,
  onDelete,
  onCopy,
  onMoveUp,
  onMoveDown,
  onAiEdit,
  onHelp,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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

  // Prevent event bubbling for all button clicks
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Fade in={true} timeout={300}>
        <Paper
          elevation={isDragging ? 8 : 2}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 2,
            borderRadius: 3,
            border: `2px solid ${isDragging ? bravoColors.primaryFlat : 'transparent'}`,
            background: isDragging 
              ? `linear-gradient(135deg, ${alpha(bravoColors.primaryFlat, 0.05)} 0%, ${alpha(bravoColors.secondary, 0.05)} 100%)`
              : '#ffffff',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: alpha(bravoColors.primaryFlat, 0.3),
              boxShadow: `0 8px 32px ${alpha(bravoColors.primaryFlat, 0.15)}`,
            },
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            mb: 2,
            gap: 2
          }}>
            {/* Left Section - Drag Handle & Info */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1, minWidth: 0 }}>
              {/* Drag Handle */}
              <Box
                {...attributes}
                {...listeners}
                sx={{
                  cursor: isDragging ? 'grabbing' : 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: alpha(bravoColors.primaryFlat, 0.08),
                  color: bravoColors.primaryFlat,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  mt: 0.5,
                  '&:hover': {
                    backgroundColor: alpha(bravoColors.primaryFlat, 0.15),
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  }
                }}
              >
                <DragIcon sx={{ fontSize: 20 }} />
              </Box>

              {/* Content Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: bravoColors.primaryFlat,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.2,
                      wordBreak: 'break-word'
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Chip
                    label={item.type}
                    size="small"
                    sx={{
                      backgroundColor: alpha(bravoColors.secondary, 0.15),
                      color: bravoColors.secondary,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24
                    }}
                  />
                </Box>
                
                {item.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 1.5,
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      lineHeight: 1.4,
                      wordBreak: 'break-word'
                    }}
                  >
                    {item.description}
                  </Typography>
                )}

                {item.content && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      backgroundColor: alpha(bravoColors.primaryFlat, 0.02),
                      border: `1px solid ${alpha(bravoColors.primaryFlat, 0.1)}`,
                      borderRadius: 2,
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                        fontFamily: 'monospace'
                      }}
                    >
                      {item.content}
                    </Typography>
                  </Paper>
                )}

                {/* Action Buttons Row */}
                <Stack 
                  direction="row" 
                  spacing={1} 
                  sx={{ 
                    flexWrap: 'wrap',
                    gap: { xs: 0.5, sm: 1 }
                  }}
                >
                  <Tooltip title="Move Up">
                    <IconButton
                      size="small"
                      onClick={(e) => handleButtonClick(e, () => onMoveUp(item.id))}
                      disabled={index === 0}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.action.active, 0.08),
                        '&:hover': { backgroundColor: alpha(theme.palette.action.active, 0.15) },
                        '&:disabled': { opacity: 0.3 }
                      }}
                    >
                      <UpIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Move Down">
                    <IconButton
                      size="small"
                      onClick={(e) => handleButtonClick(e, () => onMoveDown(item.id))}
                      disabled={index === totalItems - 1}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.action.active, 0.08),
                        '&:hover': { backgroundColor: alpha(theme.palette.action.active, 0.15) },
                        '&:disabled': { opacity: 0.3 }
                      }}
                    >
                      <DownIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Duplicate">
                    <IconButton
                      size="small"
                      onClick={(e) => handleButtonClick(e, () => onCopy(item.id))}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.info.main, 0.08),
                        color: theme.palette.info.main,
                        '&:hover': { backgroundColor: alpha(theme.palette.info.main, 0.15) }
                      }}
                    >
                      <CopyIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => handleButtonClick(e, () => onDelete(item.id))}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                        color: theme.palette.error.main,
                        '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.15) }
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Box>

            {/* Right Section - Primary Actions */}
            {!isMobile && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={(e) => handleButtonClick(e, () => onEdit(item.id))}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 100,
                    borderColor: bravoColors.primaryFlat,
                    color: bravoColors.primaryFlat,
                    '&:hover': {
                      borderColor: bravoColors.secondary,
                      backgroundColor: alpha(bravoColors.secondary, 0.08)
                    }
                  }}
                >
                  Edit
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AutoFixHighIcon />}
                  onClick={(e) => handleButtonClick(e, () => onHelp(item.id))}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 100,
                    borderColor: bravoColors.secondary,
                    color: bravoColors.secondary,
                    '&:hover': {
                      borderColor: bravoColors.primaryFlat,
                      backgroundColor: alpha(bravoColors.primaryFlat, 0.08)
                    }
                  }}
                >
                  Help Me
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile Actions */}
          {isMobile && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${alpha(bravoColors.primaryFlat, 0.1)}`
            }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={(e) => handleButtonClick(e, () => onEdit(item.id))}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: bravoColors.primaryFlat,
                  color: bravoColors.primaryFlat
                }}
              >
                Edit
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<AutoFixHighIcon />}
                onClick={(e) => handleButtonClick(e, () => onHelp(item.id))}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: bravoColors.secondary,
                  color: bravoColors.secondary
                }}
              >
                Help Me
              </Button>
            </Box>
          )}
        </Paper>
      </Fade>
    </div>
  );
};

interface DraggableTemplateEditorProps {
  initialItems?: TemplateItem[];
  onSave?: (items: TemplateItem[]) => void;
}

const DraggableTemplateEditor: React.FC<DraggableTemplateEditorProps> = ({
  initialItems = [],
  onSave
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [items, setItems] = useState<TemplateItem[]>(initialItems);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingItem, setEditingItem] = useState<TemplateItem | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [helpItemName, setHelpItemName] = useState<string>('');

  // Update items when initialItems changes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Auto-save when items are reordered
        if (onSave) {
          onSave(newItems);
        }
        
        return newItems;
      });
    }
  }, [onSave]);

  const handleAddSection = useCallback((sectionTemplate: any) => {
    const newItem: TemplateItem = {
      id: `section-${Date.now()}`,
      name: sectionTemplate.name,
      type: sectionTemplate.category?.toLowerCase() || 'custom',
      content: sectionTemplate.description || 'AI will generate content based on the instructions below.',
      description: 'A.I. will write content following the guidelines below.'
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    setShowAddSection(false);
    
    // Auto-save when section is added
    if (onSave) {
      onSave(newItems);
    }
    
    console.log('Section added successfully:', newItem);
  }, [items, onSave]);

  const handleEditItem = useCallback((id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      setEditingItem(item);
      setShowEditDialog(true);
    }
  }, [items]);

  const handleSaveEdit = useCallback(() => {
    if (editingItem) {
      const newItems = items.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
      setItems(newItems);
      setShowEditDialog(false);
      setEditingItem(null);
      
      // Auto-save when item is edited
      if (onSave) {
        onSave(newItems);
      }
    }
  }, [editingItem, items, onSave]);

  const handleDeleteItem = useCallback((id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    
    // Auto-save when item is deleted
    if (onSave) {
      onSave(newItems);
    }
  }, [items, onSave]);

  const handleCopyItem = useCallback((id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newItem = {
        ...item,
        id: `${item.id}-copy-${Date.now()}`,
        name: `${item.name} (Copy)`
      };
      const newItems = [...items, newItem];
      setItems(newItems);
      
      // Auto-save when item is copied
      if (onSave) {
        onSave(newItems);
      }
    }
  }, [items, onSave]);

  const handleMoveUp = useCallback((id: string) => {
    const index = items.findIndex(item => item.id === id);
    if (index > 0) {
      const newItems = arrayMove(items, index, index - 1);
      setItems(newItems);
      
      // Auto-save when item is moved
      if (onSave) {
        onSave(newItems);
      }
    }
  }, [items, onSave]);

  const handleMoveDown = useCallback((id: string) => {
    const index = items.findIndex(item => item.id === id);
    if (index < items.length - 1) {
      const newItems = arrayMove(items, index, index + 1);
      setItems(newItems);
      
      // Auto-save when item is moved
      if (onSave) {
        onSave(newItems);
      }
    }
  }, [items, onSave]);

  const handleAiEdit = useCallback((id: string) => {
    console.log('AI edit for item:', id);
    // TODO: Implement AI editing functionality
  }, []);

  const handleHelp = useCallback((id: string) => {
    const item = items.find(item => item.id === id);
    setHelpItemName(item?.name || '');
    setShowHelpDialog(true);
  }, [items]);

  const handleSaveTemplate = useCallback(() => {
    if (onSave) {
      onSave(items);
    }
    console.log('Template saved:', items);
  }, [items, onSave]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: bravoColors.primaryFlat,
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          Template Sections ({items.length})
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddSection(true)}
            sx={{
              backgroundColor: bravoColors.secondary,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat
              }
            }}
          >
            Add Section
          </Button>

          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveTemplate}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: bravoColors.primaryFlat,
              color: bravoColors.primaryFlat,
              px: { xs: 2, sm: 3 },
              '&:hover': {
                borderColor: bravoColors.secondary,
                backgroundColor: alpha(bravoColors.secondary, 0.08)
              }
            }}
          >
            Save Template
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {items.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: 'center',
              backgroundColor: alpha(bravoColors.primaryFlat, 0.02),
              border: `2px dashed ${alpha(bravoColors.primaryFlat, 0.2)}`,
              borderRadius: 3
            }}
          >
            <AddIcon sx={{ 
              fontSize: { xs: 48, sm: 64 }, 
              color: alpha(bravoColors.primaryFlat, 0.4),
              mb: 2 
            }} />
            <Typography variant="h6" sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: bravoColors.primaryFlat,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              No sections added yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ 
              mb: 3,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}>
              Start building your template by adding sections
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddSection(true)}
              sx={{
                backgroundColor: bravoColors.secondary,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: bravoColors.primaryFlat
                }
              }}
            >
              Add Your First Section
            </Button>
          </Paper>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  index={index}
                  totalItems={items.length}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onCopy={handleCopyItem}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onAiEdit={handleAiEdit}
                  onHelp={handleHelp}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </Box>

      {/* Add Section Overlay */}
      <AddSectionOverlay
        open={showAddSection}
        onClose={() => setShowAddSection(false)}
        onAddSection={handleAddSection}
      />

      {/* Edit Dialog */}
      <Dialog 
        open={showEditDialog} 
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Edit Section: {editingItem?.name}
          </Typography>
          
          <TextField
            fullWidth
            label="Section Name"
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Description"
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={editingItem?.content || ''}
            onChange={(e) => setEditingItem(prev => prev ? { ...prev, content: e.target.value } : null)}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setShowEditDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEdit}
            sx={{ backgroundColor: bravoColors.primaryFlat }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Dialog */}
      <HelpDialog
        open={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        itemName={helpItemName}
      />
    </Box>
  );
};

export default DraggableTemplateEditor;
