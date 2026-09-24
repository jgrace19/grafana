import { type SVGProps } from 'react';
import SVG from 'react-inlinesvg';

import { useTheme2 } from '../../../themes/ThemeContext';

import grotCTASvg from './grot-cta.svg';

import './GrotCTA.css';

export interface Props {
  width?: SVGProps<SVGElement>['width'];
  height?: SVGProps<SVGElement>['height'];
}

export const GrotCTA = ({ width = 'auto', height }: Props) => {
  const theme = useTheme2();

  return (
    <SVG
      src={grotCTASvg}
      className={theme.isDark ? 'gf-grot-cta-dark' : 'gf-grot-cta-light'}
      height={height}
      width={width}
    />
  );
};

GrotCTA.displayName = 'GrotCTA';
