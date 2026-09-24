import * as stylex from '@stylexjs/stylex';

import { type StandardEditorProps, type UnitFieldConfigSettings } from '@grafana/data';
import { t } from '@grafana/i18n';
import { IconButton, UnitPicker } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

type Props = StandardEditorProps<string, UnitFieldConfigSettings>;

export function UnitValueEditor({ value, onChange, item, id }: Props) {
  if (item?.settings?.isClearable && value != null) {
    return (
      <div {...stylex.props(styles.wrapper)}>
        <span {...stylex.props(styles.first)}>
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

const styles = stylex.create({
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  first: {
    marginRight: spacing['--gf-spacing-x1'],
    flexGrow: 2,
  },
});
