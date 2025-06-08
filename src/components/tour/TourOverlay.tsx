
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
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
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

  // Check if mobile drawer is open
  const checkDrawerState = useCallback(() => {
    if (!isMobile) {
      setDrawerOpen(false);
      return;
    }

    // Check if the mobile drawer is open by looking for the backdrop or drawer element
    const mobileDrawer = document.querySelector('.MuiDrawer-root .MuiBackdrop-root');
    const drawerPaper = document.querySelector('.MuiDrawer-root[style*="visibility: visible"]');
    const isOpen = !!(mobileDrawer || drawerPaper);
    
    setDrawerOpen(isOpen);
  }, [isMobile]);

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
    checkDrawerState();
  }, [updateTargetRect, checkDrawerState]);

  useEffect(() => {
    const handleResize = () => {
      updateTargetRect();
      checkDrawerState();
    };

    const handleScroll = () => {
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetRect(rect);
      }
    };

    // Listen for drawer state changes
    const handleMutation = () => {
      checkDrawerState();
    };

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      observer.disconnect();
    };
  }, [targetElement, updateTargetRect, checkDrawerState]);

  // Close mobile drawer when tour starts if it's open
  useEffect(() => {
    if (state.isRunning && drawerOpen && isMobile) {
      // Try to close the drawer by clicking the backdrop or close button
      const backdrop = document.querySelector('.MuiDrawer-root .MuiBackdrop-root') as HTMLElement;
      const closeButton = document.querySelector('[data-testid="mobile-close-button"]') as HTMLElement;
      
      if (backdrop) {
        backdrop.click();
      } else if (closeButton) {
        closeButton.click();
      }
    }
  }, [state.isRunning, drawerOpen, isMobile]);

  if (!state.isRunning || !state.activeTour || !targetElement || !targetRect) {
    return null;
  }

  const currentStep = state.activeTour.steps[state.currentStepIndex];
  if (!currentStep) return null;

  // Responsive spotlight padding
  const spotlightPadding = isMobile ? 8 : isTablet ? 10 : 12;

  // Adjust z-index based on drawer state
  const overlayZIndex = drawerOpen ? 1350 : 9999; // Higher than drawer's z-index (1300)
  const tooltipZIndex = drawerOpen ? 1351 : 10001;

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
          backgroundColor: drawerOpen ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
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
          boxShadow: `0 0 0 ${isMobile ? '9999px' : '9999px'} ${drawerOpen ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'}`,
          pointerEvents: 'none',
          zIndex: overlayZIndex + 1
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
        drawerOpen={drawerOpen}
        customZIndex={tooltipZIndex}
      />
    </Box>,
    document.body
  );
};
