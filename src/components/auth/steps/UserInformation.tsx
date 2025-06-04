import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  Chip,
  InputAdornment
} from '@mui/material';
import { Phone, LocalHospital, Computer, ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
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
  const [ehrMode, setEhrMode] = useState(data.ehrMode ?? true);

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

  const handleEhrModeSelect = (mode: boolean) => {
    setFormData(prev => ({ ...prev, ehrMode: mode }));
  };

  return (
    <Box sx={{ 
      height: '75vh',
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
            color: '#2e7d32',
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
            borderColor: '#e0e7ff',
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
                      <Phone sx={{ color: '#4caf50', fontSize: 20 }} />
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
                      <LocalHospital sx={{ color: '#4caf50', fontSize: 20, ml: 1 }} />
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

              {/* EHR Mode Selection */}
              <Box sx={{ mb: 3, flexShrink: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 2,
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  Choose Your Setup Mode
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2 
                }}>
                  {/* With EHR Integration Card */}
                  <Card
                    onClick={() => setEhrMode(true)}
                    sx={{
                      flex: 1,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: ehrMode === true ? '#4caf50' : 'transparent',
                      backgroundColor: ehrMode === true ? 'rgba(76, 175, 80, 0.08)' : 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.04)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          <Integration sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                          With EHR Integration
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        Connect directly to your Electronic Health Record system
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                          ✓ Direct EHR connectivity
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                          ✓ Automated data sync
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                          ✓ Streamlined workflow
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                          ✓ Real-time updates
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Standalone Mode Card */}
                  <Card
                    onClick={() => setEhrMode(false)}
                    sx={{
                      flex: 1,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: ehrMode === false ? '#2196f3' : 'transparent',
                      backgroundColor: ehrMode === false ? 'rgba(33, 150, 243, 0.08)' : 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#2196f3',
                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(33, 150, 243, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #2196f3, #42a5f5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          <Assignment sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
                          Standalone Mode
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        Use S10.AI as a standalone documentation tool
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                          ✓ Quick setup and immediate use
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                          ✓ Flexible documentation workflow
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                          ✓ Export to any format
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                          ✓ Easily copy paste notes to your EHR
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
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
