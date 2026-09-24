import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logLevelFieldStyles } from './LogLevelField.stylex';
import * as React from 'react';
import { useCallback } from 'react';

import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Checkbox } from '@grafana/ui';

interface Props {
  active: boolean;
  toggle(): void;
}

export function LogLevelField({ active, toggle }: Props): React.JSX.Element | undefined {

  const handleChange = useCallback(() => {
    reportInteraction('logs_field_selector_toggle_log_level_clicked', {
      active,
    });
    toggle();
  }, [active, toggle]);

  return (
    <div {...stylex.props(logLevelFieldStyles.contentWrap)}>
      <Checkbox
        {...stylex.props(logLevelFieldStyles.checkboxLabel)}
        label={t('logs.field-selector.log-level', 'Show log level')}
        onChange={handleChange}
        checked={active}
      />
    </div>
  );
}

