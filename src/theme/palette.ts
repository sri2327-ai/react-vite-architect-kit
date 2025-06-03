
import { PaletteOptions } from '@mui/material/styles';
import { bravoColors } from './colors';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: bravoColors.primaryFlat,
    dark: bravoColors.primaryDark,
  },
  secondary: {
    main: bravoColors.secondary,
    dark: bravoColors.primaryDark,
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
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
  },
  info: {
    main: bravoColors.accent.blue,
    light: bravoColors.tertiary,
    dark: bravoColors.primaryFlat,
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
  },
  action: {
    selected: bravoColors.highlight.selected,
    hover: bravoColors.highlight.hover,
  },
  divider: bravoColors.highlight.border,
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: bravoColors.tertiary,
    dark: bravoColors.primaryFlat,
  },
  secondary: {
    main: bravoColors.secondary,
    dark: bravoColors.primaryFlat,
  },
  background: {
    default: bravoColors.background.dark,
    paper: bravoColors.primaryFlat,
  },
  text: {
    primary: bravoColors.text.white,
    secondary: bravoColors.text.lightGrey,
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },
  info: {
    main: bravoColors.tertiary,
    light: bravoColors.secondary,
    dark: bravoColors.primaryFlat,
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },
  action: {
    selected: bravoColors.highlight.selected,
    hover: bravoColors.highlight.hover,
  },
  divider: bravoColors.highlight.border,
};
