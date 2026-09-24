import { autoUpdate } from '@floating-ui/dom';
import { useFloating } from '@floating-ui/react';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { type ActionModel, type DataFrame, type InterpolateFunction, type LinkModel } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type TimeZone } from '@grafana/schema';
import { ClickOutsideWrapper, floatingUtils } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape } from '@grafana/ui/stylex/tokens.stylex';
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
      {...mergeStylexProps(stylex.props(isRegion ? styles.annoRegion : styles.annoMarker), {
        style: style ?? undefined,
      })}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
      onClick={() => setPinned(true)}
      onMouseEnter={() => showTooltipOnHover && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-testid={selectors.pages.Dashboard.Annotations.marker}
    >
      {contents &&
        createPortal(
          <div
            ref={refs.setFloating}
            {...mergeStylexProps(stylex.props(styles.annoBox), { style: floatingStyles })}
            data-testid="annotation-marker"
          >
            <ClickOutsideWrapper includeButtonPress={false} useCapture={true} onClick={() => setPinned(false)}>
              {contents}
            </ClickOutsideWrapper>
          </div>,
          portalRoot
        )}
    </button>
  );
};

const styles = stylex.create({
  annoMarker: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopStyle: 'none',
    borderLeftWidth: '5px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightWidth: '5px',
    borderRightStyle: 'solid',
    borderRightColor: 'transparent',
    borderBottomWidth: '5px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'currentcolor',
    transform: 'translateX(-50%)',
    cursor: 'pointer',
    zIndex: 1,
    padding: 0,
    backgroundColor: 'transparent',
    backgroundImage: 'none',
  },
  annoRegion: {
    borderStyle: 'none',
    position: 'absolute',
    height: '5px',
    cursor: 'pointer',
    zIndex: 1,
    padding: 0,
    backgroundColor: 'transparent',
    backgroundImage: 'none',
  },
  // NOTE: shares much with TooltipPlugin2
  annoBox: {
    top: 0,
    left: 0,
    zIndex: zIndex.tooltip,
    borderRadius: shape['--gf-shape-radius-default'],
    position: 'absolute',
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    boxShadow: shadows['--gf-shadows-z2'],
    userSelect: 'text',
    minWidth: '300px',
  },
});
