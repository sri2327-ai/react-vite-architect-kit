
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
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      maxHeight: { xs: 'calc(100vh - 200px)', sm: 'calc(100vh - 250px)' }
    }}>
      <Box sx={{ textAlign: 'center', mb: 3, flexShrink: 0 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: '1.75rem', sm: '2.25rem' }
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
            mx: 'auto'
          }}
        >
          Help us customize S10.AI to match your medical practice and workflow
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            border: '2px solid #F0F8FF',
            backgroundColor: 'background.paper',
            boxShadow: '0 8px 32px rgba(20, 49, 81, 0.08)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                required
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                size="medium"
                placeholder="+1 (555) 123-4567"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone size={18} color="#888888" />
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
                sx={{ 
                  mb: 5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Stethoscope size={18} color="#888888" />
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

              <FormControl component="fieldset" sx={{ mb: 5, width: '100%' }}>
                <FormLabel
                  component="legend"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                    mb: 3,
                    fontSize: '1.1rem'
                  }}
                >
                  Choose Your Documentation Mode
                </FormLabel>
                <RadioGroup
                  value={formData.ehrMode}
                  onChange={(e) => setFormData(prev => ({ ...prev, ehrMode: e.target.value === 'true' }))}
                >
                  <Card
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      border: formData.ehrMode ? '2px solid #387E89' : '2px solid #E0E7FF',
                      borderRadius: 3,
                      backgroundColor: formData.ehrMode ? '#F0F8FF' : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#387E89',
                        backgroundColor: '#F8FAFF'
                      }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, ehrMode: true }))}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <FormControlLabel
                        value={true}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Database size={24} color={formData.ehrMode ? '#387E89' : '#888888'} />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h6" fontWeight={700} color={formData.ehrMode ? 'primary.main' : 'text.primary'}>
                                  EHR Integration Mode
                                </Typography>
                                <Chip 
                                  label="Recommended"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#E8F5E8',
                                    color: '#2E7D32',
                                    fontWeight: 600
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Connect with your Electronic Health Record system for seamless workflow
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                • Direct integration with your EHR • Automated note uploads • Streamlined workflow
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
                      border: !formData.ehrMode ? '2px solid #387E89' : '2px solid #E0E7FF',
                      borderRadius: 3,
                      backgroundColor: !formData.ehrMode ? '#F0F8FF' : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#387E89',
                        backgroundColor: '#F8FAFF'
                      }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, ehrMode: false }))}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <FormControlLabel
                        value={false}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <X size={24} color={!formData.ehrMode ? '#387E89' : '#888888'} />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h6" fontWeight={700} color={!formData.ehrMode ? 'primary.main' : 'text.primary'}>
                                  No EHR Mode
                                </Typography>
                                <Chip 
                                  label="Quick Start"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#FFF8E8',
                                    color: '#F57C00',
                                    fontWeight: 600
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Start documenting immediately without EHR integration
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                • Get started instantly • Export notes manually • Add EHR later
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
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        flexShrink: 0,
        pt: 2,
        borderTop: '1px solid #F0F8FF'
      }}>
        <SecondaryButton
          onClick={onBack}
          sx={{ 
            flex: 1,
            order: { xs: 2, sm: 1 },
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600
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
            borderRadius: 3,
            textTransform: 'none'
          }}
        >
          Continue to {formData.ehrMode ? 'EHR Setup' : 'Configuration'} →
        </PrimaryButton>
      </Box>
    </Box>
  );
};
