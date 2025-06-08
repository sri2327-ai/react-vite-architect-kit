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
}

export const TourTooltip: React.FC<TourTooltipProps> = ({
  step,
  targetRect,
  stepIndex,
  totalSteps,
  showProgress = true,
  allowSkip = true
}) => {
  const { nextStep, prevStep, skipTour, endTour } = useTour();

  const getTooltipPosition = () => {
    const placement = step.placement || 'bottom';
    const margin = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 200; // Approximate

    let top = 0;
    let left = 0;

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

    // Keep tooltip in viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    left = Math.max(margin, Math.min(left, viewportWidth - tooltipWidth - margin));
    top = Math.max(margin, Math.min(top, viewportHeight - tooltipHeight - margin));

    return { top, left };
  };

  const position = getTooltipPosition();
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: 320,
        maxWidth: 'calc(100vw - 32px)',
        p: 3,
        zIndex: 10001,
        pointerEvents: 'auto',
        borderRadius: 2
      }}
    >
      {/* Header with close button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {step.title}
        </Typography>
        <IconButton
          size="small"
          onClick={endTour}
          sx={{ mt: -1, mr: -1 }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Progress indicator */}
      {showProgress && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Step {stepIndex + 1} of {totalSteps}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ borderRadius: 1, height: 4 }}
          />
        </Box>
      )}

      {/* Content */}
      <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.5 }}>
        {step.content}
      </Typography>

      {/* Actions */}
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Box sx={{ display: 'flex', gap: 1 }}>
          {stepIndex > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<NavigateBefore />}
              onClick={prevStep}
            >
              Back
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {allowSkip && (
            <Button
              variant="text"
              size="small"
              startIcon={<SkipNext />}
              onClick={skipTour}
              color="inherit"
            >
              Skip Tour
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            endIcon={stepIndex < totalSteps - 1 ? <NavigateNext /> : undefined}
            onClick={nextStep}
          >
            {stepIndex < totalSteps - 1 ? 'Next' : 'Finish'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};
