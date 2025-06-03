
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getVisibleSteps = () => {
    const steps = ['Account Creation', 'User Information'];
    
    if (signupData.ehrMode) {
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
    
    if (activeStep === 2 && (!updatedData.ehrMode || !updatedData.needsMeeting)) {
      const nextStepIndex = visibleSteps.indexOf('Payment');
      setActiveStep(nextStepIndex);
    } else if (activeStep === 1 && !updatedData.ehrMode) {
      const nextStepIndex = visibleSteps.indexOf('Payment');
      setActiveStep(nextStepIndex);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === visibleSteps.indexOf('Payment') && !signupData.ehrMode) {
      setActiveStep(1);
    } else if (activeStep === visibleSteps.indexOf('Payment') && !signupData.needsMeeting) {
      setActiveStep(2);
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
      case 'Payment':
        return <Payment onBack={handleBack} data={signupData} />;
      default:
        return <AccountCreation onNext={handleNext} data={signupData} />;
    }
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 }
      }}
    >
      <Box 
        sx={{ 
          minHeight: '100vh',
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
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            maxHeight: { xs: 'calc(100vh - 16px)', sm: 'calc(100vh - 32px)' },
            overflow: 'hidden'
          }}
        >
          {/* Mobile Progress Bar */}
          {isMobile && (
            <Box sx={{ 
              mb: 2,
              textAlign: 'center',
              flexShrink: 0
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
                mb: 3,
                flexShrink: 0,
                '& .MuiStepLabel-label': {
                  fontSize: { sm: '0.875rem', md: '1rem' },
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
                        pr: 1
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
                mb: 2,
                fontWeight: 600,
                color: 'primary.main',
                fontSize: '1.125rem',
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
