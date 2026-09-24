import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { limitedDataDisclaimerStyles } from './LimitedDataDisclaimer.stylex';
import React from 'react';

import { Button, Icon, Tooltip, useStyles2 } from '@grafana/ui';

type Props = {
  toggleShowAllSeries: () => void;
  info: React.ReactNode;
  tooltip: string;
  buttonLabel: React.ReactNode;
};

export function LimitedDataDisclaimer(props: Props) {
  const { toggleShowAllSeries, info, tooltip, buttonLabel } = props;

  return (
    <div key="disclaimer" {...stylex.props(limitedDataDisclaimerStyles.disclaimer)}>
      <span {...stylex.props(limitedDataDisclaimerStyles.warningMessage)}>
        <Icon name="exclamation-triangle" aria-hidden="true" />
        {info}
      </span>

      <Tooltip content={tooltip}>
        <Button variant="secondary" size="sm" onClick={toggleShowAllSeries}>
          {buttonLabel}
        </Button>
      </Tooltip>
    </div>
  );
}

