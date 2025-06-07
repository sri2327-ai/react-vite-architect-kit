
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

  const getBulletedListGuidance = () => (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
        How this works
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Specify your bulleted list instructions
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Tell the A.I. what information you want it to generate in a bulleted list format.
      </Typography>
      
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
        Example
      </Typography>
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          For instance, you could write:
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.primary' }}>
          Create a bullet for each medication that was discussed. Each bullet should follow this format: {'{Medication Name}'} - {'{Dosage}'}, {'{Frequency}'}
        </Typography>
      </Paper>
      
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
        Tips
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Be specific about what information you want included in each bullet point. The A.I. will format the output as a bulleted list.
      </Typography>
    </Box>
  );

  const getGeneralGuidance = () => (
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
  );

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
              {sectionType === 'bulleted_list' ? 'Edit Bulleted List' : `Configure Section: ${sectionName}`}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {sectionType === 'bulleted_list' ? getBulletedListGuidance() : getGeneralGuidance()}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
          />
          
          <TextField
            fullWidth
            label={sectionType === 'bulleted_list' ? "What do you want the A.I. to generate bullets for?" : "AI Instructions"}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            multiline
            rows={6}
            placeholder={sectionType === 'bulleted_list' 
              ? "Describe what information should be included in each bullet point..."
              : `Provide detailed instructions for how the AI should generate the ${sectionName} section...`
            }
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
