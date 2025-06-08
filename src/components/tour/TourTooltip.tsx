
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
    const tooltipHeight = 280; // Increased for better content fit
    const padding = isMobile ? 12 : 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Smart positioning logic
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
    
    // Responsive positioning adjustments with better boundaries
    if (isMobileView) {
      // Mobile-first approach - always center horizontally and position vertically for best visibility
      left = Math.max(16, Math.min(left, viewportWidth - tooltipWidth - 16));
      
      // Vertical positioning - prefer bottom but avoid going off screen
      if (targetRect.bottom + tooltipHeight + padding > viewportHeight - 50) {
        if (targetRect.top - tooltipHeight - padding > 50) {
          // Place above if there's room
          top = targetRect.top - tooltipHeight - padding;
        } else {
          // Place in safe center area if neither top nor bottom works well
          top = Math.max(50, Math.min(top, viewportHeight - tooltipHeight - 50));
        }
      }
    } else {
      // Desktop/tablet positioning with better boundary checks
      // Horizontal boundaries
      if (left < padding) {
        left = padding;
      } else if (left + tooltipWidth > viewportWidth - padding) {
        left = viewportWidth - tooltipWidth - padding;
      }
      
      // Vertical boundaries  
      if (top < 50) {
        top = 50; // Account for header space
      } else if (top + tooltipHeight > viewportHeight - 50) {
        // Try placing above target
        const topPlacement = targetRect.top - tooltipHeight - padding;
        if (topPlacement > 50) {
          top = topPlacement;
        } else {
          // Center in viewport if neither works well
          top = Math.max(50, (viewportHeight - tooltipHeight) / 2);
        }
      }
    }
    
    return { 
      top: Math.max(16, top), 
      left: Math.max(16, left), 
      width: Math.min(tooltipWidth, viewportWidth - 32) 
    };
  };

  const position = getTooltipPosition();

  return (
    <Paper
      elevation={12}
      sx={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 100px)',
        p: isMobile ? 2.5 : 3,
        zIndex: customZIndex,
        pointerEvents: 'auto',
        borderRadius: isMobile ? 2 : 3,
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: 'background.paper',
        overflow: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: isMobile ? 2 : 2.5 
      }}>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          sx={{ 
            fontWeight: 600, 
            flex: 1, 
            pr: 1,
            fontSize: isMobile ? '1rem' : '1.25rem',
            lineHeight: 1.3
          }}
        >
          {step.title}
        </Typography>
        {allowSkip && (
          <IconButton
            size="small"
            onClick={endTour}
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Progress bar */}
      {showProgress && (
        <Box sx={{ mb: isMobile ? 2 : 2.5 }}>
          <LinearProgress
            variant="determinate"
            value={(stepIndex + 1) / totalSteps * 100}
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3
              }
            }}
          />
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              mt: 1, 
              display: 'block',
              fontSize: isMobile ? '0.75rem' : '0.8rem',
              fontWeight: 500
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
          mb: isMobile ? 2.5 : 3, 
          lineHeight: 1.6,
          fontSize: isMobile ? '0.9rem' : '0.95rem'
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
        gap: isMobile ? 1.5 : 0
      }}>
        <Button
          variant="outlined"
          size={isMobile ? "medium" : "small"}
          onClick={prevStep}
          disabled={stepIndex === 0}
          startIcon={!isMobile ? <ArrowBackIcon /> : undefined}
          sx={{ 
            textTransform: 'none',
            minWidth: isMobile ? '100%' : 'auto',
            order: isMobile ? 2 : 1,
            fontWeight: 500
          }}
        >
          {isMobile ? '← Back' : 'Back'}
        </Button>

        <Button
          variant="contained"
          size={isMobile ? "medium" : "small"}
          onClick={handleNext}
          endIcon={!isMobile ? <ArrowForwardIcon /> : undefined}
          sx={{ 
            textTransform: 'none',
            minWidth: isMobile ? '100%' : 'auto',
            order: isMobile ? 1 : 2,
            fontWeight: 600,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          {stepIndex === totalSteps - 1 ? 'Finish' : (isMobile ? 'Next →' : 'Next')}
        </Button>
      </Box>
    </Paper>
  );
};
