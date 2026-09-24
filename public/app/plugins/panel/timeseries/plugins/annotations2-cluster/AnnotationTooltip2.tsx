import * as stylex from '@stylexjs/stylex';
import { annotationTooltip2Styles } from './AnnotationTooltip2.stylex';

import { type ActionModel, type GrafanaTheme2, type LinkModel } from '@grafana/data';
import { usePanelContext } from '@grafana/ui';
import { VizTooltipFooter } from '@grafana/ui/internal';

import { AnnotationTooltipBody } from './AnnotationTooltipBody';
import { AnnotationTooltipHeader } from './AnnotationTooltipHeader';
import { getAnnotationTooltip } from './getAnnotationTooltip';
import { type AnnotationVals } from './types';

export interface AnnotationTooltipProps {
  annoVals: AnnotationVals;
  annoIdx: number;
  timeZone: string;
  isPinned: boolean;
  onClose: () => void;
  onEdit?: () => void;
  links?: LinkModel[];
  actions?: ActionModel[];
}

const retFalse = () => false;

export const AnnotationTooltip2 = ({
  annoVals,
  annoIdx,
  timeZone,
  isPinned,
  onClose,
  onEdit,
  links = [],
  actions = [],
}: AnnotationTooltipProps) => {
  const { canEditAnnotations = retFalse, canDeleteAnnotations = retFalse, onAnnotationDelete } = usePanelContext();
  const { onDelete, canEdit, canDelete, time, text, alertText, alertState, avatarImgSrc, title } = getAnnotationTooltip(
    annoVals,
    annoIdx,
    timeZone,
    canEditAnnotations,
    canDeleteAnnotations,
    // @ts-expect-error @todo https://github.com/grafana/grafana/issues/120097 - id is typed incorrectly as string but breaks annotation API
    onAnnotationDelete
  );

  return (
    <div {...stylex.props(annotationTooltip2Styles.wrapper)}>
      <AnnotationTooltipHeader
        avatarImg={avatarImgSrc}
        alertState={alertState}
        timeRange={time}
        canEdit={canEdit}
        canDelete={canDelete}
        isPinned={isPinned}
        onEdit={onEdit}
        onDelete={onDelete}
        onRemove={(e) => {
          // Don't trigger onClick
          e.stopPropagation();
          onClose();
        }}
      />

      <AnnotationTooltipBody title={title} text={text} alertText={alertText} tags={annoVals.tags?.[annoIdx] ?? []} />

      {(links.length > 0 || actions.length > 0) && <VizTooltipFooter dataLinks={links} actions={actions} />}
    </div>
  );
};

