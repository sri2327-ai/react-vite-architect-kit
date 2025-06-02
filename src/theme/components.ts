
import { Components, Theme } from '@mui/material/styles';
import { bravoColors } from './colors';

export const components: Components<Omit<Theme, 'components'>> = {
  MuiButton: {
    defaultProps: {
      size: 'small',
      variant: 'contained',
    },
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 12,
        fontWeight: 600,
        padding: '12px 24px',
        fontSize: '0.95rem',
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
          borderRadius: 12,
          backgroundColor: bravoColors.background.white,
          '& fieldset': {
            borderColor: '#E5E7EB',
            borderWidth: 1.5,
          },
          '&:hover fieldset': {
            borderColor: bravoColors.secondary,
          },
          '&.Mui-focused fieldset': {
            borderColor: bravoColors.primary,
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root': {
          fontWeight: 500,
          color: bravoColors.text.light,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: `1px solid #F3F4F6`,
        backgroundColor: bravoColors.background.white,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiCheckbox: {
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: {
        color: bravoColors.icons.primary,
        '&.Mui-checked': {
          color: bravoColors.primary,
        },
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        color: bravoColors.icons.primary,
        '&.Mui-checked': {
          color: bravoColors.primary,
        },
      },
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
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        fontWeight: 500,
      },
    },
  },
  MuiStep: {
    styleOverrides: {
      root: {
        '& .MuiStepIcon-root': {
          color: '#E5E7EB',
          '&.Mui-active': {
            color: bravoColors.primary,
          },
          '&.Mui-completed': {
            color: bravoColors.secondary,
          },
        },
      },
    },
  },
};
