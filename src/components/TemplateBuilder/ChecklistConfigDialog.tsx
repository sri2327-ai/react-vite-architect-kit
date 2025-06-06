
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
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Help as HelpIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

interface ChecklistItem {
  id: string;
  buttonName: string;
  buttonText: string;
}

interface ChecklistConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onContinue: (config: any) => void;
}

const ChecklistConfigDialog: React.FC<ChecklistConfigDialogProps> = ({
  open,
  onClose,
  onBack,
  onContinue
}) => {
  const [title, setTitle] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: '1',
      buttonName: '',
      buttonText: ''
    }
  ]);

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, {
      id: Date.now().toString(),
      buttonName: '',
      buttonText: ''
    }]);
  };

  const removeChecklistItem = (id: string) => {
    if (checklistItems.length > 1) {
      setChecklistItems(checklistItems.filter(item => item.id !== id));
    }
  };

  const updateChecklistItem = (id: string, field: keyof ChecklistItem, value: string) => {
    setChecklistItems(checklistItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const currentIndex = checklistItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= checklistItems.length) return;

    const newItems = [...checklistItems];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    setChecklistItems(newItems);
  };

  const handleContinue = () => {
    if (!title.trim() || checklistItems.some(item => !item.buttonName.trim() || !item.buttonText.trim())) {
      return;
    }
    
    onContinue({
      title,
      checklistItems,
      type: 'checklist'
    });
  };

  const handleClose = () => {
    setTitle('');
    setChecklistItems([{ id: '1', buttonName: '', buttonText: '' }]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Checklist
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
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                Add items below. Each item will get a button. On press of the button, the corresponding text will be added to the note. 
                This will not be A.I. generated; you will need to manually press the button to insert the exact corresponding text.
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
            placeholder="What buttons do you want to include?"
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Checklist Items
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addChecklistItem}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Add Another Item
            </Button>
          </Box>

          {checklistItems.map((item, index) => (
            <Card key={item.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Item {index + 1}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => moveItem(item.id, 'up')}
                      size="small"
                      disabled={index === 0}
                      title="Move Up"
                    >
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => moveItem(item.id, 'down')}
                      size="small"
                      disabled={index === checklistItems.length - 1}
                      title="Move Down"
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                    {checklistItems.length > 1 && (
                      <IconButton
                        onClick={() => removeChecklistItem(item.id)}
                        size="small"
                        color="error"
                        title="Delete Item"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Button Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={item.buttonName}
                    onChange={(e) => updateChecklistItem(item.id, 'buttonName', e.target.value)}
                    placeholder="Enter button label"
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    What text should be added when this button is clicked?
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={item.buttonText}
                    onChange={(e) => updateChecklistItem(item.id, 'buttonText', e.target.value)}
                    placeholder="Enter the exact text that will be inserted when this button is clicked"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
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
          disabled={!title.trim() || checklistItems.some(item => !item.buttonName.trim() || !item.buttonText.trim())}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChecklistConfigDialog;
