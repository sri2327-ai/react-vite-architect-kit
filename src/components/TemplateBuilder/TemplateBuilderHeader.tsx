
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
  const { isMobileView } = useResponsive();

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: showBackButton ? 'flex-start' : { xs: 'center', sm: 'center', md: 'flex-start' },
      px: { xs: 1, sm: 2, md: 3 },
      py: { xs: 1.5, sm: 2, md: 2.5 },
      borderBottom: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
      position: 'relative'
    }}>
      {showBackButton && (
        <IconButton
          onClick={onBack}
          sx={{
            mr: { xs: 1, sm: 2 },
            p: { xs: 0.5, sm: 1 }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
          textAlign: { xs: 'center', sm: 'center', md: showBackButton ? 'left' : 'center' },
          flex: showBackButton ? 1 : 'none',
          color: 'text.primary'
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default TemplateBuilderHeader;
