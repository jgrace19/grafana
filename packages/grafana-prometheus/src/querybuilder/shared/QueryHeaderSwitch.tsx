// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/shared/QueryHeaderSwitch.tsx
import { uniqueId } from 'lodash';
import { type HTMLProps, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';

import { Switch, Stack } from '@grafana/ui';

import { queryHeaderSwitchStyles } from './QueryHeaderSwitch.stylex';

interface Props extends Omit<HTMLProps<HTMLInputElement>, 'value' | 'ref'> {
  value?: boolean;
  label: string;
}

export function QueryHeaderSwitch({ label, ...inputProps }: Props) {
  const dashedLabel = label.replace(' ', '-');
  const switchIdRef = useRef(uniqueId(`switch-${dashedLabel}`));

  return (
    <Stack gap={1}>
      <label htmlFor={switchIdRef.current} {...stylex.props(queryHeaderSwitchStyles.switchLabel)}>
        {label}
      </label>
      <Switch {...inputProps} id={switchIdRef.current} />
    </Stack>
  );
}
