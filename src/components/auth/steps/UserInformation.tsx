
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { Phone, Stethoscope, Database, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
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
  'Radiology',
  'Surgery',
  'Other'
];

export const UserInformation: React.FC<UserInformationProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    phoneNumber: data.phoneNumber || '',
    specialty: data.specialty || '',
    ehrMode: data.ehrMode ?? true,
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
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 1.5, sm: 2 }, 
        flexShrink: 0 
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5,
            fontSize: { xs: '1.3rem', sm: '1.6rem' }
          }}
        >
          Professional Information
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.95rem' }
          }}
        >
          Help us customize your experience
        </Typography>
      </Box>

      {/* Content area with better spacing */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 0,
        gap: { xs: 1.5, sm: 2 }
      }}>
        <Card
          sx={{
            flex: 1,
            borderRadius: 2,
            border: '1px solid #E8F4F8',
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ 
            p: { xs: 2, sm: 3 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'auto'
          }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: { xs: 2, sm: 2.5 },
              height: '100%'
            }}>
              {/* Phone Number Field */}
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                required
                size="small"
                placeholder="+1 (555) 123-4567"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <Phone size={16} color="#387E89" />
                    </Box>
                  ),
                }}
              />

              {/* Medical Specialty Field */}
              <TextField
                fullWidth
                select
                label="Medical Specialty"
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <Stethoscope size={16} color="#387E89" />
                    </Box>
                  ),
                }}
              >
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </TextField>

              {/* Documentation Mode with better spacing */}
              <FormControl component="fieldset" sx={{ flex: 1, minHeight: 0 }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    mb: { xs: 1, sm: 1.5 }
                  }}
                >
                  How do you want to document your sessions?
                </FormLabel>

                <RadioGroup
                  value={formData.ehrMode}
                  onChange={(e) => setFormData(prev => ({ ...prev, ehrMode: e.target.value === 'true' }))}
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 1.5, sm: 2 }
                  }}
                >
                  {/* EHR Integration Mode */}
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: formData.ehrMode ? '2px solid #387E89' : '1px solid #E0E7FF',
                      borderRadius: 2,
                      background: formData.ehrMode 
                        ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)' 
                        : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#387E89',
                      }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, ehrMode: true }))}
                  >
                    <CardContent sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      '&:last-child': { pb: { xs: 1.5, sm: 2 } }
                    }}>
                      <Box
                        sx={{
                          width: { xs: 32, sm: 36 },
                          height: { xs: 32, sm: 36 },
                          borderRadius: '8px',
                          background: formData.ehrMode 
                            ? 'linear-gradient(135deg, #143151, #387E89)'
                            : 'linear-gradient(135deg, #F5F7FA, #E8EAED)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: formData.ehrMode ? 'white' : '#666',
                          flexShrink: 0
                        }}
                      >
                        <Database size={18} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="body1" 
                          fontWeight={700} 
                          color={formData.ehrMode ? 'primary.main' : 'text.primary'}
                          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 0.5 }}
                        >
                          EHR Integration
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}
                        >
                          Connect with your existing system
                        </Typography>
                      </Box>
                      {formData.ehrMode && <CheckCircle2 size={18} color="#2E7D32" />}
                    </CardContent>
                  </Card>

                  {/* No EHR Mode */}
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: !formData.ehrMode ? '2px solid #387E89' : '1px solid #E0E7FF',
                      borderRadius: 2,
                      background: !formData.ehrMode 
                        ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)' 
                        : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#387E89',
                      }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, ehrMode: false }))}
                  >
                    <CardContent sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      '&:last-child': { pb: { xs: 1.5, sm: 2 } }
                    }}>
                      <Box
                        sx={{
                          width: { xs: 32, sm: 36 },
                          height: { xs: 32, sm: 36 },
                          borderRadius: '8px',
                          background: !formData.ehrMode 
                            ? 'linear-gradient(135deg, #143151, #387E89)'
                            : 'linear-gradient(135deg, #F5F7FA, #E8EAED)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: !formData.ehrMode ? 'white' : '#666',
                          flexShrink: 0
                        }}
                      >
                        <FileText size={18} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="body1" 
                          fontWeight={700} 
                          color={!formData.ehrMode ? 'primary.main' : 'text.primary'}
                          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 0.5 }}
                        >
                          Standalone Notes
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}
                        >
                          Use S10.AI as your primary system
                        </Typography>
                      </Box>
                      {!formData.ehrMode && <CheckCircle2 size={18} color="#2E7D32" />}
                    </CardContent>
                  </Card>
                </RadioGroup>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Alert with better spacing */}
        <Alert
          severity="info"
          icon={<AlertCircle size={16} />}
          sx={{ 
            borderRadius: 2,
            flexShrink: 0,
            py: { xs: 1, sm: 1.2 },
            '& .MuiAlert-message': {
              fontSize: { xs: '0.8rem', sm: '0.85rem' }
            }
          }}
        >
          Your selection determines the next setup steps for optimal integration.
        </Alert>

        {/* Fixed buttons at bottom with better spacing */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2 },
          flexShrink: 0
        }}>
          <SecondaryButton
            onClick={onBack}
            sx={{ 
              flex: 1,
              order: { xs: 2, sm: 1 },
              py: { xs: 1.2, sm: 1.5 },
              borderRadius: 2,
              fontSize: { xs: '0.85rem', sm: '0.9rem' }
            }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            onClick={handleSubmit}
            disabled={!formData.phoneNumber || !formData.specialty}
            sx={{ 
              flex: 2, 
              fontWeight: 700,
              order: { xs: 1, sm: 2 },
              py: { xs: 1.2, sm: 1.5 },
              borderRadius: 2,
              fontSize: { xs: '0.85rem', sm: '0.9rem' }
            }}
          >
            Continue →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
