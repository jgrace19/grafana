import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import SVG from 'react-inlinesvg';

import { t } from '@grafana/i18n';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { type IconSize, isIconSize } from '../../types/icon';
import { Icon } from '../Icon/Icon';
import { getIconRoot, getIconSubDir } from '../Icon/utils';

import { spinnerStyles } from './Spinner.stylex';

export interface Props {
  className?: string;
  style?: React.CSSProperties;
  iconClassName?: string;
  inline?: boolean;
  size?: IconSize;
}

interface PropsWithDeprecatedSize extends Omit<Props, 'size'> {
  size?: number | string;
}

export const Spinner = ({ className, inline = false, iconClassName, style, size = 'md' }: Props | PropsWithDeprecatedSize) => {
  const iconName = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'hourglass' : 'spinner';
  if (typeof size !== 'string' || !isIconSize(size)) {
    const svgPath = `${getIconRoot()}${getIconSubDir(iconName, 'default')}/${iconName}.svg`;
    return (
      <div data-testid="Spinner" style={style} {...mergeStylexClassName(stylex.props(spinnerStyles.inline, spinnerStyles.deprecatedWrapper), className)}>
        <SVG src={svgPath} width={size} height={size} {...mergeStylexClassName(stylex.props(spinnerStyles.spin, spinnerStyles.deprecatedIcon), className)} style={style} />
      </div>
    );
  }
  return (
    <div data-testid="Spinner" style={style} {...mergeStylexClassName(stylex.props(inline && spinnerStyles.inline), className)}>
      <Icon className={mergeStylexClassName(stylex.props(spinnerStyles.spin), iconClassName).className} name={iconName} size={size} aria-label={t('grafana-ui.spinner.aria-label', 'Loading')} />
    </div>
  );
};
