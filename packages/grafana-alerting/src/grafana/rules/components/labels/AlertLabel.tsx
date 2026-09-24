import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, type HTMLAttributes, useMemo } from 'react';
import tinycolor2 from 'tinycolor2';
import { type MergeExclusive } from 'type-fest';

import { type IconName } from '@grafana/data';
import { Icon, Stack, getTagColorsFromName, useTheme2 } from '@grafana/ui';

import { alertLabelStaticStyles } from '../alertingRules.stylex';

export type LabelSize = 'md' | 'sm' | 'xs';

interface BaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'className'> {
  icon?: IconName;
  labelKey?: string;
  value?: string;
  size?: LabelSize;
  onClick?: ([value, key]: [string | undefined, string | undefined]) => void;
}

type Props = BaseProps & MergeExclusive<{ color?: string }, { colorBy?: 'key' | 'value' | 'both' }>;

const AlertLabel = (props: Props) => {
  const { labelKey, value, icon, color, colorBy, size = 'md', onClick, ...rest } = props;
  const theme = useTheme2();
  const theColor = getColorFromProps({ color, colorBy, labelKey, value });

  const dynamicStyles = useMemo(() => {
    const backgroundColor = theColor ?? theme.colors.secondary.main;
    const borderColor = theme.isDark
      ? tinycolor2(backgroundColor).lighten(5).toString()
      : tinycolor2(backgroundColor).darken(5).toString();
    const valueBackgroundColor = theme.isDark
      ? tinycolor2(backgroundColor).darken(5).toString()
      : tinycolor2(backgroundColor).lighten(5).toString();
    const labelFontColor = theColor
      ? getReadableFontColor(backgroundColor, theme.colors.text.primary)
      : theme.colors.text.primary;
    const valueFontColor = theColor
      ? getReadableFontColor(valueBackgroundColor, theme.colors.text.primary)
      : theme.colors.text.primary;

    let padding: CSSProperties['padding'] = '2.5px 8px';
    switch (size) {
      case 'sm':
        padding = '1.5px 5px';
        break;
      case 'xs':
        padding = '0 4px';
        break;
      default:
        break;
    }

    const radius = theme.shape.borderRadius(2);

    return {
      wrapper: {
        fontSize: theme.typography.bodySmall.fontSize,
        borderRadius: radius,
      } satisfies CSSProperties,
      label: {
        display: 'flex',
        alignItems: 'center',
        color: labelFontColor,
        padding,
        background: backgroundColor,
        border: `solid 1px ${borderColor}`,
        borderTopLeftRadius: radius,
        borderBottomLeftRadius: radius,
      } satisfies CSSProperties,
      value: {
        color: valueFontColor,
        padding,
        background: valueBackgroundColor,
        border: `solid 1px ${borderColor}`,
        borderLeft: 'none',
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
      } satisfies CSSProperties,
      valueWithoutKey: {
        borderTopLeftRadius: radius,
        borderBottomLeftRadius: radius,
        borderLeft: `solid 1px ${borderColor}`,
      } satisfies CSSProperties,
    };
  }, [size, theColor, theme]);

  const ariaLabel = `${labelKey}: ${value}`;
  const keyless = !Boolean(labelKey);

  const innerLabel = useMemo(
    () => (
      <Stack direction="row" gap={0} alignItems="stretch">
        {labelKey && (
          <div style={dynamicStyles.label}>
            <Stack direction="row" gap={0.5} alignItems="center">
              {icon && <Icon name={icon} />}
              {labelKey && (
                <span {...stylex.props(alertLabelStaticStyles.labelText)} title={labelKey.toString()}>
                  {labelKey ?? ''}
                </span>
              )}
            </Stack>
          </div>
        )}
        <div
          style={{ ...dynamicStyles.value, ...(keyless ? dynamicStyles.valueWithoutKey : undefined) }}
          title={value?.toString()}
        >
          {value ?? '-'}
        </div>
      </Stack>
    ),
    [dynamicStyles, icon, keyless, labelKey, value]
  );

  return (
    <div style={dynamicStyles.wrapper} aria-label={ariaLabel} data-testid="label-value" {...rest}>
      {onClick && (labelKey || value) ? (
        <button
          type="button"
          {...stylex.props(alertLabelStaticStyles.clickable)}
          key={`${labelKey ?? ''}${value ?? ''}`}
          onClick={() => onClick?.([value ?? '', labelKey ?? ''])}
        >
          {innerLabel}
        </button>
      ) : (
        innerLabel
      )}
    </div>
  );
};

function getAccessibleTagColor(name?: string): string | undefined {
  if (!name) {
    return;
  }
  const attempts = Array.from({ length: 6 }, (_, i) => name + '-'.repeat(i));
  const readableAttempt = attempts.find((attempt) => {
    const candidate = getTagColorsFromName(attempt).color;
    return (
      tinycolor2.isReadable(candidate, '#000', { level: 'AA', size: 'small' }) ||
      tinycolor2.isReadable(candidate, '#fff', { level: 'AA', size: 'small' })
    );
  });
  const chosen = readableAttempt ?? name;
  return getTagColorsFromName(chosen).color;
}

function getColorFromProps({
  color,
  colorBy,
  labelKey,
  value,
}: Pick<Props, 'color' | 'colorBy' | 'labelKey' | 'value'>) {
  if (color) {
    return getAccessibleTagColor(color);
  }

  if (colorBy === 'key') {
    return getAccessibleTagColor(labelKey);
  }

  if (colorBy === 'value') {
    return getAccessibleTagColor(value);
  }

  if (colorBy === 'both' && labelKey && value) {
    return getAccessibleTagColor(labelKey + value);
  }

  return;
}

function getReadableFontColor(bg: string, fallback: string): string {
  if (tinycolor2.isReadable(bg, '#000', { level: 'AA', size: 'small' })) {
    return '#000';
  }

  if (tinycolor2.isReadable(bg, '#fff', { level: 'AA', size: 'small' })) {
    return '#fff';
  }

  if (tinycolor2.isReadable(bg, fallback, { level: 'AA', size: 'small' })) {
    return tinycolor2(fallback).toHexString();
  }

  return tinycolor2
    .mostReadable(bg, ['#000', '#fff', fallback], {
      includeFallbackColors: true,
    })
    .toHexString();
}

export { AlertLabel };
export type AlertLabelProps = Props;
