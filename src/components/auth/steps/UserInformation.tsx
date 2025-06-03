
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Card,
  CardContent,
  Chip,
  InputAdornment,
} from '@mui/material';
import { Phone, Stethoscope, Database, X } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface UserInformationProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const specialties = [
  'Cardiology', 'Dermatology', 'Emergency Medicine', 'Family Medicine',
  'Internal Medicine', 'Neurology', 'Oncology', 'Orthopedics',
  'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery', 'Other',
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
    <Box sx={{ 
      minHeight: '60vh',
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Professional Information
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          Customize S10.AI for your medical practice
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Card
          sx={{
            flex: 1,
            borderRadius: 2,
            border: '1px solid #F0F8FF',
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                required
                sx={{ mb: 1.5 }}
                size="small"
                placeholder="+1 (555) 123-4567"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone size={16} color="#888888" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                select
                label="Medical Specialty"
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                required
                sx={{ mb: 2 }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Stethoscope size={16} color="#888888" />
                    </InputAdornment>
                  ),
                }}
              >
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </TextField>

              <FormControl component="fieldset" sx={{ flex: 1 }}>
                <FormLabel
                  component="legend"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                    mb: 1.5,
                    fontSize: '1rem'
                  }}
                >
                  Documentation Mode
                </FormLabel>
                <RadioGroup
                  value={formData.ehrMode}
                  onChange={(e) => setFormData(prev => ({ ...prev, ehrMode: e.target.value === 'true' }))}
                  sx={{ flex: 1 }}
                >
                  <Card
                    sx={{
                      mb: 1.5,
                      cursor: 'pointer',
                      border: formData.ehrMode ? '2px solid #387E89' : '1px solid #E0E7FF',
                      borderRadius: 2,
                      backgroundColor: formData.ehrMode ? '#F0F8FF' : 'background.paper',
                      '&:hover': {
                        borderColor: '#387E89'
                      }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, ehrMode: true }))}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      <FormControlLabel
                        value={true}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Database size={20} color={formData.ehrMode ? '#387E89' : '#888888'} />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ fontSize: '0.95rem' }}>
                                  EHR Integration Mode
                                </Typography>
                                <Chip 
                                  label="Recommended"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#E8F5E8',
                                    color: '#2E7D32',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Connect with your EHR system for seamless workflow
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </CardContent>
                  </Card>

                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: !formData.ehrMode ? '2px solid #387E89' : '1px solid #E0E7FF',
                      borderRadius: 2,
                      backgroundColor: !formData.ehrMode ? '#F0F8FF' : 'background.paper',
                      '&:hover': {
                        borderColor: '#387E89'
                      }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, ehrMode: false }))}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      <FormControlLabel
                        value={false}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <X size={20} color={!formData.ehrMode ? '#387E89' : '#888888'} />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ fontSize: '0.95rem' }}>
                                  No EHR Mode
                                </Typography>
                                <Chip 
                                  label="Quick Start"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#FFF8E8',
                                    color: '#F57C00',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Start documenting immediately without EHR integration
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </CardContent>
                  </Card>
                </RadioGroup>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

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
            ← Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            onClick={handleSubmit}
            sx={{ 
              flex: 2, 
              order: { xs: 1, sm: 2 },
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Continue to {formData.ehrMode ? 'EHR Setup' : 'Configuration'} →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
