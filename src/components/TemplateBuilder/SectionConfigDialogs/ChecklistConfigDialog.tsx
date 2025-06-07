
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
  Divider,
  Alert,
  Chip,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as MoveUpIcon,
  KeyboardArrowDown as MoveDownIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

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
  const [titleError, setTitleError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Section title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    return isValid && items.every(item => item.buttonName.trim() && item.textToAdd.trim());
  };

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      buttonName: '',
      textToAdd: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
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
    if (validateForm()) {
      onContinue({ title: title.trim(), items });
    }
  };

  const exampleTemplates = [
    {
      label: "Vitals",
      title: "Vital Signs Checklist",
      items: [
        { buttonName: "Normal BP", textToAdd: "Blood pressure within normal limits" },
        { buttonName: "Normal HR", textToAdd: "Heart rate regular and within normal range" }
      ]
    },
    {
      label: "Follow-up", 
      title: "Follow-up Instructions",
      items: [
        { buttonName: "RTC 1 week", textToAdd: "Return to clinic in 1 week" },
        { buttonName: "Call if worse", textToAdd: "Call office if symptoms worsen" }
      ]
    }
  ];

  const handleExampleClick = (example: typeof exampleTemplates[0]) => {
    setTitle(example.title);
    setItems(example.items.map((item, index) => ({
      id: (Date.now() + index).toString(),
      buttonName: item.buttonName,
      textToAdd: item.textToAdd
    })));
    setTitleError('');
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
          maxHeight: '90vh',
          boxShadow: '0 24px 56px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2, px: 3, pt: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton 
              onClick={onBack}
              size="small"
              sx={{
                backgroundColor: alpha('#000', 0.05),
                '&:hover': { backgroundColor: alpha('#000', 0.1) }
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box 
                sx={{
                  backgroundColor: alpha('#9c27b0', 0.1),
                  p: 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 20, color: '#7b1fa2' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                  Configure Checklist Section
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Clickable buttons for quick text insertion
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{
              backgroundColor: alpha('#000', 0.05),
              '&:hover': { backgroundColor: alpha('#000', 0.1) }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Alert 
            severity="info" 
            icon={<CheckCircleIcon />}
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '0.875rem' }
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              How Checklists Work
            </Typography>
            <Typography variant="body2">
              Create clickable buttons that insert predefined text into your notes. Each button click adds the exact corresponding text - no AI generation involved.
            </Typography>
          </Alert>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LightbulbIcon sx={{ fontSize: 18, color: 'warning.main' }} />
              Quick Start Templates
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {exampleTemplates.map((example) => (
                <Chip
                  key={example.label}
                  label={example.label}
                  variant="outlined"
                  clickable
                  onClick={() => handleExampleClick(example)}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: alpha('#9c27b0', 0.05),
                      borderColor: '#9c27b0'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Checklist Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError('');
            }}
            placeholder="e.g., Quick Actions, Common Findings"
            variant="outlined"
            size="small"
            error={!!titleError}
            helperText={titleError || "This will appear as the section header"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              What buttons do you want to include?
            </Typography>
            
            <Stack spacing={2}>
              {items.map((item, index) => (
                <Card 
                  key={item.id} 
                  sx={{ 
                    border: '2px solid', 
                    borderColor: 'grey.200',
                    '&:hover': { borderColor: 'primary.light' },
                    transition: 'border-color 0.2s'
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={`Button ${index + 1}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Move Up">
                          <IconButton 
                            size="small" 
                            onClick={() => moveItem(item.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUpIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Move Down">
                          <IconButton 
                            size="small" 
                            onClick={() => moveItem(item.id, 'down')}
                            disabled={index === items.length - 1}
                          >
                            <MoveDownIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {items.length > 1 && (
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              onClick={() => removeItem(item.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                    
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Button Name"
                        value={item.buttonName}
                        onChange={(e) => updateItem(item.id, 'buttonName', e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="e.g., Normal BP, Follow-up"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Text to insert when clicked"
                        value={item.textToAdd}
                        onChange={(e) => updateItem(item.id, 'textToAdd', e.target.value)}
                        multiline
                        rows={2}
                        variant="outlined"
                        size="small"
                        placeholder="Enter the exact text that will be added to the note..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Button
              startIcon={<AddIcon />}
              onClick={addItem}
              variant="outlined"
              sx={{ 
                mt: 2, 
                textTransform: 'none',
                borderStyle: 'dashed',
                '&:hover': { borderStyle: 'solid' },
                borderRadius: 2
              }}
            >
              Add Another Button
            </Button>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onBack}
          variant="outlined"
          size="medium"
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
          size="medium"
          onClick={handleContinue}
          disabled={!validateForm()}
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

export default ChecklistConfigDialog;
