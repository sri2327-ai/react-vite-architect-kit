
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
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface ChecklistItem {
  id: string;
  buttonName: string;
  textToAdd: string;
}

interface ChecklistConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (config: { title: string; items: ChecklistItem[] }) => void;
  onBack: () => void;
}

const ChecklistConfigDialog: React.FC<ChecklistConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack
}) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', buttonName: '', textToAdd: '' }
  ]);

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      buttonName: '',
      textToAdd: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < items.length - 1)
    ) {
      const newItems = [...items];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      setItems(newItems);
    }
  };

  const updateItem = (id: string, field: 'buttonName' | 'textToAdd', value: string) => {
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
          <Typography variant="h6">Edit Checklist</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>How this works</strong><br />
            Add items below. Each item will get a button. On press of the button, the corresponding text will be added to the note. This will not be A.I. generated; you will need to manually press the button to insert the exact corresponding text.
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
          What buttons do you want to include?
        </Typography>

        <Stack spacing={2}>
          {items.map((item, index) => (
            <Paper key={item.id} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Button Name"
                  value={item.buttonName}
                  onChange={(e) => updateItem(item.id, 'buttonName', e.target.value)}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="What text should be added when this button is clicked?"
                  multiline
                  rows={3}
                  value={item.textToAdd}
                  onChange={(e) => updateItem(item.id, 'textToAdd', e.target.value)}
                />
                <Box display="flex" justifyContent="space-between">
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<ArrowUpwardIcon />}
                      onClick={() => moveItem(item.id, 'up')}
                      disabled={index === 0}
                    >
                      Move Up
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ArrowDownwardIcon />}
                      onClick={() => moveItem(item.id, 'down')}
                      disabled={index === items.length - 1}
                    >
                      Move Down
                    </Button>
                  </Stack>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    Delete Item
                  </Button>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Button
          startIcon={<AddIcon />}
          onClick={addItem}
          sx={{ mt: 2 }}
        >
          Add Another Item
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!title || items.some(item => !item.buttonName || !item.textToAdd)}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChecklistConfigDialog;
