
import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const isTabletView = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktopView = useMediaQuery(theme.breakpoints.up('md'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileView,
    isTabletView,
    isDesktopView,
  };
};
