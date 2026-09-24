import * as stylex from '@stylexjs/stylex';

import { InternalTimeZones, type StandardEditorProps } from '@grafana/data';
import { t } from '@grafana/i18n';
import { type OptionsWithTimezones } from '@grafana/schema';
import { IconButton, TimeZonePicker } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

type Props = StandardEditorProps<string[], unknown, OptionsWithTimezones>;

export const TimezonesEditor = ({ value, onChange }: Props) => {
  if (!value || value.length < 1) {
    value = [''];
  }

  const addTimezone = () => {
    onChange([...value, InternalTimeZones.default]);
  };

  const removeTimezone = (idx: number) => {
    const copy = value.slice();
    copy.splice(idx, 1);
    onChange(copy);
  };

  const setTimezone = (idx: number, tz?: string) => {
    const copy = value.slice();
    copy[idx] = tz ?? InternalTimeZones.default;
    if (copy.length === 0 || (copy.length === 1 && copy[0] === '')) {
      onChange(undefined);
    } else {
      onChange(copy);
    }
  };

  return (
    <ul {...stylex.props(styles.list)}>
      {value.map((tz, idx) => (
        <li {...stylex.props(styles.listItem)} key={`${idx}.${tz}`}>
          <TimeZonePicker
            onChange={(v) => setTimezone(idx, v)}
            includeInternal={true}
            value={tz ?? InternalTimeZones.default}
          />
          {idx === value.length - 1 ? (
            <IconButton
              name="plus"
              onClick={addTimezone}
              tooltip={t('timeseries.timezones-editor.tooltip-add-timezone', 'Add timezone')}
            />
          ) : (
            <IconButton
              name="times"
              onClick={() => removeTimezone(idx)}
              tooltip={t('timeseries.timezones-editor.tooltip-remove-timezone', 'Remove timezone')}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

const styles = stylex.create({
  list: {
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x0-5'],
  },
  listItem: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
  },
});
