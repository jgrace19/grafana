import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { annotationPickerStyles } from './AnnotationPicker.stylex';
import { useEffect, useState, type JSX } from 'react';

import { type AnnotationQuery, type EventBus, type GrafanaTheme2 } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { InlineField, InlineFieldRow, InlineSwitch, useStyles2 } from '@grafana/ui';
import { LoadingIndicator } from '@grafana/ui/internal';

import { AnnotationQueryFinished, AnnotationQueryStarted } from '../../../../types/events';
import { getDashboardQueryRunner } from '../../../query/state/DashboardQueryRunner/DashboardQueryRunner';

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
    <div key={annotation.name} {...stylex.props(annotationPickerStyles.annotation)}>
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
        <div {...stylex.props(annotationPickerStyles.indicator)}>
          <LoadingIndicator loading={loading} onCancel={onCancel} />
        </div>
      </InlineFieldRow>
    </div>
  );
};

