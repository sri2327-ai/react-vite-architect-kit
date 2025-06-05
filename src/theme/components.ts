
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
        background: '#6B7280',
        color: bravoColors.text.white,
        '&:hover': {
          background: '#4B5563',
          boxShadow: 'none',
        },
      },
      outlined: {
        background: 'transparent',
        color: '#6B7280',
        borderColor: '#6B7280',
        '&:hover': {
          background: '#F9FAFB',
          borderColor: '#4B5563',
        },
      },
      text: {
        background: 'transparent',
        color: '#6B7280',
        '&:hover': {
          background: '#F9FAFB',
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
            borderColor: '#D1D5DB',
            borderWidth: 1.5,
          },
          '&:hover fieldset': {
            borderColor: '#9CA3AF',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#6B7280',
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
        border: `1px solid #E5E7EB`,
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
        borderRight: `1px solid #E5E7EB`,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: '#6B7280',
        color: bravoColors.text.white,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        '&.Mui-selected': {
          backgroundColor: '#F3F4F6',
          color: '#374151',
          '&:hover': {
            backgroundColor: '#E5E7EB',
          },
        },
        '&:hover': {
          backgroundColor: '#F9FAFB',
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
        color: '#9CA3AF',
        '&.Mui-checked': {
          color: '#6B7280',
        },
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        color: '#9CA3AF',
        '&.Mui-checked': {
          color: '#6B7280',
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
      standardInfo: {
        backgroundColor: '#F3F4F6',
        color: '#374151',
        '& .MuiAlert-icon': {
          color: '#6B7280',
        },
      },
      standardSuccess: {
        backgroundColor: '#F3F4F6',
        color: '#374151',
        '& .MuiAlert-icon': {
          color: '#6B7280',
        },
      },
      standardWarning: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        '& .MuiAlert-icon': {
          color: '#D97706',
        },
      },
      standardError: {
        backgroundColor: '#FEE2E2',
        color: '#B91C1C',
        '& .MuiAlert-icon': {
          color: '#DC2626',
        },
      },
    },
  },
  MuiStep: {
    styleOverrides: {
      root: {
        '& .MuiStepIcon-root': {
          color: '#D1D5DB',
          '&.Mui-active': {
            color: '#6B7280',
          },
          '&.Mui-completed': {
            color: '#9CA3AF',
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      colorInfo: {
        backgroundColor: '#F3F4F6',
        color: '#374151',
        '& .MuiChip-icon': {
          color: '#6B7280',
        },
      },
      colorSuccess: {
        backgroundColor: '#F3F4F6',
        color: '#374151',
        '& .MuiChip-icon': {
          color: '#6B7280',
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
        color: '#9CA3AF',
        '&:hover': {
          backgroundColor: '#F9FAFB',
        },
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        backgroundColor: '#6B7280',
        color: bravoColors.text.white,
      },
    },
  },
};
