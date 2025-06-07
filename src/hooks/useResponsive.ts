
import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const isTabletView = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktopView = useMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileView,
    isTabletView,
    isDesktopView,
  };
};
