
import { PaletteOptions } from '@mui/material/styles';
import { bravoColors } from './colors';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: bravoColors.primary,
    light: bravoColors.secondary,
    dark: bravoColors.background.dark,
  },
  secondary: {
    main: bravoColors.secondary,
    light: bravoColors.tertiary,
    dark: bravoColors.background.dark,
  },
  background: {
    default: bravoColors.background.white,
    paper: bravoColors.background.light,
  },
  text: {
    primary: bravoColors.text.primary,
    secondary: bravoColors.text.secondary,
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: bravoColors.tertiary,
    light: bravoColors.secondary,
    dark: bravoColors.primary,
  },
  secondary: {
    main: bravoColors.secondary,
    light: bravoColors.tertiary,
    dark: bravoColors.primary,
  },
  background: {
    default: bravoColors.background.dark,
    paper: bravoColors.primary,
  },
  text: {
    primary: bravoColors.text.white,
    secondary: bravoColors.tertiary,
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
  },
};
