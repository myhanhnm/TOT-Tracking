import { palette } from './pallete';
import { themeConfig } from './_config';
import { typography } from './typography';
import { ThemeOptions } from 'src/theme/types';

export const base: ThemeOptions = {
  colorSchemes: {
    light: { palette: palette.light },
  },
  typography,
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          backgroundColor: themeConfig.palette.primary.main,
          color: themeConfig.palette.common.white,
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlined: {
          borderColor: themeConfig.palette.grey['200'],
          color: themeConfig.palette.primary.main,
        },
        text: {
          color: themeConfig.darkText.secondary,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: themeConfig.darkText.secondary,
          borderBottomColor: themeConfig.palette.grey['200'],
        },
        body: {
          borderBottomColor: themeConfig.palette.grey['200'],
        },
      },
    },
  },
};
