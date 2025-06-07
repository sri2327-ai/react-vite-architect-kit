
import React, { useState } from 'react';
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
  RadioGroup,
  Radio,
  Checkbox
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowBack as ArrowBackIcon, 
  FileText as FileTextIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface ExamItem {
  id: string;
  subsectionTitle: string;
  reportInstructions: string;
  normalText: string;
}

interface WithinNormalLimitsSettings {
  whenNotDiscussed: 'blank' | 'default' | 'alert';
  whenNormal: 'summarize' | 'specified' | 'highlight';
  hideEmpty: boolean;
}

interface ExamListConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (config: { 
    title: string; 
    items: ExamItem[];
    withinNormalLimits: WithinNormalLimitsSettings;
  }) => void;
  onBack: () => void;
}

const ExamListConfigDialog: React.FC<ExamListConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack
}) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ExamItem[]>([
    { id: '1', subsectionTitle: '', reportInstructions: '', normalText: '' }
  ]);
  const [withinNormalLimits, setWithinNormalLimits] = useState<WithinNormalLimitsSettings>({
    whenNotDiscussed: 'blank',
    whenNormal: 'summarize',
    hideEmpty: false
  });
  const [titleError, setTitleError] = useState('');
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    let isValid = true;
    const newItemErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      setTitleError('Section title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    items.forEach(item => {
      if (!item.subsectionTitle.trim()) {
        newItemErrors[`${item.id}-subsectionTitle`] = 'Subsection title is required';
        isValid = false;
      }
      if (!item.reportInstructions.trim()) {
        newItemErrors[`${item.id}-reportInstructions`] = 'Instructions are required';
        isValid = false;
      }
    });

    setItemErrors(newItemErrors);
    return isValid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onContinue({ title: title.trim(), items, withinNormalLimits });
    }
  };

  const addItem = () => {
    const newItem: ExamItem = {
      id: Date.now().toString(),
      subsectionTitle: '',
      reportInstructions: '',
      normalText: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ExamItem, value: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
    
    // Clear errors for this field
    const errorKey = `${id}-${field}`;
    if (itemErrors[errorKey]) {
      setItemErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleWithinNormalLimitsChange = (field: keyof WithinNormalLimitsSettings, value: any) => {
    setWithinNormalLimits(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exampleTemplates = [
    {
      label: "Physical Exam",
      title: "Physical Examination",
      items: [
        { subsectionTitle: "Heart", reportInstructions: "Document heart sounds, rhythm, and any murmurs", normalText: "Regular rate and rhythm, no murmurs" },
        { subsectionTitle: "Lungs", reportInstructions: "Document breath sounds and respiratory effort", normalText: "Clear to auscultation bilaterally" },
        { subsectionTitle: "Abdomen", reportInstructions: "Document abdominal examination findings", normalText: "Soft, non-tender, no masses" }
      ]
    },
    {
      label: "Neurological",
      title: "Neurological Examination", 
      items: [
        { subsectionTitle: "Mental Status", reportInstructions: "Assess orientation, memory, and cognition", normalText: "Alert and oriented x3" },
        { subsectionTitle: "Motor", reportInstructions: "Evaluate muscle strength and tone", normalText: "5/5 strength throughout" },
        { subsectionTitle: "Reflexes", reportInstructions: "Test deep tendon reflexes", normalText: "2+ reflexes bilaterally" }
      ]
    }
  ];

  const handleExampleClick = (example: typeof exampleTemplates[0]) => {
    setTitle(example.title);
    setItems(example.items.map((item, index) => ({
      id: (Date.now() + index).toString(),
      subsectionTitle: item.subsectionTitle,
      reportInstructions: item.reportInstructions,
      normalText: item.normalText
    })));
    setTitleError('');
    setItemErrors({});
  };

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
                  backgroundColor: alpha('#2196f3', 0.1),
                  p: 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FileTextIcon sx={{ fontSize: 20, color: '#1976d2' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                  Configure Exam List Section
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Structured AI-generated content
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
            icon={<InfoIcon />}
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '0.875rem' }
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              How Exam Lists Work
            </Typography>
            <Typography variant="body2">
              Each subsection gets its own AI instruction. Define what aspects of the exam to report on and set default text for normal findings.
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
                      backgroundColor: alpha('#2196f3', 0.05),
                      borderColor: '#2196f3'
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
            placeholder="Enter section title..."
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

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Exam Sections
              </Typography>
              <Button
                onClick={addItem}
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Add Section
              </Button>
            </Box>

            <Stack spacing={2}>
              {items.map((item, index) => (
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
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Box 
                      sx={{
                        minWidth: 32,
                        height: 32,
                        backgroundColor: alpha('#2196f3', 0.1),
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1976d2',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        {item.subsectionTitle || `Section ${index + 1}`}
                      </Typography>
                    </Box>
                    {items.length > 1 && (
                      <IconButton
                        onClick={() => removeItem(item.id)}
                        size="small"
                        sx={{
                          color: 'error.main',
                          backgroundColor: alpha('#f44336', 0.05),
                          '&:hover': { backgroundColor: alpha('#f44336', 0.1) }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Subsection Title"
                      value={item.subsectionTitle}
                      onChange={(e) => updateItem(item.id, 'subsectionTitle', e.target.value)}
                      placeholder="e.g., Heart, Lungs, Abdomen..."
                      variant="outlined"
                      size="small"
                      error={!!itemErrors[`${item.id}-subsectionTitle`]}
                      helperText={itemErrors[`${item.id}-subsectionTitle`]}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5 }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="AI Instructions"
                      value={item.reportInstructions}
                      onChange={(e) => updateItem(item.id, 'reportInstructions', e.target.value)}
                      placeholder="Tell the AI what to focus on for this section..."
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
                      error={!!itemErrors[`${item.id}-reportInstructions`]}
                      helperText={itemErrors[`${item.id}-reportInstructions`]}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5 }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Normal Findings Text (Optional)"
                      value={item.normalText}
                      onChange={(e) => updateItem(item.id, 'normalText', e.target.value)}
                      placeholder="Text to use when findings are within normal limits..."
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5 }
                      }}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Accordion sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                ⚙️ Advanced Settings
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    When an item is not discussed:
                  </Typography>
                  <RadioGroup
                    value={withinNormalLimits.whenNotDiscussed}
                    onChange={(e) => handleWithinNormalLimitsChange('whenNotDiscussed', e.target.value)}
                  >
                    <FormControlLabel 
                      value="blank" 
                      control={<Radio size="small" />} 
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Leave it blank</Typography>
                          <Typography variant="caption" color="text.secondary">Section won't appear in output</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel 
                      value="default" 
                      control={<Radio size="small" />} 
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Default to "Within Normal Limits"</Typography>
                          <Typography variant="caption" color="text.secondary">Use standard normal text</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel 
                      value="alert" 
                      control={<Radio size="small" />} 
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Alert provider</Typography>
                          <Typography variant="caption" color="text.secondary">Add reminder note for missing sections</Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    When findings are normal:
                  </Typography>
                  <RadioGroup
                    value={withinNormalLimits.whenNormal}
                    onChange={(e) => handleWithinNormalLimitsChange('whenNormal', e.target.value)}
                  >
                    <FormControlLabel 
                      value="summarize" 
                      control={<Radio size="small" />} 
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Summarize discussion</Typography>
                          <Typography variant="caption" color="text.secondary">AI generates summary of normal findings</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel 
                      value="specified" 
                      control={<Radio size="small" />} 
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Use specified text</Typography>
                          <Typography variant="caption" color="text.secondary">Use the text you defined above</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel 
                      value="highlight" 
                      control={<Radio size="small" />} 
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Highlight abnormal only</Typography>
                          <Typography variant="caption" color="text.secondary">Focus on what's not normal</Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={withinNormalLimits.hideEmpty}
                      onChange={(e) => handleWithinNormalLimitsChange('hideEmpty', e.target.checked)}
                      size="small"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Hide empty sections</Typography>
                      <Typography variant="caption" color="text.secondary">Don't show sections with no content</Typography>
                    </Box>
                  }
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
          disabled={!title.trim() || items.some(item => !item.subsectionTitle.trim() || !item.reportInstructions.trim())}
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

export default ExamListConfigDialog;
