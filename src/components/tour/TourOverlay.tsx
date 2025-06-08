
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Box, Backdrop, useTheme, useMediaQuery, Paper, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTour } from '@/contexts/TourContext';
import { TourTooltip } from './TourTooltip';

interface TourOverlayProps {
  children?: React.ReactNode;
}

export const TourOverlay: React.FC<TourOverlayProps> = () => {
  const { state, endTour } = useTour();
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

    const isSelector = currentStep.target.startsWith('[') || currentStep.target.startsWith('.') || currentStep.target.startsWith('#') || currentStep.target.includes(' ');
    
    let element: HTMLElement | null = null;
    
    if (isSelector) {
      element = document.querySelector(currentStep.target) as HTMLElement;
    } else {
      element = document.querySelector(`[data-tour-id="${currentStep.target}"]`) as HTMLElement;
    }
    
    return element;
  }, [state.activeTour, state.currentStepIndex, state.isRunning]);

  const checkDrawerState = useCallback(() => {
    if (!isMobile && !isTablet) {
      setDrawerOpen(false);
      return;
    }

    const mobileDrawer = document.querySelector('.MuiDrawer-root .MuiBackdrop-root');
    const drawerPaper = document.querySelector('.MuiDrawer-root[style*="visibility: visible"]');
    const isOpen = !!(mobileDrawer || drawerPaper);
    
    setDrawerOpen(isOpen);
  }, [isMobile, isTablet]);

  const updateTargetRect = useCallback(() => {
    const element = findTargetElement();
    setTargetElement(element);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      
      // Don't auto-scroll when drawer is open to avoid conflicts
      if (!drawerOpen) {
        const behavior = isMobile ? 'auto' : 'smooth';
        element.scrollIntoView({ 
          behavior, 
          block: 'center', 
          inline: 'center' 
        });
      }
    }
  }, [findTargetElement, isMobile, drawerOpen]);

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
      if (targetElement && !drawerOpen) {
        const rect = targetElement.getBoundingClientRect();
        setTargetRect(rect);
      }
    };

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
  }, [targetElement, updateTargetRect, checkDrawerState, drawerOpen]);

  if (!state.isRunning || !state.activeTour) {
    return null;
  }

  const currentStep = state.activeTour.steps[state.currentStepIndex];
  if (!currentStep) return null;

  // For mobile/tablet with drawer open, use a simple notification approach
  if ((isMobile || isTablet) && drawerOpen) {
    return createPortal(
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1400, // Higher than drawer
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: 3,
          px: 2
        }}
      >
        <Paper
          elevation={8}
          sx={{
            pointerEvents: 'auto',
            maxWidth: 340,
            width: '100%',
            p: 2.5,
            borderRadius: 3,
            backgroundColor: 'background.paper',
            border: '2px solid',
            borderColor: 'primary.main',
            boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
            animation: 'slideInDown 0.3s ease-out'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', flex: 1, pr: 1 }}>
              {currentStep.title}
            </Typography>
            <IconButton
              size="small"
              onClick={endTour}
              sx={{ 
                mt: -0.5,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' }
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.5 }}>
            {currentStep.content}
          </Typography>

          <Typography variant="caption" sx={{ 
            color: 'primary.main', 
            fontWeight: 600,
            display: 'block',
            textAlign: 'center',
            p: 1,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 1
          }}>
            Step {state.currentStepIndex + 1} of {state.activeTour.steps.length} - Look for the highlighted item in the menu
          </Typography>
        </Paper>
      </Box>,
      document.body
    );
  }

  // For desktop or mobile/tablet without drawer, use the normal spotlight approach
  if (!targetElement || !targetRect) {
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
          boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6)`,
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
        drawerOpen={false}
        customZIndex={tooltipZIndex}
      />
    </Box>,
    document.body
  );
};
