import * as stylex from '@stylexjs/stylex';
import { timezonesEditorStyles } from './TimezonesEditor.stylex';

import { t } from '@grafana/i18n';
import { type OptionsWithTimezones } from '@grafana/schema';
import { IconButton, TimeZonePicker } from '@grafana/ui';

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
    <ul {...stylex.props(timezonesEditorStyles.list)}>
      {value.map((tz, idx) => (
        <li {...stylex.props(timezonesEditorStyles.listItem)} key={`${idx}.${tz}`}>
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

