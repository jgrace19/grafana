import * as stylex from '@stylexjs/stylex';

import { type ThemeTypographyVariantTypes } from '@grafana/data';

import { cssVar } from '../../themes/stylex/cssVar';
import { grafanaTokens } from '../../themes/stylex/tokens.generated.stylex';

export const textStyles = stylex.create({
  base: { margin: 0, padding: 0 },
  truncate: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  italic: { fontStyle: 'italic' },
  tabular: { fontFeatureSettings: '"tnum"' },
  h1: {
    fontFamily: grafanaTokens.typography_h1_fontFamily,
    fontSize: grafanaTokens.typography_h1_fontSize,
    fontWeight: grafanaTokens.typography_h1_fontWeight,
    lineHeight: grafanaTokens.typography_h1_lineHeight,
  },
  h2: {
    fontFamily: grafanaTokens.typography_h2_fontFamily,
    fontSize: grafanaTokens.typography_h2_fontSize,
    fontWeight: grafanaTokens.typography_h2_fontWeight,
    lineHeight: grafanaTokens.typography_h2_lineHeight,
  },
  h3: {
    fontFamily: grafanaTokens.typography_h3_fontFamily,
    fontSize: grafanaTokens.typography_h3_fontSize,
    fontWeight: grafanaTokens.typography_h3_fontWeight,
    lineHeight: grafanaTokens.typography_h3_lineHeight,
  },
  h4: {
    fontFamily: grafanaTokens.typography_h4_fontFamily,
    fontSize: grafanaTokens.typography_h4_fontSize,
    fontWeight: grafanaTokens.typography_h4_fontWeight,
    lineHeight: grafanaTokens.typography_h4_lineHeight,
  },
  h5: {
    fontFamily: grafanaTokens.typography_h5_fontFamily,
    fontSize: grafanaTokens.typography_h5_fontSize,
    fontWeight: grafanaTokens.typography_h5_fontWeight,
    lineHeight: grafanaTokens.typography_h5_lineHeight,
  },
  h6: {
    fontFamily: grafanaTokens.typography_h6_fontFamily,
    fontSize: grafanaTokens.typography_h6_fontSize,
    fontWeight: grafanaTokens.typography_h6_fontWeight,
    lineHeight: grafanaTokens.typography_h6_lineHeight,
  },
  body: {
    fontFamily: grafanaTokens.typography_body_fontFamily,
    fontSize: grafanaTokens.typography_body_fontSize,
    fontWeight: grafanaTokens.typography_body_fontWeight,
    lineHeight: grafanaTokens.typography_body_lineHeight,
  },
  weightLight: { fontWeight: grafanaTokens.typography_fontWeightLight },
  weightRegular: { fontWeight: grafanaTokens.typography_fontWeightRegular },
  weightMedium: { fontWeight: grafanaTokens.typography_fontWeightMedium },
  weightBold: { fontWeight: grafanaTokens.typography_fontWeightBold },
  colorError: { color: cssVar('colors.error.text') },
  colorSuccess: { color: cssVar('colors.success.text') },
  colorInfo: { color: cssVar('colors.info.text') },
  colorWarning: { color: cssVar('colors.warning.text') },
  colorPrimary: { color: cssVar('colors.text.primary') },
  colorSecondary: { color: cssVar('colors.text.secondary') },
  colorDisabled: { color: cssVar('colors.text.disabled') },
  colorMaxContrast: { color: cssVar('colors.text.maxContrast') },
  colorLink: { color: cssVar('colors.text.link') },
  alignLeft: { textAlign: 'left' },
  alignCenter: { textAlign: 'center' },
  alignRight: { textAlign: 'right' },
});

const elementDefaultVariant: Record<string, keyof typeof textStyles | undefined> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'body',
  li: 'body',
};

export function textStyleProps(options: {
  element?: string;
  variant?: keyof ThemeTypographyVariantTypes;
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  color?: string;
  truncate?: boolean;
  italic?: boolean;
  tabular?: boolean;
  textAlignment?: string;
}) {
  const { element = 'span', variant, weight, color, truncate, italic, tabular, textAlignment } = options;
  const typographyKey = (variant ?? elementDefaultVariant[element]) as keyof typeof textStyles | undefined;
  const styles: Array<(typeof textStyles)[keyof typeof textStyles]> = [textStyles.base];
  if (typographyKey && typographyKey in textStyles) styles.push(textStyles[typographyKey]);
  if (weight === 'light') styles.push(textStyles.weightLight);
  if (weight === 'medium') styles.push(textStyles.weightMedium);
  if (weight === 'bold') styles.push(textStyles.weightBold);
  if (weight === 'regular') styles.push(textStyles.weightRegular);
  if (color === 'error') styles.push(textStyles.colorError);
  if (color === 'success') styles.push(textStyles.colorSuccess);
  if (color === 'info') styles.push(textStyles.colorInfo);
  if (color === 'warning') styles.push(textStyles.colorWarning);
  if (color === 'primary') styles.push(textStyles.colorPrimary);
  if (color === 'secondary') styles.push(textStyles.colorSecondary);
  if (color === 'disabled') styles.push(textStyles.colorDisabled);
  if (color === 'maxContrast') styles.push(textStyles.colorMaxContrast);
  if (color === 'link') styles.push(textStyles.colorLink);
  if (truncate) styles.push(textStyles.truncate);
  if (italic) styles.push(textStyles.italic);
  if (tabular) styles.push(textStyles.tabular);
  if (textAlignment === 'left') styles.push(textStyles.alignLeft);
  if (textAlignment === 'center') styles.push(textStyles.alignCenter);
  if (textAlignment === 'right') styles.push(textStyles.alignRight);
  return stylex.props(...styles);
}
