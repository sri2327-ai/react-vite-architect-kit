
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Box, Backdrop, useTheme, useMediaQuery } from '@mui/material';
import { useTour } from '@/contexts/TourContext';
import { TourTooltip } from './TourTooltip';

interface TourOverlayProps {
  children?: React.ReactNode;
}

export const TourOverlay: React.FC<TourOverlayProps> = () => {
  const { state } = useTour();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const findTargetElement = useCallback(() => {
    if (!state.activeTour || !state.isRunning) return null;
    
    const currentStep = state.activeTour.steps[state.currentStepIndex];
    if (!currentStep) return null;

    // Check if target is already a CSS selector (starts with '[', '.', '#', etc.)
    const isSelector = currentStep.target.startsWith('[') || currentStep.target.startsWith('.') || currentStep.target.startsWith('#') || currentStep.target.includes(' ');
    
    let element: HTMLElement | null = null;
    
    if (isSelector) {
      // Use the target as-is if it's already a CSS selector
      element = document.querySelector(currentStep.target) as HTMLElement;
    } else {
      // Try data-tour-id first for simple identifiers
      element = document.querySelector(`[data-tour-id="${currentStep.target}"]`) as HTMLElement;
    }
    
    return element;
  }, [state.activeTour, state.currentStepIndex, state.isRunning]);

  const updateTargetRect = useCallback(() => {
    const element = findTargetElement();
    setTargetElement(element);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      
      // Scroll element into view if needed - adjusted for mobile
      const behavior = isMobile ? 'auto' : 'smooth';
      element.scrollIntoView({ 
        behavior, 
        block: 'center', 
        inline: 'center' 
      });
    }
  }, [findTargetElement, isMobile]);

  useEffect(() => {
    updateTargetRect();
  }, [updateTargetRect]);

  useEffect(() => {
    const handleResize = () => {
      updateTargetRect();
    };

    const handleScroll = () => {
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetRect(rect);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [targetElement, updateTargetRect]);

  if (!state.isRunning || !state.activeTour || !targetElement || !targetRect) {
    return null;
  }

  const currentStep = state.activeTour.steps[state.currentStepIndex];
  if (!currentStep) return null;

  // Responsive spotlight padding
  const spotlightPadding = isMobile ? 8 : isTablet ? 10 : 12;

  return createPortal(
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      {/* Backdrop with spotlight effect */}
      <Backdrop
        open={true}
        sx={{
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          pointerEvents: currentStep.spotlightClicks ? 'none' : 'auto'
        }}
      />
      
      {/* Spotlight cutout */}
      <Box
        sx={{
          position: 'absolute',
          top: Math.max(0, targetRect.top - spotlightPadding),
          left: Math.max(0, targetRect.left - spotlightPadding),
          width: Math.min(
            targetRect.width + (spotlightPadding * 2),
            window.innerWidth - Math.max(0, targetRect.left - spotlightPadding)
          ),
          height: Math.min(
            targetRect.height + (spotlightPadding * 2),
            window.innerHeight - Math.max(0, targetRect.top - spotlightPadding)
          ),
          backgroundColor: 'transparent',
          border: `${isMobile ? 2 : 3}px solid`,
          borderColor: 'primary.main',
          borderRadius: isMobile ? 1 : 2,
          boxShadow: `0 0 0 ${isMobile ? '9999px' : '9999px'} rgba(0, 0, 0, 0.6)`,
          pointerEvents: 'none',
          zIndex: 10000
        }}
      />

      {/* Tour tooltip */}
      <TourTooltip
        step={currentStep}
        targetRect={targetRect}
        stepIndex={state.currentStepIndex}
        totalSteps={state.activeTour.steps.length}
        showProgress={state.activeTour.showProgress}
        allowSkip={state.activeTour.allowSkip}
        isMobile={isMobile}
        isTablet={isTablet}
      />
    </Box>,
    document.body
  );
};
