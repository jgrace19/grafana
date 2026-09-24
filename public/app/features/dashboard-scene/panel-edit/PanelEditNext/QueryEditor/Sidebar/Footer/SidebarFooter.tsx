import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { sidebarFooterStyles } from './SidebarFooter.stylex';

import { t } from '@grafana/i18n';
import {Icon, Stack, Text} from '@grafana/ui';

import { FOOTER_HEIGHT, getQueryEditorColors, QueryEditorType } from '../../../constants';
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
    <div {...stylex.props(sidebarFooterStyles.footer)}>
      <Text weight="medium" variant="bodySmall">
        {suffixText}
      </Text>
      {!isAlertView && (
        <Stack direction="row" alignItems="center" gap={2}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Icon name="eye" size="sm" {...stylex.props(sidebarFooterStyles.icon)} />
            <Text weight="medium" variant="bodySmall">
              {visible}
            </Text>
          </Stack>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Icon name="eye-slash" size="sm" {...stylex.props(sidebarFooterStyles.icon)} />
            <Text weight="medium" variant="bodySmall">
              {hidden}
            </Text>
          </Stack>
        </Stack>
      )}
    </div>
  );
}


