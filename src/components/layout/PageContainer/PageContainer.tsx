
import React from 'react';
import { Container, ContainerProps } from '@mui/material';

interface PageContainerProps extends ContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  sx,
  ...props
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        py: { xs: 2, md: 3 },
        px: { xs: 2, md: 3 },
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};
