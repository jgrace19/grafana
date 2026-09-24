import { useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import * as stylex from '@stylexjs/stylex';
import { useMemo, type ReactNode } from 'react';

import { type ActionModel, type LinkModel } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shadows, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { getPositioningMiddleware } from '../../utils/floating';
import { Portal } from '../Portal/Portal';
import { VizTooltipFooter } from '../VizTooltip/VizTooltipFooter';
import { VizTooltipWrapper } from '../VizTooltip/VizTooltipWrapper';

import { type DataLinksActionsTooltipCoords } from './utils';

interface Props {
  links: LinkModel[];
  actions?: ActionModel[];
  value?: ReactNode;
  coords: DataLinksActionsTooltipCoords;
  onTooltipClose?: () => void;
}

/**
 *
 * @internal
 */
export const DataLinksActionsTooltip = ({ links, actions, value, coords, onTooltipClose }: Props) => {
  const theme = useTheme2();
  const placement = 'right-start';

  // the order of middleware is important!
  const middleware = getPositioningMiddleware(placement);

  const virtual = useMemo(() => {
    const { clientX, clientY } = coords;

    // https://floating-ui.com/docs/virtual-elements
    return {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: clientX,
          y: clientY,
          top: clientY,
          left: clientX,
          right: clientX,
          bottom: clientY,
        };
      },
    };
  }, [coords]);

  const refCallback = (el: HTMLDivElement) => {
    refs.setFloating(el);
    refs.setReference(virtual);
  };

  const { context, refs, floatingStyles } = useFloating({
    open: true,
    placement,
    onOpenChange: onTooltipClose,
    middleware,
    // whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([dismiss]);

  if (links.length === 0 && !Boolean(actions?.length)) {
    return null;
  }

  return (
    <>
      {/* TODO: we can remove `value` from this component when TableRT is fully deprecated */}
      {value}
      <Portal zIndex={theme.zIndex.tooltip}>
        <div
          ref={refCallback}
          {...getReferenceProps()}
          {...getFloatingProps()}
          {...mergeStylexProps(stylex.props(styles.tooltipWrapper), { style: floatingStyles })}
          data-testid={selectors.components.DataLinksActionsTooltip.tooltipWrapper}
        >
          <VizTooltipWrapper>
            <VizTooltipFooter dataLinks={links} actions={actions} />
          </VizTooltipWrapper>
        </div>
      </Portal>
    </>
  );
};

export const renderSingleLink = (link: LinkModel, children: ReactNode, className?: string): ReactNode => {
  return (
    <a
      href={link.href}
      onClick={link.onClick}
      target={link.target}
      title={link.title}
      data-testid={selectors.components.DataLinksContextMenu.singleLink}
      className={className}
    >
      {children}
    </a>
  );
};

const styles = stylex.create({
  tooltipWrapper: {
    whiteSpace: 'pre',
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    boxShadow: shadows['--gf-shadows-z3'],
    maxHeight: `calc(100vh - ${spacing['--gf-spacing-x4']})`,
    overflowX: 'hidden',
    userSelect: 'text',
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
