
import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = 'contained',
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
