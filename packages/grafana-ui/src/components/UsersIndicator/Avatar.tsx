import * as stylex from '@stylexjs/stylex';

import { type ThemeSpacingTokens } from '@grafana/data';

import { shape } from '../../themes/stylex/tokens.stylex';
import { responsive, responsiveStyles } from '../Layout/utils/responsiveStyles';
import { spacingValue } from '../Layout/utils/responsiveStylex';
import { type ResponsiveProp } from '../Layout/utils/responsiveness';

export interface AvatarProps {
  src: string;
  alt: string;
  width?: ResponsiveProp<ThemeSpacingTokens>;
  height?: ResponsiveProp<ThemeSpacingTokens>;
}
export const Avatar = ({ src, alt, width = 3, height = 3 }: AvatarProps) => {
  return (
    <img
      {...stylex.props(
        responsive(responsiveStyles.width, width, spacingValue),
        responsive(responsiveStyles.height, height, spacingValue),
        styles.image
      )}
      src={src}
      alt={alt}
    />
  );
};

const styles = stylex.create({
  image: {
    borderRadius: shape['--gf-shape-radius-circle'],
  },
});
