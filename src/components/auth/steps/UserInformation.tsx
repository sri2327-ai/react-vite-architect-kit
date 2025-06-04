
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Alert,
  Chip,
  InputAdornment
} from '@mui/material';
import { Phone, LocalHospital, Computer, ArrowBack, ArrowForward } from '@mui/icons-material';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface UserInformationProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const specialties = [
  'Internal Medicine',
  'Family Medicine',
  'Pediatrics',
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Psychiatry',
  'Orthopedic Surgery',
  'Radiology',
  'Anesthesiology',
  'Pathology',
  'Neurology',
  'Oncology',
  'Obstetrics & Gynecology',
  'Ophthalmology',
  'Otolaryngology',
  'Urology',
  'Plastic Surgery',
  'General Surgery',
  'Other'
];

export const UserInformation: React.FC<UserInformationProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    phoneNumber: data.phoneNumber || '',
    specialty: data.specialty || '',
    ehrMode: data.ehrMode ?? true,
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.phoneNumber || !formData.specialty) {
      setError('Please fill in all required fields');
      return;
    }

    onNext(formData);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phoneNumber: formatted }));
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 3, sm: 4 }, 
        flexShrink: 0 
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 2,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Professional Information
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            maxWidth: 500,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Help us customize S10.AI for your practice
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              flexShrink: 0,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {error}
          </Alert>
        )}

        <Card
          sx={{
            flex: 1,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}
        >
          <CardContent sx={{ 
            p: { xs: 3, sm: 4, md: 5 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'auto'
          }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1 }}>
              {/* Phone Number */}
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                required
                placeholder="(555) 123-4567"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: 'action.active', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                helperText="We'll use this for account security and important updates"
              />

              {/* Medical Specialty */}
              <FormControl fullWidth required sx={{ mb: 4 }}>
                <InputLabel>Medical Specialty</InputLabel>
                <Select
                  value={formData.specialty}
                  label="Medical Specialty"
                  onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocalHospital sx={{ color: 'action.active', fontSize: 20, ml: 1 }} />
                    </InputAdornment>
                  }
                >
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* EHR Integration Section */}
              <Card 
                sx={{ 
                  mb: 4, 
                  border: '2px solid',
                  borderColor: formData.ehrMode ? 'primary.main' : 'divider',
                  backgroundColor: formData.ehrMode ? 'primary.50' : 'grey.50',
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Computer sx={{ color: 'primary.main', mr: 1, fontSize: 24 }} />
                    <Typography variant="h6" fontWeight={600}>
                      EHR Integration
                    </Typography>
                    <Chip 
                      label="Recommended" 
                      size="small" 
                      color="primary" 
                      sx={{ ml: 2 }} 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Connect S10.AI with your Electronic Health Record system for seamless documentation workflow
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.ehrMode}
                        onChange={(e) => setFormData(prev => ({ ...prev, ehrMode: e.target.checked }))}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {formData.ehrMode ? 'With EHR Integration' : 'Without EHR Integration'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formData.ehrMode 
                            ? 'Full integration with your EHR system' 
                            : 'Use S10.AI as a standalone documentation tool'}
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>

              {/* Benefits based on selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  {formData.ehrMode ? 'EHR Integration Benefits:' : 'Standalone Benefits:'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {formData.ehrMode ? (
                    <>
                      <Typography variant="body2" color="text.secondary">✓ Direct note insertion into your EHR</Typography>
                      <Typography variant="body2" color="text.secondary">✓ Patient data synchronization</Typography>
                      <Typography variant="body2" color="text.secondary">✓ Automated billing code suggestions</Typography>
                      <Typography variant="body2" color="text.secondary">✓ Workflow optimization</Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">✓ Quick setup and immediate use</Typography>
                      <Typography variant="body2" color="text.secondary">✓ Flexible documentation workflow</Typography>
                      <Typography variant="body2" color="text.secondary">✓ Export to any format</Typography>
                      <Typography variant="body2" color="text.secondary">✓ No IT department coordination needed</Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Box sx={{ 
          flexShrink: 0,
          pt: 3,
          display: 'flex',
          gap: 2,
          mt: 'auto'
        }}>
          <SecondaryButton
            onClick={onBack}
            startIcon={<ArrowBack />}
            sx={{
              py: { xs: 1.5, sm: 1.25 },
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minWidth: 120
            }}
          >
            Back
          </SecondaryButton>
          
          <PrimaryButton
            fullWidth
            type="submit"
            onClick={handleSubmit}
            endIcon={<ArrowForward />}
            sx={{
              py: { xs: 1.5, sm: 1.25 },
              fontWeight: 700,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Continue Setup
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
