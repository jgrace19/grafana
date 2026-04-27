import { useEffect, useRef, useState } from 'react';

import { type StandardEditorProps, type SelectFieldConfigSettings, type SelectableValue } from '@grafana/data';
import { Select } from '@grafana/ui';

type Props<T> = StandardEditorProps<T, SelectFieldConfigSettings<T>>;

export function SelectValueEditor<T>({ value, onChange, item, id, context }: Props<T>) {
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<Array<SelectableValue<T>>>(item.settings?.options || []);

  const prevSettingsRef = useRef(item?.settings);
  const prevDataRef = useRef(context?.data);

  const updateOptions = async () => {
    const { settings } = item;
    let newOptions: Array<SelectableValue<T>> = item.settings?.options || [];
    if (settings?.getOptions) {
      newOptions = await settings.getOptions(context);
    }
    setIsLoading(false);
    setOptions(newOptions);
  };

  useEffect(() => {
    updateOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const oldSettings = prevSettingsRef.current;
    const newSettings = item?.settings;
    if (oldSettings !== newSettings) {
      updateOptions();
    } else if (newSettings?.getOptions) {
      const oldData = prevDataRef.current;
      const newData = context?.data;
      if (oldData !== newData) {
        updateOptions();
      }
    }
    prevSettingsRef.current = item?.settings;
    prevDataRef.current = context?.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.settings, context?.data]);

  const { settings } = item;
  let current = options.find((v) => v.value === value);
  if (!current && value) {
    current = {
      label: `${value}`,
      value,
    };
  }
  return (
    <Select<T>
      inputId={id}
      isLoading={isLoading}
      value={current}
      defaultValue={value}
      allowCustomValue={settings?.allowCustomValue}
      isClearable={settings?.isClearable}
      onChange={(e) => onChange(e?.value)}
      options={options}
    />
  );
}
