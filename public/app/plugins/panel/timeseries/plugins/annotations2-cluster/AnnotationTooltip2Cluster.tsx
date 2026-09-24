import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { ScrollContainer, usePanelContext } from '@grafana/ui';
import { VizTooltipFooter } from '@grafana/ui/internal';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import alertDef from 'app/features/alerting/state/alertDef';

import { type AnnotationTooltipProps } from './AnnotationTooltip2';
import { AnnotationTooltipBody } from './AnnotationTooltipBody';
import { AnnotationTooltipHeader } from './AnnotationTooltipHeader';
import { getAnnotationTooltip } from './getAnnotationTooltip';

const retFalse = () => false;

export interface AnnotationClusterTooltipProps extends Omit<AnnotationTooltipProps, 'onEdit'> {
  // clustered tooltips need to know which annotation is being edited
  onEdit: (annotationId: number) => void;
}

export const AnnotationTooltip2Cluster = ({
  annoVals,
  annoIdx,
  timeZone,
  onEdit,
  isPinned,
  onClose,
  links,
  actions,
}: AnnotationClusterTooltipProps) => {
  const { canEditAnnotations = retFalse, canDeleteAnnotations = retFalse, onAnnotationDelete } = usePanelContext();

  const annotationTooltipComponents: React.ReactNode[] = [];
  const clusterIdx = annoVals.clusterIdx?.[annoIdx];
  let annotationCount = 0;

  for (let i = 0; i < annoVals.time.length; i++) {
    if (annoVals.clusterIdx?.[i] === clusterIdx && i !== annoIdx) {
      annotationCount++;
      const { onDelete, canEdit, canDelete, time, alertState, avatarImgSrc } = getAnnotationTooltip(
        annoVals,
        i,
        timeZone,
        canEditAnnotations,
        canDeleteAnnotations,
        // @ts-expect-error @todo https://github.com/grafana/grafana/issues/120097 - id is typed incorrectly as string but breaks annotation API
        onAnnotationDelete
      );

      const text = annoVals.text?.[i] ?? '';
      const alertText = annoVals.data?.[i] ? alertDef.getAlertAnnotationText(annoVals.data[i]) : '';
      const title = annoVals.title?.[i] ?? '';
      const annotationId = annoVals.id?.[i];

      annotationTooltipComponents.push(
        <div {...stylex.props(annotationCount % 2 !== 0 ? styles.zebra : styles.annotationWrapper)}>
          <AnnotationTooltipHeader
            clusterIndex={annotationCount}
            avatarImg={avatarImgSrc}
            alertState={alertState}
            timeRange={time}
            canEdit={canEdit}
            canDelete={canDelete}
            isPinned={false}
            onEdit={annotationId != null ? () => onEdit(annotationId) : undefined}
            onDelete={onDelete}
            onRemove={(e) => {
              // Don't trigger onClick
              e.stopPropagation();
              onClose();
            }}
          />

          <AnnotationTooltipBody title={title} text={text} alertText={alertText} tags={annoVals?.tags?.[i] ?? []} />
        </div>
      );
    }
  }

  const { time } = getAnnotationTooltip(
    annoVals,
    annoIdx,
    timeZone,
    canEditAnnotations,
    canDeleteAnnotations,
    // @ts-expect-error @todo https://github.com/grafana/grafana/issues/120097 - id is typed incorrectly as string but breaks annotation API
    onAnnotationDelete
  );

  const count =
    annotationTooltipComponents.length.toString() +
    ' ' +
    t('timeseries.annotation-tooltip2.cluster-header', 'annotations');

  return (
    <div data-testid={selectors.pages.Dashboard.Annotations.clusterTooltip} {...stylex.props(styles.wrapper)}>
      <ScrollContainer maxHeight="260px">
        <AnnotationTooltipHeader
          clusterLength={count}
          isCluster={true}
          timeRange={time}
          canEdit={false}
          canDelete={false}
          isPinned={isPinned}
          onRemove={(e) => {
            // Don't trigger onClick
            e.stopPropagation();
            onClose();
          }}
        />
        {annotationTooltipComponents.map((item, clusterIndex) => (
          <div key={clusterIndex}>
            {item}
            <div {...stylex.props(styles.hr)}></div>
          </div>
        ))}

        {/* @todo move to inner cluster loop when annotation field overrides are supported https://github.com/grafana/grafana/issues/112685, https://github.com/grafana/grafana/issues/119619 */}
        <VizTooltipFooter actions={actions} dataLinks={links ?? []} />
      </ScrollContainer>
    </div>
  );
};

const styles = stylex.create({
  zebra: {
    backgroundColor: colors['--gf-colors-background-primary'],
    paddingBottom: spacing['--gf-spacing-x1-5'],
  },
  annotationWrapper: {
    paddingBottom: spacing['--gf-spacing-x1-5'],
  },
  wrapper: {
    zIndex: zIndex.tooltip,
    whiteSpace: 'initial',
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-elevated'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    boxShadow: shadows['--gf-shadows-z3'],
    userSelect: 'text',
    overflow: 'hidden',
  },
  hr: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-medium'],
    width: '100%',
  },
});
