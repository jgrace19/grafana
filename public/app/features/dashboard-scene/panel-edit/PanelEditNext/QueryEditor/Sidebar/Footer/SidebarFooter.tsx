import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Icon, Stack, Text, useTheme2 } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { getQueryEditorColors, QueryEditorType } from '../../../constants';
import {
  useAlertingContext,
  usePanelContext,
  useQueryEditorUIContext,
  useQueryRunnerContext,
} from '../../QueryEditorContext';

export function SidebarFooter() {
  const { queries } = useQueryRunnerContext();
  const { transformations } = usePanelContext();
  const { alertRules } = useAlertingContext();
  const { cardType } = useQueryEditorUIContext();
  const themeColors = getQueryEditorColors(useTheme2());

  const isAlertView = cardType === QueryEditorType.Alert;
  const total = isAlertView ? alertRules.length : queries.length + transformations.length;
  const hidden = isAlertView
    ? 0
    : queries.filter((q) => q.hide).length + transformations.filter((t) => t.transformConfig.disabled).length;
  const visible = total - hidden;

  const suffixText = isAlertView
    ? t('query-editor-next.sidebar.footer-items-alert', '{{count}} alerts', { count: total })
    : t('query-editor-next.sidebar.footer-items', '{{count}} items', { count: total });

  return (
    <div {...stylex.props(styles.footer, styles.background(themeColors.sidebarFooterBackground))}>
      <Text weight="medium" variant="bodySmall">
        {suffixText}
      </Text>
      {!isAlertView && (
        <Stack direction="row" alignItems="center" gap={2}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Icon name="eye" size="sm" xstyle={styles.icon} />
            <Text weight="medium" variant="bodySmall">
              {visible}
            </Text>
          </Stack>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Icon name="eye-slash" size="sm" xstyle={styles.icon} />
            <Text weight="medium" variant="bodySmall">
              {hidden}
            </Text>
          </Stack>
        </Stack>
      )}
    </div>
  );
}

const styles = stylex.create({
  footer: {
    marginTop: 'auto',
    paddingTop: spacing['--gf-spacing-x0'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    paddingBottom: spacing['--gf-spacing-x0'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    // FOOTER_HEIGHT in ../../../constants.ts
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 'unset',
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-weak'],
  },
  background: (backgroundColor: string) => ({ backgroundColor }),
  icon: {
    color: colors['--gf-colors-text-secondary'],
  },
});
