
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Box, Backdrop, useTheme, useMediaQuery } from '@mui/material';
import { useTour } from '@/contexts/TourContext';
import { TourTooltip } from './TourTooltip';

interface TourOverlayProps {
  children?: React.ReactNode;
}

export const TourOverlay: React.FC<TourOverlayProps> = () => {
  const { state, endTour, nextStep } = useTour();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const findTargetElement = useCallback(() => {
    if (!state.activeTour || !state.isRunning) return null;
    
    const currentStep = state.activeTour.steps[state.currentStepIndex];
    if (!currentStep) return null;

    // Special handling for body target (used for screen transitions)
    if (currentStep.target === 'body') {
      return document.body;
    }

    const isSelector = currentStep.target.startsWith('[') || currentStep.target.startsWith('.') || currentStep.target.startsWith('#') || currentStep.target.includes(' ');
    
    let element: HTMLElement | null = null;
    
    if (isSelector) {
      element = document.querySelector(currentStep.target) as HTMLElement;
    } else {
      element = document.querySelector(`[data-tour-id="${currentStep.target}"]`) as HTMLElement;
    }
    
    return element;
  }, [state.activeTour, state.currentStepIndex, state.isRunning]);

  const closeMobileDrawer = useCallback(() => {
    // Find and close mobile drawer if it's open
    const mobileDrawerBackdrop = document.querySelector('.MuiDrawer-root .MuiBackdrop-root') as HTMLElement;
    const mobileDrawerCloseButton = document.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement;
    
    if (mobileDrawerBackdrop) {
      mobileDrawerBackdrop.click();
    } else if (mobileDrawerCloseButton) {
      mobileDrawerCloseButton.click();
    }
  }, []);

  const updateTargetRect = useCallback(() => {
    const element = findTargetElement();
    
    if (element) {
      setTargetElement(element);
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      setRetryCount(0);
      
      const behavior = isMobile ? 'auto' : 'smooth';
      
      // Only scroll if not targeting body
      if (element !== document.body) {
        element.scrollIntoView({ 
          behavior, 
          block: 'center', 
          inline: 'center' 
        });
      }
    } else {
      // Element not found, retry with a delay
      if (retryCount < 10) { // Max 10 retries (5 seconds)
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 500);
      } else {
        // If we can't find the element after retries, show tour on body
        console.warn(`Tour target not found: ${state.activeTour?.steps[state.currentStepIndex]?.target}`);
        setTargetElement(document.body);
        const rect = document.body.getBoundingClientRect();
        setTargetRect(rect);
        setRetryCount(0);
      }
    }
  }, [findTargetElement, isMobile, retryCount, state.activeTour, state.currentStepIndex]);

  // Auto-close drawer when tour starts
  useEffect(() => {
    if (state.isRunning && (isMobile || isTablet)) {
      // Small delay to ensure drawer is fully rendered before attempting to close
      const timer = setTimeout(() => {
        closeMobileDrawer();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [state.isRunning, isMobile, isTablet, closeMobileDrawer]);

  useEffect(() => {
    updateTargetRect();
  }, [updateTargetRect]);

  useEffect(() => {
    const handleResize = () => {
      updateTargetRect();
    };

    const handleScroll = () => {
      if (targetElement && targetElement !== document.body) {
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

  // Handle navigation for template builder tour step 3
  const handleTourNavigation = useCallback(() => {
    if (state.activeTour?.id === 'template-builder-tour' && state.isRunning) {
      const currentStep = state.activeTour.steps[state.currentStepIndex];
      
      if (currentStep?.id === 'visit-type-selection') {
        // Find the first visit type card and click it
        const visitTypeCard = document.querySelector('[data-tour-id="visit-type-selection"] .MuiCard-root');
        if (visitTypeCard) {
          console.log('Template builder tour: Clicking first visit type card');
          (visitTypeCard as HTMLElement).click();
          return true;
        }
      }
    }
    return false;
  }, [state.activeTour, state.currentStepIndex, state.isRunning]);

  if (!state.isRunning || !state.activeTour) {
    return null;
  }

  const currentStep = state.activeTour.steps[state.currentStepIndex];
  if (!currentStep || !targetElement || !targetRect) {
    return null;
  }

  const spotlightPadding = isMobile ? 8 : isTablet ? 10 : 12;
  const overlayZIndex = 9999;
  const tooltipZIndex = 10001;

  return createPortal(
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: overlayZIndex,
        pointerEvents: 'none'
      }}
    >
      {/* Backdrop with spotlight effect */}
      <Backdrop
        open={true}
        sx={{
          zIndex: overlayZIndex,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          pointerEvents: currentStep.spotlightClicks ? 'none' : 'auto'
        }}
      />
      
      {/* Spotlight cutout - don't show for body target */}
      {targetElement !== document.body && (
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
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6)`,
            pointerEvents: 'none',
            zIndex: overlayZIndex + 1
          }}
        />
      )}

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
        drawerOpen={false}
        customZIndex={tooltipZIndex}
        onCustomNavigation={handleTourNavigation}
      />
    </Box>,
    document.body
  );
};
