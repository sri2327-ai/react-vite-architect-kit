
import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { Shield, HardDrive } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface NotesRetentionProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const retentionOptions = [
  { value: '1year', label: '1 Year', description: 'Standard retention period' },
  { value: '3years', label: '3 Years', description: 'Extended retention' },
  { value: '5years', label: '5 Years', description: 'Long-term storage' },
  { value: '7years', label: '7 Years', description: 'Maximum compliance period' },
  { value: 'indefinite', label: 'Indefinite', description: 'No automatic deletion' },
];

export const NotesRetention: React.FC<NotesRetentionProps> = ({ onNext, onBack, data }) => {
  const [retentionDuration, setRetentionDuration] = useState(data.retentionDuration || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ retentionDuration });
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Notes Retention Policy
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Select how long you want to retain clinical notes in our system
      </Typography>

      <Alert
        severity="info"
        sx={{ mb: 4, borderRadius: 2 }}
        icon={<Shield size={20} />}
      >
        All notes are encrypted and stored securely. You can change this setting anytime in your account preferences.
      </Alert>

      <Box component="form" onSubmit={handleSubmit}>
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <RadioGroup
            value={retentionDuration}
            onChange={(e) => setRetentionDuration(e.target.value)}
          >
            {retentionOptions.map((option) => (
              <Card
                key={option.value}
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  border: retentionDuration === option.value ? 2 : 1,
                  borderColor: retentionDuration === option.value ? 'primary.main' : 'divider',
                  backgroundColor: retentionDuration === option.value ? '#F0F8FF' : 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: '#F8FBFF',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={() => setRetentionDuration(option.value)}
              >
                <CardContent sx={{ py: 2 }}>
                  <FormControlLabel
                    value={option.value}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <HardDrive 
                          size={20}
                          color={retentionDuration === option.value ? '#143151' : '#888888'}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight={retentionDuration === option.value ? 600 : 400}
                            color={retentionDuration === option.value ? 'primary.main' : 'text.primary'}
                          >
                            {option.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <SecondaryButton
            onClick={onBack}
            sx={{ flex: 1 }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={!retentionDuration}
            sx={{ flex: 2, fontWeight: 600 }}
          >
            Continue to Payment
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
