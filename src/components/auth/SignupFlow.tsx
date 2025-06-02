
import React, { useState } from 'react';
import { Box, Container, Stepper, Step, StepLabel, Paper } from '@mui/material';
import { AccountCreation } from './steps/AccountCreation';
import { UserInformation } from './steps/UserInformation';
import { EHRSelection } from './steps/EHRSelection';
import { BookMeeting } from './steps/BookMeeting';
import { NotesRetention } from './steps/NotesRetention';
import { Payment } from './steps/Payment';

export interface SignupData {
  // Account Creation
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isGoogleSignup: boolean;
  agreedToBAA: boolean;
  agreedToTerms: boolean;
  
  // User Information
  phoneNumber: string;
  specialty: string;
  ehrMode: boolean;
  
  // EHR Selection
  ehrSystem: string;
  needsMeeting: boolean;
  
  // Meeting booking
  meetingScheduled: boolean;
  meetingDate: string;
  meetingTime: string;
  meetingNotes: string;
  
  // Notes Retention
  retentionDuration: string;
  
  // Payment
  paymentCompleted: boolean;
}

const steps = [
  'Account Creation',
  'User Information',
  'EHR Selection',
  'Meeting (if needed)',
  'Notes Retention',
  'Payment'
];

export const SignupFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [signupData, setSignupData] = useState<Partial<SignupData>>({});

  const handleNext = (stepData: Partial<SignupData>) => {
    const updatedData = { ...signupData, ...stepData };
    setSignupData(updatedData);
    
    // Skip meeting step if not needed
    if (activeStep === 2 && !updatedData.needsMeeting) {
      setActiveStep(4); // Skip to Notes Retention
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    // Handle back navigation, accounting for skipped steps
    if (activeStep === 4 && !signupData.needsMeeting) {
      setActiveStep(2); // Go back to EHR Selection
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <AccountCreation onNext={handleNext} data={signupData} />;
      case 1:
        return <UserInformation onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 2:
        return <EHRSelection onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 3:
        return <BookMeeting onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 4:
        return <NotesRetention onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 5:
        return <Payment onBack={handleBack} data={signupData} />;
      default:
        return <AccountCreation onNext={handleNext} data={signupData} />;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'background.paper',
            border: `1px solid ${(theme) => theme.palette.divider}`,
            boxShadow: '0 8px 32px rgba(20, 49, 81, 0.1)',
          }}
        >
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.75rem', md: '0.875rem' },
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  sx={{
                    '& .MuiStepLabel-label.Mui-active': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                    '& .MuiStepLabel-label.Mui-completed': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStep()}
        </Paper>
      </Box>
    </Container>
  );
};
