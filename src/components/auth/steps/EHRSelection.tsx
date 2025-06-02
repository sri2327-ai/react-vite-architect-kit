
import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
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
          color: 'primary.main',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Select Your EHR System
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Choose your Electronic Health Record system for integration
      </Typography>

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
                        backgroundColor: 'background.light',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onClick={() => setSelectedEHR(ehr)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <FormControlLabel
                        value={ehr}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Typography
                            variant="body1"
                            fontWeight={selectedEHR === ehr ? 600 : 400}
                            color={selectedEHR === ehr ? 'primary.main' : 'text.primary'}
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

        <Box sx={{ display: 'flex', gap: 2 }}>
          <SecondaryButton
            onClick={onBack}
            sx={{ flex: 1 }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={!selectedEHR}
            sx={{ flex: 2, fontWeight: 600 }}
          >
            Continue
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
