
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
  Divider,
  Alert
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon, TextSnippet as TextSnippetIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleContinue = () => {
    onContinue({ title, content });
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
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton 
              onClick={onBack}
              sx={{
                backgroundColor: alpha('#000', 0.05),
                '&:hover': { backgroundColor: alpha('#000', 0.1) }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Configure Static Text Section
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add fixed text that appears the same in every note
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose}
            sx={{
              backgroundColor: alpha('#000', 0.05),
              '&:hover': { backgroundColor: alpha('#000', 0.1) }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Alert 
          severity="info" 
          icon={<TextSnippetIcon />}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': { fontSize: '0.875rem' }
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            How Static Text Works
          </Typography>
          <Typography variant="body2">
            Whatever you enter here will appear exactly as-is in your generated note. Use this for fixed text that should remain the same across all notes.
          </Typography>
        </Alert>

        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha('#e8f5e8', 0.5), borderRadius: 2, border: `1px solid ${alpha('#4caf50', 0.2)}` }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#2e7d32' }}>
            💡 Common Use Cases
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Standard disclaimers or legal text
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Practice information or contact details
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Instructions that appear in every note
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Standard closing statements
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Disclaimer, Practice Info, Instructions"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <TextField
            fullWidth
            label="What fixed text do you want included in all notes?"
            multiline
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the exact text that should appear in every generated note..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onBack}
          variant="outlined"
          size="large"
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
          size="large"
          onClick={handleContinue}
          disabled={!title || !content}
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

export default StaticTextConfigDialog;
