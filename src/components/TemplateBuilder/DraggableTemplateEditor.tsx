import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Paper,
  Fade,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  AppBar,
  Toolbar
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Add as AddIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Help as HelpIcon,
  AutoFixHigh as AutoFixHighIcon,
  Close as CloseIcon,
  Psychology as PsychologyIcon,
  ViewHeadline as ViewHeadlineIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Title as TitleIcon,
  Assignment as AssignmentIcon,
  TextSnippet as TextSnippetIcon,
  Checklist as ChecklistIcon,
  SwapHoriz as SwapHorizIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FilterList as FilterListIcon,
  Create as CreateIcon,
  Save as SaveIcon
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
import AddSectionOverlay from './AddSectionOverlay';
import SectionConfigDialog from './SectionConfigDialog';
import SectionPlacementDialog from './SectionPlacementDialog';
import { bravoColors } from '../../theme/colors';

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
}

interface DraggableTemplateEditorProps {
  initialItems?: TemplateItem[];
  onSave?: (items: TemplateItem[]) => void;
}

interface SortableItemProps {
  item: TemplateItem;
  index: number;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onHelp: (id: string) => void;
  onAiEdit: (id: string) => void;
  getTypeColor: (type: string) => string;
  getTypeIcon: (type: string) => React.ReactNode;
  getTypeLabel: (type: string) => string;
  theme: any;
  totalItems: number;
}

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  index,
  onDelete,
  onCopy,
  onMoveUp,
  onMoveDown,
  onHelp,
  onAiEdit,
  getTypeColor,
  getTypeIcon,
  getTypeLabel,
  theme,
  totalItems
}) => {
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

  return (
    <div ref={setNodeRef} style={style}>
      <Fade in={true} timeout={300}>
        <Card 
          sx={{ 
            mb: 3,
            position: 'relative',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            overflow: 'visible',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
              '& .drag-handle': {
                opacity: 1
              }
            }
          }}
        >
          {/* Drag Handle */}
          <Box 
            className="drag-handle"
            sx={{
              position: 'absolute',
              left: -12,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              opacity: 0,
              transition: 'opacity 0.2s ease'
            }}
          >
            <Tooltip title="Drag to reorder">
              <IconButton 
                {...attributes}
                {...listeners}
                sx={{ 
                  backgroundColor: theme.palette.background.paper,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  cursor: 'grab',
                  color: theme.palette.primary.main,
                  width: 32,
                  height: 32,
                  '&:hover': { 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderColor: theme.palette.primary.main
                  },
                  '&:active': { cursor: 'grabbing' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <DragIndicatorIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <CardContent sx={{ p: 0 }}>
            {/* Header Section */}
            <Box sx={{ 
              p: 3, 
              pb: 2,
              background: `linear-gradient(135deg, ${alpha(getTypeColor(item.type), 0.03)} 0%, ${alpha(getTypeColor(item.type), 0.08)} 100%)`
            }}>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    {getTypeIcon(item.type)}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        fontSize: '1.1rem'
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Chip
                      label={getTypeLabel(item.type)}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getTypeColor(item.type), 0.15),
                        color: getTypeColor(item.type),
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24
                      }}
                    />
                  </Stack>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                      fontStyle: 'italic'
                    }}
                  >
                    {item.description || 'A.I. will write a descriptive block of text following the guidelines below.'}
                  </Typography>
                </Box>

                {/* Quick Actions */}
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Move Up">
                    <IconButton
                      size="small"
                      onClick={() => onMoveUp(item.id)}
                      disabled={index === 0}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.action.active, 0.08),
                        '&:hover': { backgroundColor: alpha(theme.palette.action.active, 0.12) },
                        '&:disabled': { opacity: 0.3 }
                      }}
                    >
                      <KeyboardArrowUpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Move Down">
                    <IconButton
                      size="small"
                      onClick={() => onMoveDown(item.id)}
                      disabled={index === totalItems - 1}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.action.active, 0.08),
                        '&:hover': { backgroundColor: alpha(theme.palette.action.active, 0.12) },
                        '&:disabled': { opacity: 0.3 }
                      }}
                    >
                      <KeyboardArrowDownIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Duplicate">
                    <IconButton
                      size="small"
                      onClick={() => onCopy(item.id)}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.info.main, 0.08),
                        color: theme.palette.info.main,
                        '&:hover': { backgroundColor: alpha(theme.palette.info.main, 0.15) }
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(item.id)}
                      sx={{ 
                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                        color: theme.palette.error.main,
                        '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.15) }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Box>

            <Divider />

            {/* Content Preview */}
            <Box sx={{ p: 3, pt: 2 }}>
              <Paper 
                sx={{ 
                  p: 2.5, 
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  borderRadius: 2
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6,
                    mb: item.items && item.items.length > 0 ? 2 : 0
                  }}
                >
                  {item.content}
                </Typography>
                
                {item.items && item.items.length > 0 && (
                  <Box>
                    {item.items.map((subItem, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                        <Box 
                          sx={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            backgroundColor: getTypeColor(item.type),
                            mt: 1,
                            flexShrink: 0
                          }} 
                        />
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {subItem.name && <strong>{subItem.name}: </strong>}{subItem.content}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Special formatting for exam-list and checklist */}
                {(item.type === 'exam-list' || item.type === 'checklist') && !item.items && (
                  <Box sx={{ mt: 2 }}>
                    {[
                      'General Appearance: Recap the patient\'s general appearance, including level of alertness and any acute distress.',
                      'Cardiovascular: Recap findings related to heart sounds, rate, rhythm, and any murmurs.',
                      'Respiratory: Recap findings regarding breath sounds, rate, and effort of breathing.',
                      'Neurological: Recap findings related to mental status, motor and sensory function, and reflexes.',
                      'Gastrointestinal: Recap findings related to abdominal examination, including palpation, bowel sounds, and any tenderness.',
                      'Musculoskeletal: Recap findings regarding joint function, muscle strength, and any deformities.',
                      'Skin: Recap findings on skin condition, including rashes, lesions, or color changes.'
                    ].map((bullet, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                        <Box 
                          sx={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            backgroundColor: getTypeColor(item.type),
                            mt: 1,
                            flexShrink: 0
                          }} 
                        />
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                          {bullet}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>

            <Divider />

            {/* Action Buttons */}
            <Box sx={{ p: 3, pt: 2 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<AutoFixHighIcon />}
                  onClick={() => onAiEdit(item.id)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    flex: 1,
                    backgroundColor: getTypeColor(item.type),
                    '&:hover': {
                      backgroundColor: alpha(getTypeColor(item.type), 0.8)
                    }
                  }}
                >
                  Edit Instructions
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<HelpIcon />}
                  onClick={() => onHelp(item.id)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    borderWidth: 2,
                    borderColor: getTypeColor(item.type),
                    color: getTypeColor(item.type),
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: alpha(getTypeColor(item.type), 0.04),
                      borderColor: getTypeColor(item.type)
                    }
                  }}
                >
                  Get Help
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
};

const DraggableTemplateEditor: React.FC<DraggableTemplateEditorProps> = ({
  initialItems = [],
  onSave
}) => {
  const theme = useTheme();
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [aiEditDialogOpen, setAiEditDialogOpen] = useState(false);
  const [sectionConfigOpen, setSectionConfigOpen] = useState(false);
  const [placementDialogOpen, setPlacementDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedHelpOption, setSelectedHelpOption] = useState('');
  const [helpInputValue, setHelpInputValue] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [aiTitle, setAiTitle] = useState('');
  const [pendingSection, setPendingSection] = useState<any>(null);

  // Initialize with default items if none provided
  useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems);
    } else {
      // Create some default sections if starting fresh
      const defaultItems: TemplateItem[] = [
        {
          id: '1',
          name: 'Chief Complaint',
          type: 'paragraph',
          content: 'Document the primary reason for the patient visit',
          description: 'A.I. will write a descriptive block of text following the guidelines below.'
        },
        {
          id: '2', 
          name: 'History of Present Illness',
          type: 'bulleted-list',
          content: 'Document the current illness details',
          description: 'A.I. will create a bulleted list based on the instructions provided',
          items: [
            { content: 'Onset and duration of symptoms' },
            { content: 'Associated symptoms' },
            { content: 'Previous treatments attempted' }
          ]
        }
      ];
      setItems(defaultItems);
    }
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const helpOptions = [
    { 
      value: 'change-to-list', 
      label: 'Change to List',
      icon: <SwapHorizIcon sx={{ fontSize: 20, color: '#666' }} />,
      requiresInput: false
    },
    { 
      value: 'increase-detail', 
      label: 'Increase Detail',
      icon: <ZoomInIcon sx={{ fontSize: 20, color: '#666' }} />,
      requiresInput: true,
      inputLabel: 'How many paragraphs do you prefer?'
    },
    { 
      value: 'decrease-detail', 
      label: 'Decrease Detail',
      icon: <ZoomOutIcon sx={{ fontSize: 20, color: '#666' }} />,
      requiresInput: true,
      inputLabel: 'How many paragraphs do you prefer?'
    },
    { 
      value: 'format-specific', 
      label: 'Format Specific',
      icon: <FilterListIcon sx={{ fontSize: 20, color: '#666' }} />,
      requiresInput: true,
      inputLabel: 'Please give an example of how you\'d like this to be formatted:'
    },
    { 
      value: 'other', 
      label: 'Other',
      icon: <CreateIcon sx={{ fontSize: 20, color: '#666' }} />,
      requiresInput: true,
      inputLabel: 'What do you want changed?'
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      paragraph: theme.palette.primary.main,
      'bulleted-list': theme.palette.secondary.main,
      'section-header': theme.palette.info.main,
      'exam-list': theme.palette.warning.main,
      checklist: theme.palette.success.main,
      'static-text': theme.palette.grey[600]
    };
    return colors[type as keyof typeof colors] || theme.palette.grey[500];
  };

  const getTypeIcon = (type: string) => {
    const iconProps = { fontSize: 'small' as const, sx: { color: getTypeColor(type) } };
    switch (type) {
      case 'paragraph': return <ViewHeadlineIcon {...iconProps} />;
      case 'bulleted-list': return <FormatListBulletedIcon {...iconProps} />;
      case 'section-header': return <TitleIcon {...iconProps} />;
      case 'exam-list': return <AssignmentIcon {...iconProps} />;
      case 'checklist': return <ChecklistIcon {...iconProps} />;
      case 'static-text': return <TextSnippetIcon {...iconProps} />;
      default: return <TextSnippetIcon {...iconProps} />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'paragraph': 'Paragraph',
      'bulleted-list': 'Bulleted List',
      'section-header': 'Section Header',
      'exam-list': 'Exam List',
      'checklist': 'Checklist',
      'static-text': 'Static Text'
    };
    return labels[type as keyof typeof labels] || type.replace('-', ' ').toUpperCase();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Call onSave with the updated items
        if (onSave) {
          onSave(newItems);
        }
        
        return newItems;
      });
    }
  };

  const handleSaveTemplate = () => {
    if (onSave) {
      onSave(items);
    }
    console.log('Template saved successfully!', items);
  };

  const handleAddSection = (section: any) => {
    console.log('Adding section:', section);
    if (['paragraph', 'section-header', 'bulleted-list', 'exam-list', 'checklist', 'static-text'].includes(section.id)) {
      setPendingSection(section);
      setSectionConfigOpen(true);
    } else {
      const newItem: TemplateItem = {
        id: Date.now().toString(),
        name: section.name,
        type: 'paragraph',
        content: section.description,
        description: 'A.I. will write a descriptive block of text following the guidelines below.'
      };
      
      const newItems = [...items, newItem];
      setItems(newItems);
      
      // Call onSave with the updated items
      if (onSave) {
        onSave(newItems);
      }
    }
  };

  const handleSectionConfigContinue = () => {
    setSectionConfigOpen(false);
    setPlacementDialogOpen(true);
  };

  const handleBackToConfig = () => {
    setPlacementDialogOpen(false);
    setSectionConfigOpen(true);
  };

  const handleSectionConfigBack = () => {
    setSectionConfigOpen(false);
    setAddSectionOpen(true);
  };

  const handlePlaceSection = (position: number) => {
    if (pendingSection) {
      const newItem: TemplateItem = {
        id: Date.now().toString(),
        name: pendingSection.name,
        type: pendingSection.id,
        content: pendingSection.description,
        description: 'A.I. will write content following the guidelines below.'
      };
      
      const newItems = [...items];
      newItems.splice(position, 0, newItem);
      setItems(newItems);
      
      setPendingSection(null);
      setPlacementDialogOpen(false);
      
      // Call onSave with the updated items
      if (onSave) {
        onSave(newItems);
      }
    }
  };

  const handleDeleteItem = (id: string) => {
    console.log('Deleting item with id:', id);
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    
    // Call onSave with the updated items
    if (onSave) {
      onSave(newItems);
    }
  };

  const handleCopyItem = (id: string) => {
    console.log('Copying item with id:', id);
    const itemToCopy = items.find(item => item.id === id);
    if (itemToCopy) {
      const copiedItem: TemplateItem = {
        ...itemToCopy,
        id: Date.now().toString(),
        name: `${itemToCopy.name} (Copy)`
      };
      const newItems = [...items, copiedItem];
      setItems(newItems);
      
      // Call onSave with the updated items
      if (onSave) {
        onSave(newItems);
      }
    }
  };

  const handleMoveUp = (id: string) => {
    console.log('Moving up item with id:', id);
    const index = items.findIndex(item => item.id === id);
    if (index > 0) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      setItems(newItems);
      
      // Call onSave with the updated items
      if (onSave) {
        onSave(newItems);
      }
    }
  };

  const handleMoveDown = (id: string) => {
    console.log('Moving down item with id:', id);
    const index = items.findIndex(item => item.id === id);
    if (index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      setItems(newItems);
      
      // Call onSave with the updated items
      if (onSave) {
        onSave(newItems);
      }
    }
  };

  const handleHelp = (itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedHelpOption('');
    setHelpInputValue('');
    setHelpDialogOpen(true);
  };

  const handleHelpClose = () => {
    setHelpDialogOpen(false);
    setSelectedItemId(null);
    setSelectedHelpOption('');
    setHelpInputValue('');
  };

  const handleHelpUpdate = () => {
    console.log('Help update:', {
      itemId: selectedItemId,
      option: selectedHelpOption,
      input: helpInputValue
    });
    
    // Here you would implement the actual logic to modify the item
    // based on the selected help option and input
    
    handleHelpClose();
  };

  const handleAiEdit = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedItemId(itemId);
      setAiTitle(item.name);
      setAiInstructions(item.content || '');
      setAiEditDialogOpen(true);
    }
  };

  const handleSaveAiEdit = () => {
    if (selectedItemId) {
      const newItems = items.map(item => 
        item.id === selectedItemId 
          ? { ...item, name: aiTitle, content: aiInstructions }
          : item
      );
      setItems(newItems);
      if (onSave) {
        onSave(newItems);
      }
    }
    setAiEditDialogOpen(false);
    setSelectedItemId(null);
    setAiInstructions('');
    setAiTitle('');
  };

  const getSelectedHelpOption = () => {
    return helpOptions.find(option => option.value === selectedHelpOption);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Save Button */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Template Editor
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveTemplate}
            sx={{
              mr: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Save Template
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddSectionOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Add Section
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {/* Template Sections with Drag and Drop */}
        <Box sx={{ position: 'relative', pl: 2 }}>
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
                  onDelete={handleDeleteItem}
                  onCopy={handleCopyItem}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onHelp={handleHelp}
                  onAiEdit={handleAiEdit}
                  getTypeColor={getTypeColor}
                  getTypeIcon={getTypeIcon}
                  getTypeLabel={getTypeLabel}
                  theme={theme}
                  totalItems={items.length}
                />
              ))}
            </SortableContext>
          </DndContext>
        </Box>

        {/* Empty State */}
        {items.length === 0 && (
          <Paper 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              borderRadius: 3,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.02)
            }}
          >
            <PsychologyIcon 
              sx={{ 
                fontSize: 80, 
                color: alpha(theme.palette.primary.main, 0.3),
                mb: 2
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1
              }}
            >
              Start Building Your Template
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary,
                mb: 4,
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              Add your first section to begin creating an AI-powered template that will generate intelligent content based on your specifications.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setAddSectionOpen(true)}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Add Your First Section
            </Button>
          </Paper>
        )}
      </Box>

      {/* Dialogs */}
      <AddSectionOverlay
        open={addSectionOpen}
        onClose={() => setAddSectionOpen(false)}
        onAddSection={handleAddSection}
      />

      <SectionConfigDialog
        open={sectionConfigOpen}
        onClose={() => setSectionConfigOpen(false)}
        onContinue={handleSectionConfigContinue}
        onBack={handleSectionConfigBack}
        sectionType={pendingSection?.id || ''}
        sectionName={pendingSection?.name || ''}
      />

      <SectionPlacementDialog
        open={placementDialogOpen}
        onClose={() => setPlacementDialogOpen(false)}
        onBack={handleBackToConfig}
        onPlaceSection={handlePlaceSection}
        existingSections={items.map(item => ({ id: item.id, name: item.name }))}
      />

      {/* Help Dialog */}
      <Dialog 
        open={helpDialogOpen} 
        onClose={handleHelpClose}
        maxWidth="sm" 
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            maxWidth: 600,
            width: '100%'
          } 
        }}
      >
        <DialogTitle sx={{ pb: 2, position: 'relative' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, pr: 4 }}>
            Edit Auto-Generated Section
          </Typography>
          <IconButton
            onClick={handleHelpClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'grey.500'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Select an option:
          </Typography>
          
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={selectedHelpOption}
              onChange={(e) => setSelectedHelpOption(e.target.value)}
            >
              {helpOptions.map((option) => (
                <Box key={option.value}>
                  <Card
                    sx={{
                      mb: 2,
                      border: selectedHelpOption === option.value ? `2px solid ${bravoColors.primaryFlat}` : '1px solid #e0e0e0',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: selectedHelpOption === option.value ? bravoColors.primary : 'transparent',
                      '&:hover': {
                        borderColor: selectedHelpOption === option.value ? bravoColors.primaryFlat : '#bdbdbd'
                      }
                    }}
                    onClick={() => setSelectedHelpOption(option.value)}
                  >
                    <CardContent sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FormControlLabel
                        value={option.value}
                        control={
                          <Radio 
                            sx={{ 
                              '&.Mui-checked': { 
                                color: selectedHelpOption === option.value ? bravoColors.text.white : bravoColors.primaryFlat 
                              } 
                            }} 
                          />
                        }
                        label=""
                        sx={{ margin: 0 }}
                      />
                      {option.icon}
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 500,
                          color: selectedHelpOption === option.value ? bravoColors.text.white : 'text.primary'
                        }}
                      >
                        {option.label}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Show input field directly below the selected option */}
                  {selectedHelpOption === option.value && option.requiresInput && (
                    <Box sx={{ mb: 3, ml: 2 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ mb: 2, fontWeight: 500 }}
                      >
                        {option.inputLabel}
                      </Typography>
                      <TextField
                        fullWidth
                        multiline={option.value === 'format-specific' || option.value === 'other'}
                        rows={option.value === 'format-specific' || option.value === 'other' ? 4 : 1}
                        placeholder={option.value === 'other' ? 'Describe the changes you want to make...' : 'Enter your answer'}
                        value={helpInputValue}
                        onChange={(e) => setHelpInputValue(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleHelpClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleHelpUpdate}
            disabled={!selectedHelpOption || (getSelectedHelpOption()?.requiresInput && !helpInputValue.trim())}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Edit Dialog */}
      <Dialog 
        open={aiEditDialogOpen} 
        onClose={() => setAiEditDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Configure AI Instructions
            </Typography>
            <IconButton onClick={() => setAiEditDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              💡 How AI Instructions Work
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 0, '& li': { mb: 1 } }}>
              <li><strong>Natural Language:</strong> Write instructions as you would explain to a colleague</li>
              <li><strong>Placeholders:</strong> Use {'{variable}'} for dynamic content</li>
              <li><strong>Exact Text:</strong> Use "quotes" for text that must appear exactly</li>
              <li><strong>Hidden Notes:</strong> Use (parentheses) for AI-only instructions</li>
            </Box>
          </Alert>
          
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Section Title"
              value={aiTitle}
              onChange={(e) => setAiTitle(e.target.value)}
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Detailed AI Instructions"
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              multiline
              rows={6}
              placeholder="Provide detailed instructions for how the AI should generate this section..."
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setAiEditDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveAiEdit}>
            Save Instructions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DraggableTemplateEditor;
