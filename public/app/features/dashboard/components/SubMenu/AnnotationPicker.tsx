import * as stylex from '@stylexjs/stylex';
import { useEffect, useState, type JSX } from 'react';

import { type AnnotationQuery, type EventBus } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { InlineField, InlineFieldRow, InlineSwitch } from '@grafana/ui';
import { LoadingIndicator, mergeStylexProps } from '@grafana/ui/internal';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { AnnotationQueryFinished, AnnotationQueryStarted } from '../../../../types/events';
import { getDashboardQueryRunner } from '../../../query/state/DashboardQueryRunner/DashboardQueryRunner';

import './AnnotationPicker.css';

export interface AnnotationPickerProps {
  events: EventBus;
  annotation: AnnotationQuery;
  onEnabledChanged: (annotation: AnnotationQuery) => void;
}

export const AnnotationPicker = ({ annotation, events, onEnabledChanged }: AnnotationPickerProps): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const onCancel = () => getDashboardQueryRunner().cancel(annotation);

  useEffect(() => {
    const started = events.getStream(AnnotationQueryStarted).subscribe({
      next: (event) => {
        if (event.payload === annotation) {
          setLoading(true);
        }
      },
    });
    const stopped = events.getStream(AnnotationQueryFinished).subscribe({
      next: (event) => {
        if (event.payload === annotation) {
          setLoading(false);
        }
      },
    });

    return () => {
      started.unsubscribe();
      stopped.unsubscribe();
    };
  });

  return (
    <div
      key={annotation.name}
      {...mergeStylexProps(stylex.props(styles.annotation), { className: 'gf-annotation-picker' })}
    >
      <InlineFieldRow>
        <InlineField
          label={annotation.name}
          disabled={loading}
          data-testid={selectors.pages.Dashboard.SubMenu.Annotations.annotationLabel(annotation.name)}
        >
          <InlineSwitch
            label={annotation.name}
            value={annotation.enable}
            onChange={() => onEnabledChanged(annotation)}
            disabled={loading}
            data-testid={selectors.pages.Dashboard.SubMenu.Annotations.annotationToggle(annotation.name)}
          />
        </InlineField>
        <div {...stylex.props(styles.indicator)}>
          <LoadingIndicator loading={loading} onCancel={onCancel} />
        </div>
      </InlineFieldRow>
    </div>
  );
};

// The rules for the children's legacy classes live in AnnotationPicker.css.
const styles = stylex.create({
  annotation: {
    display: 'inline-block',
    marginRight: spacing['--gf-spacing-x1'],
  },
  indicator: {
    alignSelf: 'center',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
});
