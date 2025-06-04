
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Stepper, 
  Step, 
  StepLabel, 
  Paper, 
  Typography,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { AccountCreation } from './steps/AccountCreation';
import { UserInformation } from './steps/UserInformation';
import { EHRSelection } from './steps/EHRSelection';
import { BookMeeting } from './steps/BookMeeting';
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
  
  // Payment
  paymentCompleted: boolean;
}

const CustomStepIcon = ({ active, completed, icon }: any) => {
  const theme = useTheme();
  
  if (completed) {
    return (
      <CheckCircle 
        sx={{ 
          color: 'success.main',
          fontSize: { xs: 18, sm: 20, md: 24 }
        }} 
      />
    );
  }
  
  return (
    <Box
      sx={{
        width: { xs: 18, sm: 20, md: 24 },
        height: { xs: 18, sm: 20, md: 24 },
        borderRadius: '50%',
        backgroundColor: active ? 'primary.main' : 'grey.300',
        color: active ? 'white' : 'grey.600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getVisibleSteps = () => {
    const steps = ['Account Creation', 'User Information'];
    
    // Only add EHR-related steps if EHR mode is enabled
    if (signupData.ehrMode === true) {
      steps.push('EHR Selection');
      if (signupData.needsMeeting) {
        steps.push('Meeting');
      }
    }
    
    steps.push('Payment');
    return steps;
  };

  const visibleSteps = getVisibleSteps();

  const handleNext = (stepData: Partial<SignupData>) => {
    const updatedData = { ...signupData, ...stepData };
    setSignupData(updatedData);
    
    console.log('Updated signup data:', updatedData);
    console.log('Current step:', activeStep, 'Step name:', visibleSteps[activeStep]);
    
    // If we're on User Information step and EHR mode is disabled, skip directly to Payment
    if (activeStep === 1 && updatedData.ehrMode === false) {
      const paymentStepIndex = visibleSteps.indexOf('Payment');
      console.log('Skipping to Payment step:', paymentStepIndex);
      setActiveStep(paymentStepIndex);
      return;
    }
    
    // If we're on EHR Selection and no meeting is needed, skip to Payment
    if (activeStep === 2 && updatedData.ehrMode === true && !updatedData.needsMeeting) {
      const paymentStepIndex = visibleSteps.indexOf('Payment');
      console.log('Skipping to Payment step (no meeting needed):', paymentStepIndex);
      setActiveStep(paymentStepIndex);
      return;
    }
    
    // Normal progression to next step
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    console.log('Going back from step:', activeStep, 'Step name:', visibleSteps[activeStep]);
    
    // If we're on Payment step and came from User Information (no EHR mode)
    if (activeStep === visibleSteps.indexOf('Payment') && signupData.ehrMode === false) {
      setActiveStep(1); // Go back to User Information
      return;
    }
    
    // If we're on Payment step and came from EHR Selection (no meeting needed)
    if (activeStep === visibleSteps.indexOf('Payment') && signupData.ehrMode === true && !signupData.needsMeeting) {
      setActiveStep(2); // Go back to EHR Selection
      return;
    }
    
    // Normal back progression
    setActiveStep((prev) => prev - 1);
  };

  const renderStep = () => {
    const currentStepName = visibleSteps[activeStep];
    console.log('Rendering step:', currentStepName, 'at index:', activeStep);
    
    switch (currentStepName) {
      case 'Account Creation':
        return <AccountCreation onNext={handleNext} data={signupData} />;
      case 'User Information':
        return <UserInformation onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 'EHR Selection':
        return <EHRSelection onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 'Meeting':
        return <BookMeeting onNext={handleNext} onBack={handleBack} data={signupData} />;
      case 'Payment':
        return <Payment onBack={handleBack} data={signupData} />;
      default:
        return <AccountCreation onNext={handleNext} data={signupData} />;
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
        py: { xs: 0.5, sm: 1, md: 2 }
      }}
    >
      <Box 
        sx={{ 
          minHeight: { xs: 'calc(100vh - 80px)', sm: 'calc(100vh - 100px)', md: 'calc(100vh - 120px)' },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            maxHeight: { xs: 'calc(100vh - 80px)', sm: 'calc(100vh - 100px)', md: 'calc(100vh - 120px)' },
            overflow: 'hidden',
            borderRadius: { xs: 2, sm: 3, md: 4 }
          }}
        >
          {/* Mobile Progress Bar */}
          {isMobile && (
            <Box sx={{ 
              mb: { xs: 1.5, sm: 2 },
              textAlign: 'center',
              flexShrink: 0
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Step {activeStep + 1} of {visibleSteps.length}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 3, sm: 4 },
                  backgroundColor: 'grey.200',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: `${((activeStep + 1) / visibleSteps.length) * 100}%`,
                    height: '100%',
                    backgroundColor: 'primary.main',
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Desktop Stepper */}
          {!isMobile && (
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: { sm: 2, md: 3 },
                flexShrink: 0,
                '& .MuiStepLabel-label': {
                  fontSize: { sm: '0.8rem', md: '0.875rem', lg: '1rem' },
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
                  borderColor: 'grey.300',
                  borderTopWidth: 2
                },
                '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                  borderColor: 'primary.main'
                },
                '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                  borderColor: 'primary.light'
                }
              }}
            >
              {visibleSteps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    StepIconComponent={CustomStepIcon}
                    sx={{
                      '& .MuiStepLabel-iconContainer': {
                        pr: { sm: 0.5, md: 1 }
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {/* Mobile Step Title */}
          {isMobile && (
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: { xs: 1.5, sm: 2 },
                fontWeight: 600,
                color: 'primary.main',
                fontSize: { xs: '1rem', sm: '1.125rem' },
                flexShrink: 0
              }}
            >
              {visibleSteps[activeStep]}
            </Typography>
          )}

          {/* Step Content */}
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              overflow: 'hidden'
            }}
          >
            {renderStep()}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
