import { FloatingFocusManager, useFloating } from '@floating-ui/react';
import RcDrawer from '@rc-component/drawer';
import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useCallback, useEffect, useId, useState } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { bp, zIndex } from '../../themes/stylex/constants.stylex';
import { colors, components, shadows, spacing } from '../../themes/stylex/tokens.stylex';
import { dragHandleStyles, verticalOffsetStyles } from '../DragHandle/dragHandleStyles';
import { IconButton } from '../IconButton/IconButton';
import { Stack } from '../Layout/Stack/Stack';
import { getPortalContainer } from '../Portal/Portal';
import { ScrollContainer } from '../ScrollContainer/ScrollContainer';
import { Text } from '../Text/Text';

import './Drawer.global.css';

export interface Props {
  children: ReactNode;
  /** Title shown at the top of the drawer */
  title?: ReactNode;
  /** Subtitle shown below the title */
  subtitle?: ReactNode;
  /** Should the Drawer be closable by clicking on the mask, defaults to true */
  closeOnMaskClick?: boolean;
  /** @deprecated */
  inline?: boolean;
  /**
   * @deprecated use the size property instead
   **/
  width?: number | string;
  /**
   * @deprecated use a large size instead if high width is needed
   **/
  expandable?: boolean;
  /**
   * Specifies the width and min-width.
   * sm = width 25vw & min-width 384px
   * md = width 50vw & min-width 568px
   * lg = width 75vw & min-width 744px
   **/
  size?: 'sm' | 'md' | 'lg';
  /** Tabs */
  tabs?: React.ReactNode;
  /**
   * Whether the content should be wrapped in a ScrollContainer
   * Only change this if you intend to manage scroll behaviour yourself
   * (e.g. having a split pane with independent scrolling)
   **/
  scrollableContent?: boolean;
  /** Callback for closing the drawer */
  onClose: () => void;
}

const drawerSizes = {
  sm: { width: '25vw', minWidth: 384 },
  md: { width: '50vw', minWidth: 568 },
  lg: { width: '75vw', minWidth: 744 },
};

/**
 * Drawer is a slide in overlay that can be used to display additional information without hiding the main page content. It can be anchored to the left or right edge of the screen.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/overlays-drawer--docs
 */
export function Drawer({
  children,
  onClose,
  closeOnMaskClick = true,
  scrollableContent = true,
  title,
  subtitle,
  width,
  size = 'md',
  tabs,
}: Props) {
  const [drawerWidth, onMouseDown, onTouchStart] = useResizebleDrawer();

  const titleId = useId();

  const { context, refs } = useFloating({
    open: true,
    onOpenChange: (open) => {
      if (!open) {
        onClose?.();
      }
    },
  });

  // Adds body class while open so the toolbar nav can hide some actions while drawer is open
  useBodyClassWhileOpen();

  const content = <div {...stylex.props(styles.content)}>{children}</div>;
  const overrideWidth = drawerWidth ?? width ?? drawerSizes[size].width;
  const minWidth = drawerSizes[size].minWidth;

  return (
    <RcDrawer
      open={true}
      onClose={onClose}
      placement="right"
      getContainer={'.main-view'}
      className={stylex.props(styles.drawerContent).className}
      rootClassName={stylex.props(styles.drawer).className}
      classNames={{
        wrapper: stylex.props(styles.wrapper).className,
      }}
      styles={{
        wrapper: {
          width: overrideWidth,
          minWidth,
        },
      }}
      aria-label={typeof title === 'string' ? selectors.components.Drawer.General.title(title) : undefined}
      aria-labelledby={title ? titleId : undefined}
      width={''}
      motion={{
        motionAppear: true,
        motionName: 'gf-drawer-motion',
      }}
      maskClassName={stylex.props(styles.mask).className}
      maskClosable={closeOnMaskClick}
      maskMotion={{
        motionAppear: true,
        motionName: 'gf-drawer-mask-motion',
      }}
      // this is handled by floating-ui
      autoFocus={false}
    >
      <FloatingFocusManager context={context} modal getInsideElements={() => [getPortalContainer()]}>
        <div {...stylex.props(styles.container)} ref={refs.setFloating}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            {...stylex.props(
              dragHandleStyles.base,
              dragHandleStyles.vertical,
              dragHandleStyles.verticalGrip,
              verticalOffsetStyles.middle,
              styles.resizer
            )}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
          />
          <div {...stylex.props(styles.header, Boolean(tabs) && styles.headerWithTabs)}>
            <div {...stylex.props(styles.actions)}>
              <IconButton
                name="times"
                variant="secondary"
                onClick={onClose}
                data-testid={selectors.components.Drawer.General.close}
                tooltip={t(`grafana-ui.drawer.close`, 'Close')}
              />
            </div>
            {typeof title === 'string' ? (
              <Stack direction="column">
                <Text element="h3" id={titleId} truncate>
                  {title}
                </Text>
                {subtitle && (
                  <div {...stylex.props(styles.subtitle)} data-testid={selectors.components.Drawer.General.subtitle}>
                    {subtitle}
                  </div>
                )}
              </Stack>
            ) : (
              <div id={titleId}>{title}</div>
            )}
            {tabs && <div {...stylex.props(styles.tabsWrapper)}>{tabs}</div>}
          </div>
          {!scrollableContent ? content : <ScrollContainer showScrollIndicators>{content}</ScrollContainer>}
        </div>
      </FloatingFocusManager>
    </RcDrawer>
  );
}

