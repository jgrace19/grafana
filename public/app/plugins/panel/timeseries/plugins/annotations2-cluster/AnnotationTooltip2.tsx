import * as stylex from '@stylexjs/stylex';

import { type ActionModel, type LinkModel } from '@grafana/data';
import { usePanelContext } from '@grafana/ui';
import { VizTooltipFooter } from '@grafana/ui/internal';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...stylex.props(styles.wrapper)}>
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

const styles = stylex.create({
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
  },
});
