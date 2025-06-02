
import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { Shield, HardDrive, Clock, Infinity, CheckCircle2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface NotesRetentionProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const retentionOptions = [
  { 
    value: '1year', 
    label: '1 Year', 
    description: 'Standard retention',
    icon: <Clock size={20} />,
    recommended: false
  },
  { 
    value: '3years', 
    label: '3 Years', 
    description: 'Extended retention',
    icon: <HardDrive size={20} />,
    recommended: true
  },
  { 
    value: '5years', 
    label: '5 Years', 
    description: 'Long-term storage',
    icon: <Shield size={20} />,
    recommended: false
  },
  { 
    value: '7years', 
    label: '7 Years', 
    description: 'Maximum compliance',
    icon: <Shield size={20} />,
    recommended: false
  },
  { 
    value: 'indefinite', 
    label: 'Indefinite', 
    description: 'No automatic deletion',
    icon: <Infinity size={20} />,
    recommended: false
  },
];

const securityFeatures = [
  'End-to-end encryption',
  'HIPAA compliant storage',
  'Regular security audits',
  'Backup & disaster recovery'
];

export const NotesRetention: React.FC<NotesRetentionProps> = ({ onNext, onBack, data }) => {
  const [retentionDuration, setRetentionDuration] = useState(data.retentionDuration || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ retentionDuration });
  };

  return (
    <Box sx={{ 
      height: { xs: 'calc(100vh - 250px)', sm: 'calc(100vh - 300px)' },
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Box sx={{ textAlign: 'center', mb: 2, flexShrink: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #143151, #387E89)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.4rem', sm: '1.8rem' }
          }}
        >
          Data Retention Policy
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            mb: 1
          }}
        >
          Choose how long to securely store your clinical notes
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
          <Shield size={14} color="#2E7D32" />
          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600, fontSize: '0.8rem' }}>
            HIPAA compliant • Bank-level security
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #F8FBFF 0%, #F0F8FF 100%)',
            border: '1px solid #E8F4F8',
            borderRadius: 2,
            mb: 2,
            flexShrink: 0
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #143151, #387E89)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <Shield size={16} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1rem' }}>
                Your Data is Protected
              </Typography>
            </Box>
            <Grid container spacing={1}>
              {securityFeatures.map((feature, index) => (
                <Grid key={index} size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle2 size={12} color="#2E7D32" />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                      {feature}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Alert
          severity="info"
          sx={{ 
            mb: 2, 
            borderRadius: 2,
            flexShrink: 0,
            '& .MuiAlert-message': {
              fontSize: '0.8rem'
            }
          }}
          icon={<Shield size={18} />}
        >
          All notes are encrypted and stored securely. Change this setting anytime.
        </Alert>

        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, minHeight: 0 }}>
          <FormControl component="fieldset" fullWidth sx={{ height: '100%' }}>
            <RadioGroup
              value={retentionDuration}
              onChange={(e) => setRetentionDuration(e.target.value)}
              sx={{ height: '100%' }}
            >
              <Grid container spacing={1.5} sx={{ height: '100%', overflow: 'auto' }}>
                {retentionOptions.map((option) => (
                  <Grid key={option.value} size={{ xs: 6, sm: 4, lg: 2.4 }}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: retentionDuration === option.value ? 2 : 1,
                        borderColor: retentionDuration === option.value ? 'primary.main' : '#E0E7FF',
                        background: retentionDuration === option.value 
                          ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)' 
                          : 'background.paper',
                        borderRadius: 2,
                        position: 'relative',
                        height: { xs: 120, sm: 140 },
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(20, 49, 81, 0.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => setRetentionDuration(option.value)}
                    >
                      {option.recommended && (
                        <Chip
                          label="Recommended"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: '#E8F5E8',
                            color: '#2E7D32',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            zIndex: 2
                          }}
                        />
                      )}

                      {retentionDuration === option.value && (
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
                        p: 1.5,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <FormControlLabel
                          value={option.value}
                          control={<Radio sx={{ display: 'none' }} />}
                          label={
                            <Box>
                              <Box
                                sx={{
                                  width: { xs: 36, sm: 44 },
                                  height: { xs: 36, sm: 44 },
                                  borderRadius: '10px',
                                  background: retentionDuration === option.value 
                                    ? 'linear-gradient(135deg, #143151, #387E89)'
                                    : 'linear-gradient(135deg, #F5F7FA, #E8EAED)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  margin: '0 auto 8px auto',
                                  color: retentionDuration === option.value ? 'white' : '#666',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                {option.icon}
                              </Box>
                              <Typography
                                variant="h6"
                                fontWeight={retentionDuration === option.value ? 700 : 600}
                                color={retentionDuration === option.value ? 'primary.main' : 'text.primary'}
                                sx={{ mb: 0.5, fontSize: { xs: '0.9rem', sm: '1rem' } }}
                              >
                                {option.label}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' }, lineHeight: 1.2 }}
                              >
                                {option.description}
                              </Typography>
                            </Box>
                          }
                          sx={{ m: 0, width: '100%' }}
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
            disabled={!retentionDuration}
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
            Continue to Payment →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
