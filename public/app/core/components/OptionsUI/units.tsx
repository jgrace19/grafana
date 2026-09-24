import * as stylex from '@stylexjs/stylex';

import { type StandardEditorProps, type GrafanaTheme2, type UnitFieldConfigSettings } from '@grafana/data';
import { t } from '@grafana/i18n';
import { IconButton, UnitPicker } from '@grafana/ui';

type Props = StandardEditorProps<string, UnitFieldConfigSettings>;

export function UnitValueEditor({ value, onChange, item, id }: Props) {

  if (item?.settings?.isClearable && value != null) {
    return (
      <div {...stylex.props(unitsStyles.wrapper)}>
        <span {...stylex.props(unitsStyles.first)}>
          <UnitPicker value={value} onChange={onChange} id={id} />
        </span>
        <IconButton
          name="times"
          onClick={() => onChange(undefined)}
          tooltip={t('options-ui.units.clear-tooltip', 'Clear unit selection')}
        />
      </div>
    );
  }
  return <UnitPicker value={value} onChange={onChange} id={id} />;
}

