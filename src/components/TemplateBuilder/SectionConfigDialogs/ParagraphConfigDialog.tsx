
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
  Tooltip
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowBack as ArrowBackIcon, 
  Info as InfoIcon,
  Article as ArticleIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface ParagraphConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (config: { title: string; instructions: string }) => void;
  onBack: () => void;
}

const ParagraphConfigDialog: React.FC<ParagraphConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack
}) => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [titleError, setTitleError] = useState('');
  const [instructionsError, setInstructionsError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Section title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    if (!instructions.trim()) {
      setInstructionsError('AI instructions are required');
      isValid = false;
    } else {
      setInstructionsError('');
    }
    
    return isValid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onContinue({ title: title.trim(), instructions: instructions.trim() });
    }
  };

  const exampleTemplates = [
    {
      label: "Chief Complaint",
      title: "Chief Complaint",
      instruction: "Summarize the patient's primary concern in 1-2 sentences. Include onset and severity if discussed."
    },
    {
      label: "Assessment", 
      title: "Assessment",
      instruction: "Provide clinical impression based on findings. Keep it concise and professional."
    },
    {
      label: "History",
      title: "History of Present Illness", 
      instruction: "Document the timeline and progression of current symptoms in paragraph format."
    }
  ];

  const handleExampleClick = (example: typeof exampleTemplates[0]) => {
    setTitle(example.title);
    setInstructions(example.instruction);
    setTitleError('');
    setInstructionsError('');
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
                <ArticleIcon sx={{ fontSize: 20, color: '#1976d2' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                  Configure Paragraph Section
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  AI-generated paragraph content
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
              How Paragraph Sections Work
            </Typography>
            <Typography variant="body2">
              Tell the AI what you want it to write, as you would instruct a colleague. Be specific about content and desired length.
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
            placeholder="e.g., Chief Complaint, Assessment, History"
            variant="outlined"
            size="small"
            error={!!titleError}
            helperText={titleError || "This will appear as the section header in your template"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <TextField
            fullWidth
            label="AI Instructions"
            multiline
            rows={6}
            value={instructions}
            onChange={(e) => {
              setInstructions(e.target.value);
              if (instructionsError) setInstructionsError('');
            }}
            placeholder="Describe what you want the AI to generate in this section..."
            variant="outlined"
            error={!!instructionsError}
            helperText={instructionsError || `${instructions.length}/500 characters`}
            inputProps={{ maxLength: 500 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <Accordion sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                💡 Advanced Formatting Tips
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Paper sx={{ p: 2, backgroundColor: alpha('#2196f3', 0.05), border: `1px solid ${alpha('#2196f3', 0.2)}` }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    📝 SUGGEST LENGTH
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    "Keep this brief" or "Write 2-3 paragraphs"
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: 2, backgroundColor: alpha('#4caf50', 0.05), border: `1px solid ${alpha('#4caf50', 0.2)}` }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#388e3c' }}>
                    🔗 PLACEHOLDERS: {"{}"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use for dynamic content: "Summary for {'{Scale Result}'}"
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: 2, backgroundColor: alpha('#ff9800', 0.05), border: `1px solid ${alpha('#ff9800', 0.2)}` }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#f57c00' }}>
                    💬 EXACT TEXT: ""
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use quotes: 'Conclude with "Follow up as needed."'
                  </Typography>
                </Paper>
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
          disabled={!title.trim() || !instructions.trim()}
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

export default ParagraphConfigDialog;
