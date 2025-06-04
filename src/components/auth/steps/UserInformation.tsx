
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

              {/* EHR Integration Options */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Computer sx={{ color: '#4caf50', mr: 1, fontSize: 24 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#2e7d32' }}>
                    Choose Your Integration
                  </Typography>
                  <Chip 
                    label="Required" 
                    size="small" 
                    sx={{ 
                      ml: 2,
                      backgroundColor: '#e8f5e8',
                      color: '#2e7d32',
                      fontWeight: 600
                    }} 
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Select how you'd like to use S10.AI in your practice workflow
                </Typography>

                {/* EHR Integration Options */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  {/* With EHR Integration */}
                  <Card 
                    onClick={() => handleEhrModeSelect(true)}
                    sx={{ 
                      flex: 1,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: formData.ehrMode ? '#4caf50' : '#e1e5e9',
                      backgroundColor: formData.ehrMode ? '#f1f8e9' : '#fafafa',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        borderColor: formData.ehrMode ? '#4caf50' : '#81c784',
                        backgroundColor: formData.ehrMode ? '#f1f8e9' : '#f8f9fa',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Computer sx={{ color: '#4caf50', mr: 2, fontSize: 28 }} />
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#2e7d32' }}>
                          With EHR Integration
                        </Typography>
                        {formData.ehrMode && (
                          <CheckCircle sx={{ 
                            color: '#4caf50', 
                            ml: 'auto', 
                            fontSize: 24,
                            position: 'absolute',
                            top: 16,
                            right: 16
                          }} />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        Full integration with your Electronic Health Record system
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 500 }}>
                          ✓ Direct note insertion into your EHR
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 500 }}>
                          ✓ Patient data synchronization
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 500 }}>
                          ✓ Automated billing code suggestions
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 500 }}>
                          ✓ Workflow optimization
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Without EHR Integration */}
                  <Card 
                    onClick={() => handleEhrModeSelect(false)}
                    sx={{ 
                      flex: 1,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: !formData.ehrMode ? '#2196f3' : '#e1e5e9',
                      backgroundColor: !formData.ehrMode ? '#e3f2fd' : '#fafafa',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        borderColor: !formData.ehrMode ? '#2196f3' : '#64b5f6',
                        backgroundColor: !formData.ehrMode ? '#e3f2fd' : '#f8f9fa',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Computer sx={{ color: '#2196f3', mr: 2, fontSize: 28 }} />
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#1565c0' }}>
                          Standalone Mode
                        </Typography>
                        {!formData.ehrMode && (
                          <CheckCircle sx={{ 
                            color: '#2196f3', 
                            ml: 'auto', 
                            fontSize: 24,
                            position: 'absolute',
                            top: 16,
                            right: 16
                          }} />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        Use S10.AI as a standalone documentation tool
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                          ✓ Quick setup and immediate use
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                          ✓ Flexible documentation workflow
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                          ✓ Export to any format
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                          ✓ No IT department coordination needed
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
