
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Chip,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Category as CategoryIcon,
  NavigateNext as NavigateNextIcon
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
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        py: { xs: 2, sm: 3 },
        mb: { xs: 3, sm: 4 }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2, sm: 3 }
        }}
      >
        {/* Breadcrumb Navigation */}
        <Box sx={{ flex: 1 }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{
              '& .MuiBreadcrumbs-separator': {
                color: 'text.secondary'
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: currentStep === 'templates' ? 'pointer' : 'default',
                color: currentStep === 'visit-types' ? bravoColors.primaryFlat : 'text.secondary',
                '&:hover': currentStep === 'templates' ? {
                  color: bravoColors.primaryFlat
                } : {}
              }}
              onClick={currentStep === 'templates' ? onBackToVisitTypes : undefined}
            >
              <CategoryIcon fontSize="small" />
              <Typography
                variant="body1"
                sx={{
                  fontWeight: currentStep === 'visit-types' ? 600 : 400,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Visit Types
              </Typography>
            </Box>

            {currentStep === 'templates' && selectedVisitType && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: bravoColors.primaryFlat,
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  {selectedVisitType}
                </Typography>
                <Chip
                  label={`${templateCount} template${templateCount !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{
                    backgroundColor: `${bravoColors.primaryFlat}20`,
                    color: bravoColors.primaryFlat,
                    fontSize: '0.75rem',
                    height: 24
                  }}
                />
              </Box>
            )}
          </Breadcrumbs>

          {/* Secondary Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            {currentStep === 'visit-types'
              ? 'Select a visit type to view and manage its templates'
              : `Manage templates for ${selectedVisitType || 'this visit type'}`}
          </Typography>
        </Box>

        {/* Create Template Action */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateTemplate}
          sx={{
            backgroundColor: bravoColors.primaryFlat,
            borderRadius: 3,
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            boxShadow: `0 4px 20px ${bravoColors.primaryFlat}40`,
            minWidth: { xs: '100%', sm: 'auto' },
            '&:hover': {
              backgroundColor: bravoColors.secondary,
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 25px ${bravoColors.secondary}50`
            },
            '&:disabled': {
              backgroundColor: 'action.disabled',
              color: 'text.disabled'
            },
            transition: 'all 0.3s ease'
          }}
          disabled={currentStep === 'visit-types'}
        >
          Create Template
        </Button>
      </Box>

      {/* Progress Indicator */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 2,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: currentStep === 'visit-types' ? bravoColors.primaryFlat : 'action.disabled'
          }}
        />
        <Box
          sx={{
            flex: 1,
            height: 2,
            backgroundColor: 'divider',
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: currentStep === 'templates' ? '100%' : '0%',
              backgroundColor: bravoColors.primaryFlat,
              borderRadius: 1,
              transition: 'width 0.3s ease'
            }}
          />
        </Box>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: currentStep === 'templates' ? bravoColors.primaryFlat : 'action.disabled'
          }}
        />
      </Box>
    </Box>
  );
};

export default MyTemplatesNavBar;
