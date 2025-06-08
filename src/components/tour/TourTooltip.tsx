
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTour } from '@/contexts/TourContext';
import { TourStep } from '@/contexts/TourContext';

interface TourTooltipProps {
  step: TourStep;
  targetRect: DOMRect;
  stepIndex: number;
  totalSteps: number;
  showProgress?: boolean;
  allowSkip?: boolean;
  isMobile: boolean;
  isTablet: boolean;
  drawerOpen: boolean;
  customZIndex?: number;
  onCustomNavigation?: () => boolean;
}

export const TourTooltip: React.FC<TourTooltipProps> = ({
  step,
  targetRect,
  stepIndex,
  totalSteps,
  showProgress = true,
  allowSkip = true,
  isMobile,
  isTablet,
  customZIndex = 10001,
  onCustomNavigation
}) => {
  const { nextStep, prevStep, endTour } = useTour();
  const theme = useTheme();

  const handleNext = () => {
    // Check if we need custom navigation (for template builder step 3)
    if (onCustomNavigation && onCustomNavigation()) {
      // Custom navigation handled, wait a bit then advance
      setTimeout(() => {
        nextStep();
      }, 1500);
    } else {
      nextStep();
    }
  };

  const getTooltipPosition = () => {
    const tooltipWidth = isMobile ? 280 : 320;
    const tooltipHeight = 200; // Approximate height
    const padding = 16;
    
    let top = targetRect.bottom + padding;
    let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
    
    // Handle placement based on step placement preference
    switch (step.placement) {
      case 'top':
        top = targetRect.top - tooltipHeight - padding;
        break;
      case 'bottom':
        top = targetRect.bottom + padding;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        left = targetRect.left - tooltipWidth - padding;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        left = targetRect.right + padding;
        break;
    }
    
    // Ensure tooltip stays within viewport
    if (left < padding) left = padding;
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }
    if (top < padding) top = padding;
    if (top + tooltipHeight > window.innerHeight - padding) {
      top = window.innerHeight - tooltipHeight - padding;
    }
    
    return { top, left };
  };

  const position = getTooltipPosition();

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: isMobile ? 280 : 320,
        maxWidth: 'calc(100vw - 32px)',
        p: 3,
        zIndex: customZIndex,
        pointerEvents: 'auto',
        borderRadius: 2,
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: 'background.paper'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, pr: 1 }}>
          {step.title}
        </Typography>
        {allowSkip && (
          <IconButton
            size="small"
            onClick={endTour}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Progress bar */}
      {showProgress && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={(stepIndex + 1) / totalSteps * 100}
            sx={{ height: 4, borderRadius: 2 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Step {stepIndex + 1} of {totalSteps}
          </Typography>
        </Box>
      )}

      {/* Content */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.5 }}>
        {step.content}
      </Typography>

      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={prevStep}
          disabled={stepIndex === 0}
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: 'none' }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={handleNext}
          endIcon={<ArrowForwardIcon />}
          sx={{ textTransform: 'none' }}
        >
          {stepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};
