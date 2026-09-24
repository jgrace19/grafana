import * as stylex from '@stylexjs/stylex';
import { type AriaRole, type HTMLAttributes, type ReactNode } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Box } from '../Layout/Box/Box';
import { Stack } from '../Layout/Stack/Stack';
import { spacingValue } from '../Layout/utils/responsiveStylex';
import { Text } from '../Text/Text';
export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  /** On click handler for alert button, mostly used for dismissing the alert */
  onRemove?: (event: React.MouseEvent) => void;
  severity?: AlertVariant;
  children?: ReactNode;
  elevated?: boolean;
  buttonContent?: React.ReactNode | string;
  bottomSpacing?: number;
  topSpacing?: number;
  /** Custom action element rendered in the alert's button area, independently from the dismiss button. */
  action?: ReactNode;
  /** @internal first-party StyleX overrides for the root element, applied last */
  xstyle?: stylex.StyleXStyles;
}

/**
 * An alert displays an important message in a way that attracts the user's attention without interrupting the user's task.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-alert--docs
 */
export const Alert = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      title,
      onRemove,
      children,
      buttonContent,
      elevated,
      bottomSpacing,
      topSpacing,
      className,
      style,
      severity = 'error',
      action,
      xstyle,
      ...restProps
    },
    ref
  ) => {
    const hasTitle = Boolean(title);
    const rolesBySeverity: Record<AlertVariant, AriaRole> = {
      error: 'alert',
      warning: 'alert',
      info: 'status',
      success: 'status',
    };
    const role = restProps['role'] || rolesBySeverity[severity];
    const ariaLabel = restProps['aria-label'] || title;

    const closeLabel = t('grafana-ui.alert.close-button', 'Close alert');

    return (
      <div
        ref={ref}
        {...mergeStylexProps(
          stylex.props(
            styles.wrapper,
            bottomSpacing !== undefined && styles.marginBottom(spacingValue(bottomSpacing)),
            topSpacing !== undefined && styles.marginTop(spacingValue(topSpacing)),
            xstyle
          ),
          { className, style }
        )}
        role={role}
        aria-label={ariaLabel}
        {...restProps}
      >
        <Box
          data-testid={selectors.components.Alert.alertV2(severity)}
          display="flex"
          backgroundColor={severity}
          borderRadius="default"
          paddingY={1}
          paddingX={2}
          borderStyle="solid"
          borderColor={severity}
          alignItems="stretch"
          boxShadow={elevated ? 'z3' : undefined}
        >
          <Box paddingTop={1} paddingRight={2}>
            <div {...stylex.props(styles.icon, iconColorStyles[severity])}>
              <Icon size="xl" name={getIconFromSeverity(severity)} />
            </div>
          </Box>

          <Stack alignItems="center" flex={1} wrap="wrap" columnGap={1} rowGap={0}>
            <Box paddingY={1} flex={1} minWidth="50%">
              <Text color="primary" weight="medium">
                {title}
              </Text>
              {children && <div {...stylex.props(styles.content, hasTitle && styles.contentWithTitle)}>{children}</div>}
            </Box>
            <Stack alignItems="center" wrap="wrap">
              {action}
              {onRemove && buttonContent && (
                <Button aria-label={closeLabel} variant="secondary" onClick={onRemove} type="button">
                  {buttonContent}
                </Button>
              )}
            </Stack>
          </Stack>
          {/* If onRemove is specified, giving preference to onRemove */}
          {onRemove && !buttonContent && (
            <div {...stylex.props(styles.close)}>
              <Button
                aria-label={closeLabel}
                icon="times"
                onClick={onRemove}
                type="button"
                fill="text"
                variant="secondary"
              />
            </div>
          )}
        </Box>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export const getIconFromSeverity = (severity: AlertVariant): IconName => {
  switch (severity) {
    case 'error':
      return 'exclamation-circle';
    case 'warning':
      return 'exclamation-triangle';
    case 'info':
      return 'info-circle';
    case 'success':
      return 'check';
  }
};

const styles = stylex.create({
  wrapper: {
    flexGrow: 1,
    marginBottom: spacing['--gf-spacing-x2'],
    marginTop: 0,
    position: 'relative',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: colors['--gf-colors-background-primary'],
      borderRadius: shape['--gf-shape-radius-default'],
      zIndex: -1,
    },
  },
  marginBottom: (value: string) => ({ marginBottom: value }),
  marginTop: (value: string) => ({ marginTop: value }),
  icon: {
    position: 'relative',
    top: '-1px',
  },
  content: {
    color: colors['--gf-colors-text-primary'],
    paddingTop: 0,
    maxHeight: '50vh',
    overflowY: 'auto',
  },
  contentWithTitle: {
    paddingTop: spacing['--gf-spacing-x0-5'],
  },
  close: {
    position: 'relative',
    color: colors['--gf-colors-text-secondary'],
    backgroundColor: 'transparent',
    display: 'flex',
    top: '-6px',
    right: '-14px',
  },
});

const iconColorStyles = stylex.create({
  success: { color: colors['--gf-colors-success-text'] },
  warning: { color: colors['--gf-colors-warning-text'] },
  error: { color: colors['--gf-colors-error-text'] },
  info: { color: colors['--gf-colors-info-text'] },
});
