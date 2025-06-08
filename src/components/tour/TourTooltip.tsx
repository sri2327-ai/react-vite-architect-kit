
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTour } from '@/contexts/TourContext';
import { TourStep } from '@/contexts/TourContext';
import { useResponsive } from '@/hooks/useResponsive';

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
}

export const TourTooltip: React.FC<TourTooltipProps> = ({
  step,
  targetRect,
  stepIndex,
  totalSteps,
  showProgress = true,
  allowSkip = true,
  customZIndex = 10001
}) => {
  const { nextStep, prevStep, endTour } = useTour();
  const theme = useTheme();
  const { isMobile, isTablet, isMobileView } = useResponsive();

  const handleNext = () => {
    // For template builder tour step 3, click the first visit type card
    if (step.id === 'visit-type-selection') {
      const visitTypeCard = document.querySelector('[data-tour-id="visit-type-selection"] .MuiCard-root');
      if (visitTypeCard) {
        console.log('Template builder tour: Clicking first visit type card');
        (visitTypeCard as HTMLElement).click();
        // Wait for navigation then advance
        setTimeout(() => {
          nextStep();
        }, 1000);
        return;
      }
    }
    nextStep();
  };

  const getTooltipPosition = () => {
    const tooltipWidth = isMobile ? Math.min(280, window.innerWidth - 32) : 
                       isTablet ? Math.min(320, window.innerWidth - 32) : 350;
    const tooltipHeight = 250; // Approximate height
    const padding = isMobile ? 8 : 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
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
    
    // Mobile-specific positioning adjustments
    if (isMobileView) {
      // On mobile, prefer bottom placement and center horizontally
      if (targetRect.bottom + tooltipHeight + padding < viewportHeight) {
        top = targetRect.bottom + padding;
      } else if (targetRect.top - tooltipHeight - padding > 0) {
        top = targetRect.top - tooltipHeight - padding;
      } else {
        // If neither top nor bottom works, place in center
        top = (viewportHeight - tooltipHeight) / 2;
      }
      left = (viewportWidth - tooltipWidth) / 2;
    } else {
      // Desktop/tablet positioning with viewport boundary checks
      if (left < padding) left = padding;
      if (left + tooltipWidth > viewportWidth - padding) {
        left = viewportWidth - tooltipWidth - padding;
      }
      if (top < padding) top = padding;
      if (top + tooltipHeight > viewportHeight - padding) {
        top = viewportHeight - tooltipHeight - padding;
      }
    }
    
    return { top, left, width: tooltipWidth };
  };

  const position = getTooltipPosition();

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        maxWidth: 'calc(100vw - 16px)',
        maxHeight: 'calc(100vh - 32px)',
        p: isMobile ? 2 : 3,
        zIndex: customZIndex,
        pointerEvents: 'auto',
        borderRadius: isMobile ? 1 : 2,
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: 'background.paper',
        overflow: 'auto'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: isMobile ? 1.5 : 2 
      }}>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          sx={{ 
            fontWeight: 600, 
            flex: 1, 
            pr: 1,
            fontSize: isMobile ? '1rem' : '1.25rem'
          }}
        >
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
        <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
          <LinearProgress
            variant="determinate"
            value={(stepIndex + 1) / totalSteps * 100}
            sx={{ height: 4, borderRadius: 2 }}
          />
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              mt: 0.5, 
              display: 'block',
              fontSize: isMobile ? '0.7rem' : '0.75rem'
            }}
          >
            Step {stepIndex + 1} of {totalSteps}
          </Typography>
        </Box>
      )}

      {/* Content */}
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: isMobile ? 2 : 3, 
          lineHeight: 1.5,
          fontSize: isMobile ? '0.85rem' : '0.875rem'
        }}
      >
        {step.content}
      </Typography>

      {/* Navigation buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 0
      }}>
        <Button
          variant="outlined"
          size="small"
          onClick={prevStep}
          disabled={stepIndex === 0}
          startIcon={!isMobile ? <ArrowBackIcon /> : undefined}
          sx={{ 
            textTransform: 'none',
            minWidth: isMobile ? '100%' : 'auto',
            order: isMobile ? 2 : 1
          }}
        >
          {isMobile ? '← Back' : 'Back'}
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={handleNext}
          endIcon={!isMobile ? <ArrowForwardIcon /> : undefined}
          sx={{ 
            textTransform: 'none',
            minWidth: isMobile ? '100%' : 'auto',
            order: isMobile ? 1 : 2
          }}
        >
          {stepIndex === totalSteps - 1 ? 'Finish' : (isMobile ? 'Next →' : 'Next')}
        </Button>
      </Box>
    </Paper>
  );
};
