
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
  Alert
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon, Info as InfoIcon, List as ListIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface BulletedListConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (config: { title: string; instructions: string }) => void;
  onBack: () => void;
}

const BulletedListConfigDialog: React.FC<BulletedListConfigDialogProps> = ({
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
                Configure Bulleted List Section
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up AI-generated bulleted content for your template
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
          icon={<ListIcon />}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': { fontSize: '0.875rem' }
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            How Bulleted Lists Work
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tell the AI what information you want it to generate in a bulleted list format. Be specific about what should be included in each bullet point.
          </Typography>
        </Alert>

        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            💡 Example Instructions
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2, lineHeight: 1.6 }}>
            "Create a bullet for each medication that was discussed. Each bullet should follow this format: {'{Medication Name}'} - {'{Dosage}'}, {'{Frequency}'}."
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            💡 Pro Tips
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Be specific about what information should be in each bullet
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Use formatting templates like: "• {'{Item}'} - {'{Details}'}"
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              The AI will automatically format the output as a bulleted list
            </Typography>
          </Box>
        </Paper>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Medications, Treatment Plan, Key Points"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <TextField
            fullWidth
            label="What do you want the A.I. to generate bullets for?"
            multiline
            rows={5}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Describe what should be included in each bullet point..."
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

export default BulletedListConfigDialog;
