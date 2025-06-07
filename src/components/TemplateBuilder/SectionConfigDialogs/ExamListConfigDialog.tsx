
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
  Stack,
  Paper,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface ExamItem {
  id: string;
  subsectionTitle: string;
  reportInstructions: string;
  normalText: string;
}

interface ExamListConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (config: { title: string; items: ExamItem[] }) => void;
  onBack: () => void;
}

const ExamListConfigDialog: React.FC<ExamListConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack
}) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ExamItem[]>([
    { id: '1', subsectionTitle: '', reportInstructions: '', normalText: '' }
  ]);

  const addItem = () => {
    const newItem: ExamItem = {
      id: Date.now().toString(),
      subsectionTitle: '',
      reportInstructions: '',
      normalText: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ExamItem, value: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleContinue = () => {
    onContinue({ title, items });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Exam List</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>How this works</strong><br />
            Review each subsection
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            An exam-list is a structured output, with each subsection as it's own instruction for Medwriter. You can add, remove, or edit sections.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Tell Medwriter what to focus on</strong><br />
            For each section, you can tell Medwriter what to write for that subsection.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Decide Normal Limits Behavior</strong><br />
            You can specify certain default "within normal limits" text, and decide when you want Medwriter to fall back to that text.
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          What exam sections would you like A.I. to report on?
        </Typography>

        <Stack spacing={3}>
          {items.map((item, index) => (
            <Paper key={item.id} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Item {index + 1}</Typography>
                <IconButton
                  color="error"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="I want to title this subsection..."
                  value={item.subsectionTitle}
                  onChange={(e) => updateItem(item.id, 'subsectionTitle', e.target.value)}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="I want the A.I. to report on..."
                  multiline
                  rows={3}
                  value={item.reportInstructions}
                  onChange={(e) => updateItem(item.id, 'reportInstructions', e.target.value)}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="When findings are normal, use this text..."
                  value={item.normalText}
                  onChange={(e) => updateItem(item.id, 'normalText', e.target.value)}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Button
          startIcon={<AddIcon />}
          onClick={addItem}
          sx={{ mt: 2 }}
        >
          Add another item
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Within Normal Limits Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure default behavior for normal findings above in each item's "When findings are normal" field.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!title || items.some(item => !item.subsectionTitle || !item.reportInstructions)}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExamListConfigDialog;
