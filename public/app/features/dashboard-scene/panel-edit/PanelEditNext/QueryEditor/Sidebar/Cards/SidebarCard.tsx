import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';

import { type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Icon, useTheme2 } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type ActionItem, Actions } from '../../../Actions';
import { QUERY_EDITOR_TYPE_CONFIG, QueryEditorType, getQueryEditorColors } from '../../../constants';
import { getEditorBorderColor } from '../../utils';
import { AddCardButton } from '../AddCardButton';
import { cardMarker, draggableItemMarker, sidebarCardMarker } from '../markers.stylex';

interface SidebarCardProps {
  children: React.ReactNode;
  id: string;
  isSelected: boolean;
  isPartOfSelection?: boolean;
  item: ActionItem;
  onSelect: (modifiers?: { multi?: boolean; range?: boolean }) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onToggleHide?: () => void;
  variant?: 'default' | 'ghost';
}

export const SidebarCard = ({
  children,
  id,
  isSelected,
  isPartOfSelection,
  item,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleHide,
  variant = 'default',
}: SidebarCardProps) => {
  const theme = useTheme2();
  const queryEditorColors = getQueryEditorColors(theme);
  const addVariant = item.type === QueryEditorType.Transformation ? 'transformation' : 'query';
  const hasActions = onDelete || onDuplicate || onToggleHide;
  const [hasFocusWithin, setHasFocusWithin] = useState(false);

  const cardColors = getCardColors(theme, { isSelected, isPartOfSelection, item });

  const handleFocus = useCallback(() => {
    setHasFocusWithin(true);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setHasFocusWithin(false);
    }
  }, []);

  // Setter function to reset the focus state of the card when the modal is closed.
  const handleResetFocus = useCallback(() => {
    setHasFocusWithin(false);
  }, []);

  // Using a div with role="button" instead of a native button for @hello-pangea/dnd compatibility,
  // so we manually handle Enter and Space key activation.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect({});
    }
  };

  if (variant === 'ghost') {
    const typeConfig = QUERY_EDITOR_TYPE_CONFIG[item.type];
    return (
      <div {...stylex.props(styles.wrapper, styles.ghostWrapper)} aria-hidden>
        <div
          {...stylex.props(
            styles.card,
            styles.cardColors(
              cardColors.ghostBackground,
              cardColors.ghostBorder,
              cardColors.boxShadow,
              cardColors.hoverBackground
            ),
            styles.indicator(cardColors.indicator),
            item.isHidden && styles.cardHidden(cardColors.hiddenOpacity),
            styles.ghostCard
          )}
        >
          <div {...stylex.props(styles.cardContent, styles.ghostCardContent)}>
            <Icon name={typeConfig.icon} size="sm" xstyle={styles.ghostCardIcon} />
            <span {...stylex.props(styles.ghostCardLabel)}>
              {t('query-editor-next.sidebar.new-type', 'New {{type}}', { type: typeConfig.getLabel() })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.wrapper, sidebarCardMarker)}>
      <div
        {...stylex.props(
          styles.card,
          styles.cardColors(cardColors.background, cardColors.border, cardColors.boxShadow, cardColors.hoverBackground),
          styles.indicator(cardColors.indicator),
          isSelected && styles.indicatorSelected,
          item.isHidden && styles.cardHidden(cardColors.hiddenOpacity),
          cardMarker
        )}
        onClick={(e) => onSelect({ multi: e.metaKey || e.ctrlKey, range: e.shiftKey })}
        onMouseDown={(e) => {
          // Prevent the browser's native text-selection behaviour when Shift is held
          // (Shift+Click is used for range-selection of cards, not text).
          if (e.shiftKey) {
            e.preventDefault();
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        role="button"
        tabIndex={0}
        data-query-sidebar-card={id}
        aria-label={t('query-editor-next.sidebar.card-click', 'Select card {{id}}', { id })}
        aria-pressed={isSelected || isPartOfSelection}
      >
        <div {...stylex.props(styles.cardContent)}>{children}</div>
        {/** Alerts don't have actions and cannot be hidden so we don't need to show the hidden icon or hover actions. */}
        {/** hasActions is indicating if this is an alert card or a query/transformation card. */}
        {hasActions && (
          <div>
            <div {...stylex.props(styles.cardContentIcons)}>
              {item.isHidden && <Icon name="eye-slash" size="sm" />}
              {!!item.error && <Icon name="exclamation-triangle" size="sm" color={queryEditorColors.error} />}
            </div>
            <div
              {...stylex.props(
                styles.hoverActions,
                styles.hoverActionsBackground(cardColors.hoverBackground),
                hasFocusWithin && styles.hoverActionsVisible
              )}
            >
              <Actions
                handleResetFocus={handleResetFocus}
                item={item}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onToggleHide={onToggleHide}
                order={{
                  delete: 1,
                  duplicate: 0,
                  hide: 2,
                }}
              />
            </div>
          </div>
        )}
      </div>
      <AddCardButton variant={addVariant} afterId={id} />
    </div>
  );
};

function getCardColors(
  theme: GrafanaTheme2,
  { isSelected, isPartOfSelection, item }: { isSelected?: boolean; isPartOfSelection?: boolean; item: ActionItem }
) {
  // TODO: I think we should refactor this so we aren't relying on this border color for the selected card.
  const borderColor = getEditorBorderColor({
    theme,
    editorType: item.type,
    alertState: item.alertState,
    isError: !!item.error,
  });

  const themeColors = getQueryEditorColors(theme);
  const selectedBg = `color-mix(in srgb, ${borderColor} 10%, ${theme.colors.background.primary})`;
  const inSelection = isSelected || isPartOfSelection;
  const selectionTintBg = `color-mix(in srgb, ${borderColor} 5%, ${theme.colors.background.primary})`;

  return {
    indicator: borderColor,
    hoverBackground: isSelected ? selectedBg : themeColors.card.hoverBg,
    background: isSelected ? selectedBg : isPartOfSelection ? selectionTintBg : themeColors.card.bg,
    border: item.error
      ? `color-mix(in srgb, ${themeColors.error} 50%, transparent)`
      : inSelection
        ? borderColor
        : theme.colors.border.medium,
    boxShadow: isSelected ? `0 0 4px 0 color-mix(in srgb, ${borderColor} 40%, transparent)` : 'none',
    hiddenOpacity: theme.isDark ? 0.6 : 0.7,
    ghostBackground: `color-mix(in srgb, ${theme.colors.background.secondary} 72%, ${theme.colors.background.primary})`,
    ghostBorder: `color-mix(in srgb, ${theme.colors.border.medium} 85%, ${theme.colors.text.secondary})`,
  };
}

const ghostBlobFloat = stylex.keyframes({
  '0%, 100%': {
    transform: 'translate3d(0, 0, 0) scale(1)',
    backgroundPosition: '12% 28%, 84% 18%, 44% 82%',
  },
  '33%': {
    transform: 'translate3d(3.8%, -5.2%, 0) scale(1.08)',
    backgroundPosition: '24% 16%, 72% 38%, 58% 70%',
  },
  '66%': {
    transform: 'translate3d(-4.2%, 3.6%, 0) scale(0.92)',
    backgroundPosition: '36% 26%, 66% 68%, 24% 76%',
  },
});

const ghostBlobPulse = stylex.keyframes({
  '0%, 100%': {
    opacity: 0.42,
  },
  '50%': {
    opacity: 1.2,
  },
});

const ghostBlobStrong = `color-mix(in srgb, ${colors['--gf-colors-text-secondary']} 34%, transparent)`;
const ghostBlobMedium = `color-mix(in srgb, ${colors['--gf-colors-text-secondary']} 24%, transparent)`;
const ghostBlobSoft = `color-mix(in srgb, ${colors['--gf-colors-text-secondary']} 17%, transparent)`;

// Hover, focus and selection transitions run for both motion preferences, as Emotion's handleMotion('no-preference', 'reduce') did.
const cardTransitionDuration = '300ms';
const cardTransitionEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';

const styles = stylex.create({
  cardContentIcons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1-5'],
  },
  wrapper: {
    position: 'relative',
    // SIDEBAR_CARD_INDENT in ../../../constants.ts
    marginLeft: spacing['--gf-spacing-x2'],
    marginRight: spacing['--gf-spacing-x2'],
    zIndex: { default: null, ':hover': 1 },

    // Two slim pseudo-element strips extend the hover zone to the left and
    // below the card, covering the path to the "+" button without overlapping
    // the card's clickable area.

    // Left strip: narrow gutter running along the card's left edge and below.
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: `calc(-1 * calc(${spacing['--gf-spacing-grid-size']} * 3.5))`,
      width: `calc(${spacing['--gf-spacing-grid-size']} * 3.5)`,
      height: `calc(100% + ${spacing['--gf-spacing-x1-5']})`,
    },

    // Bottom strip: runs along the card's bottom edge extending to the left.
    '::after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: `calc(-1 * calc(${spacing['--gf-spacing-grid-size']} * 3.5))`,
      width: `calc(100% + calc(${spacing['--gf-spacing-grid-size']} * 3.5))`,
      height: spacing['--gf-spacing-x1-5'],
    },
  },
  ghostWrapper: {
    // SIDEBAR_CARD_SPACING in ../../../constants.ts
    marginTop: spacing['--gf-spacing-x1'],
  },
  card: {
    position: 'relative',
    // SIDEBAR_CARD_HEIGHT in ../../../constants.ts
    minHeight: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: shape['--gf-shape-radius-default'],
    cursor: 'pointer',
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid',
    // This transitions the background color of the card when it is hovered or selected.
    transitionProperty: {
      default: null,
      [motion.noPreferenceOrReduce]: 'background-color, box-shadow, opacity, filter',
    },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: cardTransitionDuration },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: cardTransitionEasing },
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 2,
      transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'width' },
      transitionDuration: { default: null, [motion.noPreferenceOrReduce]: cardTransitionDuration },
      transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: cardTransitionEasing },
    },
  },
  cardColors: (background: string, borderColor: string, boxShadow: string, hoverBackground: string) => ({
    backgroundColor: {
      default: background,
      ':hover': hoverBackground,
      [stylex.when.ancestor('[data-is-dragging]', draggableItemMarker)]: hoverBackground,
    },
    borderColor,
    boxShadow,
  }),
  indicator: (color: string) => ({
    '::before': {
      backgroundColor: color,
    },
  }),
  indicatorSelected: {
    '::before': {
      width: 3,
    },
  },
  cardHidden: (opacity: number) => ({
    opacity,
    filter: 'grayscale(0.8)',
    boxShadow: 'none',
  }),
  hoverActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    paddingRight: spacing['--gf-spacing-x1'],
    // increasing the left padding lets the gradient become transparent before the first button rather than behind the first button
    paddingLeft: spacing['--gf-spacing-x3'],
    borderTopLeftRadius: 'unset',
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    borderBottomLeftRadius: 'unset',
    opacity: { default: 0, [stylex.when.ancestor(':hover', cardMarker)]: 1 },
    transform: { default: 'translateX(8px)', [stylex.when.ancestor(':hover', cardMarker)]: 'translateX(0)' },
    pointerEvents: { default: 'none', [stylex.when.ancestor(':hover', cardMarker)]: 'auto' },
    // This transition handles the opacity and transform of the hover actions when the card is hovered.
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity, transform' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: cardTransitionDuration },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: cardTransitionEasing },
  },
  hoverActionsBackground: (hoverBackground: string) => ({
    backgroundImage: `linear-gradient(270deg, ${hoverBackground} 70%, transparent 100%)`,
  }),
  hoverActionsVisible: {
    opacity: 1,
    transform: 'translateX(0)',
    pointerEvents: 'auto',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.25)`,
    overflow: 'hidden',
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    // This transitions the opacity of the card text when the card is hidden.
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: cardTransitionDuration },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: cardTransitionEasing },
  },
  ghostCard: {
    cursor: 'default',
    opacity: 1,
    '::before': {
      display: 'block',
      width: 2,
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: '-15%',
      right: '-15%',
      bottom: '-15%',
      left: '-15%',
      pointerEvents: 'none',
      backgroundImage: `radial-gradient(ellipse 42% 32% at 12% 28%, ${ghostBlobStrong}, transparent), radial-gradient(ellipse 34% 26% at 84% 18%, ${ghostBlobMedium}, transparent), radial-gradient(ellipse 30% 38% at 44% 82%, ${ghostBlobSoft}, transparent)`,
      backgroundRepeat: 'no-repeat',
      filter: 'blur(7px)',
      opacity: 0.96,
      animationName: { default: null, [motion.noPreference]: `${ghostBlobFloat}, ${ghostBlobPulse}` },
      animationDuration: { default: null, [motion.noPreference]: '3000ms, 2400ms' },
      animationTimingFunction: { default: null, [motion.noPreference]: 'ease-in-out, ease-in-out' },
      animationIterationCount: { default: null, [motion.noPreference]: 'infinite, infinite' },
      animationDelay: { default: null, [motion.noPreference]: '-1200ms, -700ms' },
    },
  },
  ghostCardContent: {
    position: 'relative',
    zIndex: 1,
  },
  ghostCardIcon: {
    color: colors['--gf-colors-text-secondary'],
  },
  ghostCardLabel: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontStyle: 'italic',
    color: colors['--gf-colors-text-secondary'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
