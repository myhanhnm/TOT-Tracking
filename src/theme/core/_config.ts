import { PaletteColor, CommonColors } from '@mui/material';

type ThemeConfig = {
  palette: Record<
    'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error',
    PaletteColor & { lighter: string; darker: string }
  > & {
    common: Pick<CommonColors, 'black' | 'white'>;
    grey: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
  };
  darkText: Record<'primary' | 'secondary' | 'disabled', string>;
};

export const themeConfig: ThemeConfig = {
  palette: {
    primary: {
      lighter: '#E8E8E8',
      light: '#4A4A4A',
      main: '#111111',
      dark: '#0A0A0A',
      darker: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#E1F3FE',
      light: '#7CB9DE',
      main: '#1F6C9F',
      dark: '#164F75',
      darker: '#0D334C',
      contrastText: '#FFFFFF',
    },
    info: {
      lighter: '#E1F3FE',
      light: '#7CB9DE',
      main: '#1F6C9F',
      dark: '#164F75',
      darker: '#0D334C',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#EDF3EC',
      light: '#8FB892',
      main: '#346538',
      dark: '#264A28',
      darker: '#18301A',
      contrastText: '#FFFFFF',
    },
    warning: {
      lighter: '#FBF3DB',
      light: '#E8C97A',
      main: '#956400',
      dark: '#6F4B00',
      darker: '#4A3200',
      contrastText: '#111111',
    },
    error: {
      lighter: '#FDEBEC',
      light: '#D98A88',
      main: '#9F2F2D',
      dark: '#7A2422',
      darker: '#551918',
      contrastText: '#FFFFFF',
    },
    grey: {
      '50': '#FBFBFA',
      '100': '#F7F6F3',
      '200': '#EAEAEA',
      '300': '#D8D8D6',
      '400': '#B8B8B5',
      '500': '#989894',
      '600': '#787774',
      '700': '#5A5956',
      '800': '#3D3C39',
      '900': '#2F3437',
    },
    common: { black: '#111111', white: '#FFFFFF' },
  },
  darkText: {
    primary: '#2F3437',
    secondary: '#787774',
    disabled: '#B8B8B5',
  },
};
