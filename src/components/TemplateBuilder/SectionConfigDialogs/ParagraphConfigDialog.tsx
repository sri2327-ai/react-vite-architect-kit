
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Paragraph</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>How this works</strong><br />
            Instruct as you would to a human
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Tell Medwriter what you want it to write, as you would tell another human (or ChatGPT) how to write this section. Explain what you it should do, where it should focus, etc.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Suggest Length</strong><br />
            State the brevity or length (e.g., keep this brief, 2-3 paragraphs).
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Placeholders: {'{}'}</strong><br />
            Use for info the AI should fill in: Summary for {'{Scale Result}'}.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Verbatim Text: ""</strong><br />
            Use double quotes for text to include exactly: Conclude with "Follow up as needed."
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Hidden Instructions: ()</strong><br />
            Use parentheses for notes to the AI (won't appear in output): Physical exam findings (focus on cardio).
          </Typography>
        </Box>

        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Example</Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            "Summarize any assessments discussed in this session; keep it brief. Use the following format: {'{Scale Name}'}: {'{Scale Result}'}. (If none discussed, leave this blank)."
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
          label="What do you want the A.I. to generate in this section?"
          multiline
          rows={6}
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

export default ParagraphConfigDialog;
