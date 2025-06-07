
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
  onCreateVisitType?: () => void;
  templateCount?: number;
}

const MyTemplatesNavBar: React.FC<MyTemplatesNavBarProps> = ({
  currentStep,
  selectedVisitType,
  onCreateTemplate,
  onBackToVisitTypes,
  onCreateVisitType,
  templateCount = 0
}) => {
  const theme = useTheme();
  const { isMobile } = useResponsive();

  return (
    <Paper
      elevation={1}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        p: { xs: 1.5, sm: 2 },
        mb: { xs: 2, sm: 2.5 },
        border: '1px solid',
        borderColor: 'divider',
        maxWidth: { xs: '100%', sm: '800px', md: '900px' },
        mx: 'auto'
      }}
    >
      {/* Compact Header */}
      <Box sx={{ mb: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: bravoColors.primaryFlat,
            fontWeight: 600,
            mb: 0.25,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Template Workflow
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
        >
          {currentStep === 'visit-types' 
            ? 'Choose a visit type to manage templates'
            : `Managing templates for ${selectedVisitType}`
          }
        </Typography>
      </Box>

      {/* Compact Workflow Steps */}
      <Box sx={{ mb: 1.5 }}>
        <Stepper 
          activeStep={currentStep === 'visit-types' ? 0 : 1} 
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{
            '& .MuiStepLabel-root': {
              cursor: 'pointer',
              '& .MuiStepLabel-labelContainer': {
                maxWidth: 'none'
              }
            },
            '& .MuiStep-root': {
              padding: { xs: '4px 0', sm: '6px' }
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CategoryIcon fontSize="small" />
                <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.8rem' }}>
                  Visit Type
                </Typography>
              </Box>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AssignmentIcon fontSize="small" />
                <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.8rem' }}>
                  Templates
                </Typography>
                {currentStep === 'templates' && (
                  <Chip
                    label={`${templateCount}`}
                    size="small"
                    sx={{
                      backgroundColor: `${bravoColors.primaryFlat}15`,
                      color: bravoColors.primaryFlat,
                      fontSize: '0.65rem',
                      height: 16,
                      ml: 0.5
                    }}
                  />
                )}
              </Box>
            </StepLabel>
          </Step>
        </Stepper>
      </Box>

      {/* Compact Status & Actions */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 1, sm: 1.5 },
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Current Status */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {currentStep === 'visit-types' ? (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: bravoColors.primaryFlat,
                  mb: 0.25,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' }
                }}
              >
                Choose a Visit Type
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'block' }}
              >
                Select to view and manage templates
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={onBackToVisitTypes}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#000000',
                    color: '#FFFFFF',
                    backgroundColor: '#000000',
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    borderWidth: 1,
                    '&:hover': {
                      borderColor: '#333333',
                      backgroundColor: '#333333',
                      color: '#FFFFFF'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Back
                </Button>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: bravoColors.primaryFlat,
                  mb: 0.25,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  display: 'block'
                }}
              >
                {selectedVisitType}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'block' }}
              >
                {templateCount === 0 
                  ? 'No templates yet. Create your first template.'
                  : `${templateCount} template${templateCount !== 1 ? 's' : ''} available.`
                }
              </Typography>
            </Box>
          )}
        </Box>

        {/* Single Action Button */}
        <Box sx={{ 
          display: 'flex', 
          minWidth: { xs: '100%', sm: 'auto' }
        }}>
          {currentStep === 'visit-types' ? (
            onCreateVisitType && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onCreateVisitType}
                size="small"
                sx={{
                  backgroundColor: bravoColors.primaryFlat,
                  borderRadius: 1.5,
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 0.75, sm: 1 },
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  minWidth: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    backgroundColor: bravoColors.secondary,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 16px ${bravoColors.secondary}50`
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Add Visit Type
              </Button>
            )
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateTemplate}
              size="small"
              sx={{
                backgroundColor: bravoColors.primaryFlat,
                borderRadius: 1.5,
                px: { xs: 2, sm: 2.5 },
                py: { xs: 0.75, sm: 1 },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                boxShadow: `0 2px 12px ${bravoColors.primaryFlat}40`,
                minWidth: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  backgroundColor: bravoColors.secondary,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 16px ${bravoColors.secondary}50`
                },
                transition: 'all 0.2s ease'
              }}
            >
              Create Template
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default MyTemplatesNavBar;
