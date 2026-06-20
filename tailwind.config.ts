import { themeConfig } from './src/theme/core/_config';

const SCREENS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  '2xl': 1600,
  '3xl': 1920,
};

function screenToPx(screen: number) {
  return `${screen}px`;
}

function screenUp(screen: number) {
  return { min: screenToPx(screen) };
}

function screenDown(screen: number) {
  return { max: screenToPx(screen - 1) };
}

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F6F3',
        surface: '#FFFFFF',
        line: '#EAEAEA',
        ink: '#2F3437',
        muted: '#787774',
        accent: '#1F6C9F',
        'accent-soft': '#E1F3FE',
        'status-off': '#FDEBEC',
        'status-off-text': '#9F2F2D',
        'status-on': '#EDF3EC',
        'status-on-text': '#346538',
        ...themeConfig.palette,
        'hero-bg': '#F7F6F3',
        'app-primary-dtxt': themeConfig.darkText.primary,
        'app-secondary-dtxt': themeConfig.darkText.secondary,
        'app-disabled-dtxt': themeConfig.darkText.disabled,
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(17, 17, 17, 0.04)',
      },
    },
    screens: {
      xs: screenToPx(SCREENS.xs),
      sm: screenToPx(SCREENS.sm),
      md: screenToPx(SCREENS.md),
      lg: screenToPx(SCREENS.lg),
      xl: screenToPx(SCREENS.xl),
      '2xl': screenToPx(SCREENS['2xl']),
      '3xl': screenToPx(SCREENS['3xl']),

      xsDown: screenDown(SCREENS.xs),
      smDown: screenDown(SCREENS.sm),
      mdDown: screenDown(SCREENS.md),
      lgDown: screenDown(SCREENS.lg),
      xlDown: screenDown(SCREENS.xl),

      xsUp: screenUp(SCREENS.xs),
      smUp: screenUp(SCREENS.sm),
      mdUp: screenUp(SCREENS.md),
      lgUp: screenUp(SCREENS.lg),
      xlUp: screenUp(SCREENS.xl),
    },
  },
  plugins: [],
  corePlugins: { preflight: false },
};
