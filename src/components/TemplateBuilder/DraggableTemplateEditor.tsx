
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
  Alert
} from '@mui/material';
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
  Close as CloseIcon
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

  const handleAddSection = (section: any) => {
    // Check if it's a custom block that needs configuration
    if (['paragraph', 'section-header', 'bulleted-list', 'exam-list', 'checklist', 'static-text'].includes(section.id)) {
      setPendingSection(section);
      setSectionConfigOpen(true);
    } else {
      // Add section directly
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

  const renderSectionBlock = (item: TemplateItem) => (
    <Card key={item.id} sx={{ mb: 2, position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <DragIndicatorIcon sx={{ color: 'text.secondary', mt: 0.5, cursor: 'grab' }} />
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {item.description}
            </Typography>
            {item.items && (
              <Box sx={{ mt: 1 }}>
                {item.items.map((subItem, index) => (
                  <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                    • {subItem.content}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => handleHelp(item.id)}
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <HelpIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleAiEdit(item.id)}
              sx={{ bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}
            >
              <AutoFixHighIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDeleteItem(item.id)}
              sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleCopyItem(item.id)}
              sx={{ bgcolor: 'info.main', color: 'white', '&:hover': { bgcolor: 'info.dark' } }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleMoveUp(item.id)}
              sx={{ bgcolor: 'grey.600', color: 'white', '&:hover': { bgcolor: 'grey.700' } }}
            >
              <KeyboardArrowUpIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleMoveDown(item.id)}
              sx={{ bgcolor: 'grey.600', color: 'white', '&:hover': { bgcolor: 'grey.700' } }}
            >
              <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Template Editor
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddSectionOpen(true)}
        >
          Add Section
        </Button>
      </Box>

      {items.map(renderSectionBlock)}

      {items.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No sections added yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddSectionOpen(true)}
          >
            Add Your First Section
          </Button>
        </Box>
      )}

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
      <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Auto-Generated Section</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Select an option:
          </Typography>
          <TextField
            fullWidth
            select
            value={helpOption}
            onChange={(e) => setHelpOption(e.target.value)}
            sx={{ mt: 2 }}
          >
            {helpOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setHelpDialogOpen(false)}>Apply</Button>
        </DialogActions>
      </Dialog>

      {/* AI Edit Dialog */}
      <Dialog open={aiEditDialogOpen} onClose={() => setAiEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Edit Instructions for AI</Typography>
            <IconButton onClick={() => setAiEditDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              How this works
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Instruct as you would to a human</strong><br />
              Tell Medwriter what you want it to write, as you would tell another human (or ChatGPT) how to write this section. Explain what you it should do, where it should focus, etc.
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Suggest Length</strong><br />
              State the brevity or length (e.g., keep this brief, 2-3 paragraphs).
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Placeholders: {'{}'}</strong><br />
              Use for info the AI should fill in: Summary for {'{Scale Result}'}.
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Verbatim Text: ""</strong><br />
              Use double quotes for text to include exactly: Conclude with "Follow up as needed."
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Hidden Instructions: ()</strong><br />
              Use parentheses for notes to the AI (won't appear in output): Physical exam findings (focus on cardio).
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              <strong>Example:</strong><br />
              "Summarize any assessments discussed in this session; keep it brief. Use the following format: {'{Scale Name}'}: {'{Scale Result}'}. (If none discussed, leave this blank)."
            </Typography>
          </Alert>
          
          <TextField
            fullWidth
            label="Title"
            value={aiTitle}
            onChange={(e) => setAiTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Description"
            value={aiDescription}
            onChange={(e) => setAiDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Instructions for AI"
            value={aiInstructions}
            onChange={(e) => setAiInstructions(e.target.value)}
            multiline
            rows={4}
            placeholder="Enter detailed instructions for how the AI should write this section..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAiEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DraggableTemplateEditor;
