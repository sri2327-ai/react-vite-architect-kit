
import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Divider,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowBack as ArrowBackIcon, 
  CheckBox as CheckBoxIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface ChecklistItem {
  id: string;
  buttonName: string;
  text: string;
}

interface ChecklistConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (config: {
    title: string;
    instructions: string;
    checklistItems: ChecklistItem[];
    notDiscussedBehavior: string;
    hideEmptyItems: boolean;
  }) => void;
  onBack: () => void;
}

const ChecklistConfigDialog: React.FC<ChecklistConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack
}) => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', buttonName: 'Normal', text: 'Normal examination findings' },
    { id: '2', buttonName: 'Abnormal', text: 'Abnormal findings noted' }
  ]);
  const [notDiscussedBehavior, setNotDiscussedBehavior] = useState('omit');
  const [hideEmptyItems, setHideEmptyItems] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [instructionsError, setInstructionsError] = useState('');

  const validateForm = useCallback(() => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Section title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    if (!instructions.trim()) {
      setInstructionsError('Instructions are required');
      isValid = false;
    } else {
      setInstructionsError('');
    }
    
    return isValid;
  }, [title, instructions]);

  const handleContinue = useCallback(() => {
    if (validateForm()) {
      onContinue({
        title: title.trim(),
        instructions: instructions.trim(),
        checklistItems,
        notDiscussedBehavior,
        hideEmptyItems
      });
    }
  }, [title, instructions, checklistItems, notDiscussedBehavior, hideEmptyItems, validateForm, onContinue]);

  const addChecklistItem = useCallback(() => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      buttonName: '',
      text: ''
    };
    setChecklistItems(prev => [...prev, newItem]);
  }, []);

  const removeChecklistItem = useCallback((id: string) => {
    setChecklistItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateChecklistItem = useCallback((id: string, field: keyof ChecklistItem, value: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  }, []);

  const exampleTemplates = [
    {
      label: "Physical Exam",
      title: "Physical Examination",
      instructions: "Document examination findings for each system",
      items: [
        { buttonName: "Normal", text: "Normal examination findings" },
        { buttonName: "Abnormal", text: "Abnormal findings noted" },
        { buttonName: "Not Examined", text: "Not examined during this visit" }
      ]
    },
    {
      label: "Review of Systems",
      title: "Review of Systems", 
      instructions: "Review each body system with the patient",
      items: [
        { buttonName: "Negative", text: "Patient denies symptoms" },
        { buttonName: "Positive", text: "Patient reports symptoms" },
        { buttonName: "Not Asked", text: "Not discussed during visit" }
      ]
    },
    {
      label: "Medications",
      title: "Current Medications",
      instructions: "Review patient's current medication list",
      items: [
        { buttonName: "Continuing", text: "Continue current medication" },
        { buttonName: "Discontinued", text: "Medication discontinued" },
        { buttonName: "Modified", text: "Dosage or frequency modified" }
      ]
    }
  ];

  const handleExampleClick = useCallback((example: typeof exampleTemplates[0]) => {
    setTitle(example.title);
    setInstructions(example.instructions);
    setChecklistItems(example.items.map((item, index) => ({
      id: (Date.now() + index).toString(),
      buttonName: item.buttonName,
      text: item.text
    })));
    setTitleError('');
    setInstructionsError('');
  }, []);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          boxShadow: '0 24px 56px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2, px: 3, pt: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton 
              onClick={onBack}
              size="small"
              sx={{
                backgroundColor: alpha('#000', 0.05),
                '&:hover': { backgroundColor: alpha('#000', 0.1) }
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box 
                sx={{
                  backgroundColor: alpha('#4caf50', 0.1),
                  p: 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CheckBoxIcon sx={{ fontSize: 20, color: '#2e7d32' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                  Configure Checklist Section
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Create clickable buttons with associated text
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{
              backgroundColor: alpha('#000', 0.05),
              '&:hover': { backgroundColor: alpha('#000', 0.1) }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Alert 
            severity="info" 
            icon={<CheckBoxIcon />}
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '0.875rem' }
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              How Checklists Work
            </Typography>
            <Typography variant="body2">
              Create clickable buttons that insert predefined text when selected. Perfect for standardized examinations, reviews, or assessments.
            </Typography>
          </Alert>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LightbulbIcon sx={{ fontSize: 18, color: 'warning.main' }} />
              Quick Start Templates
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {exampleTemplates.map((example) => (
                <Chip
                  key={example.label}
                  label={example.label}
                  variant="outlined"
                  clickable
                  onClick={() => handleExampleClick(example)}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: alpha('#4caf50', 0.05),
                      borderColor: '#4caf50'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Section Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError('');
            }}
            placeholder="e.g., Physical Examination, Review of Systems"
            variant="outlined"
            size="small"
            error={!!titleError}
            helperText={titleError || "This will appear as the section header"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <TextField
            fullWidth
            label="Instructions for AI"
            multiline
            rows={3}
            value={instructions}
            onChange={(e) => {
              setInstructions(e.target.value);
              if (instructionsError) setInstructionsError('');
            }}
            placeholder="Describe what this checklist is for and how it should be used..."
            variant="outlined"
            error={!!instructionsError}
            helperText={instructionsError || "Guide the AI on how to use this checklist"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Checklist Items
              </Typography>
              <Button
                onClick={addChecklistItem}
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Add Item
              </Button>
            </Box>

            <Stack spacing={2}>
              {checklistItems.map((item, index) => (
                <Paper 
                  key={item.id}
                  sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'grey.200', 
                    borderRadius: 2,
                    backgroundColor: alpha('#f5f5f5', 0.3)
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Button Text"
                        value={item.buttonName}
                        onChange={(e) => updateChecklistItem(item.id, 'buttonName', e.target.value)}
                        placeholder="e.g., Normal, Abnormal"
                        variant="outlined"
                        size="small"
                        sx={{ 
                          mb: 2,
                          '& .MuiOutlinedInput-root': { borderRadius: 1.5 }
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Text to Insert"
                        value={item.text}
                        onChange={(e) => updateChecklistItem(item.id, 'text', e.target.value)}
                        placeholder="Text that will be inserted when button is clicked"
                        variant="outlined"
                        size="small"
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 1.5 }
                        }}
                      />
                    </Box>
                    {checklistItems.length > 1 && (
                      <IconButton
                        onClick={() => removeChecklistItem(item.id)}
                        size="small"
                        sx={{
                          color: 'error.main',
                          backgroundColor: alpha('#f44336', 0.05),
                          '&:hover': { backgroundColor: alpha('#f44336', 0.1) },
                          mt: 0.5
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Accordion sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                ⚙️ Advanced Options
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={hideEmptyItems}
                      onChange={(e) => setHideEmptyItems(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Hide items with no selection"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onBack}
          variant="outlined"
          size="medium"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="medium"
          onClick={handleContinue}
          disabled={!title.trim() || !instructions.trim() || checklistItems.length === 0}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              boxShadow: 'none'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChecklistConfigDialog;
