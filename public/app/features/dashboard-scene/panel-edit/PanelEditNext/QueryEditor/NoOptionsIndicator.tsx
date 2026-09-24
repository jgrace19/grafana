import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Icon, Stack } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

interface NoOptionsIndicatorProps {
  name: string;
}

export function NoOptionsIndicator({ name }: NoOptionsIndicatorProps) {
  return (
    <div {...stylex.props(styles.wrapper)}>
      <Icon name="check-circle" size="lg" xstyle={styles.icon} />
      <Stack direction="column" gap={0.25}>
        <span {...stylex.props(styles.title)}>
          {t('transformation-editor.no-options.title', 'No options to configure')}
        </span>
        <span {...stylex.props(styles.description)}>
          {t(
            'transformation-editor.no-options.description',
            '{{name}} will be applied automatically to your data unless the transformation is disabled.',
            {
              name,
              interpolation: { escapeValue: false },
            }
          )}
        </span>
      </Stack>
    </div>
  );
}

// QUERY_EDITOR_COLORS.transformation in ../constants.ts
const transformationColor = '#00D492';

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1-5'],
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
    borderRadius: shape['--gf-shape-radius-default'],
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: `color-mix(in srgb, ${transformationColor} 10%, ${colors['--gf-colors-background-secondary']} 100%)`,
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      backgroundColor: transformationColor,
    },
  },
  icon: {
    color: transformationColor,
    flexShrink: 0,
  },
  title: {
    fontSize: typography['--gf-typography-body-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-primary'],
  },
  description: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
  },
});
