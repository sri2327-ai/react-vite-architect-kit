
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
  Chip,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Info, Search, Zap, CheckCircle2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface EHRSelectionProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const ehrSystems = [
  { name: 'Practice Fusion', popular: true, integration: 'Direct' },
  { name: 'Elation', popular: true, integration: 'Direct' },
  { name: 'IntakeQ', popular: false, integration: 'API' },
  { name: 'Z Health', popular: false, integration: 'API' },
  { name: 'Tebra', popular: true, integration: 'Direct' },
  { name: 'eCW', popular: false, integration: 'Custom' },
  { name: 'Athenahealth', popular: true, integration: 'Direct' },
  { name: 'Valant', popular: false, integration: 'API' },
  { name: 'iCAN', popular: false, integration: 'Custom' },
  { name: 'DrChrono', popular: true, integration: 'Direct' },
  { name: 'Osmind', popular: false, integration: 'API' },
  { name: 'Others', popular: false, integration: 'Custom' },
];

export const EHRSelection: React.FC<EHRSelectionProps> = ({ onNext, onBack, data }) => {
  const [selectedEHR, setSelectedEHR] = useState(data.ehrSystem || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEHRs = ehrSystems.filter(ehr =>
    ehr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getIntegrationColor = (integration: string) => {
    switch (integration) {
      case 'Direct': return '#2E7D32';
      case 'API': return '#1976D2';
      case 'Custom': return '#F57C00';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Choose Your EHR System
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            px: { xs: 1, sm: 0 },
            mb: 2
          }}
        >
          Select your Electronic Health Record system for seamless integration
        </Typography>
        
        <Box sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 1,
          backgroundColor: '#E8F5E8',
          px: 2,
          py: 1,
          borderRadius: 2,
          border: '1px solid #C8E6C9'
        }}>
          <Zap size={16} color="#2E7D32" />
          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600 }}>
            Instant setup for popular EHRs
          </Typography>
        </Box>
      </Box>

      <Alert
        severity="info"
        icon={<Info size={20} />}
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          backgroundColor: '#F0F8FF',
          borderColor: '#D6E8F5',
          '& .MuiAlert-message': {
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }
        }}
      >
        Don't see your EHR system? Select "Others" and we'll create a custom integration for you.
      </Alert>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Search Box */}
        <TextField
          fullWidth
          placeholder="Search for your EHR system..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: '#FAFBFC',
              '&:hover': {
                backgroundColor: '#F5F7FA'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#888888" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <RadioGroup
            value={selectedEHR}
            onChange={(e) => setSelectedEHR(e.target.value)}
          >
            <Grid container spacing={2}>
              {filteredEHRs.map((ehr) => (
                <Grid key={ehr.name} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedEHR === ehr.name ? 3 : 2,
                      borderColor: selectedEHR === ehr.name ? 'primary.main' : 'transparent',
                      background: selectedEHR === ehr.name 
                        ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)' 
                        : 'linear-gradient(135deg, #FFFFFF 0%, #FAFBFC 100%)',
                      boxShadow: selectedEHR === ehr.name 
                        ? '0 8px 32px rgba(20, 49, 81, 0.15)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(20, 49, 81, 0.2)',
                        '& .ehr-icon': {
                          transform: 'scale(1.1) rotate(5deg)'
                        }
                      },
                      '&::before': selectedEHR === ehr.name ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderLeft: '20px solid transparent',
                        borderTop: '20px solid #2E7D32',
                        zIndex: 1
                      } : {},
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onClick={() => setSelectedEHR(ehr.name)}
                  >
                    {selectedEHR === ehr.name && (
                      <CheckCircle2 
                        size={12} 
                        color="white" 
                        style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          zIndex: 2
                        }}
                      />
                    )}
                    
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      py: { xs: 2, sm: 3 },
                      px: { xs: 1.5, sm: 2 },
                      position: 'relative'
                    }}>
                      {ehr.popular && (
                        <Chip
                          label="Popular"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: '#E8F5E8',
                            color: '#2E7D32',
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}
                        />
                      )}
                      
                      <Box
                        className="ehr-icon"
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: selectedEHR === ehr.name 
                            ? 'linear-gradient(135deg, #143151, #387E89)'
                            : 'linear-gradient(135deg, #F5F7FA, #E8EAED)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 12px auto',
                          color: selectedEHR === ehr.name ? 'white' : '#666',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          transition: 'all 0.3s ease',
                          boxShadow: selectedEHR === ehr.name 
                            ? '0 4px 16px rgba(20, 49, 81, 0.3)'
                            : '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {ehr.name.charAt(0)}
                      </Box>
                      
                      <FormControlLabel
                        value={ehr.name}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight={selectedEHR === ehr.name ? 700 : 600}
                              color={selectedEHR === ehr.name ? 'primary.main' : 'text.primary'}
                              sx={{
                                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                mb: 1
                              }}
                            >
                              {ehr.name}
                            </Typography>
                            <Chip
                              label={ehr.integration}
                              size="small"
                              sx={{
                                backgroundColor: selectedEHR === ehr.name 
                                  ? 'rgba(255, 255, 255, 0.9)'
                                  : 'rgba(0, 0, 0, 0.05)',
                                color: getIntegrationColor(ehr.integration),
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          </Box>
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
              order: { xs: 2, sm: 1 },
              py: 1.5,
              borderRadius: 3
            }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={!selectedEHR}
            sx={{ 
              flex: 2, 
              fontWeight: 700,
              order: { xs: 1, sm: 2 },
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem'
            }}
          >
            Continue to {selectedEHR === 'Others' ? 'Meeting Setup' : 'Notes Settings'} →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
