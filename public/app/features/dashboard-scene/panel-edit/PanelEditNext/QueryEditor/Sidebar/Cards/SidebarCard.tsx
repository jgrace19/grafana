import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useMemo, useState } from 'react';

import { t } from '@grafana/i18n';
import { Icon, useTheme2 } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { type ActionItem, Actions } from '../../../Actions';
import {
  QUERY_EDITOR_TYPE_CONFIG,
  QueryEditorType,
  SIDEBAR_CARD_HEIGHT,
  getQueryEditorColors,
} from '../../../constants';
import { getEditorBorderColor } from '../../utils';
import { AddCardButton } from '../AddCardButton';
import { getGhostCardVisuals } from '../SidebarCardGhostStyles';

import { sidebarCardStyles } from './SidebarCard.stylex';

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

  const borderColor = getEditorBorderColor({
    theme,
    editorType: item.type,
    alertState: item.alertState,
    isError: !!item.error,
  });

  const cardStyle = useMemo(() => {
    const themeColors = getQueryEditorColors(theme);
    const selectedBg = `color-mix(in srgb, ${borderColor} 10%, ${theme.colors.background.primary})`;
    const hoverBackgroundColor = isSelected ? selectedBg : themeColors.card.hoverBg;
    const inSelection = isSelected || isPartOfSelection;
    const cardBorder = item.error
      ? `1px solid color-mix(in srgb, ${themeColors.error} 50%, transparent)`
      : `1px solid ${inSelection ? borderColor : theme.colors.border.medium}`;
    const selectionTintBg = `color-mix(in srgb, ${borderColor} 5%, ${theme.colors.background.primary})`;
    const cardBackground = isSelected ? selectedBg : isPartOfSelection ? selectionTintBg : themeColors.card.bg;
    const cardBoxShadow = isSelected ? `0 0 4px 0 color-mix(in srgb, ${borderColor} 40%, transparent)` : 'none';
    const indicatorWidth = isSelected ? 3 : 2;

    return {
      background: cardBackground,
      border: cardBorder,
      boxShadow: cardBoxShadow,
      minHeight: SIDEBAR_CARD_HEIGHT,
      ['--indicator-width' as string]: `${indicatorWidth}px`,
      ['--indicator-color' as string]: borderColor,
      ['--hover-bg' as string]: hoverBackgroundColor,
    };
  }, [borderColor, isPartOfSelection, isSelected, item.error, item.type, theme]);

  const ghostVisuals = useMemo(() => getGhostCardVisuals(theme), [theme]);

  const handleFocus = useCallback(() => {
    setHasFocusWithin(true);
  }, []);

  const handleBlur = useCallback(() => {
    setHasFocusWithin(false);
  }, []);

  const handleResetFocus = useCallback(() => {
    setHasFocusWithin(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect({});
    }
  };

  if (variant === 'ghost') {
    const typeConfig = QUERY_EDITOR_TYPE_CONFIG[item.type];
    return (
      <div
        {...mergeStylexClassName(
          stylex.props(sidebarCardStyles.wrapper, sidebarCardStyles.ghostWrapper),
          undefined
        )}
        aria-hidden
      >
        <div
          {...mergeStylexClassName(stylex.props(sidebarCardStyles.card, sidebarCardStyles.ghostCard), undefined)}
          style={{
            border: `1px solid ${ghostVisuals.ghostBorderColor}`,
            background: ghostVisuals.ghostBackgroundColor,
            minHeight: SIDEBAR_CARD_HEIGHT,
          }}
        >
          <div {...stylex.props(sidebarCardStyles.cardContent)}>
            <Icon name={typeConfig.icon} size="sm" {...stylex.props(sidebarCardStyles.ghostCardIcon)} />
            <span {...stylex.props(sidebarCardStyles.ghostCardLabel)}>
              {t('query-editor-next.sidebar.new-type', 'New {{type}}', { type: typeConfig.getLabel() })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div {...stylex.props(sidebarCardStyles.wrapper)}>
      <div
        {...stylex.props(sidebarCardStyles.card)}
        style={cardStyle}
        onClick={(e) => onSelect({ multi: e.metaKey || e.ctrlKey, range: e.shiftKey })}
        onMouseDown={(e) => {
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
        <div {...stylex.props(sidebarCardStyles.cardContent)}>{children}</div>
        {hasActions && (
          <div>
            <div {...stylex.props(sidebarCardStyles.cardContentIcons)}>
              {item.isHidden && <Icon name="eye-slash" size="sm" />}
              {!!item.error && <Icon name="exclamation-triangle" size="sm" color={queryEditorColors.error} />}
            </div>
            <div
              {...mergeStylexClassName(
                stylex.props(
                  sidebarCardStyles.hoverActions,
                  hasFocusWithin && sidebarCardStyles.hoverActionsVisible
                ),
                undefined
              )}
              style={{
                background: `linear-gradient(270deg, ${cardStyle['--hover-bg' as keyof typeof cardStyle]} 70%, transparent 100%)`,
              }}
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
