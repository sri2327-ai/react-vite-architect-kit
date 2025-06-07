
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close as CloseIcon, CheckCircle } from '@mui/icons-material';
import { useGuide } from '@/contexts/GuideContext';
import WelcomeStep from './steps/WelcomeStep';
import TemplateBuilderTour from './steps/TemplateBuilderTour';
import WorkflowIntroStep from './steps/WorkflowIntroStep';
import WorkflowImportStep from './steps/WorkflowImportStep';
import WorkflowConfigStep from './steps/WorkflowConfigStep';
import CompletionStep from './steps/CompletionStep';

const CustomStepIcon = ({ active, completed, icon }: any) => {
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
        fontWeight: 600
      }}
    >
      {icon}
    </Box>
  );
};

const GuideModal: React.FC = () => {
  const { guideState, nextStep, prevStep, skipGuide } = useGuide();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getStepLabels = () => {
    if (guideState.userMode === 'ehr') {
      return ['Welcome', 'Templates', 'Workflows', 'Import', 'Configure', 'Complete'];
    }
    return ['Welcome', 'Templates', 'Complete'];
  };

  const stepLabels = getStepLabels();

  const renderStep = () => {
    const stepIndex = guideState.currentStep;
    
    if (guideState.userMode === 'ehr') {
      switch (stepIndex) {
        case 0: return <WelcomeStep />;
        case 1: return <TemplateBuilderTour />;
        case 2: return <WorkflowIntroStep />;
        case 3: return <WorkflowImportStep />;
        case 4: return <WorkflowConfigStep />;
        case 5: return <CompletionStep />;
        default: return <WelcomeStep />;
      }
    } else {
      switch (stepIndex) {
        case 0: return <WelcomeStep />;
        case 1: return <TemplateBuilderTour />;
        case 2: return <CompletionStep />;
        default: return <WelcomeStep />;
      }
    }
  };

  const isLastStep = guideState.currentStep === guideState.totalSteps - 1;
  const isFirstStep = guideState.currentStep === 0;

  return (
    <Dialog
      open={guideState.isActive}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: { xs: '90vh', md: '70vh' },
          maxHeight: { xs: '95vh', md: '85vh' }
        }
      }}
    >
      <DialogHeader sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle sx={{ p: 0, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            Implementation Guide
          </DialogTitle>
          <IconButton onClick={skipGuide} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogHeader>

      <DialogContent sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
        {/* Progress Indicator */}
        {!isMobile && (
          <Stepper 
            activeStep={guideState.currentStep} 
            sx={{ 
              mb: 3,
              '& .MuiStepLabel-label': {
                fontSize: { sm: '0.8rem', md: '0.875rem' },
                fontWeight: 500
              }
            }}
          >
            {stepLabels.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {/* Mobile Progress */}
        {isMobile && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Step {guideState.currentStep + 1} of {guideState.totalSteps}
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
                  width: `${((guideState.currentStep + 1) / guideState.totalSteps) * 100}%`,
                  height: '100%',
                  backgroundColor: 'primary.main',
                  transition: 'width 0.3s ease'
                }}
              />
            </Box>
          </Box>
        )}

        {/* Step Content */}
        <Box sx={{ minHeight: { xs: '300px', md: '400px' }, mb: 3 }}>
          {renderStep()}
        </Box>

        {/* Navigation */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            variant="outlined"
            onClick={prevStep}
            disabled={isFirstStep}
            sx={{ minWidth: 100 }}
          >
            Back
          </Button>

          <Button
            variant="text"
            color="inherit"
            onClick={skipGuide}
            sx={{ mx: 2 }}
          >
            Skip Guide
          </Button>

          <Button
            variant="contained"
            onClick={nextStep}
            disabled={!guideState.canProceed}
            sx={{ minWidth: 100 }}
          >
            {isLastStep ? 'Complete' : 'Next'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GuideModal;
