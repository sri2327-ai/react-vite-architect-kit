
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
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface SectionHeaderConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (config: { title: string }) => void;
  onBack: () => void;
}

const SectionHeaderConfigDialog: React.FC<SectionHeaderConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack
}) => {
  const [title, setTitle] = useState('');

  const handleContinue = () => {
    onContinue({ title });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Section Header</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>How this works</strong><br />
            Section headers help organize your note into clear, distinct sections. Use them to create a logical structure in your notes. Change the title above to change the name of the section. This will not impact the A.I. generation.
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!title}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionHeaderConfigDialog;
