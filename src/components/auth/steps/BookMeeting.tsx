
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { Calendar, Clock, Video, Users, CheckCircle2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface BookMeetingProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const timeSlots = [
  { value: '9:00 AM - 10:00 AM', label: '9:00 AM - 10:00 AM', available: true },
  { value: '10:00 AM - 11:00 AM', label: '10:00 AM - 11:00 AM', available: true },
  { value: '11:00 AM - 12:00 PM', label: '11:00 AM - 12:00 PM', available: false },
  { value: '2:00 PM - 3:00 PM', label: '2:00 PM - 3:00 PM', available: true },
  { value: '3:00 PM - 4:00 PM', label: '3:00 PM - 4:00 PM', available: true },
  { value: '4:00 PM - 5:00 PM', label: '4:00 PM - 5:00 PM', available: true },
];

const meetingFeatures = [
  {
    icon: <Video size={16} />,
    title: 'Video Conference',
    description: 'HD video call'
  },
  {
    icon: <Users size={16} />,
    title: 'Expert Support',
    description: 'Integration specialists'
  },
  {
    icon: <CheckCircle2 size={16} />,
    title: 'Complete Setup',
    description: 'Full EHR integration'
  }
];

export const BookMeeting: React.FC<BookMeetingProps> = ({ onNext, onBack, data }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      meetingScheduled: true,
      meetingDate: selectedDate,
      meetingTime: selectedTime,
    });
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ textAlign: 'center', mb: 4, flexShrink: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#000000',
            mb: 2,
            fontSize: { xs: '1.5rem', sm: '1.75rem' }
          }}
        >
          Schedule Integration Call
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mb: 3,
            lineHeight: 1.6,
            maxWidth: 500,
            mx: 'auto',
            color: '#000000'
          }}
        >
          Set up a session to integrate your EHR system with our specialists
        </Typography>
        
        <Box sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 1,
          backgroundColor: '#E8F5E8',
          px: 2.5,
          py: 1,
          borderRadius: 2,
          border: '1px solid #C8E6C9'
        }}>
          <Clock size={16} color="#2E7D32" />
          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600, fontSize: '0.85rem' }}>
            30-45 minutes • Free consultation
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Grid container spacing={3} sx={{ mb: 4, flexShrink: 0 }}>
          {meetingFeatures.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #F8FBFF 0%, #F0F8FF 100%)',
                  border: '1px solid #E8F4F8',
                  borderRadius: 2,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CardContent sx={{ 
                  p: 2.5, 
                  textAlign: 'center', 
                  width: '100%',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:last-child': { pb: 2.5 }
                }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #143151, #387E89)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      color: 'white'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    mb: 0.5, 
                    fontSize: '0.85rem',
                    lineHeight: 1.2,
                    color: '#000000'
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.75rem',
                    lineHeight: 1.2,
                    color: '#000000'
                  }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Alert
          severity="info"
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            flexShrink: 0,
            '& .MuiAlert-message': {
              fontSize: '0.85rem',
              color: '#000000'
            }
          }}
          icon={<Calendar size={18} />}
        >
          Our specialists will help connect your EHR system via secure video conference.
        </Alert>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Grid container spacing={4} sx={{ mb: 5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Preferred Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                    sx: { 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: '#000000'
                    }
                  }}
                  inputProps={{
                    min: getMinDate(),
                    sx: { 
                      fontSize: '0.95rem',
                      py: 1.5,
                      color: '#000000'
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.95rem',
                      '& fieldset': {
                        borderColor: '#E0E0E0'
                      },
                      '&:hover fieldset': {
                        borderColor: '#387E89'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#387E89'
                      }
                    }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Preferred Time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                  size="small"
                  InputLabelProps={{
                    sx: { 
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: '#000000'
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.95rem',
                      '& fieldset': {
                        borderColor: '#E0E0E0'
                      },
                      '&:hover fieldset': {
                        borderColor: '#387E89'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#387E89'
                      }
                    },
                    '& .MuiSelect-select': {
                      py: 1.5,
                      color: '#000000'
                    }
                  }}
                >
                  {timeSlots.map((slot) => (
                    <MenuItem 
                      key={slot.value} 
                      value={slot.value}
                      disabled={!slot.available}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        py: 2,
                        px: 2.5,
                        color: '#000000'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Clock size={14} color={slot.available ? '#387E89' : '#ccc'} />
                        {slot.label}
                      </Box>
                      {slot.available ? (
                        <Chip label="Available" size="small" sx={{ 
                          backgroundColor: '#E8F5E8', 
                          color: '#2E7D32',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }} />
                      ) : (
                        <Chip label="Booked" size="small" sx={{ 
                          backgroundColor: '#FFEBEE', 
                          color: '#C62828',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }} />
                      )}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          flexShrink: 0,
          pt: 3,
          mt: 'auto'
        }}>
          <SecondaryButton
            onClick={onBack}
            sx={{ 
              flex: 1,
              order: { xs: 2, sm: 1 },
              py: 1.75,
              borderRadius: 2,
              fontSize: '0.9rem'
            }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={!selectedDate || !selectedTime}
            sx={{ 
              flex: 2, 
              fontWeight: 700,
              order: { xs: 1, sm: 2 },
              py: 1.75,
              borderRadius: 2,
              fontSize: '0.9rem'
            }}
          >
            Schedule Meeting →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
