import { TypographyVariantsOptions } from '@mui/material';
import { FontExtendType } from 'src/theme/types';
import { pxToRem, setFont, responsiveFontSizes } from 'src/theme/helpers';
import { geistMono, geistSans } from '../fonts';

const primaryFont = setFont(geistSans.style.fontFamily);
const monoFont = setFont(geistMono.style.fontFamily);

export const typography: TypographyVariantsOptions & FontExtendType = {
  fontFamily: primaryFont,
  fontSecondaryFamily: monoFont,
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  h1: {
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    fontSize: pxToRem(36),
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h2: {
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    fontSize: pxToRem(28),
    ...responsiveFontSizes({ sm: 30, md: 32 }),
  },
  h3: {
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    fontSize: pxToRem(22),
    ...responsiveFontSizes({ md: 24 }),
  },
  h4: {
    fontWeight: 600,
    lineHeight: 1.25,
    fontSize: pxToRem(20),
  },
  h5: {
    fontWeight: 600,
    lineHeight: 1.3,
    fontSize: pxToRem(18),
  },
  h6: {
    fontWeight: 600,
    lineHeight: 1.35,
    fontSize: pxToRem(16),
  },
  subtitle1: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 500,
    lineHeight: 1.45,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.6,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 1.55,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.45,
    fontSize: pxToRem(12),
    fontFamily: monoFont,
    fontVariantNumeric: 'tabular-nums',
  },
  overline: {
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: pxToRem(11),
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: pxToRem(14),
    textTransform: 'none',
  },
};
