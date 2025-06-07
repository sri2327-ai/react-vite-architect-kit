
import React, { useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Container } from '@mui/material';
import TemplateLibraryTab from './TemplateLibraryTab';
import MyTemplatesTab from './MyTemplatesTab';

interface TemplateBuilderProps {
  activeTab?: 'my-templates' | 'template-library';
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ activeTab = 'my-templates' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="xl" sx={{
      py: {
        xs: 2,
        sm: 3,
        md: 4
      },
      px: {
        xs: 1,
        sm: 2,
        md: 3
      }
    }}>
      <Box sx={{
        mb: {
          xs: 2,
          sm: 3,
          md: 4
        }
      }}>
        <Typography variant="h4" component="h1" sx={{
          fontSize: {
            xs: '1.5rem',
            sm: '2rem',
            md: '2.25rem'
          },
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1,
          textAlign: 'center'
        }}>
          {activeTab === 'my-templates' ? 'My Templates' : 'Template Library'}
        </Typography>
        <Typography variant="body1" sx={{
          fontSize: {
            xs: '0.875rem',
            sm: '1rem'
          },
          color: theme.palette.text.secondary,
          textAlign: 'center',
          maxWidth: '600px',
          mx: 'auto'
        }}>
          {activeTab === 'my-templates' 
            ? 'Create, edit, and manage your custom templates'
            : 'Browse and import pre-built templates from our library'
          }
        </Typography>
      </Box>

      {activeTab === 'my-templates' ? (
        <MyTemplatesTab />
      ) : (
        <TemplateLibraryTab />
      )}
    </Container>
  );
};

export default TemplateBuilder;
