
import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface EHRSelectionProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const ehrSystems = [
  'Practice Fusion',
  'Elation',
  'IntakeQ',
  'Z Health',
  'Tebra',
  'eCW',
  'Athenahealth',
  'Valant',
  'iCAN',
  'DrChrono',
  'Osmind',
  'Others',
];

export const EHRSelection: React.FC<EHRSelectionProps> = ({ onNext, onBack, data }) => {
  const [selectedEHR, setSelectedEHR] = useState(data.ehrSystem || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      ehrSystem: selectedEHR,
      needsMeeting: selectedEHR === 'Others',
    });
  };

  // Skip this step if no EHR mode
  if (!data.ehrMode) {
    React.useEffect(() => {
      onNext({ ehrSystem: '', needsMeeting: false });
    }, []);
    return null;
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(90deg, #143151, #387E89)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          textAlign: 'center',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}
      >
        Select Your EHR System
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ 
          textAlign: 'center', 
          mb: 3,
          fontSize: { xs: '0.875rem', sm: '1rem' },
          px: { xs: 1, sm: 0 }
        }}
      >
        Choose your Electronic Health Record system for integration
      </Typography>

      <Alert
        severity="info"
        icon={<Info />}
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          backgroundColor: 'info.light',
          '& .MuiAlert-message': {
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }
        }}
      >
        Don't see your EHR system? Select "Others" and we'll help you set up a custom integration.
      </Alert>

      <Box component="form" onSubmit={handleSubmit}>
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <RadioGroup
            value={selectedEHR}
            onChange={(e) => setSelectedEHR(e.target.value)}
          >
            <Grid container spacing={2}>
              {ehrSystems.map((ehr) => (
                <Grid key={ehr} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedEHR === ehr ? 2 : 1,
                      borderColor: selectedEHR === ehr ? 'primary.main' : 'divider',
                      backgroundColor: selectedEHR === ehr ? 'primary.light' : 'background.paper',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: selectedEHR === ehr ? 'primary.light' : 'background.light',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(20, 49, 81, 0.15)'
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onClick={() => setSelectedEHR(ehr)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                      <FormControlLabel
                        value={ehr}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Typography
                            variant="body1"
                            fontWeight={selectedEHR === ehr ? 600 : 400}
                            color={selectedEHR === ehr ? 'primary.main' : 'text.primary'}
                            sx={{
                              fontSize: { xs: '0.85rem', sm: '1rem' }
                            }}
                          >
                            {ehr}
                          </Typography>
                        }
                        sx={{ m: 0 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2 
        }}>
          <SecondaryButton
            onClick={onBack}
            sx={{ 
              flex: 1,
              order: { xs: 2, sm: 1 }
            }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={!selectedEHR}
            sx={{ 
              flex: 2, 
              fontWeight: 600,
              order: { xs: 1, sm: 2 }
            }}
          >
            Continue
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
