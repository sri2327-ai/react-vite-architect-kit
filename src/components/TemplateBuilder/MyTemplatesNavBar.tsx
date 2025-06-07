
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Chip,
  useTheme,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepConnector
} from '@mui/material';
import {
  Add as AddIcon,
  Category as CategoryIcon,
  NavigateNext as NavigateNextIcon,
  Assignment as AssignmentIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { useResponsive } from '@/hooks/useResponsive';

interface MyTemplatesNavBarProps {
  currentStep: 'visit-types' | 'templates';
  selectedVisitType?: string | null;
  onCreateTemplate: () => void;
  onBackToVisitTypes?: () => void;
  templateCount?: number;
}

const MyTemplatesNavBar: React.FC<MyTemplatesNavBarProps> = ({
  currentStep,
  selectedVisitType,
  onCreateTemplate,
  onBackToVisitTypes,
  templateCount = 0
}) => {
  const theme = useTheme();
  const { isMobile } = useResponsive();

  return (
    <Paper
      elevation={1}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 3,
        p: { xs: 3, sm: 4 },
        mb: { xs: 3, sm: 4 },
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: bravoColors.primaryFlat,
            fontWeight: 600,
            mb: 1,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Template Management Workflow
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
        >
          {currentStep === 'visit-types' 
            ? 'Step 1: Choose a visit type to manage its templates'
            : `Step 2: Manage templates for ${selectedVisitType}`
          }
        </Typography>
      </Box>

      {/* Workflow Steps */}
      <Box sx={{ mb: 3 }}>
        <Stepper 
          activeStep={currentStep === 'visit-types' ? 0 : 1} 
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{
            '& .MuiStepLabel-root': {
              cursor: 'pointer'
            }
          }}
        >
          <Step>
            <StepLabel
              onClick={currentStep === 'templates' ? onBackToVisitTypes : undefined}
              sx={{
                cursor: currentStep === 'templates' ? 'pointer' : 'default',
                '&:hover': currentStep === 'templates' ? {
                  '& .MuiStepLabel-label': {
                    color: bravoColors.primaryFlat
                  }
                } : {}
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>
                  Select Visit Type
                </Typography>
              </Box>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>
                  Manage Templates
                </Typography>
                {currentStep === 'templates' && (
                  <Chip
                    label={`${templateCount} template${templateCount !== 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                      backgroundColor: `${bravoColors.primaryFlat}15`,
                      color: bravoColors.primaryFlat,
                      fontSize: '0.7rem',
                      height: 20,
                      ml: 1
                    }}
                  />
                )}
              </Box>
            </StepLabel>
          </Step>
        </Stepper>
      </Box>

      {/* Current Status & Actions */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2, sm: 3 },
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Current Status */}
        <Box sx={{ flex: 1 }}>
          {currentStep === 'visit-types' ? (
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: bravoColors.primaryFlat,
                  mb: 0.5,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Choose a Visit Type
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Select from your existing visit types to view and manage their templates
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={onBackToVisitTypes}
                  size="small"
                  sx={{
                    color: bravoColors.primaryFlat,
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: 1,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                >
                  Back to Visit Types
                </Button>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: bravoColors.primaryFlat,
                  mb: 0.5,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Managing: {selectedVisitType}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {templateCount === 0 
                  ? 'No templates yet. Create your first template to get started.'
                  : `You have ${templateCount} template${templateCount !== 1 ? 's' : ''} for this visit type.`
                }
              </Typography>
            </Box>
          )}
        </Box>

        {/* Create Template Action */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateTemplate}
          disabled={currentStep === 'visit-types'}
          sx={{
            backgroundColor: bravoColors.primaryFlat,
            borderRadius: 2,
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            boxShadow: currentStep === 'templates' ? `0 4px 20px ${bravoColors.primaryFlat}40` : 'none',
            minWidth: { xs: '100%', sm: 'auto' },
            '&:hover': {
              backgroundColor: bravoColors.secondary,
              transform: currentStep === 'templates' ? 'translateY(-2px)' : 'none',
              boxShadow: currentStep === 'templates' ? `0 6px 25px ${bravoColors.secondary}50` : 'none'
            },
            '&:disabled': {
              backgroundColor: 'action.disabled',
              color: 'text.disabled'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {currentStep === 'visit-types' ? 'Select Visit Type First' : 'Create New Template'}
        </Button>
      </Box>
    </Paper>
  );
};

export default MyTemplatesNavBar;
