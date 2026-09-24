import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { noOptionsIndicatorStyles } from './NoOptionsIndicator.stylex';

import { t } from '@grafana/i18n';
import {Icon, Stack} from '@grafana/ui';

import { QUERY_EDITOR_COLORS } from '../constants';

interface NoOptionsIndicatorProps {
  name: string;
}

export function NoOptionsIndicator({ name }: NoOptionsIndicatorProps) {

  return (
    <div {...stylex.props(noOptionsIndicatorStyles.wrapper)}>
      <Icon name="check-circle" size="lg" {...stylex.props(noOptionsIndicatorStyles.icon)} />
      <Stack direction="column" gap={0.25}>
        <span {...stylex.props(noOptionsIndicatorStyles.title)}>{t('transformation-editor.no-options.title', 'No options to configure')}</span>
        <span {...stylex.props(noOptionsIndicatorStyles.description)}>
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

