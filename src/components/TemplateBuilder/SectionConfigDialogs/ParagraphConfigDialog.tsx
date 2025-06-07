
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
  Chip,
  Stack,
  Divider,
  Alert
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon, Info as InfoIcon } from '@mui/icons-material';
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

  const handleContinue = () => {
    onContinue({ title, instructions });
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
                Configure Paragraph Section
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up AI-generated paragraph content for your template
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
          icon={<InfoIcon />}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': { fontSize: '0.875rem' }
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            How Paragraph Sections Work
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tell the AI what you want it to write, as you would instruct a human. Be specific about content, focus areas, and desired length.
          </Typography>
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Formatting Guidelines
          </Typography>
          <Stack spacing={2}>
            <Paper sx={{ p: 2, backgroundColor: alpha('#2196f3', 0.05), border: `1px solid ${alpha('#2196f3', 0.2)}` }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#1976d2', fontWeight: 600 }}>
                📝 Suggest Length
              </Typography>
              <Typography variant="body2" color="text.secondary">
                State the brevity or length (e.g., "keep this brief", "2-3 paragraphs")
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, backgroundColor: alpha('#4caf50', 0.05), border: `1px solid ${alpha('#4caf50', 0.2)}` }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#388e3c', fontWeight: 600 }}>
                🔗 Placeholders: {"{}"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use for info the AI should fill in: "Summary for {'{Scale Result}'}"
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, backgroundColor: alpha('#ff9800', 0.05), border: `1px solid ${alpha('#ff9800', 0.2)}` }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#f57c00', fontWeight: 600 }}>
                💬 Verbatim Text: ""
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use quotes for exact text: 'Conclude with "Follow up as needed."'
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, backgroundColor: alpha('#9c27b0', 0.05), border: `1px solid ${alpha('#9c27b0', 0.2)}` }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#7b1fa2', fontWeight: 600 }}>
                🔒 Hidden Instructions: ()
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use parentheses for AI notes (won't appear): "Physical exam (focus on cardio)"
              </Typography>
            </Paper>
          </Stack>
        </Box>

        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            💡 Example
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
            "Summarize any assessments discussed in this session; keep it brief. Use the following format: {'{Scale Name}'}: {'{Scale Result}'}. (If none discussed, leave this blank)."
          </Typography>
        </Paper>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Chief Complaint, Assessment, History"
            variant="outlined"
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
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Describe what you want the AI to generate in this section..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Stack>
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
          disabled={!title || !instructions}
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
