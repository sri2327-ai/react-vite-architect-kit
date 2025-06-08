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
  AccordionDetails
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowBack as ArrowBackIcon, 
  TextSnippet as TextSnippetIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useResponsive } from '../../../hooks/useResponsive';

interface StaticTextConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (config: { title: string; content: string }) => void;
  onBack: () => void;
}

const StaticTextConfigDialog: React.FC<StaticTextConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack
}) => {
  const { isMobile, isTablet } = useResponsive();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Section title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    if (!content.trim()) {
      setContentError('Static text content is required');
      isValid = false;
    } else {
      setContentError('');
    }
    
    return isValid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onContinue({ title: title.trim(), content: content.trim() });
    }
  };

  const exampleTemplates = [
    {
      label: "Disclaimer",
      title: "Medical Disclaimer",
      content: "This note is for informational purposes only and does not constitute medical advice. Please consult your healthcare provider for medical concerns."
    },
    {
      label: "Practice Info", 
      title: "Practice Information",
      content: "For questions or concerns, please contact our office at (555) 123-4567 or visit our patient portal."
    },
    {
      label: "Instructions",
      title: "Patient Instructions", 
      content: "Please follow up as directed. Contact our office immediately if you experience any concerning symptoms."
    }
  ];

  const handleExampleClick = (example: typeof exampleTemplates[0]) => {
    setTitle(example.title);
    setContent(example.content);
    setTitleError('');
    setContentError('');
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
                  backgroundColor: alpha('#ff9800', 0.1),
                  p: { xs: 0.75, sm: 1 },
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <TextSnippetIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: '#f57c00' }} />
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
                  Configure Static Text Section
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  Fixed text that appears in every note
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
            icon={<TextSnippetIcon />}
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: { xs: '0.75rem', sm: '0.875rem' } }
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1, 
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}
            >
              How Static Text Works
            </Typography>
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
            >
              Whatever you enter here will appear exactly as-is in your generated note. Use this for fixed text that should remain the same across all notes.
            </Typography>
          </Alert>

          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontSize: { xs: '0.85rem', sm: '1rem' }
              }}
            >
              <LightbulbIcon sx={{ fontSize: { xs: 14, sm: 18 }, color: 'warning.main' }} />
              Quick Start Templates
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 }, mb: { xs: 2, sm: 3 } }}>
              {exampleTemplates.map((example) => (
                <Chip
                  key={example.label}
                  label={example.label}
                  variant="outlined"
                  clickable
                  onClick={() => handleExampleClick(example)}
                  sx={{
                    borderRadius: 2,
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    '&:hover': {
                      backgroundColor: alpha('#ff9800', 0.05),
                      borderColor: '#ff9800'
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
            placeholder="e.g., Disclaimer, Practice Info, Instructions"
            variant="outlined"
            size="small"
            error={!!titleError}
            helperText={titleError || "This will appear as the section header"}
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
            label="What fixed text do you want included in all notes?"
            multiline
            rows={isMobile ? 5 : isTablet ? 6 : 8}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (contentError) setContentError('');
            }}
            placeholder="Enter the exact text that should appear in every generated note..."
            variant="outlined"
            error={!!contentError}
            helperText={contentError || `${content.length}/1000 characters`}
            inputProps={{ maxLength: 1000 }}
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

          <Accordion sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }}
              >
                💡 Common Use Cases
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: { xs: 1, sm: 2 } }}>
              <Stack spacing={{ xs: 1.5, sm: 2 }}>
                <Paper sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: alpha('#4caf50', 0.05), border: `1px solid ${alpha('#4caf50', 0.2)}` }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#388e3c',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' }
                    }}
                  >
                    📄 DISCLAIMERS
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                  >
                    Standard legal text or medical disclaimers
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: alpha('#2196f3', 0.05), border: `1px solid ${alpha('#2196f3', 0.2)}` }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#1976d2',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' }
                    }}
                  >
                    🏥 PRACTICE INFO
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                  >
                    Contact details or practice information
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: alpha('#9c27b0', 0.05), border: `1px solid ${alpha('#9c27b0', 0.2)}` }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#7b1fa2',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' }
                    }}
                  >
                    📋 INSTRUCTIONS
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                  >
                    Standard instructions that appear in every note
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
          disabled={!title.trim() || !content.trim()}
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

export default StaticTextConfigDialog;
