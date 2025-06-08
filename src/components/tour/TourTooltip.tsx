import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  useTheme,
  Card,
  CardContent
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Assignment as TemplateIcon,
  AccountTree as WorkflowIcon,
  Login as LoginIcon,
  MenuBook as GuideIcon
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

  const navigateToSection = (sectionId: string) => {
    console.log(`Tour: Navigating to section ${sectionId}`);
    
    // Find and click the navigation element
    const navSelectors = [
      `[data-tour-id="nav-${sectionId}"]`,
      `[data-tour-id="${sectionId}"]`,
      `button:contains("${sectionId}")`,
      `[aria-label*="${sectionId}"]`
    ];
    
    for (const selector of navSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`Found nav element with selector: ${selector}`);
        (element as HTMLElement).click();
        return true;
      }
    }
    
    return false;
  };

  const handleNext = () => {
    const tourId = state.activeTour?.id;
    console.log(`Tour: Handling next step for tour ${tourId}, step ${step.id}`);
    
    // Handle special navigation steps
    if (tourId === 'template-builder-tour') {
      if (step.id === 'template-overview') {
        // Navigate to template builder section
        navigateToSection('templates');
        setTimeout(() => nextStep(), 1000);
        return;
      }
      
      if (step.id === 'visit-type-selection') {
        // Auto-select first visit type
        setTimeout(() => {
          const visitTypeCard = document.querySelector('.visit-type-card') ||
                               document.querySelector('.MuiCard-root');
          if (visitTypeCard) {
            console.log('Auto-selecting visit type');
            (visitTypeCard as HTMLElement).click();
          }
          setTimeout(() => nextStep(), 1500);
        }, 500);
        return;
      }

      if (step.id === 'edit-template') {
        // Auto-click edit button
        setTimeout(() => {
          const editButton = document.querySelector('[data-testid="edit-template-button"]') ||
                           document.querySelector('[aria-label*="edit"]') ||
                           document.querySelector('button[title*="Edit"]');
          if (editButton) {
            console.log('Auto-clicking edit template');
            (editButton as HTMLElement).click();
          }
          setTimeout(() => nextStep(), 1500);
        }, 500);
        return;
      }
    }
    
    if (tourId === 'workflow-builder-tour') {
      if (step.id === 'workflow-overview') {
        // Navigate to workflow builder section
        navigateToSection('workflows');
        setTimeout(() => nextStep(), 1000);
        return;
      }
      
      if (step.id === 'workflow-library-switch') {
        // Auto-switch to library tab
        setTimeout(() => {
          const libraryTab = document.querySelector('[role="tab"]:last-child') ||
                           document.querySelector('[aria-label*="library"]');
          if (libraryTab) {
            console.log('Auto-switching to library tab');
            (libraryTab as HTMLElement).click();
          }
          setTimeout(() => nextStep(), 500);
        }, 500);
        return;
      }
    }
    
    if (tourId === 'welcome-tour') {
      // For welcome tour, just proceed without navigation
      if (['template-builder', 'workflow-builder', 'profile-settings'].includes(step.id)) {
        console.log('Welcome tour: Proceeding without navigation');
        setTimeout(() => nextStep(), 500);
        return;
      }
    }

    // Default next step
    console.log('Tour: Proceeding to next step');
    nextStep();
  };

  const renderQuickStartGuide = () => {
    if (step.id !== 'quick-start-guide') return null;

    const quickLinks = [
      {
        title: 'Setup Workflows',
        description: 'Configure automated clinical workflows',
        icon: <WorkflowIcon />,
        action: () => navigateToSection('workflows')
      },
      {
        title: 'Build Templates',
        description: 'Create clinical note templates',
        icon: <TemplateIcon />,
        action: () => navigateToSection('templates')
      },
      {
        title: 'Access S10.AI',
        description: 'Login to your account',
        icon: <LoginIcon />,
        action: () => window.open('https://s10.ai', '_blank')
      },
      {
        title: 'View Documentation',
        description: 'Browse help guides and tutorials',
        icon: <GuideIcon />,
        action: () => window.open('https://docs.s10.ai', '_blank')
      }
    ];

    return (
      <Box sx={{ mt: 1.5, mb: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)'
            },
            gap: { xs: 1, sm: 1.5 },
            width: '100%'
          }}
        >
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                height: 'fit-content',
                minHeight: { xs: 'auto', sm: '90px' },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
              onClick={link.action}
            >
              <CardContent 
                sx={{ 
                  p: { xs: 1, sm: 1.5 }, 
                  textAlign: 'center',
                  '&:last-child': { pb: { xs: 1, sm: 1.5 } }
                }}
              >
                <Box sx={{ 
                  color: 'primary.main', 
                  mb: { xs: 0.5, sm: 0.5 },
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {React.cloneElement(link.icon, {
                    sx: { fontSize: { xs: 18, sm: 22 } }
                  })}
                </Box>
                <Typography 
                  variant="caption" 
                  fontWeight={600} 
                  display="block"
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    lineHeight: 1.2,
                    mb: { xs: 0.25, sm: 0.5 }
                  }}
                >
                  {link.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.65rem' },
                    lineHeight: 1.2,
                    display: { xs: 'block', sm: 'block' }
                  }}
                >
                  {link.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  };

  const getTooltipPosition = () => {
    const tooltipWidth = isMobile ? Math.min(320, window.innerWidth - 32) : 
                       isTablet ? Math.min(400, window.innerWidth - 32) : 450;
    const tooltipHeight = step.id === 'quick-start-guide' ? 
                         (isMobile ? 420 : isTablet ? 400 : 450) : 280;
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
      
      // Special handling for quick start guide on mobile
      if (step.id === 'quick-start-guide') {
        // Center vertically with more space for buttons
        const availableHeight = viewportHeight - 100; // Leave space for system UI
        top = Math.max(20, (availableHeight - tooltipHeight) / 2);
      } else if (targetRect.bottom + tooltipHeight + padding > viewportHeight - 50) {
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
        p: isMobile ? 2 : 2.5,
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
        mb: isMobile ? 1.5 : 2 
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
        <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
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
          mb: isMobile ? 2 : 2.5, 
          lineHeight: 1.6,
          fontSize: isMobile ? '0.9rem' : '0.95rem'
        }}
      >
        {step.content}
      </Typography>

      {/* Quick Start Guide */}
      {renderQuickStartGuide()}

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
