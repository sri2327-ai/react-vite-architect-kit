import React, { useState } from 'react';
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
  useTheme
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
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import AddSectionOverlay from './AddSectionOverlay';
import SectionConfigDialog from './SectionConfigDialog';
import SectionPlacementDialog from './SectionPlacementDialog';

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

const DraggableTemplateEditor: React.FC<DraggableTemplateEditorProps> = ({
  initialItems = [],
  onSave
}) => {
  const theme = useTheme();
  const [items, setItems] = useState<TemplateItem[]>(initialItems);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [aiEditDialogOpen, setAiEditDialogOpen] = useState(false);
  const [sectionConfigOpen, setSectionConfigOpen] = useState(false);
  const [placementDialogOpen, setPlacementDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [helpOption, setHelpOption] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [aiTitle, setAiTitle] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [pendingSection, setPendingSection] = useState<any>(null);

  const helpOptions = [
    { value: 'change-to-list', label: 'Change to List' },
    { value: 'increase-detail', label: 'Increase Detail' },
    { value: 'decrease-detail', label: 'Decrease Detail' },
    { value: 'format-specific', label: 'Format Specific' },
    { value: 'other', label: 'Other' }
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
    switch (type) {
      case 'paragraph': return '📝';
      case 'bulleted-list': return '• ';
      case 'section-header': return '📋';
      case 'exam-list': return '🔍';
      case 'checklist': return '✅';
      case 'static-text': return '📄';
      default: return '📋';
    }
  };

  const handleAddSection = (section: any) => {
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
      setItems([...items, newItem]);
    }
  };

  const handleSectionConfigContinue = () => {
    setSectionConfigOpen(false);
    setPlacementDialogOpen(true);
  };

  const handlePlaceSection = (position: number) => {
    if (pendingSection) {
      const newItem: TemplateItem = {
        id: Date.now().toString(),
        name: pendingSection.name,
        type: pendingSection.id,
        content: pendingSection.description,
        description: 'A.I. will write a descriptive block of text following the guidelines below.'
      };
      
      const newItems = [...items];
      newItems.splice(position, 0, newItem);
      setItems(newItems);
      
      setPendingSection(null);
      setPlacementDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCopyItem = (id: string) => {
    const itemToCopy = items.find(item => item.id === id);
    if (itemToCopy) {
      const copiedItem: TemplateItem = {
        ...itemToCopy,
        id: Date.now().toString(),
        name: `${itemToCopy.name} (Copy)`
      };
      setItems([...items, copiedItem]);
    }
  };

  const handleMoveUp = (id: string) => {
    const index = items.findIndex(item => item.id === id);
    if (index > 0) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      setItems(newItems);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = items.findIndex(item => item.id === id);
    if (index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      setItems(newItems);
    }
  };

  const handleHelp = (itemId: string) => {
    setSelectedItemId(itemId);
    setHelpDialogOpen(true);
  };

  const handleAiEdit = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedItemId(itemId);
      setAiTitle(item.name);
      setAiDescription(item.description || '');
      setAiEditDialogOpen(true);
    }
  };

  const handleSaveAiEdit = () => {
    if (selectedItemId) {
      setItems(items.map(item => 
        item.id === selectedItemId 
          ? { ...item, name: aiTitle, description: aiDescription }
          : item
      ));
    }
    setAiEditDialogOpen(false);
    setSelectedItemId(null);
    setAiInstructions('');
    setAiTitle('');
    setAiDescription('');
  };

  const renderSectionBlock = (item: TemplateItem, index: number) => (
    <Fade in={true} timeout={300} key={item.id}>
      <Card 
        sx={{ 
          mb: 3,
          position: 'relative',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Tooltip title="Drag to reorder">
              <IconButton 
                sx={{ 
                  cursor: 'grab',
                  color: theme.palette.text.secondary,
                  '&:active': { cursor: 'grabbing' }
                }}
              >
                <DragIndicatorIcon />
              </IconButton>
            </Tooltip>
            
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '1.1rem'
                  }}
                >
                  {getTypeIcon(item.type)} {item.name}
                </Typography>
                <Chip
                  label={item.type.replace('-', ' ').toUpperCase()}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getTypeColor(item.type), 0.1),
                    color: getTypeColor(item.type),
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />
              </Stack>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                  mb: 2
                }}
              >
                {item.description}
              </Typography>

              {/* Content Preview */}
              <Paper 
                sx={{ 
                  p: 2, 
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 2
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: 'italic',
                    color: theme.palette.text.secondary
                  }}
                >
                  {item.content}
                </Typography>
                
                {item.items && item.items.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    {item.items.map((subItem, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                        <Box 
                          sx={{ 
                            width: 4, 
                            height: 4, 
                            borderRadius: '50%', 
                            backgroundColor: theme.palette.primary.main,
                            mt: 1,
                            flexShrink: 0
                          }} 
                        />
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {subItem.name && `${subItem.name}: `}{subItem.content}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>

            {/* Action Buttons */}
            <Stack direction="column" spacing={1}>
              <Tooltip title="Get AI Help">
                <IconButton
                  size="small"
                  onClick={() => handleHelp(item.id)}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit AI Instructions">
                <IconButton
                  size="small"
                  onClick={() => handleAiEdit(item.id)}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <AutoFixHighIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Duplicate Section">
                <IconButton
                  size="small"
                  onClick={() => handleCopyItem(item.id)}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.info.main, 0.2),
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Divider sx={{ my: 1 }} />

              <Tooltip title="Move Up">
                <IconButton
                  size="small"
                  onClick={() => handleMoveUp(item.id)}
                  disabled={index === 0}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.grey[600], 0.1),
                    color: theme.palette.grey[600],
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.grey[600], 0.2),
                      transform: 'scale(1.05)'
                    },
                    '&:disabled': {
                      backgroundColor: 'transparent',
                      color: theme.palette.grey[300]
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <KeyboardArrowUpIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Move Down">
                <IconButton
                  size="small"
                  onClick={() => handleMoveDown(item.id)}
                  disabled={index === items.length - 1}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.grey[600], 0.1),
                    color: theme.palette.grey[600],
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.grey[600], 0.2),
                      transform: 'scale(1.05)'
                    },
                    '&:disabled': {
                      backgroundColor: 'transparent',
                      color: theme.palette.grey[300]
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <KeyboardArrowDownIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Divider sx={{ my: 1 }} />

              <Tooltip title="Delete Section">
                <IconButton
                  size="small"
                  onClick={() => handleDeleteItem(item.id)}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.error.main, 0.2),
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Action Bar */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Button
              variant="contained"
              startIcon={<AutoFixHighIcon />}
              onClick={() => handleAiEdit(item.id)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              Edit AI Instructions
            </Button>

            <Button
              variant="outlined"
              startIcon={<HelpIcon />}
              onClick={() => handleHelp(item.id)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              Get Help
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1
              }}
            >
              Template Editor
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary,
                maxWidth: 600
              }}
            >
              Build your AI-powered template by adding and configuring sections. Each section will be intelligently generated based on your instructions.
            </Typography>
          </Box>
          
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
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Add Section
          </Button>
        </Box>
      </Paper>

      {/* Template Sections */}
      <Box>
        {items.map((item, index) => renderSectionBlock(item, index))}
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
        sectionType={pendingSection?.id || ''}
        sectionName={pendingSection?.name || ''}
      />

      <SectionPlacementDialog
        open={placementDialogOpen}
        onClose={() => setPlacementDialogOpen(false)}
        onPlaceSection={handlePlaceSection}
        existingSections={items.map(item => ({ id: item.id, name: item.name }))}
      />

      {/* Help Dialog */}
      <Dialog 
        open={helpDialogOpen} 
        onClose={() => setHelpDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Section Assistant
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom sx={{ mb: 3 }}>
            How would you like to modify this AI-generated section?
          </Typography>
          <TextField
            fullWidth
            select
            value={helpOption}
            onChange={(e) => setHelpOption(e.target.value)}
            label="Select modification type"
            variant="outlined"
          >
            {helpOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setHelpDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setHelpDialogOpen(false)}
            disabled={!helpOption}
          >
            Apply Changes
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
              label="Description"
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              multiline
              rows={3}
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
