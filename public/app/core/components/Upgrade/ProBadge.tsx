import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { type HTMLAttributes, useEffect } from 'react';

import { reportExperimentView } from '@grafana/runtime';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { OrangeBadge } from '../Branding/OrangeBadge';

export interface Props extends HTMLAttributes<HTMLSpanElement> {
  experimentId?: string;
  eventVariant?: string;
}

export const ProBadge = ({ className, experimentId, eventVariant = '', ...htmlProps }: Props) => {

  useEffect(() => {
    if (experimentId) {
      reportExperimentView(experimentId, 'test', eventVariant);
    }
  }, [experimentId, eventVariant]);

  return <OrangeBadge className={clsx(stylex.props(styles.badge).className, className)} {...htmlProps} />;
};

const styles = stylex.create({
  badge: {
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.25)`,
  },
});
