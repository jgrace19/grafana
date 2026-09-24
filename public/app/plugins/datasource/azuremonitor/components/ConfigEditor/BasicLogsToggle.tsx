import * as stylex from '@stylexjs/stylex';
import { basicLogsToggleStyles } from './BasicLogsToggle.stylex';

import * as React from 'react';

import { Trans, t } from '@grafana/i18n';
import { Field, Switch, TextLink, useTheme2 } from '@grafana/ui';

import { type AzureMonitorDataSourceJsonData } from '../../types/types';

export interface Props {
  options: AzureMonitorDataSourceJsonData;
  onBasicLogsEnabledChange: (basicLogsEnabled: boolean) => void;
}

export const BasicLogsToggle = (props: Props) => {
  const { options, onBasicLogsEnabledChange } = props;

  const theme = useTheme2();
  