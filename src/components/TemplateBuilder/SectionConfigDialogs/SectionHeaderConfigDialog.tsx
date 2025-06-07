
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
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon, Title as TitleIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useResponsive } from '../../../hooks/useResponsive';

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
  const { isMobile } = useResponsive();
  const [title, setTitle] = useState('');

  const handleContinue = () => {
    onContinue({ title });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          m: { xs: 0.5, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ pb: { xs: 1, sm: 2 }, px: { xs: 1.5, sm: 3 }, pt: { xs: 1.5, sm: 3 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 2 }}>
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
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 0.5,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Configure Section Header
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Add a header to organize your template sections
              </Typography>
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

      <DialogContent sx={{ p: { xs: 1.5, sm: 3 } }}>
        <Alert 
          severity="info" 
          icon={<TitleIcon />}
          sx={{ 
            mb: { xs: 2, sm: 3 },
            borderRadius: 2,
            '& .MuiAlert-message': { fontSize: { xs: '0.75rem', sm: '0.875rem' } }
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1, 
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }}
          >
            How Section Headers Work
          </Typography>
          <Typography 
            variant="body2"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
          >
            Section headers help organize your note into clear, distinct sections. Use them to create a logical structure in your notes. This will not impact the A.I. generation.
          </Typography>
        </Alert>

        <Paper 
          sx={{ 
            p: { xs: 1.5, sm: 3 }, 
            mb: { xs: 2, sm: 3 }, 
            bgcolor: alpha('#e3f2fd', 0.3), 
            borderRadius: 2, 
            border: `1px solid ${alpha('#2196f3', 0.2)}` 
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: { xs: 1.5, sm: 2 }, 
              fontWeight: 600, 
              color: '#1976d2',
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }}
          >
            💡 Common Section Headers
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
            {['Chief Complaint', 'History of Present Illness', 'Physical Examination', 'Assessment', 'Plan', 'Review of Systems'].map((example) => (
              <Button
                key={example}
                variant="outlined"
                size="small"
                onClick={() => setTitle(example)}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  borderColor: alpha('#2196f3', 0.3),
                  color: '#1976d2',
                  '&:hover': {
                    borderColor: '#2196f3',
                    backgroundColor: alpha('#2196f3', 0.05)
                  },
                  px: { xs: 0.75, sm: 1.5 },
                  py: { xs: 0.25, sm: 0.75 },
                  minHeight: { xs: 28, sm: 32 }
                }}
              >
                {example}
              </Button>
            ))}
          </Box>
        </Paper>

        <TextField
          fullWidth
          label="Header Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the section header name"
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: { xs: 1.5, sm: 3 }, gap: { xs: 1, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button 
          onClick={onBack}
          variant="outlined"
          size="medium"
          fullWidth={isMobile}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="medium"
          onClick={handleContinue}
          disabled={!title}
          fullWidth={isMobile}
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
            transition: 'all 0.3s ease',
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionHeaderConfigDialog;
