
import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface SecondaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  variant = 'outlined',
  color = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
};
