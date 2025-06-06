
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
  Paper,
  IconButton,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Help as HelpIcon
} from '@mui/icons-material';

interface BulletedListConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onContinue: (config: any) => void;
}

const BulletedListConfigDialog: React.FC<BulletedListConfigDialogProps> = ({
  open,
  onClose,
  onBack,
  onContinue
}) => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleContinue = () => {
    if (!title.trim() || !instructions.trim()) return;
    
    onContinue({
      title,
      instructions,
      type: 'bulleted-list'
    });
  };

  const handleClose = () => {
    setTitle('');
    setInstructions('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Bulleted List
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            border: '1px solid rgba(25, 118, 210, 0.12)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <HelpIcon sx={{ color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                How this works
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                Specify your bulleted list instructions. Tell the A.I. what information you want it to generate in a bulleted list format.
              </Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Example
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', lineHeight: 1.6 }}>
                For instance, you could write: Create a bullet for each medication that was discussed. 
                Each bullet should follow this format: {'{Medication Name}'} - {'{Dosage}'}, {'{Frequency}'}
              </Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Tips
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                Be specific about what information you want included in each bullet point. 
                The A.I. will format the output as a bulleted list.
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Title
          </Typography>
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter section title"
            variant="outlined"
            size="small"
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            What do you want the A.I. to generate bullets for?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Provide detailed instructions for what the AI should include in each bullet point..."
            variant="outlined"
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onBack}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          variant="contained"
          disabled={!title.trim() || !instructions.trim()}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulletedListConfigDialog;
