import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { expressionTypeDropdownStyles } from './ExpressionTypeDropdown.stylex';
import { memo, type ReactElement, useCallback, useMemo } from 'react';

import { FeatureState, type GrafanaTheme2, type SelectableValue } from '@grafana/data';
import { Dropdown, FeatureBadge, Icon, Menu, Tooltip } from '@grafana/ui';
import { ExpressionQueryType, expressionTypes } from 'app/features/expressions/types';

const EXPRESSION_ICON_MAP = {
  [ExpressionQueryType.math]: 'calculator-alt',
  [ExpressionQueryType.reduce]: 'compress-arrows',
  [ExpressionQueryType.resample]: 'sync',
  [ExpressionQueryType.classic]: 'cog',
  [ExpressionQueryType.threshold]: 'sliders-v-alt',
  [ExpressionQueryType.sql]: 'database',
} as const satisfies Record<ExpressionQueryType, string>;

interface ExpressionTypeDropdownProps {
  children: ReactElement<Record<string, unknown>>;
  handleOnSelect: (value: ExpressionQueryType) => void;
  disabledExpressions?: Partial<Record<ExpressionQueryType, string>>;
}

interface ExpressionMenuItemProps {
  item: SelectableValue<ExpressionQueryType>;
  onSelect: (value: ExpressionQueryType) => void;
  disabled?: string;
}

const ExpressionMenuItem = memo<ExpressionMenuItemProps>(({ item, onSelect, disabled }) => {
  const { value, label, description } = item;

  const handleClick = useCallback(() => {
    onSelect(value!);
  }, [value, onSelect]);

  const tooltipContent = disabled || description;

  return (
    <Menu.Item
      component={() => (
        <div {...stylex.props(expressionTypeDropdownStyles.expressionTypeItem)} role="menuitem" aria-disabled={!!disabled}>
          <div
            {...mergeStylexClassName(stylex.props(expressionTypeDropdownStyles.expressionTypeItem, Content, { ...(!!disabled  ? stylex.props(expressionTypeDropdownStyles.expressionTypeItemDisabled) : {}) }), undefined)}
            data-testid={`expression-type-${value}`}
          >
            <Icon {...stylex.props(expressionTypeDropdownStyles.icon)} name={EXPRESSION_ICON_MAP[value!]} aria-hidden="true" />
            {label}
            {value === ExpressionQueryType.sql && <FeatureBadge featureState={FeatureState.preview} />}
          </div>
          <Tooltip placement="right" content={tooltipContent!}>
            <Icon {...stylex.props(expressionTypeDropdownStyles.infoIcon)} name="info-circle" />
          </Tooltip>
        </div>
      )}
      key={value}
      label=""
      onClick={handleClick}
      disabled={!!disabled}
    />
  );
});

ExpressionMenuItem.displayName = 'ExpressionMenuItem';

export const ExpressionTypeDropdown = memo<ExpressionTypeDropdownProps>(
  ({ handleOnSelect, children, disabledExpressions = {} }) => {
    const menuItems = useMemo(
      () =>
        expressionTypes.map((item) => {
          const disabledReason = item.value ? disabledExpressions[item.value] : undefined;

          return (
            <ExpressionMenuItem key={item.value} item={item} onSelect={handleOnSelect} disabled={disabledReason} />
          );
        }),
      [handleOnSelect, disabledExpressions]
    );

    const menuOverlay = useMemo(() => <Menu role="menu">{menuItems}</Menu>, [menuItems]);

    return (
      <Dropdown placement="bottom-start" overlay={menuOverlay}>
        {children}
      </Dropdown>
    );
  }
);

ExpressionTypeDropdown.displayName = 'ExpressionTypeDropdown';

;
