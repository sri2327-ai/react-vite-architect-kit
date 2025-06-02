
import React, { useState } from 'react';
import { Box, Container, Stepper, Step, StepLabel, Paper, StepIcon, Typography } from '@mui/material';
import { AccountCreation } from './steps/AccountCreation';
import { UserInformation } from './steps/UserInformation';
import { EHRSelection } from './steps/EHRSelection';
import { BookMeeting } from './steps/BookMeeting';
import { NotesRetention } from './steps/NotesRetention';
import { Payment } from './steps/Payment';
import { CheckCircle } from '@mui/icons-material';

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

const allSteps = [
  'Account Creation',
  'User Information',
  'EHR Selection',
  'Meeting (if needed)',
  'Notes Retention',
  'Payment'
];

const CustomStepIcon = ({ active, completed, icon }: any) => {
  if (completed) {
    return (
      <CheckCircle 
        sx={{ 
          color: 'primary.main',
          fontSize: { xs: 20, sm: 24 }
        }} 
      />
    );
  }
  
  return (
    <Box
      sx={{
        width: { xs: 20, sm: 24 },
        height: { xs: 20, sm: 24 },
        borderRadius: '50%',
        backgroundColor: active ? 'primary.main' : 'grey.300',
        color: active ? 'white' : 'grey.600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        fontWeight: 600,
        transition: 'all 0.3s ease'
      }}
    >
      {icon}
    </Box>
  );
};

export const SignupFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [signupData, setSignupData] = useState<Partial<SignupData>>({});

  // Filter steps based on signup data
  const getVisibleSteps = () => {
    const steps = ['Account Creation', 'User Information'];
    
    if (signupData.ehrMode) {
      steps.push('EHR Selection');
      if (signupData.needsMeeting) {
        steps.push('Meeting');
      }
    }
    
    steps.push('Notes Retention', 'Payment');
    return steps;
  };

  const visibleSteps = getVisibleSteps();

  const handleNext = (stepData: Partial<SignupData>) => {
    const updatedData = { ...signupData, ...stepData };
    setSignupData(updatedData);
    
    // Skip meeting step if not needed or EHR mode is disabled
    if (activeStep === 2 && (!updatedData.ehrMode || !updatedData.needsMeeting)) {
      // Skip to Notes Retention
      const nextStepIndex = visibleSteps.indexOf('Notes Retention');
      setActiveStep(nextStepIndex);
    } else if (activeStep === 1 && !updatedData.ehrMode) {
      // Skip to Notes Retention if EHR mode is disabled
      const nextStepIndex = visibleSteps.indexOf('Notes Retention');
      setActiveStep(nextStepIndex);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    // Handle back navigation, accounting for skipped steps
    if (activeStep === visibleSteps.indexOf('Notes Retention') && !signupData.ehrMode) {
      setActiveStep(1); // Go back to User Information
    } else if (activeStep === visibleSteps.indexOf('Notes Retention') && !signupData.needsMeeting) {
      setActiveStep(2); // Go back to EHR Selection
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    const currentStepName = visibleSteps[activeStep];
    
    switch (currentStepName) {
      case 'Account Creation':
        return <AccountCreation onNext={handleNext} data={signupData} />;
      case 'User Information':
        return <UserInformation onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 'EHR Selection':
        return <EHRSelection onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 'Meeting':
        return <BookMeeting onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 'Notes Retention':
        return <NotesRetention onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 'Payment':
        return <Payment onBack={handleBack} data={signupData} />;
      default:
        return <AccountCreation onNext={handleNext} data={signupData} />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 } }}>
      <Box sx={{ py: { xs: 2, sm: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: 'background.paper',
            border: `1px solid ${(theme) => theme.palette.divider}`,
            boxShadow: '0 8px 32px rgba(20, 49, 81, 0.08)',
          }}
        >
          {/* Progress indicator for mobile */}
          <Box sx={{ 
            display: { xs: 'block', md: 'none' }, 
            mb: 3,
            textAlign: 'center'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Step {activeStep + 1} of {visibleSteps.length}
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 4,
                backgroundColor: 'grey.200',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${((activeStep + 1) / visibleSteps.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #143151, #387E89)',
                  transition: 'width 0.3s ease'
                }}
              />
            </Box>
          </Box>

          {/* Desktop stepper */}
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              display: { xs: 'none', md: 'flex' },
              '& .MuiStepLabel-label': {
                fontSize: '0.875rem',
                fontWeight: 500
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: 'primary.main',
                fontWeight: 600,
              },
              '& .MuiStepLabel-label.Mui-completed': {
                color: 'primary.main',
                fontWeight: 500
              },
              '& .MuiStepConnector-line': {
                borderColor: 'divider',
                borderTopWidth: 2
              },
              '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                borderColor: 'primary.main'
              }
            }}
          >
            {visibleSteps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconComponent={CustomStepIcon}
                  sx={{
                    '& .MuiStepLabel-iconContainer': {
                      pr: 1
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Current step name for mobile */}
          <Typography
            variant="h6"
            sx={{
              display: { xs: 'block', md: 'none' },
              textAlign: 'center',
              mb: 3,
              fontWeight: 600,
              color: 'primary.main'
            }}
          >
            {visibleSteps[activeStep]}
          </Typography>

          {renderStep()}
        </Paper>
      </Box>
    </Container>
  );
};
