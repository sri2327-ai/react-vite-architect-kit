
import { Components, Theme } from '@mui/material/styles';

export const components: Components<Omit<Theme, 'components'>> = {
  MuiButton: {
    defaultProps: {
      size: 'small',
      variant: 'contained',
    },
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        fontWeight: 600,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
      variant: 'outlined',
      fullWidth: true,
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiCheckbox: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: 'small',
      fullWidth: true,
    },
  },
  MuiSelect: {
    defaultProps: {
      size: 'small',
      fullWidth: true,
    },
  },
};
