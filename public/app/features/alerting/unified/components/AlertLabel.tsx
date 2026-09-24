import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { IconButton } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  labelKey: string;
  value: string;
  operator?: string;
  onRemoveLabel?: () => void;
  /** first-party StyleX overrides */
  xstyle?: StyleXStyles;
}

export const AlertLabel = ({ labelKey, value, operator = '=', onRemoveLabel, xstyle }: Props) => {
  return (
    <div {...stylex.props(styles.wrapper, xstyle)}>
      {labelKey}
      {operator}
      {value}
      {!!onRemoveLabel && (
        <IconButton
          name="times"
          size="xs"
          onClick={onRemoveLabel}
          tooltip={t('alerting.alert-label.tooltip-remove-label', 'Remove label')}
        />
      )}
    </div>
  );
};

const styles = stylex.create({
  wrapper: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
    color: colors['--gf-colors-text-primary'],
    display: 'inline-block',
    lineHeight: 1.2,
  },
});
