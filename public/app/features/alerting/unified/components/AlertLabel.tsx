import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { IconButton } from '@grafana/ui';

interface Props {
  labelKey: string;
  value: string;
  operator?: string;
  onRemoveLabel?: () => void;
}

export const AlertLabel = ({ labelKey, value, operator = '=', onRemoveLabel }: Props) => {

  return (
    <div {...stylex.props(alertLabelStyles.wrapper)}>
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

