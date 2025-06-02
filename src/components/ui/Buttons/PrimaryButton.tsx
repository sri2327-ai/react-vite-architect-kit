
import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { bravoColors } from '@/theme/colors';

export const PrimaryButton: React.FC<ButtonProps> = ({ children, sx, ...props }) => {
  return (
    <Button
      variant="contained"
      sx={{
        background: bravoColors.button.gradient,
        color: bravoColors.text.white,
        fontWeight: 600,
        borderRadius: 2,
        textTransform: 'none',
        boxShadow: '0 4px 12px rgba(20, 49, 81, 0.25)',
        '&:hover': {
          background: bravoColors.button.hover,
          boxShadow: '0 6px 20px rgba(20, 49, 81, 0.35)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0px)',
        },
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
