
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
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface SectionConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  onBack?: () => void;
  sectionType: string;
  sectionName: string;
}

const SectionConfigDialog: React.FC<SectionConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack,
  sectionType,
  sectionName
}) => {
  const [title, setTitle] = useState(sectionName);
  const [instructions, setInstructions] = useState('');

  React.useEffect(() => {
    if (open) {
      setTitle(sectionName);
      setInstructions('');
    }
  }, [open, sectionName]);

  const handleContinue = () => {
    console.log('Section configuration completed:', { title, instructions, sectionType });
    onContinue();
  };

  const handleBack = () => {
    console.log('Going back to section selection');
    if (onBack) {
      onBack();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {onBack && (
              <IconButton 
                onClick={handleBack} 
                sx={{ 
                  mr: 1,
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Configure Section: {sectionName}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            💡 How AI Instructions Work
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 0, '& li': { mb: 1 } }}>
            <li><strong>Natural Language:</strong> Write instructions as you would explain to a colleague</li>
            <li><strong>Placeholders:</strong> Use {'{variable}'} for dynamic content</li>
            <li><strong>Exact Text:</strong> Use "quotes" for text that must appear exactly</li>
            <li><strong>Hidden Notes:</strong> Use (parentheses) for AI-only instructions</li>
          </Box>
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
          />
          
          <TextField
            fullWidth
            label="AI Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            multiline
            rows={6}
            placeholder={`Provide detailed instructions for how the AI should generate the ${sectionName} section...`}
            variant="outlined"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleContinue}
          disabled={!title.trim()}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionConfigDialog;
