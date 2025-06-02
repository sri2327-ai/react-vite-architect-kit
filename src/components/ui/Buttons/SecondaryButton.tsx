
import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { bravoColors } from '@/theme/colors';

export const SecondaryButton: React.FC<ButtonProps> = ({ children, sx, ...props }) => {
  return (
    <Button
      variant="outlined"
      sx={{
        borderColor: bravoColors.primary,
        color: bravoColors.primary,
        fontWeight: 600,
        borderRadius: 2,
        textTransform: 'none',
        borderWidth: 2,
        '&:hover': {
          borderColor: bravoColors.secondary,
          backgroundColor: bravoColors.background.light,
          borderWidth: 2,
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
