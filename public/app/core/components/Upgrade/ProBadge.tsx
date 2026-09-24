import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { proBadgeStyles } from './ProBadge.stylex';
import { type HTMLAttributes, useEffect } from 'react';

import { reportExperimentView } from '@grafana/runtime';

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

  return <OrangeBadge {...mergeStylexClassName(stylex.props(proBadgeStyles.badge, className), undefined)} {...htmlProps} />;
};

