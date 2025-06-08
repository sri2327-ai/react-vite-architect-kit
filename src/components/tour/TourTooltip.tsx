
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  IconButton,
  Stack
} from '@mui/material';
import {
  NavigateNext,
  NavigateBefore,
  Close,
  SkipNext
} from '@mui/icons-material';
import { useTour, TourStep } from '@/contexts/TourContext';

interface TourTooltipProps {
  step: TourStep;
  targetRect: DOMRect;
  stepIndex: number;
  totalSteps: number;
  showProgress?: boolean;
  allowSkip?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  drawerOpen?: boolean;
  customZIndex?: number;
}

export const TourTooltip: React.FC<TourTooltipProps> = ({
  step,
  targetRect,
  stepIndex,
  totalSteps,
  showProgress = true,
  allowSkip = true,
  isMobile = false,
  isTablet = false,
  drawerOpen = false,
  customZIndex = 10001
}) => {
  const { nextStep, prevStep, skipTour, endTour } = useTour();

  const getTooltipPosition = () => {
    const placement = step.placement || 'bottom';
    const margin = isMobile ? 16 : isTablet ? 20 : 24;
    
    // Adjust tooltip width based on drawer state and screen size
    let tooltipWidth: number;
    if (drawerOpen && isMobile) {
      tooltipWidth = Math.min(280, window.innerWidth - 32);
    } else if (isMobile) {
      tooltipWidth = Math.min(320, window.innerWidth - 24);
    } else if (isTablet) {
      tooltipWidth = Math.min(360, window.innerWidth - 32);
    } else {
      tooltipWidth = Math.min(400, window.innerWidth - 40);
    }
    
    // Dynamic height estimation based on content and drawer state
    const baseHeight = isMobile ? (drawerOpen ? 180 : 200) : isTablet ? 220 : 240;
    const progressHeight = showProgress ? (isMobile ? 40 : 50) : 0;
    const buttonsHeight = isMobile ? 80 : 60;
    const tooltipHeight = baseHeight + progressHeight + buttonsHeight;

    let top = 0;
    let left = 0;
    let actualPlacement = placement;

    // Calculate initial position
    switch (placement) {
      case 'top':
        top = targetRect.top - tooltipHeight - margin;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = targetRect.bottom + margin;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        left = targetRect.left - tooltipWidth - margin;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        left = targetRect.right + margin;
        break;
    }

    // Viewport constraints with drawer consideration
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const minMargin = isMobile ? (drawerOpen ? 16 : 12) : 16;

    // Adjust for drawer if open
    const drawerWidth = drawerOpen && isMobile ? 280 : 0;
    const availableWidth = viewportWidth - drawerWidth;

    // Check if tooltip fits and adjust placement if needed
    if (left < minMargin + drawerWidth) {
      left = minMargin + drawerWidth;
      if (placement === 'left') {
        left = Math.min(targetRect.right + margin, availableWidth - tooltipWidth - minMargin);
        actualPlacement = 'right';
      }
    }
    
    if (left + tooltipWidth > availableWidth - minMargin) {
      left = availableWidth - tooltipWidth - minMargin;
      if (placement === 'right') {
        left = Math.max(targetRect.left - tooltipWidth - margin, minMargin + drawerWidth);
        actualPlacement = 'left';
      }
    }

    if (top < minMargin) {
      top = minMargin;
      if (placement === 'top') {
        top = targetRect.bottom + margin;
        actualPlacement = 'bottom';
      }
    }
    
    if (top + tooltipHeight > viewportHeight - minMargin) {
      top = viewportHeight - tooltipHeight - minMargin;
      if (placement === 'bottom') {
        top = targetRect.top - tooltipHeight - margin;
        actualPlacement = 'top';
      }
    }

    // Final boundary check with drawer consideration
    left = Math.max(minMargin + drawerWidth, Math.min(left, availableWidth - tooltipWidth - minMargin));
    top = Math.max(minMargin, Math.min(top, viewportHeight - tooltipHeight - minMargin));

    return { top, left, width: tooltipWidth, placement: actualPlacement };
  };

  const position = getTooltipPosition();
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <Paper
      elevation={isMobile ? (drawerOpen ? 16 : 12) : 16}
      sx={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: position.width,
        maxWidth: `calc(100vw - ${isMobile ? (drawerOpen ? 48 : 24) : 32}px)`,
        p: isMobile ? (drawerOpen ? 1.5 : 2) : isTablet ? 2.5 : 3,
        zIndex: customZIndex,
        pointerEvents: 'auto',
        borderRadius: isMobile ? 2 : 3,
        backgroundColor: 'background.paper',
        border: isMobile ? '1px solid' : 'none',
        borderColor: 'divider',
        boxShadow: drawerOpen 
          ? '0 16px 64px rgba(0,0,0,0.25), 0 8px 32px rgba(0,0,0,0.15)'
          : isMobile 
            ? '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)'
            : '0 12px 48px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.1)'
      }}
    >
      {/* Header with close button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: isMobile ? (drawerOpen ? 1 : 1.5) : isTablet ? 2 : 2.5,
        gap: 1
      }}>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          sx={{ 
            fontWeight: 600, 
            fontSize: isMobile ? (drawerOpen ? '0.9rem' : '1rem') : isTablet ? '1.1rem' : '1.2rem',
            lineHeight: 1.3,
            color: 'text.primary',
            flex: 1,
            pr: 1
          }}
        >
          {step.title}
        </Typography>
        <IconButton
          size="small"
          onClick={endTour}
          sx={{ 
            mt: -0.5, 
            mr: -0.5,
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Progress indicator */}
      {showProgress && (
        <Box sx={{ mb: isMobile ? (drawerOpen ? 1.5 : 2) : isTablet ? 2.5 : 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 1 
          }}>
            <Typography variant="caption" color="text.secondary" sx={{
              fontSize: isMobile ? (drawerOpen ? '0.7rem' : '0.75rem') : '0.8rem'
            }}>
              Step {stepIndex + 1} of {totalSteps}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{
              fontSize: isMobile ? (drawerOpen ? '0.7rem' : '0.75rem') : '0.8rem',
              fontWeight: 500
            }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ 
              borderRadius: 2, 
              height: isMobile ? (drawerOpen ? 4 : 6) : 8,
              backgroundColor: 'action.hover'
            }}
          />
        </Box>
      )}

      {/* Content */}
      <Typography 
        variant="body2" 
        sx={{ 
          mb: isMobile ? (drawerOpen ? 2 : 2.5) : isTablet ? 3 : 3.5, 
          lineHeight: 1.5,
          fontSize: isMobile ? (drawerOpen ? '0.8rem' : '0.875rem') : isTablet ? '0.9rem' : '0.95rem',
          color: 'text.secondary'
        }}
      >
        {step.content}
      </Typography>

      {/* Actions */}
      <Stack 
        direction={isMobile ? 'column' : 'row'} 
        spacing={isMobile ? (drawerOpen ? 1 : 1.5) : 1} 
        justifyContent="space-between"
        alignItems={isMobile ? 'stretch' : 'center'}
      >
        {/* Back button for desktop */}
        {!isMobile && stepIndex > 0 && (
          <Button
            variant="outlined"
            size={isTablet ? "medium" : "small"}
            startIcon={<NavigateBefore />}
            onClick={prevStep}
            sx={{
              minWidth: 'auto',
              px: isTablet ? 2 : 1.5
            }}
          >
            Back
          </Button>
        )}

        {/* Right side actions */}
        <Box sx={{ 
          display: 'flex', 
          gap: isMobile ? (drawerOpen ? 0.5 : 1) : 1, 
          flexDirection: isMobile ? 'column' : 'row',
          flex: isMobile ? 1 : 'none',
          alignItems: 'stretch'
        }}>
          {/* Back button for mobile */}
          {isMobile && stepIndex > 0 && (
            <Button
              variant="outlined"
              size={drawerOpen ? "small" : "medium"}
              startIcon={<NavigateBefore />}
              onClick={prevStep}
              fullWidth
            >
              Back
            </Button>
          )}
          
          {/* Skip button */}
          {allowSkip && (
            <Button
              variant="text"
              size={isMobile ? (drawerOpen ? "small" : "medium") : isTablet ? "medium" : "small"}
              startIcon={<SkipNext />}
              onClick={skipTour}
              color="inherit"
              fullWidth={isMobile}
              sx={{
                minWidth: isMobile ? 'auto' : 100,
                px: isMobile ? (drawerOpen ? 1.5 : 2) : 1.5
              }}
            >
              Skip Tour
            </Button>
          )}
          
          {/* Next/Finish button */}
          <Button
            variant="contained"
            size={isMobile ? (drawerOpen ? "small" : "medium") : isTablet ? "medium" : "small"}
            endIcon={stepIndex < totalSteps - 1 ? <NavigateNext /> : undefined}
            onClick={nextStep}
            fullWidth={isMobile}
            sx={{
              minWidth: isMobile ? 'auto' : 100,
              px: isMobile ? (drawerOpen ? 1.5 : 2) : isTablet ? 2 : 1.5,
              fontWeight: 600
            }}
          >
            {stepIndex < totalSteps - 1 ? 'Next' : 'Finish'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};
