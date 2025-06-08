
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useResponsive } from '@/hooks/useResponsive';

interface TemplateBuilderHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const TemplateBuilderHeader: React.FC<TemplateBuilderHeaderProps> = ({
  title,
  onBack,
  showBackButton = false
}) => {
  const { isMobile, isTablet, isMobileView } = useResponsive();

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: showBackButton ? 'flex-start' : { xs: 'center', sm: 'center', md: 'flex-start' },
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, sm: 2.5, md: 3 },
      borderBottom: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
      position: 'relative',
      minHeight: { xs: 56, sm: 64, md: 72 },
      width: '100%',
      flexShrink: 0
    }}>
      {showBackButton && (
        <IconButton
          onClick={onBack}
          sx={{
            mr: { xs: 1.5, sm: 2, md: 2.5 },
            p: { xs: 1, sm: 1.25, md: 1.5 },
            minWidth: { xs: 40, sm: 44, md: 48 },
            minHeight: { xs: 40, sm: 44, md: 48 },
            backgroundColor: { xs: 'action.hover', sm: 'transparent' },
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
          size={isMobile ? 'small' : 'medium'}
        >
          <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24, md: 24 } }} />
        </IconButton>
      )}
      
      <Typography
        variant={isMobile ? 'h6' : isTablet ? 'h5' : 'h4'}
        component="h1"
        sx={{
          fontWeight: 600,
          fontSize: { 
            xs: '1.1rem', 
            sm: '1.35rem', 
            md: '1.75rem',
            lg: '2rem'
          },
          textAlign: { 
            xs: showBackButton ? 'left' : 'center', 
            sm: showBackButton ? 'left' : 'center', 
            md: showBackButton ? 'left' : 'center' 
          },
          flex: showBackButton ? 1 : 'none',
          color: 'text.primary',
          lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: { xs: 'nowrap', sm: 'normal' },
          wordBreak: { xs: 'keep-all', sm: 'break-word' }
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default TemplateBuilderHeader;
