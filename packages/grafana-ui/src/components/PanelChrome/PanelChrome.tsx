import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { type CSSProperties, type ReactElement, type ReactNode, useId, useState } from 'react';
import * as React from 'react';
import { useMeasure, useToggle } from 'react-use';

import { type GrafanaTheme2, LoadingState } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { mixins } from '../../themes/stylex/mixins';
import { colors, components, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { DelayRender } from '../../utils/DelayRender';
import { getFeatureToggle } from '../../utils/featureToggle';
import { usePointerDistance } from '../../utils/usePointerDistance';
import { useElementSelection } from '../ElementSelectionContext/ElementSelectionContext';
import { Icon } from '../Icon/Icon';
import { LoadingBar } from '../LoadingBar/LoadingBar';
import { Text } from '../Text/Text';
import { Tooltip } from '../Tooltip/Tooltip';

import { HoverWidget } from './HoverWidget';
import { PanelDescription } from './PanelDescription';
import { PanelMenu } from './PanelMenu';
import { PanelStatus } from './PanelStatus';
import { TitleItem } from './TitleItem';

import './PanelChrome.css';

/**
 * @internal
 */
export type PanelChromeProps = (AutoSize | FixedDimensions) & (Collapsible | HoverHeader);

interface BaseProps {
  padding?: PanelPadding;
  title?: string | React.ReactElement;
  description?: string | (() => string);
  titleItems?: ReactNode;
  menu?: ReactElement | (() => ReactElement);
  dragClass?: string;
  dragClassCancel?: string;
  onDragStart?: (e: React.PointerEvent) => void;
  selectionId?: string;
  /**
   * Use only to indicate loading or streaming data in the panel.
   * Any other values of loadingState are ignored.
   */
  loadingState?: LoadingState;
  /**
   * Used to display status message (used for panel errors currently)
   */
  statusMessage?: string;
  /**
   * Handle opening error details view (like inspect / error tab)
   */
  statusMessageOnClick?: (e: React.SyntheticEvent) => void;
  /**
   * @deprecated use `actions' instead
   **/
  leftItems?: ReactNode[];
  actions?: ReactNode;
  displayMode?: 'default' | 'transparent';
  onCancelQuery?: () => void;
  /**
   * callback when opening the panel menu
   */
  onOpenMenu?: () => void;
  /**
   * Used for setting panel attention
   */
  onFocus?: () => void;
  /**
   * Debounce the event handler, if possible
   */
  onMouseMove?: () => void;
  onMouseEnter?: () => void;
  /**
   * If true, the VizPanelMenu will always be visible in the panel header. Defaults to false.
   */
  showMenuAlways?: boolean;
  /**
   * Content to display in the sub-header area below the main header.
   * Can contain text, pills, links, buttons, or any other React elements.
   */
  subHeaderContent?: ReactNode;
}

interface FixedDimensions extends BaseProps {
  width: number;
  height: number;
  children: (innerWidth: number, innerHeight: number) => ReactNode;
}

interface AutoSize extends BaseProps {
  width?: never;
  height?: never;
  children: ReactNode;
}

interface Collapsible {
  collapsible: boolean;
  collapsed?: boolean;
  /**
   * callback when collapsing or expanding the panel
   */
  onToggleCollapse?: (collapsed: boolean) => void;
  hoverHeader?: never;
  hoverHeaderOffset?: never;
}

interface HoverHeader {
  collapsible?: never;
  collapsed?: never;
  showMenuAlways?: never;
  onToggleCollapse?: never;
  hoverHeader?: boolean;
  hoverHeaderOffset?: number;
}

/**
 * @internal
 */
export type PanelPadding = 'none' | 'md';

/**
 * Component used for rendering content wrapped in the same style as grafana panels.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/plugins-panelchrome--docs
 *
 * @internal
 */
export function PanelChrome({
  width,
  height,
  children,
  padding = 'md',
  title = '',
  description = '',
  displayMode = 'default',
  titleItems,
  menu,
  dragClass,
  dragClassCancel,
  hoverHeader = false,
  hoverHeaderOffset,
  loadingState,
  statusMessage,
  statusMessageOnClick,
  leftItems,
  actions,
  selectionId,
  onCancelQuery,
  onOpenMenu,
  collapsible = false,
  collapsed,
  onToggleCollapse,
  onFocus,
  onMouseMove,
  onMouseEnter,
  onDragStart,
  showMenuAlways = false,
  subHeaderContent,
}: PanelChromeProps) {
  const theme = useTheme2();
  const newPanelPadding = getFeatureToggle('newPanelPadding');
  const panelContentId = useId();
  const panelTitleId = useId().replace(/:/g, '_');
  const { isSelected, onSelect, isSelectable } = useElementSelection(selectionId);
  const pointerDistance = usePointerDistance();
  const [subHeaderRef, { height: measuredSubHeaderHeight }] = useMeasure<HTMLDivElement>();

  const hasHeader = !hoverHeader;

  const [isOpen, toggleOpen] = useToggle(true);

  // Highlight the full panel when hovering over header
  const [selectableHighlight, setSelectableHighlight] = useState(false);
  const onHeaderEnter = React.useCallback(() => setSelectableHighlight(true), []);
  const onHeaderLeave = React.useCallback(() => setSelectableHighlight(false), []);
  const isSelectableHighlighted = !isSelected && isSelectable && selectableHighlight;

  // if collapsed is not defined, then component is uncontrolled and state is managed internally
  if (collapsed === undefined) {
    collapsed = !isOpen;
  }

  // hover menu is only shown on hover when not on touch devices
  const showOnHoverClass = showMenuAlways ? 'always-show' : 'show-on-hover';
  const isPanelTransparent = displayMode === 'transparent';

  const headerHeight = getHeaderHeight(theme, hasHeader);
  const subHeaderHeight = Math.min(measuredSubHeaderHeight, headerHeight);
  const { contentStyle, innerWidth, innerHeight } = getContentStyle(
    padding,
    theme,
    headerHeight,
    collapsed,
    subHeaderHeight,
    height,
    width
  );

  const headerStyles: CSSProperties = {
    height: headerHeight,
    cursor: dragClass ? 'move' : 'auto',
  };

  const containerStyles: CSSProperties = { width, height: collapsed ? undefined : height };
  const [ref, { width: loadingBarWidth }] = useMeasure<HTMLDivElement>();

  /** Old property name now maps to actions */
  if (leftItems) {
    actions = leftItems;
  }

  const testid = typeof title === 'string' ? selectors.components.Panels.Panel.title(title) : 'Panel';

  // Handle drag & selection events
  // Mainly the tricky bit of differentiating between dragging and selecting
  const onPointerUp = React.useCallback(
    (evt: React.PointerEvent) => {
      if (
        pointerDistance.check(evt) ||
        (dragClassCancel && evt.target instanceof Element && evt.target.closest(`.${dragClassCancel}`))
      ) {
        return;
      }
      // setTimeout is needed here because onSelect stops the event propagation
      // By doing so, the event won't get to the document and drag will never be stopped
      setTimeout(() => onSelect?.(evt));
    },
    [dragClassCancel, onSelect, pointerDistance]
  );

  const onPointerDown = React.useCallback(
    (evt: React.PointerEvent) => {
      evt.stopPropagation();

      pointerDistance.set(evt);

      onDragStart?.(evt);
    },
    [pointerDistance, onDragStart]
  );

  const onContentPointerDown = React.useCallback(
    (evt: React.PointerEvent) => {
      // Ignore clicks inside buttons, links, canvas and svg elments
      // This does prevent a clicks inside a graphs from selecting panel as there is normal div above the canvas element that intercepts the click
      // '[role="columnheader"]' targets table column headers (e.g. react-data-grid), preventing sort clicks
      // and column resize drags from selecting the panel in edit mode.
      // '.u-axis' targets uPlot axis elements, preventing axis interactions from selecting the panel.
      if (
        evt.target instanceof Element &&
        (evt.target.closest('button,a,canvas,svg,[role="button"],#grafana-portal-container,[role="columnheader"]') ||
          evt.target.classList.contains('u-over') ||
          evt.target.classList.contains('u-axis'))
      ) {
        // Stop propagation otherwise row config editor will get selected
        evt.stopPropagation();
        return;
      }

      onSelect?.(evt);
    },
    [onSelect]
  );

  const headerContent = (
    <>
      {/* Non collapsible title */}
      {!collapsible && title && (
        <div {...mergeStylexProps(stylex.props(styles.title), { className: 'gf-panel-chrome-title' })}>
          <Text
            element="h2"
            variant="h6"
            truncate
            title={typeof title === 'string' ? title : undefined}
            id={panelTitleId}
          >
            {title}
          </Text>
        </div>
      )}

      {/* Collapsible title */}
      {collapsible && (
        <div {...mergeStylexProps(stylex.props(styles.title), { className: 'gf-panel-chrome-title' })}>
          <Text element="h2" variant="h6">
            <button
              type="button"
              {...stylex.props(styles.clearButtonStyles)}
              onClick={() => {
                toggleOpen();
                if (onToggleCollapse) {
                  onToggleCollapse(!collapsed);
                }
              }}
              aria-expanded={!collapsed}
              aria-controls={!collapsed ? panelContentId : undefined}
            >
              <Icon
                name={!collapsed ? 'angle-down' : 'angle-right'}
                aria-hidden={!!title}
                aria-label={
                  !title ? t('grafana-ui.panel-chrome.aria-label-toggle-collapse', 'toggle collapse panel') : undefined
                }
              />
              <Text variant="h6" truncate id={panelTitleId}>
                {title}
              </Text>
            </button>
          </Text>
        </div>
      )}

      {(titleItems || description) && (
        <div
          {...mergeStylexProps(stylex.props(styles.titleItems), { className: dragClassCancel })}
          data-testid="title-items-container"
        >
          <PanelDescription description={description} className={dragClassCancel} />
          {titleItems}
        </div>
      )}

      {loadingState === LoadingState.Streaming && (
        <Tooltip
          content={
            onCancelQuery
              ? t('grafana-ui.panel-chrome.tooltip-stop-streaming', 'Stop streaming')
              : t('grafana-ui.panel-chrome.tooltip-streaming', 'Streaming')
          }
        >
          <TitleItem className={dragClassCancel} data-testid="panel-streaming" onClick={onCancelQuery}>
            <Icon name="circle-mono" size="md" xstyle={styles.streaming} />
          </TitleItem>
        </Tooltip>
      )}
      {loadingState === LoadingState.Loading && onCancelQuery && (
        <DelayRender delay={2000}>
          <Tooltip content={t('grafana-ui.panel-chrome.tooltip-cancel', 'Cancel query')}>
            <TitleItem className={dragClassCancel} data-testid="panel-cancel-query" onClick={onCancelQuery}>
              <Icon name="sync-slash" size="md" />
            </TitleItem>
          </Tooltip>
        </DelayRender>
      )}
      {!hoverHeader && <div {...stylex.props(styles.flexGrow)} />}
      {actions && itemsRenderer(actions, (item) => item)}
    </>
  );

  // Ignores streaming and loading (cancel query) states for simplicity
  // If you need to cancel streaming / loading panels set a title
  const hasHeaderContent = title || description || titleItems || menu || dragClass || actions;

  return (
    <div {...stylex.props(styles.container)}>
      {/* tabIndex={0} is needed for keyboard accessibility in the plot area */}
      <section
        {...mergeStylexProps(
          stylex.props(
            mixins.focusRing,
            styles.panel,
            isPanelTransparent && styles.panelTransparent,
            isSelectableHighlighted &&
              styles.selectableHighlight(
                isPanelTransparent ? 'transparent' : components['--gf-components-panel-background'],
                theme.colors.emphasize(theme.colors.background.canvas, 0.08)
              )
          ),
          {
            className: clsx(
              // dashboard-scene finds panels with `section[class*="panel-container"]`
              'gf-panel-container',
              isSelected && 'dashboard-selected-element',
              isSelectableHighlighted && 'dashboard-selectable-element'
            ),
            style: containerStyles,
          }
        )}
        aria-labelledby={!!title ? panelTitleId : undefined}
        data-testid={testid}
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
        onFocus={onFocus}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        ref={ref}
      >
        <div {...stylex.props(styles.loadingBarContainer)}>
          {loadingState === LoadingState.Loading ? (
            <LoadingBar
              width={loadingBarWidth}
              ariaLabel={t('grafana-ui.panel-chrome.ariaLabel-panel-loading', 'Panel loading bar')}
            />
          ) : null}
        </div>

        {hoverHeader && (
          <>
            {hasHeaderContent && (
              <HoverWidget
                menu={menu}
                title={typeof title === 'string' ? title : undefined}
                dragClass={dragClass}
                onDragStart={onDragStart}
                offset={hoverHeaderOffset}
                onOpenMenu={onOpenMenu}
              >
                {headerContent}
              </HoverWidget>
            )}

            {statusMessage && (
              <div {...stylex.props(styles.errorContainerFloating)}>
                <PanelStatus
                  message={statusMessage}
                  onClick={statusMessageOnClick}
                  ariaLabel={t('grafana-ui.panel-chrome.ariaLabel-panel-status', 'Panel status')}
                />
              </div>
            )}
          </>
        )}

        {hasHeader && (
          <>
            <div
              {...mergeStylexProps(
                stylex.props(
                  styles.headerContainer,
                  newPanelPadding ? styles.headerPaddingNew : styles.headerPaddingLegacy
                ),
                { className: dragClass, style: headerStyles }
              )}
              data-testid={selectors.components.Panels.Panel.headerContainer}
              onPointerDown={onPointerDown}
              onMouseEnter={isSelectable ? onHeaderEnter : undefined}
              onMouseLeave={isSelectable ? onHeaderLeave : undefined}
              onPointerUp={onPointerUp}
            >
              {statusMessage && (
                <div className={dragClassCancel}>
                  <PanelStatus
                    message={statusMessage}
                    onClick={statusMessageOnClick}
                    ariaLabel={t('grafana-ui.panel-chrome.ariaLabel-panel-status', 'Panel status')}
                  />
                </div>
              )}

              {headerContent}

              {menu && (
                <PanelMenu
                  menu={menu}
                  title={typeof title === 'string' ? title : undefined}
                  placement="bottom-end"
                  menuButtonClass={clsx('gf-panel-chrome-menu', dragClassCancel, showOnHoverClass)}
                  onOpenMenu={onOpenMenu}
                  dragClassCancel={dragClassCancel}
                />
              )}
            </div>
            {!collapsed && subHeaderContent && (
              <div
                {...stylex.props(
                  styles.subHeader,
                  newPanelPadding ? styles.subHeaderPaddingNew : styles.subHeaderPaddingLegacy
                )}
                ref={subHeaderRef}
              >
                {subHeaderContent}
              </div>
            )}
          </>
        )}

        {!collapsed && (
          <div
            id={panelContentId}
            data-testid={selectors.components.Panels.Panel.content}
            {...mergeStylexProps(stylex.props(styles.content, height === undefined && styles.containNone), {
              style: contentStyle,
            })}
            onPointerDown={onContentPointerDown}
          >
            {typeof children === 'function' ? children(innerWidth, innerHeight) : children}
          </div>
        )}
      </section>
    </div>
  );
}

const itemsRenderer = (items: ReactNode[] | ReactNode, renderer: (items: ReactNode[]) => ReactNode): ReactNode => {
  const toRender = React.Children.toArray(items).filter(Boolean);
  return toRender.length > 0 ? renderer(toRender) : null;
};

const getHeaderHeight = (theme: GrafanaTheme2, hasHeader: boolean) => {
  if (hasHeader) {
    if (getFeatureToggle('newPanelPadding')) {
      return theme.spacing.gridSize * 5;
    }

    return theme.spacing.gridSize * theme.components.panel.headerHeight;
  }

  return 0;
};

const getContentStyle = (
  padding: string,
  theme: GrafanaTheme2,
  headerHeight: number,
  collapsed: boolean,
  subHeaderHeight: number,
  height?: number,
  width?: number
) => {
  const chromePadding = (padding === 'md' ? theme.components.panel.padding : 0) * theme.spacing.gridSize;

  const panelPadding = chromePadding * 2;
  const panelBorder = 1 * 2;

  let innerWidth = 0;
  if (width) {
    innerWidth = width - panelPadding - panelBorder;
  }

  let innerHeight = 0;
  if (height) {
    innerHeight = height - headerHeight - panelPadding - panelBorder - subHeaderHeight;
  }

  if (collapsed) {
    innerHeight = headerHeight;
  }

  const contentStyle: CSSProperties = {
    padding: chromePadding,
  };

  return { contentStyle, innerWidth, innerHeight };
};

const panelFocusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

const styles = stylex.create({
  container: {
    height: '100%',
    position: 'relative',
  },
  panel: {
    backgroundColor: components['--gf-components-panel-background'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-panel-border-color'],
    position: 'unset',
    borderRadius: shape['--gf-shape-radius-default'],
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  panelTransparent: {
    backgroundColor: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: { default: 'transparent', ':hover': components['--gf-components-panel-border-color'] },
    boxSizing: 'border-box',
  },
  /**
   * The global `.dashboard-selectable-element:not(.dashboard-selected-element):hover` rule (0,3,0) used to beat
   * the Emotion panel class; it is layered now and can't, so the panel applies its values itself.
   * The `:focus-visible` branches repeat `mixins.focusRing`, which this namespace replaces.
   */
  selectableHighlight: (background: string, hoverBackground: string) => ({
    outlineStyle: { default: null, ':focus-visible': 'dotted', ':hover': 'dashed' },
    outlineWidth: { default: null, ':focus-visible': '2px', ':hover': '1px' },
    outlineColor: { default: null, ':focus-visible': 'transparent', ':hover': colors['--gf-colors-border-strong'] },
    outlineOffset: { default: null, ':focus-visible': '2px', ':hover': '0px' },
    boxShadow: { default: null, ':focus-visible': panelFocusRing },
    backgroundColor: { default: background, ':hover': hoverBackground },
  }),
  loadingBarContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    // this is to force the loading bar container to create a new stacking context
    // otherwise, in webkit browsers on windows/linux, the aliasing of panel text changes when the loading bar is shown
    // see https://github.com/grafana/grafana/issues/88104
    zIndex: 1,
  },
  containNone: {
    contain: 'none',
  },
  content: {
    flexGrow: 1,
    contain: 'size layout',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  // remove logic after newPanelPadding feature toggle is removed
  headerPaddingNew: {
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  headerPaddingLegacy: {
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    maxHeight: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-panel-header-height']})`,
    overflow: 'hidden',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  subHeaderPaddingNew: {
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
  },
  subHeaderPaddingLegacy: {
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  streaming: {
    marginRight: 0,
    color: colors['--gf-colors-success-text'],
  },
  title: {
    display: 'flex',
    minWidth: 0,
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  errorContainerFloating: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  titleItems: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
  },
  clearButtonStyles: {
    alignItems: 'center',
    display: 'flex',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    backgroundColor: 'transparent',
    borderStyle: 'none',
    padding: 0,
    maxWidth: '100%',
  },
  flexGrow: {
    flexGrow: 1,
  },
});
