
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Alert,
  Divider,
  FormControlLabel,
  RadioGroup,
  Radio,
  Chip,
  Grid
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface SectionConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  onBack?: () => void;
  sectionType: string;
  sectionName: string;
}

interface ExamItem {
  id: string;
  title: string;
  instruction: string;
  normalText: string;
}

interface ChecklistItem {
  id: string;
  buttonName: string;
  insertText: string;
}

const SectionConfigDialog: React.FC<SectionConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack,
  sectionType,
  sectionName
}) => {
  const [title, setTitle] = useState(sectionName);
  const [instructions, setInstructions] = useState('');
  
  // Exam List specific states
  const [examItems, setExamItems] = useState<ExamItem[]>([
    { id: '1', title: '', instruction: '', normalText: '' }
  ]);
  const [notDiscussedBehavior, setNotDiscussedBehavior] = useState('blank');
  const [normalLimitsBehavior, setNormalLimitsBehavior] = useState('summarize');
  const [hideEmptyItems, setHideEmptyItems] = useState(false);
  
  // Checklist specific states
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', buttonName: '', insertText: '' }
  ]);

  React.useEffect(() => {
    if (open) {
      setTitle(sectionName);
      setInstructions('');
      // Reset exam items
      setExamItems([{ id: '1', title: '', instruction: '', normalText: '' }]);
      // Reset checklist items
      setChecklistItems([{ id: '1', buttonName: '', insertText: '' }]);
    }
  }, [open, sectionName]);

  const handleContinue = () => {
    let sectionData: any = { title, instructions, sectionType };
    
    if (sectionType === 'exam_list') {
      sectionData = {
        ...sectionData,
        examItems: examItems.filter(item => item.title.trim() || item.instruction.trim()),
        withinNormalLimitsSettings: {
          notDiscussedBehavior,
          normalLimitsBehavior,
          hideEmptyItems
        }
      };
    } else if (sectionType === 'checklist') {
      sectionData = {
        ...sectionData,
        checklistItems: checklistItems.filter(item => item.buttonName.trim() || item.insertText.trim())
      };
    }
    
    console.log('Section configuration completed:', sectionData);
    onContinue();
  };

  const handleBack = () => {
    console.log('Going back to section selection');
    if (onBack) {
      onBack();
    }
  };

  // Exam List handlers
  const addExamItem = () => {
    setExamItems([...examItems, { id: Date.now().toString(), title: '', instruction: '', normalText: '' }]);
  };

  const updateExamItem = (id: string, field: keyof ExamItem, value: string) => {
    setExamItems(examItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeExamItem = (id: string) => {
    if (examItems.length > 1) {
      setExamItems(examItems.filter(item => item.id !== id));
    }
  };

  // Checklist handlers
  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, { id: Date.now().toString(), buttonName: '', insertText: '' }]);
  };

  const updateChecklistItem = (id: string, field: keyof ChecklistItem, value: string) => {
    setChecklistItems(checklistItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeChecklistItem = (id: string) => {
    if (checklistItems.length > 1) {
      setChecklistItems(checklistItems.filter(item => item.id !== id));
    }
  };

  const renderSectionSpecificContent = () => {
    switch (sectionType) {
      case 'bulleted_list':
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                💡 How Bulleted Lists Work
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Specify your bulleted list instructions. Tell the A.I. what information you want it to generate in a bulleted list format.
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                <strong>Example:</strong> Create a bullet for each medication that was discussed. Each bullet should follow this format: {'{Medication Name}'} - {'{Dosage}'}, {'{Frequency}'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Tip:</strong> Be specific about what information you want included in each bullet point. The A.I. will format the output as a bulleted list.
              </Typography>
            </Alert>
            <TextField
              fullWidth
              label="What do you want the A.I. to generate bullets for?"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              multiline
              rows={4}
              placeholder="E.g., Create a bullet for each medication discussed with dosage and frequency..."
              variant="outlined"
            />
          </Box>
        );

      case 'exam_list':
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                🩺 How Exam Lists Work
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Review each subsection:</strong> An exam-list is a structured output, with each subsection as its own instruction for Medwriter.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>Tell Medwriter what to focus on:</strong> For each section, you can tell Medwriter what to write for that subsection.
              </Typography>
              <Typography variant="body2">
                • <strong>Decide Normal Limits Behavior:</strong> You can specify certain default "within normal limits" text, and decide when you want Medwriter to fall back to that text.
              </Typography>
            </Alert>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              What exam sections would you like A.I. to report on?
            </Typography>

            {examItems.map((item, index) => (
              <Box key={item.id} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Item {index + 1}
                  </Typography>
                  {examItems.length > 1 && (
                    <IconButton onClick={() => removeExamItem(item.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="I want to title this subsection..."
                      value={item.title}
                      onChange={(e) => updateExamItem(item.id, 'title', e.target.value)}
                      placeholder="e.g., Cardiovascular, Respiratory, etc."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="I want the A.I. to report on..."
                      value={item.instruction}
                      onChange={(e) => updateExamItem(item.id, 'instruction', e.target.value)}
                      placeholder="e.g., Heart rate, rhythm, murmurs, and peripheral pulses"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="When findings are normal, use this text..."
                      value={item.normalText}
                      onChange={(e) => updateExamItem(item.id, 'normalText', e.target.value)}
                      placeholder="e.g., Within normal limits"
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addExamItem}
              variant="outlined"
              sx={{ mb: 3 }}
            >
              Add Another Item
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Within Normal Limits Settings
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                When an item is not discussed in the session:
              </Typography>
              <RadioGroup
                value={notDiscussedBehavior}
                onChange={(e) => setNotDiscussedBehavior(e.target.value)}
              >
                <FormControlLabel value="blank" control={<Radio size="small" />} label="Leave it blank" />
                <FormControlLabel value="normal" control={<Radio size="small" />} label='Default to "Within Normal Limits"' />
                <FormControlLabel value="alert" control={<Radio size="small" />} label="Alert provider to discuss this item" />
              </RadioGroup>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                When findings are within normal limits:
              </Typography>
              <RadioGroup
                value={normalLimitsBehavior}
                onChange={(e) => setNormalLimitsBehavior(e.target.value)}
              >
                <FormControlLabel value="summarize" control={<Radio size="small" />} label="Summarize the discussion" />
                <FormControlLabel value="specified" control={<Radio size="small" />} label='Use specified "Within Normal Limits" text' />
                <FormControlLabel value="highlight" control={<Radio size="small" />} label="Highlight findings that are not within normal limits" />
              </RadioGroup>
            </Box>

            <FormControlLabel
              control={
                <Radio
                  checked={hideEmptyItems}
                  onChange={(e) => setHideEmptyItems(e.target.checked)}
                  size="small"
                />
              }
              label="Hide items that are empty"
            />
          </Box>
        );

      case 'checklist':
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                ☑️ How Checklists Work
              </Typography>
              <Typography variant="body2">
                Add items below. Each item will get a button. On press of the button, the corresponding text will be added to the note. 
                This will not be A.I. generated; you will need to manually press the button to insert the exact corresponding text.
              </Typography>
            </Alert>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              What buttons do you want to include?
            </Typography>

            {checklistItems.map((item, index) => (
              <Box key={item.id} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Button {index + 1}
                  </Typography>
                  {checklistItems.length > 1 && (
                    <IconButton onClick={() => removeChecklistItem(item.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Button Name"
                      value={item.buttonName}
                      onChange={(e) => updateChecklistItem(item.id, 'buttonName', e.target.value)}
                      placeholder="e.g., Normal Chest X-ray"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      label="What text should be added when this button is clicked?"
                      value={item.insertText}
                      onChange={(e) => updateChecklistItem(item.id, 'insertText', e.target.value)}
                      placeholder="e.g., Chest X-ray shows clear lungs with no acute cardiopulmonary abnormalities."
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addChecklistItem}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Add Another Item
            </Button>
          </Box>
        );

      default:
        return (
          <Box>
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

            <TextField
              fullWidth
              label="AI Instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              multiline
              rows={6}
              placeholder={`Provide detailed instructions for how the AI should generate the ${sectionName} section...`}
              variant="outlined"
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
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {onBack && (
              <IconButton 
                onClick={handleBack} 
                sx={{ 
                  mr: 1,
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Configure Section: {sectionName}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
          />
          
          {renderSectionSpecificContent()}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleContinue}
          disabled={!title.trim()}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionConfigDialog;
