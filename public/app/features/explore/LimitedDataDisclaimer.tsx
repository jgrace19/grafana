import * as stylex from '@stylexjs/stylex';
import React from 'react';

import { Button, Icon, Tooltip } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

type Props = {
  toggleShowAllSeries: () => void;
  info: React.ReactNode;
  tooltip: string;
  buttonLabel: React.ReactNode;
};

export function LimitedDataDisclaimer(props: Props) {
  const { toggleShowAllSeries, info, tooltip, buttonLabel } = props;

  return (
    <div key="disclaimer" {...stylex.props(styles.disclaimer)}>
      <span {...stylex.props(styles.warningMessage)}>
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

const styles = stylex.create({
  disclaimer: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
  },
  warningMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
    color: colors['--gf-colors-warning-main'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
