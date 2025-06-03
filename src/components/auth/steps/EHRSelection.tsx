
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
  { name: 'Practice Fusion' }, { name: 'Elation' }, { name: 'IntakeQ' },
  { name: 'Z Health' }, { name: 'Tebra' }, { name: 'eCW' },
  { name: 'Athenahealth' }, { name: 'Valant' }, { name: 'iCAN' },
  { name: 'DrChrono' }, { name: 'Osmind' }, { name: 'Others' }
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

  if (!data.ehrMode) {
    React.useEffect(() => {
      onNext({ ehrSystem: '', needsMeeting: false });
    }, []);
    return null;
  }

  return (
    <Box sx={{ 
      minHeight: '60vh',
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '1.8rem' }
          }}
        >
          Choose Your EHR System
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            mb: 1
          }}
        >
          Select your Electronic Health Record system
        </Typography>
        
        <Box sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 1,
          backgroundColor: '#E8F5E8',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          border: '1px solid #C8E6C9'
        }}>
          <Zap size={14} color="#2E7D32" />
          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600, fontSize: '0.8rem' }}>
            Instant setup for popular EHRs
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Alert
          severity="info"
          icon={<Info size={18} />}
          sx={{ 
            mb: 1.5, 
            borderRadius: 2,
            flexShrink: 0,
            '& .MuiAlert-message': {
              fontSize: '0.8rem'
            }
          }}
        >
          Don't see your EHR system? Select "Others" for custom integration.
        </Alert>

        <TextField
          fullWidth
          placeholder="Search for your EHR system..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            mb: 1.5,
            flexShrink: 0
          }}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#888888" />
              </InputAdornment>
            ),
          }}
        />

        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <FormControl component="fieldset" fullWidth sx={{ flex: 1 }}>
            <RadioGroup
              value={selectedEHR}
              onChange={(e) => setSelectedEHR(e.target.value)}
              sx={{ flex: 1 }}
            >
              <Grid container spacing={1.5} sx={{ maxHeight: '45vh', overflow: 'auto' }}>
                {filteredEHRs.map((ehr) => (
                  <Grid key={ehr.name} size={{ xs: 6, sm: 4, lg: 3 }}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: selectedEHR === ehr.name ? 2 : 1,
                        borderColor: selectedEHR === ehr.name ? 'primary.main' : '#E0E7FF',
                        background: selectedEHR === ehr.name 
                          ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)' 
                          : 'background.paper',
                        borderRadius: 2,
                        position: 'relative',
                        height: { xs: 80, sm: 90 },
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(20, 49, 81, 0.15)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => setSelectedEHR(ehr.name)}
                    >
                      {selectedEHR === ehr.name && (
                        <CheckCircle2 
                          size={12} 
                          color="white" 
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: '#2E7D32',
                            borderRadius: '50%',
                            zIndex: 2
                          }}
                        />
                      )}
                      
                      <CardContent sx={{ 
                        textAlign: 'center', 
                        p: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '8px',
                            background: selectedEHR === ehr.name 
                              ? 'linear-gradient(135deg, #143151, #387E89)'
                              : 'linear-gradient(135deg, #F5F7FA, #E8EAED)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 6px auto',
                            color: selectedEHR === ehr.name ? 'white' : '#666',
                            fontSize: '0.9rem',
                            fontWeight: 700
                          }}
                        >
                          {ehr.name.charAt(0)}
                        </Box>
                        
                        <FormControlLabel
                          value={ehr.name}
                          control={<Radio sx={{ display: 'none' }} />}
                          label={
                            <Typography
                              variant="body1"
                              fontWeight={selectedEHR === ehr.name ? 700 : 600}
                              color={selectedEHR === ehr.name ? 'primary.main' : 'text.primary'}
                              sx={{
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                lineHeight: 1.2
                              }}
                            >
                              {ehr.name}
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
        </Box>

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
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={!selectedEHR}
            onClick={handleSubmit}
            sx={{ 
              flex: 2, 
              fontWeight: 700,
              order: { xs: 1, sm: 2 },
              py: 1.5,
              borderRadius: 2,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Continue to {selectedEHR === 'Others' ? 'Meeting Setup' : 'Notes Settings'} →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