function useResizebleDrawer(): [
  string | undefined,
  React.EventHandler<React.MouseEvent>,
  React.EventHandler<React.TouchEvent>,
] {
  const [drawerWidth, setDrawerWidth] = useState<string | undefined>(undefined);

  const onMouseMove = useCallback((e: MouseEvent) => {
    setDrawerWidth(getCustomDrawerWidth(e.clientX));
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setDrawerWidth(getCustomDrawerWidth(touch.clientX));
  }, []);

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    },
    [onMouseMove]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    },
    [onTouchMove]
  );

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    // we will only add listeners when needed, and remove them afterward
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    // we will only add listeners when needed, and remove them afterward
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  }

  return [drawerWidth, onMouseDown, onTouchStart];
}

function getCustomDrawerWidth(clientX: number) {
  let offsetRight = document.body.offsetWidth - (clientX - document.body.offsetLeft);
  let widthPercent = Math.min((offsetRight / document.body.clientWidth) * 100, 98).toFixed(2);
  return `${widthPercent}vw`;
}

function useBodyClassWhileOpen() {
  useEffect(() => {
    if (!document.body) {
      return;
    }

    document.body.classList.add('body-drawer-open');

    return () => {
      document.body.classList.remove('body-drawer-open');
    };
  }, []);
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minHeight: '100%',
    position: 'relative',
  },
  drawer: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: 'fixed',
    zIndex: zIndex.modalBackdrop,
    pointerEvents: 'none',
  },
  // rc-drawer puts classNames.wrapper on .rc-drawer-content-wrapper. Its width comes from the inline
  // `styles.wrapper`, which only !important can beat on small screens.
  wrapper: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: zIndex.modalBackdrop,
    boxShadow: shadows['--gf-shadows-z3'],
    width: { default: null, [bp.mdDown]: `calc(100% - ${spacing['--gf-spacing-x2']}) !important` },
    minWidth: { default: null, [bp.mdDown]: '0 !important' },
  },
  drawerContent: {
    backgroundColor: colors['--gf-colors-background-primary'],
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    pointerEvents: 'auto',
    width: '100%',
  },
  // we want the mask itself to span the whole page including the top bar
  // this ensures trying to click something in the top bar will close the drawer correctly
  // but we don't want the backdrop styling to apply over the top bar as it looks weird
  // instead have a child pseudo element to apply the backdrop styling below the top bar
  mask: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'auto',
    position: 'fixed',
    zIndex: zIndex.modalBackdrop,
    '::before': {
      backgroundColor: components['--gf-components-overlay-background'],
      bottom: 0,
      content: '""',
      left: 0,
      position: 'fixed',
      right: 0,
      top: 0,
    },
  },
  header: {
    flexGrow: 0,
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x3'],
    paddingLeft: spacing['--gf-spacing-x2'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
  },
  headerWithTabs: {
    borderBottomStyle: 'none',
  },
  actions: {
    position: 'absolute',
    right: spacing['--gf-spacing-x1'],
    top: spacing['--gf-spacing-x1'],
  },
  subtitle: {
    color: colors['--gf-colors-text-secondary'],
  },
  content: {
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-drawer-padding']})`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-drawer-padding']})`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-drawer-padding']})`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-drawer-padding']})`,
    height: '100%',
    flexGrow: 1,
    minHeight: 0,
  },
  tabsWrapper: {
    paddingLeft: spacing['--gf-spacing-x2'],
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * -3)`,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * -3)`,
  },
  resizer: {
    top: 0,
    left: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
    bottom: 0,
    position: 'absolute',
    zIndex: zIndex.modal,
  },
});
