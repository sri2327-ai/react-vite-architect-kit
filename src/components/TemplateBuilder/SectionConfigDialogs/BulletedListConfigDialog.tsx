
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
  Paper
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Bulleted List</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>How this works</strong><br />
            Specify your bulleted list instructions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tell the A.I. what information you want it to generate in a bulleted list format.
          </Typography>
        </Box>

        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Example</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            For instance, you could write:
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
            Create a bullet for each medication that was discussed. Each bullet should follow this format: {'{Medication Name}'} - {'{Dosage}'}, {'{Frequency}'}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Tips</Typography>
          <Typography variant="body2">
            Be specific about what information you want included in each bullet point. The A.I. will format the output as a bulleted list.
          </Typography>
        </Paper>

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="What do you want the A.I. to generate bullets for?"
          multiline
          rows={4}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!title || !instructions}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulletedListConfigDialog;
