
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { CalendarToday, Schedule } from '@mui/icons-material';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { SignupData } from '../SignupFlow';

interface BookMeetingProps {
  onNext: (data: Partial<SignupData>) => void;
  onBack: () => void;
  data: Partial<SignupData>;
}

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

export const BookMeeting: React.FC<BookMeetingProps> = ({ onNext, onBack, data }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate booking confirmation
    onNext({
      meetingScheduled: true,
      meetingDate: selectedDate,
      meetingTime: selectedTime,
      meetingNotes: notes,
    });
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Schedule EHR Integration Meeting
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Let's schedule a meeting to discuss your custom EHR integration
      </Typography>

      <Alert
        severity="info"
        sx={{ mb: 4, borderRadius: 2 }}
        icon={<CalendarToday />}
      >
        Our integration specialists will help you connect your EHR system to S10.AI. 
        This typically takes 30-45 minutes.
      </Alert>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Preferred Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
          sx={{ mb: 3 }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: new Date().toISOString().split('T')[0],
          }}
        />

        <TextField
          fullWidth
          select
          label="Preferred Time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          required
          sx={{ mb: 3 }}
          SelectProps={{
            startAdornment: <Schedule sx={{ mr: 1, color: 'action.active' }} />,
          }}
        >
          {timeSlots.map((slot) => (
            <MenuItem key={slot} value={slot}>
              {slot}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Additional Notes (Optional)"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 4 }}
          placeholder="Any specific requirements or questions about your EHR integration..."
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <SecondaryButton
            onClick={onBack}
            sx={{ flex: 1 }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={!selectedDate || !selectedTime}
            sx={{ flex: 2, fontWeight: 600 }}
          >
            Schedule Meeting
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
