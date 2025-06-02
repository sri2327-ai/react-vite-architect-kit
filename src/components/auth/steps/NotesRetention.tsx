
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
    description: 'Standard retention period',
    icon: <Clock size={24} />,
    recommended: false,
    color: '#E3F2FD'
  },
  { 
    value: '3years', 
    label: '3 Years', 
    description: 'Extended retention for most practices',
    icon: <HardDrive size={24} />,
    recommended: true,
    color: '#E8F5E8'
  },
  { 
    value: '5years', 
    label: '5 Years', 
    description: 'Long-term storage for compliance',
    icon: <Shield size={24} />,
    recommended: false,
    color: '#FFF3E0'
  },
  { 
    value: '7years', 
    label: '7 Years', 
    description: 'Maximum compliance period',
    icon: <Shield size={24} />,
    recommended: false,
    color: '#F3E5F5'
  },
  { 
    value: 'indefinite', 
    label: 'Indefinite', 
    description: 'No automatic deletion',
    icon: <Infinity size={24} />,
    recommended: false,
    color: '#FAFAFA'
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
          Data Retention Policy
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
          Choose how long you want to securely store your clinical notes
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
          <Shield size={16} color="#2E7D32" />
          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600 }}>
            HIPAA compliant • Bank-level security
          </Typography>
        </Box>
      </Box>

      {/* Security Features */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #F8FBFF 0%, #F0F8FF 100%)',
          border: '2px solid #E8F4F8',
          borderRadius: 3,
          mb: 4
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #143151, #387E89)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Shield size={20} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Your Data is Protected
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {securityFeatures.map((feature, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={16} color="#2E7D32" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
          mb: 4, 
          borderRadius: 3,
          backgroundColor: '#F0F8FF',
          borderColor: '#D6E8F5'
        }}
        icon={<Shield size={20} />}
      >
        All notes are encrypted and stored securely. You can change this setting anytime in your account preferences.
      </Alert>

      <Box component="form" onSubmit={handleSubmit}>
        <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
          <RadioGroup
            value={retentionDuration}
            onChange={(e) => setRetentionDuration(e.target.value)}
          >
            <Grid container spacing={2}>
              {retentionOptions.map((option) => (
                <Grid key={option.value} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: retentionDuration === option.value ? 3 : 2,
                      borderColor: retentionDuration === option.value ? 'primary.main' : 'transparent',
                      background: retentionDuration === option.value 
                        ? 'linear-gradient(135deg, #F0F8FF 0%, #E8F4F8 100%)' 
                        : `linear-gradient(135deg, ${option.color} 0%, #FFFFFF 100%)`,
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      height: '100%',
                      minHeight: 160,
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(20, 49, 81, 0.15)',
                        '& .retention-icon': {
                          transform: 'scale(1.1) rotate(5deg)'
                        }
                      },
                      '&::before': retentionDuration === option.value ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderLeft: '24px solid transparent',
                        borderTop: '24px solid #2E7D32',
                        zIndex: 1
                      } : {},
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onClick={() => setRetentionDuration(option.value)}
                  >
                    {option.recommended && (
                      <Chip
                        label="Recommended"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          backgroundColor: '#E8F5E8',
                          color: '#2E7D32',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          zIndex: 2
                        }}
                      />
                    )}

                    {retentionDuration === option.value && (
                      <CheckCircle2 
                        size={14} 
                        color="white" 
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          zIndex: 2
                        }}
                      />
                    )}
                    
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      p: 3,
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
                              className="retention-icon"
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '14px',
                                background: retentionDuration === option.value 
                                  ? 'linear-gradient(135deg, #143151, #387E89)'
                                  : 'linear-gradient(135deg, #F5F7FA, #E8EAED)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px auto',
                                color: retentionDuration === option.value ? 'white' : '#666',
                                transition: 'all 0.3s ease',
                                boxShadow: retentionDuration === option.value 
                                  ? '0 6px 20px rgba(20, 49, 81, 0.3)'
                                  : '0 2px 8px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              {option.icon}
                            </Box>
                            <Typography
                              variant="h6"
                              fontWeight={retentionDuration === option.value ? 700 : 600}
                              color={retentionDuration === option.value ? 'primary.main' : 'text.primary'}
                              sx={{ mb: 1, fontSize: '1.1rem' }}
                            >
                              {option.label}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}
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
            disabled={!retentionDuration}
            sx={{ 
              flex: 2, 
              fontWeight: 700,
              order: { xs: 1, sm: 2 },
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem'
            }}
          >
            Continue to Payment →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
