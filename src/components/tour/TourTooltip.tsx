
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
  const { nextStep, prevStep, endTour, state } = useTour();
  const theme = useTheme();
  const { isMobile, isTablet, isMobileView } = useResponsive();

  const navigateToModule = (moduleId: string) => {
    console.log(`Tour: Navigating to module ${moduleId}`);
    
    // Find and click the navigation item
    const navItem = document.querySelector(`[data-tour-id="${moduleId}"]`);
    if (navItem) {
      (navItem as HTMLElement).click();
      return true;
    }
    
    // Fallback: try alternative selectors
    const altSelectors = [
      `[data-tour-id="nav-${moduleId}"]`,
      `[data-testid="${moduleId}"]`,
      `[data-testid="nav-${moduleId}"]`
    ];
    
    for (const selector of altSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        (element as HTMLElement).click();
        return true;
      }
    }
    
    return false;
  };

  const handleNext = () => {
    const tourId = state.activeTour?.id;
    
    // Handle navigation based on tour type and step
    if (tourId === 'template-builder-tour') {
      // Template builder tour navigation logic
      if (step.id === 'template-overview' || step.id === 'workflow-steps') {
        // Navigate to template builder if not already there
        const templateNavItem = document.querySelector('[data-tour-id="nav-templates"]') || 
                               document.querySelector('[data-tour-id="template-builder"]');
        if (templateNavItem) {
          (templateNavItem as HTMLElement).click();
          setTimeout(() => nextStep(), 500);
          return;
        }
      }
      
      if (step.id === 'visit-type-selection') {
        // Click the first visit type card to proceed
        const visitTypeCard = document.querySelector('[data-tour-id="visit-type-selection"] .MuiCard-root');
        if (visitTypeCard) {
          console.log('Template builder tour: Clicking first visit type card');
          (visitTypeCard as HTMLElement).click();
          setTimeout(() => nextStep(), 1000);
          return;
        }
      }

      if (step.id === 'edit-template') {
        // Click the edit button on first template
        const editButton = document.querySelector('[data-testid="edit-template-button"]');
        if (editButton) {
          console.log('Template builder tour: Clicking edit template button');
          (editButton as HTMLElement).click();
          setTimeout(() => nextStep(), 1500);
          return;
        }
      }
    }
    
    if (tourId === 'workflow-builder-tour') {
      // Workflow builder tour navigation logic
      if (step.id === 'workflow-overview' || step.id === 'workflow-tabs') {
        // Navigate to workflow builder if not already there
        const workflowNavItem = document.querySelector('[data-tour-id="nav-workflows"]') || 
                               document.querySelector('[data-tour-id="workflow-builder"]');
        if (workflowNavItem) {
          (workflowNavItem as HTMLElement).click();
          setTimeout(() => nextStep(), 500);
          return;
        }
      }
      
      if (step.id === 'workflow-library-switch') {
        // Click on workflow library tab
        const libraryTab = document.querySelector('[data-tour-id="workflow-tabs"] [role="tab"]:last-child');
        if (libraryTab) {
          console.log('Workflow tour: Switching to library tab');
          (libraryTab as HTMLElement).click();
          setTimeout(() => nextStep(), 500);
          return;
        }
      }
    }
    
    if (tourId === 'welcome-tour') {
      // Welcome tour navigation logic
      if (step.id === 'template-builder') {
        // Navigate to template builder
        navigateToModule('template-builder');
        setTimeout(() => nextStep(), 500);
        return;
      }
      
      if (step.id === 'workflow-builder') {
        // Navigate to workflow builder
        navigateToModule('workflow-builder');
        setTimeout(() => nextStep(), 500);
        return;
      }
      
      if (step.id === 'profile-settings') {
        // Navigate to profile
        navigateToModule('profile');
        setTimeout(() => nextStep(), 500);
        return;
      }
    }

    // Default next step
    nextStep();
  };

  const getTooltipPosition = () => {
    const tooltipWidth = isMobile ? Math.min(280, window.innerWidth - 32) : 
                       isTablet ? Math.min(320, window.innerWidth - 32) : 350;
    const tooltipHeight = 280;
    const padding = isMobile ? 12 : 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = targetRect.bottom + padding;
    let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
    
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
    
    if (isMobileView) {
      left = Math.max(16, Math.min(left, viewportWidth - tooltipWidth - 16));
      
      if (targetRect.bottom + tooltipHeight + padding > viewportHeight - 50) {
        if (targetRect.top - tooltipHeight - padding > 50) {
          top = targetRect.top - tooltipHeight - padding;
        } else {
          top = Math.max(50, Math.min(top, viewportHeight - tooltipHeight - 50));
        }
      }
    } else {
      if (left < padding) {
        left = padding;
      } else if (left + tooltipWidth > viewportWidth - padding) {
        left = viewportWidth - tooltipWidth - padding;
      }
      
      if (top < 50) {
        top = 50;
      } else if (top + tooltipHeight > viewportHeight - 50) {
        const topPlacement = targetRect.top - tooltipHeight - padding;
        if (topPlacement > 50) {
          top = topPlacement;
        } else {
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
