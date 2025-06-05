
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
        background: bravoColors.button.gradient,
        color: bravoColors.text.white,
        '&:hover': {
          background: bravoColors.button.hover,
          boxShadow: 'none',
        },
      },
      outlined: {
        background: 'transparent',
        color: bravoColors.primaryFlat,
        borderColor: bravoColors.primaryFlat,
        '&:hover': {
          background: bravoColors.highlight.hover,
          borderColor: bravoColors.primaryDark,
        },
      },
      text: {
        background: 'transparent',
        color: bravoColors.primaryFlat,
        '&:hover': {
          background: bravoColors.highlight.hover,
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
            borderColor: bravoColors.highlight.border,
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
          color: bravoColors.text.primary,
          fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        '& .MuiInputBase-input': {
          color: bravoColors.text.primary,
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
        border: `1px solid ${bravoColors.highlight.border}`,
        backgroundColor: bravoColors.background.white,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        backgroundColor: bravoColors.background.light,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: bravoColors.background.light,
        borderRight: `1px solid ${bravoColors.highlight.border}`,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: bravoColors.button.gradient,
        color: bravoColors.text.white,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        '&.Mui-selected': {
          backgroundColor: bravoColors.highlight.selected,
          color: bravoColors.primaryFlat,
          '&:hover': {
            backgroundColor: bravoColors.highlight.hover,
          },
        },
        '&:hover': {
          backgroundColor: bravoColors.highlight.hover,
        },
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
          color: bravoColors.highlight.border,
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
        color: bravoColors.text.primary,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: bravoColors.icons.primary,
        '&:hover': {
          backgroundColor: bravoColors.highlight.hover,
        },
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        background: bravoColors.button.gradient,
        color: bravoColors.text.white,
      },
    },
  },
};
