
import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { Info, Clock, CheckCircle2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface NotesRetentionProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const retentionOptions = [
  {
    value: '30',
    label: '30 Days',
    description: 'Basic compliance period',
    recommended: false
  },
  {
    value: '90',
    label: '90 Days',
    description: 'Standard practice period',
    recommended: true
  },
  {
    value: '365',
    label: '1 Year',
    description: 'Extended retention for detailed analysis',
    recommended: false
  },
  {
    value: 'indefinite',
    label: 'Indefinite',
    description: 'Keep all notes permanently',
    recommended: false
  }
];

export const NotesRetention: React.FC<NotesRetentionProps> = ({ onNext, onBack, data }) => {
  const [selectedRetention, setSelectedRetention] = useState(data.retentionDuration || '90');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ retentionDuration: selectedRetention });
  };

  return (
    <Box sx={{ 
      height: '75vh',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ textAlign: 'center', mb: 2, flexShrink: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '1.8rem' }
          }}
        >
          Notes Retention Period
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            mb: 1
          }}
        >
          Choose how long to keep your session notes
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Alert
          severity="info"
          icon={<Info size={18} />}
          sx={{ 
            mb: 2, 
            borderRadius: 2,
            flexShrink: 0,
            '& .MuiAlert-message': {
              fontSize: '0.85rem'
            }
          }}
        >
          You can always adjust this setting later in your account preferences.
        </Alert>

        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <FormControl component="fieldset" fullWidth sx={{ flex: 1, overflow: 'hidden' }}>
            <RadioGroup
              value={selectedRetention}
              onChange={(e) => setSelectedRetention(e.target.value)}
              sx={{ flex: 1, overflow: 'hidden' }}
            >
              <List 
                sx={{ 
                  flex: 1,
                  overflow: 'auto',
                  py: 0,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#c1c1c1',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#a8a8a8',
                  },
                }}
              >
                {retentionOptions.map((option) => (
                  <ListItem key={option.value} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => setSelectedRetention(option.value)}
                      selected={selectedRetention === option.value}
                      sx={{
                        borderRadius: 2,
                        border: selectedRetention === option.value ? 2 : 1,
                        borderColor: selectedRetention === option.value ? 'primary.main' : '#E0E7FF',
                        background: selectedRetention === option.value 
                          ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)' 
                          : 'background.paper',
                        py: 1.5,
                        '&:hover': {
                          borderColor: 'primary.main',
                          background: selectedRetention === option.value 
                            ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)' 
                            : 'rgba(20, 49, 81, 0.04)',
                        },
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)',
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            background: selectedRetention === option.value 
                              ? 'linear-gradient(135deg, #143151, #387E89)'
                              : 'linear-gradient(135deg, #F5F7FA, #E8EAED)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: selectedRetention === option.value ? 'white' : '#666',
                          }}
                        >
                          <Clock size={16} />
                        </Box>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body1"
                              fontWeight={selectedRetention === option.value ? 700 : 600}
                              color={selectedRetention === option.value ? 'primary.main' : 'text.primary'}
                              sx={{ fontSize: '0.95rem' }}
                            >
                              {option.label}
                            </Typography>
                            {option.recommended && (
                              <Chip 
                                label="Recommended" 
                                size="small" 
                                color="primary"
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.7rem',
                                  fontWeight: 600
                                }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem', mt: 0.5 }}
                          >
                            {option.description}
                          </Typography>
                        }
                      />
                      
                      <FormControlLabel
                        value={option.value}
                        control={
                          <Radio 
                            checked={selectedRetention === option.value}
                            sx={{ 
                              color: selectedRetention === option.value ? 'primary.main' : 'action.active',
                              '&.Mui-checked': {
                                color: 'primary.main',
                              }
                            }} 
                          />
                        }
                        label=""
                        sx={{ m: 0, mr: 0 }}
                      />
                      
                      {selectedRetention === option.value && (
                        <CheckCircle2 
                          size={16} 
                          color="#2E7D32"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          flexShrink: 0,
          pt: 2
        }}>
          <SecondaryButton
            onClick={onBack}
            sx={{ 
              flex: 1,
              order: { xs: 2, sm: 1 },
              py: 1.5,
              borderRadius: 2
            }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            onClick={handleSubmit}
            sx={{ 
              flex: 2, 
              fontWeight: 700,
              order: { xs: 1, sm: 2 },
              py: 1.5,
              borderRadius: 2,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Continue to Payment →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
