
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
    icon: <Video size={18} />,
    title: 'Video Conference',
    description: 'HD video call'
  },
  {
    icon: <Users size={18} />,
    title: 'Expert Support',
    description: 'Integration specialists'
  },
  {
    icon: <CheckCircle2 size={18} />,
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
            fontSize: { xs: '1.4rem', sm: '1.8rem' }
          }}
        >
          Schedule Integration Call
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            mb: 1
          }}
        >
          Set up a session to integrate your EHR system
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
          <Clock size={14} color="#2E7D32" />
          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600, fontSize: '0.8rem' }}>
            30-45 minutes • Free consultation
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={1.5} sx={{ mb: 1.5, flexShrink: 0 }}>
          {meetingFeatures.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #F8FBFF 0%, #F0F8FF 100%)',
                  border: '1px solid #E8F4F8',
                  borderRadius: 2,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CardContent sx={{ 
                  p: 1.5, 
                  textAlign: 'center', 
                  width: '100%',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:last-child': { pb: 1.5 }
                }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #143151, #387E89)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 0.5,
                      color: 'white'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    mb: 0.25, 
                    fontSize: '0.8rem',
                    lineHeight: 1.2
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontSize: '0.7rem',
                    lineHeight: 1.2
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
            mb: 1.5, 
            borderRadius: 2,
            flexShrink: 0,
            '& .MuiAlert-message': {
              fontSize: '0.8rem'
            }
          }}
          icon={<Calendar size={18} />}
        >
          Our specialists will help connect your EHR system via secure video conference.
        </Alert>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1 }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
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
                  }}
                  inputProps={{
                    min: getMinDate(),
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
                >
                  {timeSlots.map((slot) => (
                    <MenuItem 
                      key={slot.value} 
                      value={slot.value}
                      disabled={!slot.available}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock size={14} color={slot.available ? '#387E89' : '#ccc'} />
                        {slot.label}
                      </Box>
                      {slot.available ? (
                        <Chip label="Available" size="small" sx={{ 
                          backgroundColor: '#E8F5E8', 
                          color: '#2E7D32',
                          fontSize: '0.6rem'
                        }} />
                      ) : (
                        <Chip label="Booked" size="small" sx={{ 
                          backgroundColor: '#FFEBEE', 
                          color: '#C62828',
                          fontSize: '0.6rem'
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
            disabled={!selectedDate || !selectedTime}
            sx={{ 
              flex: 2, 
              fontWeight: 700,
              order: { xs: 1, sm: 2 },
              py: 1.5,
              borderRadius: 2,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Schedule Meeting →
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
