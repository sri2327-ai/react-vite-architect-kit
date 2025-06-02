
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
    icon: <Video size={20} />,
    title: 'Video Conference',
    description: 'HD video call via Google Meet or Zoom'
  },
  {
    icon: <Users size={20} />,
    title: 'Expert Support',
    description: 'Our integration specialists will guide you'
  },
  {
    icon: <CheckCircle2 size={20} />,
    title: 'Complete Setup',
    description: 'Full EHR integration in one session'
  }
];

export const BookMeeting: React.FC<BookMeetingProps> = ({ onNext, onBack, data }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      meetingScheduled: true,
      meetingDate: selectedDate,
      meetingTime: selectedTime,
      meetingNotes: notes,
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
      maxHeight: { xs: 'calc(100vh - 200px)', sm: 'calc(100vh - 250px)' }
    }}>
      <Box sx={{ textAlign: 'center', mb: 3, flexShrink: 0 }}>
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
          Schedule Your Integration Call
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
          Let's set up a personalized session to integrate your EHR system
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
          <Clock size={16} color="#2E7D32" />
          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600 }}>
            30-45 minutes • Free consultation
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {/* Meeting Features */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {meetingFeatures.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #F8FBFF 0%, #F0F8FF 100%)',
                  border: '2px solid #E8F4F8',
                  borderRadius: 3,
                  height: 120,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(20, 49, 81, 0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #143151, #387E89)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px auto',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(20, 49, 81, 0.3)'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.9rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
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
            mb: 3, 
            borderRadius: 3,
            backgroundColor: '#F0F8FF',
            borderColor: '#D6E8F5',
          }}
          icon={<Calendar size={20} />}
        >
          Our integration specialists will help you connect your EHR system to S10.AI seamlessly. 
          All meetings are conducted via secure video conference.
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Preferred Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: getMinDate(),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#FAFBFC',
                    '&:hover': {
                      backgroundColor: '#F5F7FA'
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#FAFBFC',
                    '&:hover': {
                      backgroundColor: '#F5F7FA'
                    }
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
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={16} color={slot.available ? '#387E89' : '#ccc'} />
                      {slot.label}
                    </Box>
                    {slot.available ? (
                      <Chip label="Available" size="small" sx={{ 
                        backgroundColor: '#E8F5E8', 
                        color: '#2E7D32',
                        fontSize: '0.7rem'
                      }} />
                    ) : (
                      <Chip label="Booked" size="small" sx={{ 
                        backgroundColor: '#FFEBEE', 
                        color: '#C62828',
                        fontSize: '0.7rem'
                      }} />
                    )}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Additional Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us about your current EHR setup, any specific integration requirements, or questions you'd like to discuss during the call..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#FAFBFC',
                    '&:hover': {
                      backgroundColor: '#F5F7FA'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        flexShrink: 0,
        pt: 2,
        borderTop: '1px solid #F0F8FF'
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
          disabled={!selectedDate || !selectedTime}
          sx={{ 
            flex: 2, 
            fontWeight: 700,
            order: { xs: 1, sm: 2 },
            py: 1.5,
            borderRadius: 3,
            fontSize: '1.1rem'
          }}
        >
          Schedule Meeting →
        </PrimaryButton>
      </Box>
    </Box>
  );
};
