
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
} from '@mui/material';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface UserInformationProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const specialties = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Family Medicine',
  'Internal Medicine',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Other',
];

export const UserInformation: React.FC<UserInformationProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    phoneNumber: data.phoneNumber || '',
    specialty: data.specialty || '',
    ehrMode: data.ehrMode !== undefined ? data.ehrMode : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
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
        Professional Information
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Help us customize your experience
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          required
          sx={{ mb: 3 }}
          placeholder="+1 (555) 123-4567"
        />

        <TextField
          fullWidth
          select
          label="Medical Specialty"
          value={formData.specialty}
          onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
          required
          sx={{ mb: 4 }}
        >
          {specialties.map((specialty) => (
            <MenuItem key={specialty} value={specialty}>
              {specialty}
            </MenuItem>
          ))}
        </TextField>

        <FormControl component="fieldset" sx={{ mb: 4 }}>
          <FormLabel
            component="legend"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 2,
            }}
          >
            EHR Integration Mode
          </FormLabel>
          <RadioGroup
            value={formData.ehrMode}
            onChange={(e) => setFormData(prev => ({ ...prev, ehrMode: e.target.value === 'true' }))}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    EHR Mode
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Integrate with your Electronic Health Record system
                  </Typography>
                </Box>
              }
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    No EHR Mode
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use S10.AI without EHR integration
                  </Typography>
                </Box>
              }
            />
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
            sx={{ flex: 2, fontWeight: 600 }}
          >
            Continue
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
