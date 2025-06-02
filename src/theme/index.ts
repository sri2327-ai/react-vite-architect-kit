
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { components } from './components';

const baseThemeOptions: Omit<ThemeOptions, 'palette'> = {
  typography,
  components,
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
};

export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: lightPalette,
});

export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: darkPalette,
});

// Default theme (light)
export const theme = lightTheme;
export type CustomTheme = typeof lightTheme;

// Export colors for use in components
export { bravoColors } from './colors';
