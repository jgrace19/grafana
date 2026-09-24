import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import SVG from 'react-inlinesvg';

import { t } from '@grafana/i18n';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { type IconSize, isIconSize } from '../../types/icon';
import { Icon } from '../Icon/Icon';
import { getIconRoot, getIconSubDir } from '../Icon/utils';

export interface Props {
  className?: string;
  style?: React.CSSProperties;
  iconClassName?: string;
  inline?: boolean;
  size?: IconSize;
}

/**
 * @deprecated
 * use a predefined size, e.g. 'md' or 'lg' instead
 */
interface PropsWithDeprecatedSize extends Omit<Props, 'size'> {
  size?: number | string;
}

/**
 * @public
 *
 * Spinner is `fa-spinner` icon animated. It is used to alert a user to wait for an activity to complete.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-spinner--docs
 */
export const Spinner = ({
  className,
  inline = false,
  iconClassName,
  style,
  size = 'md',
}: Props | PropsWithDeprecatedSize) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const iconName = prefersReducedMotion ? 'hourglass' : 'spinner';

  // this entire if statement is handling the deprecated size prop
  // TODO remove once we fully remove the deprecated type
  if (typeof size !== 'string' || !isIconSize(size)) {
    const iconRoot = getIconRoot();
    const subDir = getIconSubDir(iconName, 'default');
    const svgPath = `${iconRoot}${subDir}/${iconName}.svg`;
    return (
      <div
        data-testid="Spinner"
        {...mergeStylexProps(
          stylex.props(
            inline && styles.inline,
            styles.deprecatedWrapper(typeof size === 'string' ? size : `${size}px`)
          ),
          { className, style }
        )}
      >
        <SVG
          src={svgPath}
          width={size}
          height={size}
          {...mergeStylexProps(stylex.props(styles.spin, styles.deprecatedIcon), { className, style })}
        />
      </div>
    );
  }

  return (
    <div data-testid="Spinner" {...mergeStylexProps(stylex.props(inline && styles.inline), { className, style })}>
      <Icon
        xstyle={styles.spin}
        className={iconClassName}
        name={iconName}
        size={size}
        aria-label={t('grafana-ui.spinner.aria-label', 'Loading')}
      />
    </div>
  );
};

const spin = stylex.keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(359deg)',
  },
});

const styles = stylex.create({
  inline: {
    display: 'inline-block',
    lineHeight: 0,
  },
  spin: {
    animationName: { default: null, [motion.noPreference]: spin },
    animationDuration: { default: null, [motion.noPreference]: '2s' },
    animationIterationCount: { default: null, [motion.noPreference]: 'infinite' },
    animationTimingFunction: { default: null, [motion.noPreference]: 'linear' },
  },
  // TODO remove once we fully remove the deprecated type
  deprecatedWrapper: (fontSize: string) => ({
    fontSize,
  }),
  deprecatedIcon: {
    display: 'inline-block',
    fill: 'currentColor',
    flexShrink: 0,
    // line-height: 0; is needed for correct icon alignment in Safari
    lineHeight: 0,
    verticalAlign: 'middle',
  },
});
