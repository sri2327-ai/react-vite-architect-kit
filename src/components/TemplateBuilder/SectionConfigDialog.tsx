import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Alert,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Paper,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface SectionConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  sectionType: string;
  sectionName: string;
}

const SectionConfigDialog: React.FC<SectionConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  sectionType,
  sectionName
}) => {
  const [title, setTitle] = useState(sectionName);
  const [description, setDescription] = useState('');
  const [examItems, setExamItems] = useState([{ title: '', description: '', normalText: '' }]);
  const [checklistItems, setChecklistItems] = useState([{ buttonName: '', text: '' }]);
  
  // Within Normal Limits Settings
  const [notDiscussedBehavior, setNotDiscussedBehavior] = useState('blank');
  const [normalLimitsBehavior, setNormalLimitsBehavior] = useState('summarize');
  const [highlightAbnormal, setHighlightAbnormal] = useState(true);
  const [hideEmpty, setHideEmpty] = useState(false);

  const handleAddExamItem = () => {
    setExamItems([...examItems, { title: '', description: '', normalText: '' }]);
  };

  const handleUpdateExamItem = (index: number, field: string, value: string) => {
    const updated = [...examItems];
    updated[index] = { ...updated[index], [field]: value };
    setExamItems(updated);
  };

  const handleDeleteExamItem = (index: number) => {
    setExamItems(examItems.filter((_, i) => i !== index));
  };

  const handleMoveExamItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...examItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      setExamItems(newItems);
    }
  };

  const handleAddChecklistItem = () => {
    setChecklistItems([...checklistItems, { buttonName: '', text: '' }]);
  };

  const handleUpdateChecklistItem = (index: number, field: string, value: string) => {
    const updated = [...checklistItems];
    updated[index] = { ...updated[index], [field]: value };
    setChecklistItems(updated);
  };

  const handleDeleteChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleMoveChecklistItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...checklistItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      setChecklistItems(newItems);
    }
  };

  const renderConfigContent = () => {
    switch (sectionType) {
      case 'paragraph':
        return (
          <Box>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="What do you want the A.I. to generate in this section?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed instructions for how the AI should write this section..."
            />
          </Box>
        );

      case 'section-header':
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                How this works
              </Typography>
              <Typography variant="body2">
                Section headers help organize your note into clear, distinct sections. Use them to create a logical structure in your notes. Change the title above to change the name of the section. This will not impact the A.I. generation.
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
        );

      case 'bulleted-list':
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                How this works
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Specify your bulleted list instructions</strong><br />
                Tell the A.I. what information you want it to generate in a bulleted list format.
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Example</strong><br />
                For instance, you could write: Create a bullet for each medication that was discussed. Each bullet should follow this format: {'{Medication Name}'} - {'{Dosage}'}, {'{Frequency}'}
              </Typography>
              <Typography variant="body2">
                <strong>Tips</strong><br />
                Be specific about what information you want included in each bullet point. The A.I. will format the output as a bulleted list.
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="What do you want the A.I. to generate bullets for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
        );

      case 'exam-list':
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                How this works
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Review each subsection</strong><br />
                An exam-list is a structured output, with each subsection as it's own instruction for Medwriter. You can add, remove, or edit sections.
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Tell Medwriter what to focus on</strong><br />
                For each section, you can tell Medwriter what to write for that subsection.
              </Typography>
              <Typography variant="body2">
                <strong>Decide Normal Limits Behavior</strong><br />
                You can specify certain default "within normal limits" text, and decide when you want Medwriter to fall back to that text.
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={2}
              label="What exam sections would you like A.I. to report on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" gutterBottom>
              Exam Items
            </Typography>
            
            {examItems.map((item, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Item {index + 1}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveExamItem(index, 'up')}
                      disabled={index === 0}
                    >
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveExamItem(index, 'down')}
                      disabled={index === examItems.length - 1}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteExamItem(index)}
                      disabled={examItems.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <TextField
                  fullWidth
                  size="small"
                  label="I want to title this subsection..."
                  value={item.title}
                  onChange={(e) => handleUpdateExamItem(index, 'title', e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="I want the A.I. to report on..."
                  value={item.description}
                  onChange={(e) => handleUpdateExamItem(index, 'description', e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  size="small"
                  label="When findings are normal, use this text..."
                  value={item.normalText}
                  onChange={(e) => handleUpdateExamItem(index, 'normalText', e.target.value)}
                />
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddExamItem}
              sx={{ mb: 3 }}
            >
              Add another item
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#495057' }}>
                Within Normal Limits Settings
              </Typography>
              
              <Stack spacing={3}>
                {/* When an item is not discussed */}
                <Box>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                      When an item is not discussed in the session:
                    </FormLabel>
                    <RadioGroup
                      value={notDiscussedBehavior}
                      onChange={(e) => setNotDiscussedBehavior(e.target.value)}
                    >
                      <FormControlLabel 
                        value="blank" 
                        control={<Radio size="small" />} 
                        label="Leave it blank" 
                      />
                      <FormControlLabel 
                        value="default" 
                        control={<Radio size="small" />} 
                        label='Default to "Within Normal Limits"' 
                      />
                      <FormControlLabel 
                        value="alert" 
                        control={<Radio size="small" />} 
                        label="Alert provider to discuss this item" 
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Divider />

                {/* When findings are within normal limits */}
                <Box>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                      When findings are within normal limits:
                    </FormLabel>
                    <RadioGroup
                      value={normalLimitsBehavior}
                      onChange={(e) => setNormalLimitsBehavior(e.target.value)}
                    >
                      <FormControlLabel 
                        value="summarize" 
                        control={<Radio size="small" />} 
                        label="Summarize the discussion" 
                      />
                      <FormControlLabel 
                        value="specified" 
                        control={<Radio size="small" />} 
                        label='Use specified "Within Normal Limits" text' 
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Divider />

                {/* Additional options */}
                <Box>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2, display: 'block' }}>
                    Additional Options:
                  </FormLabel>
                  <Stack spacing={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={highlightAbnormal}
                          onChange={(e) => setHighlightAbnormal(e.target.checked)}
                          size="small"
                        />
                      }
                      label="Highlight findings that are not within normal limits"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={hideEmpty}
                          onChange={(e) => setHideEmpty(e.target.checked)}
                          size="small"
                        />
                      }
                      label="Hide items that are empty"
                    />
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Box>
        );

      case 'checklist':
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                How this works
              </Typography>
              <Typography variant="body2">
                Add items below. Each item will get a button. On press of the button, the corresponding text will be added to the note. This will not be A.I. generated; you will need to manually press the button to insert the exact corresponding text.
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="h6" gutterBottom>
              What buttons do you want to include?
            </Typography>
            
            {checklistItems.map((item, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Button {index + 1}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveChecklistItem(index, 'up')}
                      disabled={index === 0}
                    >
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveChecklistItem(index, 'down')}
                      disabled={index === checklistItems.length - 1}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteChecklistItem(index)}
                      disabled={checklistItems.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <TextField
                  fullWidth
                  size="small"
                  label="Button Name"
                  value={item.buttonName}
                  onChange={(e) => handleUpdateChecklistItem(index, 'buttonName', e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="What text should be added when this button is clicked?"
                  value={item.text}
                  onChange={(e) => handleUpdateChecklistItem(index, 'text', e.target.value)}
                />
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddChecklistItem}
            >
              Add Another Item
            </Button>
          </Box>
        );

      case 'static-text':
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                How this works
              </Typography>
              <Typography variant="body2">
                Whatever you enter here will appear exactly as-is in your generated note. Use this for fixed text that should remain the same across all notes that you need in every encounter.
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="What fixed text do you want included in all notes?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
        );

      default:
        return (
          <Box>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: '90vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit {sectionName}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        {renderConfigContent()}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Back
        </Button>
        <Button onClick={onContinue} variant="contained">
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionConfigDialog;
