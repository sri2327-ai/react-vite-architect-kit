
import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Grid2 } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  return (
    <Box sx={{ mb: { xs: 2, md: 3 } }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 1 }}
          aria-label="breadcrumb"
        >
          {breadcrumbs.map((item, index) => (
            <Link
              key={index}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
              href={item.href}
              underline="hover"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              {item.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}
      
      <Grid2 container spacing={2} alignItems="flex-start">
        <Grid2 xs={12} md={actions ? 8 : 12}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              {subtitle}
            </Typography>
          )}
        </Grid2>
        
        {actions && (
          <Grid2 xs={12} md={4}>
            <Box 
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                mt: { xs: 2, md: 0 },
              }}
            >
              {actions}
            </Box>
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
};
