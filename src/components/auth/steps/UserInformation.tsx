
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  Alert,
  Grid,
  Radio,
  FormControlLabel,
  RadioGroup,
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
        mb: { xs: 2, sm: 3 }, 
        flexShrink: 0 
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Professional Information
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Help us customize your experience
        </Typography>
      </Box>

      {/* Content area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 0,
        overflow: 'auto'
      }}>
        <Card
          sx={{
            flex: 1,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'auto'
          }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 3,
              height: '100%'
            }}>
              {/* Phone Number Field */}
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                required
                placeholder="+1 (555) 123-4567"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <Phone size={20} color="#387E89" />
                    </Box>
                  ),
                }}
              />

              {/* Medical Specialty Field */}
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                select
                label="Medical Specialty"
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                required
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <Stethoscope size={20} color="#387E89" />
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

              {/* Documentation Mode */}
              <FormControl component="fieldset" sx={{ flex: 1, minHeight: 0 }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    mb: 2
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
                    gap: 2
                  }}
                >
                  {/* EHR Integration Mode */}
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: formData.ehrMode ? 'primary.main' : 'grey.300',
                      backgroundColor: formData.ehrMode ? 'primary.50' : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'primary.50'
                      }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, ehrMode: true }))}
                  >
                    <CardContent sx={{ 
                      p: { xs: 2, sm: 3 }, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      '&:last-child': { pb: { xs: 2, sm: 3 } }
                    }}>
                      <Box
                        sx={{
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                          borderRadius: 2,
                          backgroundColor: formData.ehrMode ? 'primary.main' : 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: formData.ehrMode ? 'white' : 'grey.600',
                          flexShrink: 0
                        }}
                      >
                        <Database size={24} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          color={formData.ehrMode ? 'primary.main' : 'text.primary'}
                          sx={{ 
                            fontSize: { xs: '1rem', sm: '1.125rem' }, 
                            mb: 0.5 
                          }}
                        >
                          EHR Integration
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                          Connect with your existing system
                        </Typography>
                      </Box>
                      <FormControlLabel
                        value="true"
                        control={<Radio checked={formData.ehrMode} />}
                        label=""
                        sx={{ m: 0 }}
                      />
                      {formData.ehrMode && <CheckCircle2 size={24} color="#2E7D32" />}
                    </CardContent>
                  </Card>

                  {/* No EHR Mode */}
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: !formData.ehrMode ? 'primary.main' : 'grey.300',
                      backgroundColor: !formData.ehrMode ? 'primary.50' : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'primary.50'
                      }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, ehrMode: false }))}
                  >
                    <CardContent sx={{ 
                      p: { xs: 2, sm: 3 }, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      '&:last-child': { pb: { xs: 2, sm: 3 } }
                    }}>
                      <Box
                        sx={{
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                          borderRadius: 2,
                          backgroundColor: !formData.ehrMode ? 'primary.main' : 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: !formData.ehrMode ? 'white' : 'grey.600',
                          flexShrink: 0
                        }}
                      >
                        <FileText size={24} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          color={!formData.ehrMode ? 'primary.main' : 'text.primary'}
                          sx={{ 
                            fontSize: { xs: '1rem', sm: '1.125rem' }, 
                            mb: 0.5 
                          }}
                        >
                          Standalone Notes
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                          Use S10.AI as your primary system
                        </Typography>
                      </Box>
                      <FormControlLabel
                        value="false"
                        control={<Radio checked={!formData.ehrMode} />}
                        label=""
                        sx={{ m: 0 }}
                      />
                      {!formData.ehrMode && <CheckCircle2 size={24} color="#2E7D32" />}
                    </CardContent>
                  </Card>
                </RadioGroup>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Alert */}
        <Alert
          severity="info"
          icon={<AlertCircle size={20} />}
          sx={{ 
            mt: 2,
            borderRadius: 2,
            flexShrink: 0,
            '& .MuiAlert-message': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        >
          Your selection determines the next setup steps for optimal integration.
        </Alert>

        {/* Fixed buttons at bottom */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          flexShrink: 0,
          pt: 2,
          mt: 2
        }}>
          <SecondaryButton
            onClick={onBack}
            sx={{ 
              flex: { xs: 1, sm: 1 },
              order: { xs: 2, sm: 1 },
              py: { xs: 1.5, sm: 1.25 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            onClick={handleSubmit}
            disabled={!formData.phoneNumber || !formData.specialty}
            sx={{ 
              flex: { xs: 1, sm: 2 }, 
              fontWeight: 700,
              order: { xs: 1, sm: 2 },
              py: { xs: 1.5, sm: 1.25 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Continue →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
