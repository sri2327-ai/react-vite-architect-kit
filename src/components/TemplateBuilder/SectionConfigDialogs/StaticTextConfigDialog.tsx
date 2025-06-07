
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Static Text</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>How this works</strong><br />
            Whatever you enter here will appear exactly as-is in your generated note. Use this for fixed text that should remain the same across all notes that you need in every encounter.
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="What fixed text do you want included in all notes?"
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!title || !content}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaticTextConfigDialog;
