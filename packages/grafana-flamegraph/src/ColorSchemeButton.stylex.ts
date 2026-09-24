import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { byPackageGradient, byValueGradient, diffColorBlindGradient, diffDefaultGradient } from './FlameGraph/colors';

export const colorSchemeButtonStyles = stylex.create({
  buttonSpacing: {
    marginRight: grafanaTokens.spacing_x1,
  },
  colorDot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: grafanaTokens.shape_radius_circle,
  },
  colorDotDiff: {
    display: 'flex',
    width: '200px',
    height: '12px',
    color: 'white',
    fontSize: 9,
    lineHeight: 1.3,
    fontWeight: 300,
    justifyContent: 'space-between',
    padding: '0 2px',
    borderRadius: '2px',
  },
  colorDotByValue: {
    backgroundImage: byValueGradient,
  },
  colorDotByPackage: {
    backgroundImage: byPackageGradient,
  },
  colorDotDiffDefault: {
    backgroundImage: diffDefaultGradient,
  },
  colorDotDiffColorBlind: {
    backgroundImage: diffColorBlindGradient,
  },
});
