
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
        fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
        color: '#000000',
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
          fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
          '& fieldset': {
            borderColor: '#E5E7EB',
            borderWidth: 1.5,
          },
          '&:hover fieldset': {
            borderColor: bravoColors.secondary,
          },
          '&.Mui-focused fieldset': {
            borderColor: bravoColors.primaryFlat,
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root': {
          fontWeight: 500,
          color: '#000000',
          fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        '& .MuiInputBase-input': {
          color: '#000000',
          fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
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
        fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
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
          color: bravoColors.primaryFlat,
        },
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        color: bravoColors.icons.primary,
        '&.Mui-checked': {
          color: bravoColors.primaryFlat,
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
    styleOverrides: {
      root: {
        fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        fontWeight: 500,
        fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
      },
    },
  },
  MuiStep: {
    styleOverrides: {
      root: {
        '& .MuiStepIcon-root': {
          color: '#E5E7EB',
          '&.Mui-active': {
            color: bravoColors.primaryFlat,
          },
          '&.Mui-completed': {
            color: bravoColors.secondary,
          },
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
        color: '#000000',
      },
    },
  },
};
