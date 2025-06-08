
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Box, Backdrop, useTheme } from '@mui/material';
import { useTour } from '@/contexts/TourContext';
import { TourTooltip } from './TourTooltip';
import { useResponsive } from '@/hooks/useResponsive';

interface TourOverlayProps {
  children?: React.ReactNode;
}

export const TourOverlay: React.FC<TourOverlayProps> = () => {
  const { state, endTour } = useTour();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const theme = useTheme();
  const { isMobile, isTablet } = useResponsive();

  const findTargetElement = useCallback(() => {
    if (!state.activeTour || !state.isRunning) return null;
    
    const currentStep = state.activeTour.steps[state.currentStepIndex];
    if (!currentStep) return null;

    console.log('Looking for target:', currentStep.target);

    // Special handling for body target (used for screen transitions)
    if (currentStep.target === 'body') {
      return document.body;
    }

    if (!currentStep.target) {
      console.warn('Step target is undefined:', currentStep);
      return document.body;
    }

    // Wait for DOM to be ready
    if (document.readyState !== 'complete') {
      return null;
    }

    const isSelector = currentStep.target.startsWith('[') || 
                     currentStep.target.startsWith('.') || 
                     currentStep.target.startsWith('#') || 
                     currentStep.target.includes(' ');
    
    let element: HTMLElement | null = null;
    
    if (isSelector) {
      element = document.querySelector(currentStep.target) as HTMLElement;
    } else {
      element = document.querySelector(`[data-tour-id="${currentStep.target}"]`) as HTMLElement;
    }
    
    console.log('Found element:', element);
    return element;
  }, [state.activeTour, state.currentStepIndex, state.isRunning]);

  const updateTargetRect = useCallback(() => {
    const element = findTargetElement();
    
    if (element) {
      setTargetElement(element);
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      setRetryCount(0);
      
      // Only scroll if not targeting body and element is not in viewport
      if (element !== document.body) {
        const isInViewport = rect.top >= 0 && 
                            rect.left >= 0 && 
                            rect.bottom <= window.innerHeight && 
                            rect.right <= window.innerWidth;
        
        if (!isInViewport) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center', 
            inline: 'center' 
          });
        }
      }
    } else {
      // Element not found, retry with increasing delays
      if (retryCount < 5) {
        const delay = Math.min(1000, 200 * (retryCount + 1));
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, delay);
      } else {
        // If we can't find the element after retries, use body as fallback
        console.warn(`Tour target not found after retries, using body fallback: ${state.activeTour?.steps[state.currentStepIndex]?.target}`);
        setTargetElement(document.body);
        const rect = document.body.getBoundingClientRect();
        setTargetRect(rect);
        setRetryCount(0);
      }
    }
  }, [findTargetElement, retryCount, state.activeTour, state.currentStepIndex]);

  // Auto-close drawer when tour starts
  useEffect(() => {
    if (state.isRunning && (isMobile || isTablet)) {
      const timer = setTimeout(() => {
        // Close mobile drawer
        const mobileDrawerBackdrop = document.querySelector('.MuiDrawer-root .MuiBackdrop-root') as HTMLElement;
        if (mobileDrawerBackdrop) {
          mobileDrawerBackdrop.click();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [state.isRunning, isMobile, isTablet]);

  useEffect(() => {
    // Wait for DOM to be ready before finding targets
    if (document.readyState === 'complete') {
      updateTargetRect();
    } else {
      const timer = setTimeout(updateTargetRect, 100);
      return () => clearTimeout(timer);
    }
  }, [updateTargetRect]);

  useEffect(() => {
    const handleResize = () => {
      if (targetElement && targetElement !== document.body) {
        const rect = targetElement.getBoundingClientRect();
        setTargetRect(rect);
      }
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
  }, [targetElement]);

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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          pointerEvents: 'auto'
        }}
        onClick={() => {
          // Allow backdrop clicks to close tour only if allowSkip is true
          if (state.activeTour?.allowSkip) {
            endTour();
          }
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
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5)`,
            pointerEvents: currentStep.spotlightClicks ? 'none' : 'auto',
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
      />
    </Box>,
    document.body
  );
};
