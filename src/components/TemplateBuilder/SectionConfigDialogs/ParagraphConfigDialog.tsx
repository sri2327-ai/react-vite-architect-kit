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
import { useResponsive } from '../../../hooks/useResponsive';

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
  const { isMobile, isTablet } = useResponsive();
  
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
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          maxHeight: { xs: '100vh', sm: '90vh' },
          boxShadow: '0 24px 56px rgba(0,0,0,0.15)',
          m: { xs: 0, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: { xs: 1, sm: 2 }, 
        px: { xs: 2, sm: 3 }, 
        pt: { xs: 2, sm: 3 },
        position: { xs: 'sticky', sm: 'static' },
        top: 0,
        zIndex: 1,
        backgroundColor: 'background.paper'
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
            <IconButton 
              onClick={onBack}
              size="small"
              sx={{
                backgroundColor: alpha('#000', 0.05),
                '&:hover': { backgroundColor: alpha('#000', 0.1) },
                minWidth: { xs: 36, sm: 40 },
                minHeight: { xs: 36, sm: 40 }
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
              <Box 
                sx={{
                  backgroundColor: alpha('#2196f3', 0.1),
                  p: { xs: 0.75, sm: 1 },
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ArticleIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: '#1976d2' }} />
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 0.5, 
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  Configure Paragraph Section
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
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
              '&:hover': { backgroundColor: alpha('#000', 0.1) },
              minWidth: { xs: 36, sm: 40 },
              minHeight: { xs: 36, sm: 40 }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ 
        p: { xs: 2, sm: 3 },
        overflowY: 'auto',
        flex: 1
      }}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          <Alert 
            severity="info" 
            icon={<InfoIcon />}
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1, 
                fontWeight: 600,
                fontSize: { xs: '0.85rem', sm: '0.9rem' }
              }}
            >
              How Paragraph Sections Work
            </Typography>
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
            >
              Tell the AI what you want it to write, as you would instruct a colleague. Be specific about content and desired length.
            </Typography>
          </Alert>

          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: { xs: 1.5, sm: 2 }, 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              <LightbulbIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: 'warning.main' }} />
              Quick Start Templates
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 0.75, sm: 1 }, 
              mb: { xs: 2, sm: 3 } 
            }}>
              {exampleTemplates.map((example) => (
                <Chip
                  key={example.label}
                  label={example.label}
                  variant="outlined"
                  clickable
                  onClick={() => handleExampleClick(example)}
                  sx={{
                    borderRadius: 2,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    height: { xs: 28, sm: 32 },
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
              },
              '& .MuiFormHelperText-root': {
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.85rem', sm: '0.875rem' }
              }
            }}
          />

          <TextField
            fullWidth
            label="AI Instructions"
            multiline
            rows={isMobile ? 4 : isTablet ? 5 : 6}
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
              },
              '& .MuiFormHelperText-root': {
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.85rem', sm: '0.875rem' }
              }
            }}
          />

          <Accordion sx={{ 
            boxShadow: 'none', 
            border: '1px solid', 
            borderColor: 'grey.200', 
            borderRadius: 2 
          }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ p: { xs: 1.5, sm: 2 } }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }}
              >
                💡 Advanced Formatting Tips
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack spacing={{ xs: 1.5, sm: 2 }}>
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

      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 }, 
        gap: { xs: 1, sm: 2 },
        flexDirection: { xs: 'column', sm: 'row' },
        position: { xs: 'sticky', sm: 'static' },
        bottom: 0,
        backgroundColor: 'background.paper',
        borderTop: { xs: '1px solid', sm: 'none' },
        borderColor: { xs: 'divider', sm: 'transparent' }
      }}>
        <Button 
          onClick={onBack}
          variant="outlined"
          size="medium"
          fullWidth={isMobile}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            py: { xs: 1.5, sm: 1 }
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="medium"
          onClick={handleContinue}
          disabled={!title.trim() || !instructions.trim()}
          fullWidth={isMobile}
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
            transition: 'all 0.3s ease',
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            py: { xs: 1.5, sm: 1 }
          }}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParagraphConfigDialog;
