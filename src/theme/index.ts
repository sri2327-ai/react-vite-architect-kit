
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { components } from './components';

const themeOptions: ThemeOptions = {
  palette,
  typography,
  components,
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
};

export const theme = createTheme(themeOptions);
export type CustomTheme = typeof theme;
