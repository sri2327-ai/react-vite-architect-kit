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
  DialogTitle,
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
  Settings as SettingsIcon,
  Description as DescriptionIcon
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
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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
            p: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 1.5, sm: 2 },
            borderRadius: { xs: 2, sm: 2.5, md: 3 },
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
            overflow: 'hidden',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            mb: { xs: 1.5, sm: 2 },
            gap: { xs: 1, sm: 1.5, md: 2 },
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            width: '100%'
          }}>
            {/* Left Section - Drag Handle & Info */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: { xs: 1, sm: 1.5, md: 2 }, 
              flex: 1, 
              minWidth: 0,
              width: { xs: '100%', md: 'auto' }
            }}>
              {/* Drag Handle */}
              <Box
                {...attributes}
                {...listeners}
                sx={{
                  cursor: isDragging ? 'grabbing' : 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 32, sm: 36, md: 40 },
                  height: { xs: 32, sm: 36, md: 40 },
                  borderRadius: { xs: 1.5, sm: 2 },
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
                <DragIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
              </Box>

              {/* Content Info */}
              <Box sx={{ 
                flex: 1, 
                minWidth: 0,
                width: '100%',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 0.5, sm: 1 }, 
                  mb: { xs: 0.5, sm: 1 }, 
                  flexWrap: 'wrap',
                  width: '100%'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: bravoColors.primaryFlat,
                      fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.1rem' },
                      lineHeight: 1.2,
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: '1 1 auto',
                      minWidth: 0
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
                      fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                      height: { xs: 18, sm: 20, md: 24 },
                      flexShrink: 0
                    }}
                  />
                </Box>
                
                {item.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: { xs: 2, sm: 3 },
                      WebkitBoxOrient: 'vertical',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.description}
                  </Typography>
                )}

                {item.content && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: { xs: 1, sm: 1.5, md: 2 }, 
                      backgroundColor: alpha(bravoColors.primaryFlat, 0.02),
                      border: `1px solid ${alpha(bravoColors.primaryFlat, 0.1)}`,
                      borderRadius: { xs: 1.5, sm: 2 },
                      mb: { xs: 1.5, sm: 2 },
                      width: '100%',
                      overflow: 'hidden'
                    }}
                  >
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 3, sm: 4, md: 5 },
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.content}
                    </Typography>
                  </Paper>
                )}

                {/* Action Buttons Row */}
                <Stack 
                  direction="row" 
                  spacing={{ xs: 0.5, sm: 0.75, md: 1 }} 
                  sx={{ 
                    flexWrap: 'wrap',
                    gap: { xs: 0.5, sm: 0.75, md: 1 },
                    width: '100%',
                    '& > *': {
                      flexShrink: 0
                    }
                  }}
                >
                  <span>
                    <Tooltip title={index === 0 ? "Already at top" : "Move Up"}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleButtonClick(e, () => onMoveUp(item.id))}
                        disabled={index === 0}
                        sx={{ 
                          backgroundColor: alpha(theme.palette.action.active, 0.08),
                          '&:hover': { backgroundColor: alpha(theme.palette.action.active, 0.15) },
                          '&:disabled': { opacity: 0.3 },
                          minWidth: { xs: 32, sm: 36, md: 40 },
                          height: { xs: 32, sm: 36, md: 40 },
                          borderRadius: { xs: 1, sm: 1.5, md: 2 }
                        }}
                      >
                        <UpIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />
                      </IconButton>
                    </Tooltip>
                  </span>
                  
                  <span>
                    <Tooltip title={index === totalItems - 1 ? "Already at bottom" : "Move Down"}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleButtonClick(e, () => onMoveDown(item.id))}
                        disabled={index === totalItems - 1}
                        sx={{ 
                          backgroundColor: alpha(theme.palette.action.active, 0.08),
                          '&:hover': { backgroundColor: alpha(theme.palette.action.active, 0.15) },
                          '&:disabled': { opacity: 0.3 },
                          minWidth: { xs: 32, sm: 36, md: 40 },
                          height: { xs: 32, sm: 36, md: 40 },
                          borderRadius: { xs: 1, sm: 1.5, md: 2 }
                        }}
                      >
                        <DownIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />
                      </IconButton>
                    </Tooltip>
                  </span>
                  
                  <Tooltip title="Duplicate">
                    <IconButton
                      size="small"
                      onClick={(e) => handleButtonClick(e, () => onCopy(item.id))}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.info.main, 0.08),
                        color: theme.palette.info.main,
                        '&:hover': { backgroundColor: alpha(theme.palette.info.main, 0.15) },
                        minWidth: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        borderRadius: { xs: 1, sm: 1.5, md: 2 }
                      }}
                    >
                      <CopyIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => handleButtonClick(e, () => onDelete(item.id))}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                        color: theme.palette.error.main,
                        '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.15) },
                        minWidth: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        borderRadius: { xs: 1, sm: 1.5, md: 2 }
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Box>

            {/* Right Section - Primary Actions - Hidden on mobile, shown on tablet+ */}
            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { sm: 'row', md: 'column' }, 
                gap: { sm: 1, md: 1 }, 
                alignItems: 'flex-end', 
                flexShrink: 0,
                width: { sm: 'auto', md: 'auto' },
                mt: { sm: 0, md: 0 }
              }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon sx={{ fontSize: { sm: 14, md: 16, lg: 18 } }} />}
                  onClick={(e) => handleButtonClick(e, () => onEdit(item.id))}
                  sx={{
                    borderRadius: { sm: 1.5, md: 2, lg: 2.5 },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: { sm: 80, md: 90, lg: 100 },
                    minHeight: { sm: 30, md: 32, lg: 36 },
                    fontSize: { sm: '0.7rem', md: '0.75rem', lg: '0.8rem' },
                    px: { sm: 1.5, md: 2, lg: 2.5 },
                    borderColor: bravoColors.primaryFlat,
                    color: bravoColors.primaryFlat,
                    '&:hover': {
                      borderColor: bravoColors.secondary,
                      backgroundColor: alpha(bravoColors.secondary, 0.08)
                    },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Edit
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AutoFixHighIcon sx={{ fontSize: { sm: 14, md: 16, lg: 18 } }} />}
                  onClick={(e) => handleButtonClick(e, () => onHelp(item.id))}
                  sx={{
                    borderRadius: { sm: 1.5, md: 2, lg: 2.5 },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: { sm: 80, md: 90, lg: 100 },
                    minHeight: { sm: 30, md: 32, lg: 36 },
                    fontSize: { sm: '0.7rem', md: '0.75rem', lg: '0.8rem' },
                    px: { sm: 1.5, md: 2, lg: 2.5 },
                    borderColor: bravoColors.secondary,
                    color: bravoColors.secondary,
                    '&:hover': {
                      borderColor: bravoColors.primaryFlat,
                      backgroundColor: alpha(bravoColors.primaryFlat, 0.08)
                    },
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isTablet ? 'Help' : 'Help Me'}
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile Actions */}
          {isMobile && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px solid ${alpha(bravoColors.primaryFlat, 0.1)}`,
              width: '100%'
            }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                onClick={(e) => handleButtonClick(e, () => onEdit(item.id))}
                sx={{
                  flex: 1,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  minHeight: 36,
                  px: 1.5,
                  borderColor: bravoColors.primaryFlat,
                  color: bravoColors.primaryFlat,
                  whiteSpace: 'nowrap'
                }}
              >
                Edit
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<AutoFixHighIcon sx={{ fontSize: 14 }} />}
                onClick={(e) => handleButtonClick(e, () => onHelp(item.id))}
                sx={{
                  flex: 1,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  minHeight: 36,
                  px: 1.5,
                  borderColor: bravoColors.secondary,
                  color: bravoColors.secondary,
                  whiteSpace: 'nowrap'
                }}
              >
                Help
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
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [items, setItems] = useState<TemplateItem[]>(initialItems);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingItem, setEditingItem] = useState<TemplateItem | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [helpItemName, setHelpItemName] = useState<string>('');
  const [showMacrosDialog, setShowMacrosDialog] = useState(false);
  const [macroText, setMacroText] = useState('');

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

  const handleSaveMacro = () => {
    if (macroText.trim()) {
      const newItem: TemplateItem = {
        id: `macro-${Date.now()}`,
        name: 'Macro Template',
        type: 'macro',
        content: macroText,
        description: 'Pasted from macro/template'
      };

      const newItems = [...items, newItem];
      setItems(newItems);
      setShowMacrosDialog(false);
      setMacroText('');
      
      // Auto-save when macro is added
      if (onSave) {
        onSave(newItems);
      }
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: bravoColors.primaryFlat,
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
        }}>
          Template Sections ({items.length})
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />}
            onClick={() => setShowMacrosDialog(true)}
            sx={{
              backgroundColor: 'transparent',
              borderRadius: { xs: 2, sm: 2.5, md: 3 },
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 1.25, md: 1.5 },
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
              minHeight: { xs: 40, sm: 44, md: 48 },
              borderColor: bravoColors.secondary,
              color: bravoColors.secondary,
              '&:hover': {
                borderColor: bravoColors.primaryFlat,
                backgroundColor: alpha(bravoColors.primaryFlat, 0.08)
              }
            }}
          >
            {isMobile ? 'Macros' : 'Macros/Templates'}
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />}
            onClick={() => setShowAddSection(true)}
            sx={{
              backgroundColor: bravoColors.secondary,
              borderRadius: { xs: 2, sm: 2.5, md: 3 },
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 1.25, md: 1.5 },
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
              minHeight: { xs: 40, sm: 44, md: 48 },
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat
              }
            }}
          >
            {isMobile ? 'Add' : 'Add Section'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<SaveIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />}
            onClick={handleSaveTemplate}
            sx={{
              borderRadius: { xs: 2, sm: 2.5, md: 3 },
              textTransform: 'none',
              fontWeight: 600,
              borderColor: bravoColors.primaryFlat,
              color: bravoColors.primaryFlat,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 1.25, md: 1.5 },
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
              minHeight: { xs: 40, sm: 44, md: 48 },
              '&:hover': {
                borderColor: bravoColors.secondary,
                backgroundColor: alpha(bravoColors.secondary, 0.08)
              }
            }}
          >
            {isMobile ? 'Save' : 'Save Template'}
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {items.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
              textAlign: 'center',
              backgroundColor: alpha(bravoColors.primaryFlat, 0.02),
              border: `2px dashed ${alpha(bravoColors.primaryFlat, 0.2)}`,
              borderRadius: 3
            }}
          >
            <AddIcon sx={{ 
              fontSize: { xs: 40, sm: 48, md: 64 }, 
              color: alpha(bravoColors.primaryFlat, 0.4),
              mb: 2 
            }} />
            <Typography variant="h6" sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: bravoColors.primaryFlat,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}>
              No sections added yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ 
              mb: 3,
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
            }}>
              Start building your template by adding sections
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddSection(true)}
              sx={{
                backgroundColor: bravoColors.secondary,
                borderRadius: { xs: 2, sm: 2.5, md: 3 },
                textTransform: 'none',
                fontWeight: 600,
                px: { xs: 3, sm: 4, md: 5 },
                py: { xs: 1.25, sm: 1.5, md: 1.75 },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                minHeight: { xs: 44, sm: 48, md: 52 },
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
        fullScreen={isMobile}
        PaperProps={{
          sx: { 
            borderRadius: { xs: 0, sm: 3, md: 4 },
            maxHeight: { xs: '100vh', sm: '90vh', md: '85vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
          fontWeight: 600,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 2.5, md: 3 }
        }}>
          Edit Section: {editingItem?.name}
        </DialogTitle>
        
        <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <TextField
            fullWidth
            label="Section Name"
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
            sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}
            size={isMobile ? "small" : "medium"}
          />
          
          <TextField
            fullWidth
            label="Description"
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
            sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}
            size={isMobile ? "small" : "medium"}
          />
          
          <TextField
            fullWidth
            multiline
            rows={isMobile ? 4 : isTablet ? 5 : 6}
            label="Content"
            value={editingItem?.content || ''}
            onChange={(e) => setEditingItem(prev => prev ? { ...prev, content: e.target.value } : null)}
            size={isMobile ? "small" : "medium"}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          pt: 0,
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Button 
            onClick={() => setShowEditDialog(false)}
            size={isMobile ? "small" : "medium"}
            sx={{
              minHeight: { xs: 40, sm: 44, md: 48 },
              px: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEdit}
            sx={{ 
              backgroundColor: bravoColors.primaryFlat,
              minHeight: { xs: 40, sm: 44, md: 48 },
              px: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
            }}
            size={isMobile ? "small" : "medium"}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Macros/Templates Dialog */}
      <Dialog 
        open={showMacrosDialog} 
        onClose={() => setShowMacrosDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { 
            borderRadius: { xs: 0, sm: 3, md: 4 },
            maxHeight: { xs: '100vh', sm: '90vh', md: '85vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
          fontWeight: 600,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 2.5, md: 3 }
        }}>
          Paste Macro/Template
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="body2" color="text.secondary" sx={{ 
            mb: { xs: 2, sm: 2.5, md: 3 },
            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
          }}>
            Paste your macro or template content below to add it as a new section.
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={isMobile ? 6 : isTablet ? 8 : 10}
            label="Macro/Template Content"
            value={macroText}
            onChange={(e) => setMacroText(e.target.value)}
            placeholder="Paste your macro or template content here..."
            size={isMobile ? "small" : "medium"}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          pt: 0,
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Button 
            onClick={() => {
              setShowMacrosDialog(false);
              setMacroText('');
            }}
            size={isMobile ? "small" : "medium"}
            sx={{
              minHeight: { xs: 40, sm: 44, md: 48 },
              px: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveMacro}
            disabled={!macroText.trim()}
            sx={{ 
              backgroundColor: bravoColors.primaryFlat,
              minHeight: { xs: 40, sm: 44, md: 48 },
              px: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
            }}
            size={isMobile ? "small" : "medium"}
          >
            Save
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
