
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { useGuide } from '@/contexts/GuideContext';
import { bravoColors } from '@/theme/colors';
import WelcomeStep from './steps/WelcomeStep';
import TemplateBuilderTour from './steps/TemplateBuilderTour';
import WorkflowIntroStep from './steps/WorkflowIntroStep';
import WorkflowImportStep from './steps/WorkflowImportStep';
import WorkflowConfigStep from './steps/WorkflowConfigStep';
import CompletionStep from './steps/CompletionStep';

const GuideModal: React.FC = () => {
  const { guideState, nextStep, prevStep, skipGuide, closeGuide } = useGuide();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!guideState.isActive) return null;

  const getStepLabels = () => {
    if (guideState.userMode === 'ehr') {
      return ['Welcome', 'Templates', 'Workflow Intro', 'Import Workflow', 'Configure', 'Complete'];
    } else {
      return ['Welcome', 'Templates', 'Quick Links', 'Complete'];
    }
  };

  const getCurrentStepComponent = () => {
    if (guideState.userMode === 'ehr') {
      switch (guideState.currentStep) {
        case 0: return <WelcomeStep />;
        case 1: return <TemplateBuilderTour />;
        case 2: return <WorkflowIntroStep />;
        case 3: return <WorkflowImportStep />;
        case 4: return <WorkflowConfigStep />;
        case 5: return <CompletionStep />;
        default: return <WelcomeStep />;
      }
    } else {
      switch (guideState.currentStep) {
        case 0: return <WelcomeStep />;
        case 1: return <TemplateBuilderTour />;
        case 2: return <CompletionStep />;
        case 3: return <CompletionStep />;
        default: return <WelcomeStep />;
      }
    }
  };

  const stepLabels = getStepLabels();
  const progress = ((guideState.currentStep + 1) / guideState.totalSteps) * 100;

  return (
    <Dialog
      open={guideState.isActive}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          maxHeight: isMobile ? '100vh' : '90vh'
        }
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 3,
        background: bravoColors.primary,
        color: 'white',
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            S10.AI Implementation Guide
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={skipGuide}
              startIcon={<SkipForward size={16} />}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Skip Guide
            </Button>
            <IconButton
              onClick={closeGuide}
              sx={{
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <X size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
            Step {guideState.currentStep + 1} of {guideState.totalSteps}: {stepLabels[guideState.currentStep]}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white',
                borderRadius: 3
              }
            }}
          />
        </Box>

        {/* Desktop Stepper */}
        {!isMobile && (
          <Stepper 
            activeStep={guideState.currentStep} 
            sx={{ 
              '& .MuiStepLabel-label': {
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.875rem'
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: 'white',
                fontWeight: 600
              },
              '& .MuiStepLabel-label.Mui-completed': {
                color: 'rgba(255,255,255,0.9)'
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255,255,255,0.3)'
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: 'white'
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            {stepLabels.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </Box>

      {/* Content */}
      <DialogContent sx={{ 
        p: 0, 
        flex: 1, 
        overflow: 'auto',
        backgroundColor: 'background.default'
      }}>
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: 400 }}>
          {getCurrentStepComponent()}
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{
        p: 3,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        justifyContent: 'space-between'
      }}>
        <Button
          onClick={prevStep}
          disabled={guideState.currentStep === 0}
          startIcon={<ArrowLeft size={16} />}
          sx={{ visibility: guideState.currentStep === 0 ? 'hidden' : 'visible' }}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {guideState.currentStep < guideState.totalSteps - 1 ? (
            <Button
              variant="contained"
              onClick={nextStep}
              disabled={!guideState.canProceed}
              endIcon={<ArrowRight size={16} />}
              sx={{
                background: bravoColors.primary,
                '&:hover': {
                  background: bravoColors.primaryDark
                }
              }}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={nextStep}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #45a049, #3d8b40)'
                }
              }}
            >
              Complete Guide
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default GuideModal;
