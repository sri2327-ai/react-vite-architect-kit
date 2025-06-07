
import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

interface TemplateBuilderHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

const TemplateBuilderHeader: React.FC<TemplateBuilderHeaderProps> = ({
  title,
  onBack,
  showBackButton = false,
  children
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1.5, sm: 2 },
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 },
        minHeight: { xs: 64, sm: 72, md: 80 },
        ml: { xs: showBackButton ? 7 : 0, md: 0 }, // Offset for mobile menu button
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      {showBackButton && (
        <IconButton 
          onClick={onBack}
          size={isMobile ? 'small' : 'medium'}
          sx={{ 
            color: bravoColors.primaryFlat,
            flexShrink: 0,
            '&:hover': {
              backgroundColor: `${bravoColors.primaryFlat}10`
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      
      <Typography 
        variant={isMobile ? "h6" : "h5"}
        sx={{ 
          color: bravoColors.primaryFlat, 
          fontWeight: 700,
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
          lineHeight: 1.2,
          wordBreak: 'break-word',
          flex: 1,
          minWidth: 0
        }}
      >
        {title}
      </Typography>
      
      {children && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 1.5 },
          flexShrink: 0
        }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default TemplateBuilderHeader;
