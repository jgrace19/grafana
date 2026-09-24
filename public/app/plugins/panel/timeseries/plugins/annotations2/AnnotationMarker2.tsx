import * as stylex from '@stylexjs/stylex';
import { annotationMarker2Styles } from './AnnotationMarker2.stylex';

import { autoUpdate } from '@floating-ui/dom';
import { useFloating } from '@floating-ui/react';
import { useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import {
  type ActionModel,
  type DataFrame,
  type GrafanaTheme2,
  type InterpolateFunction,
  type LinkModel,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type TimeZone } from '@grafana/schema';
import { ClickOutsideWrapper, floatingUtils } from '@grafana/ui';
import { getDataLinks, getFieldActions } from 'app/plugins/panel/status-history/utils';

import { AnnotationEditor2 } from './AnnotationEditor2';
import { AnnotationTooltip2 } from './AnnotationTooltip2';

interface AnnotationMarkerProps {
  // Annotation dataframe
  frame: DataFrame;
  // The values from the annotation fields
  annoVals: Record<string, any[]>;
  // The value index, sometimes called rowIndex
  annoIdx: number;
  // Styles calculated from plot, e.g. calculated region width & annotation offset
  style: React.CSSProperties | null;
  // Method to close user created (wip) annotation
  exitWipEdit?: null | (() => void);
  // From PanelContext.canExecuteActions(), controls whether the user has permission to execute field actions
  canExecuteActions: boolean;
  // Sets if the user pinned via keyboard or mouse click
  setPinned: (pin: boolean) => void;
  // Current pin state
  isPinned: boolean;
  // Determines if we should display the tooltip when hovering, keeps adjacent annotations from rendering a tooltip that overlays the pinned tooltip
  showTooltipOnHover: boolean;
  timeZone: TimeZone;
  portalRoot: HTMLElement;
  replaceVariables: InterpolateFunction;
}

const STATE_DEFAULT = 0;
const STATE_EDITING = 1;

export const AnnotationMarker2 = ({
  frame,
  annoVals,
  annoIdx,
  style,
  exitWipEdit,
  timeZone,
  portalRoot,
  replaceVariables,
  canExecuteActions,
  setPinned,
  showTooltipOnHover,
  isPinned,
}: AnnotationMarkerProps) => {
  const placement = 'bottom';
  const isRegion = annoVals?.isRegion?.[annoIdx] === true;

  const [state, setState] = useState(exitWipEdit != null ? STATE_EDITING : STATE_DEFAULT);
  const [isHovering, setIsHovering] = useState(false);
  const { refs, floatingStyles } = useFloating({
    open: true,
    placement,
    middleware: floatingUtils.getPositioningMiddleware(placement),
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
  });

  const onClose = () => {
    setPinned(false);
    setIsHovering(false);
  };
  const links: LinkModel[] = [];
  const actions: ActionModel[] = [];

  if (isHovering || isPinned) {
    frame.fields.forEach((field) => {
      // @todo https://github.com/grafana/grafana/issues/119619, need to set getLinks on field, or applyFieldOverrides on dataframe
      links.push(...getDataLinks(field, annoIdx));

      if (canExecuteActions) {
        actions.push(...getFieldActions(frame, field, replaceVariables, annoIdx));
      }
    });
  }

  // Is the annotation being edited
  const showEditor = state === STATE_EDITING;
  // Is the tooltip pinned and not being edited
  const isTooltipPinned = isPinned && !showEditor;
  // Is the tooltip hovered and another tooltip is not pinned and not being edited
  const isTooltipHovered = showTooltipOnHover && isHovering && !showEditor;
  // Show the tooltip if pinned or hovered
  const showTooltip = isTooltipPinned || isTooltipHovered;

  const contents = showTooltip ? (
    <AnnotationTooltip2
      annoIdx={annoIdx}
      annoVals={annoVals}
      timeZone={timeZone}
      onClose={onClose}
      isPinned={isPinned}
      onEdit={() => setState(STATE_EDITING)}
      links={links}
      actions={actions}
    />
  ) : showEditor ? (
    <AnnotationEditor2
      annoIdx={annoIdx}
      annoVals={annoVals}
      timeZone={timeZone}
      dismiss={() => {
        exitWipEdit?.();
        setState(STATE_DEFAULT);
        onClose();
      }}
    />
  ) : null;

  return (
    <button
      aria-label={
        isRegion
          ? t('timeseries.annotation-marker.annotation-region-label', 'Annotation region')
          : t('timeseries.annotation-marker.annotation-label', 'Annotation')
      }
      ref={refs.setReference}
      className={isRegion ? (annotationMarker2Styles.annoRegion) : styles.annoMarker}
      style={style!}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
      onClick={() => setPinned(true)}
      onMouseEnter={() => showTooltipOnHover && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-testid={selectors.pages.Dashboard.Annotations.marker}
    >
      {contents &&
        createPortal(
          <div ref={refs.setFloating} {...stylex.props(annotationMarker2Styles.annoBox)} style={floatingStyles} data-testid="annotation-marker">
            <ClickOutsideWrapper includeButtonPress={false} useCapture={true} onClick={() => setPinned(false)}>
              {contents}
            </ClickOutsideWrapper>
          </div>,
          portalRoot
        )}
    </button>
  );
};

