import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableOptionsStyles } from './VariableOptions.stylex';
import { memo, type MouseEvent, type HTMLProps } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Tooltip, clearButtonStyles, useTheme2 } from '@grafana/ui';
import checkboxPng from 'img/checkbox.png';
import checkboxWhitePng from 'img/checkbox_white.png';

import { ALL_VARIABLE_VALUE } from '../../constants';

export interface Props extends Omit<HTMLProps<HTMLUListElement>, 'onToggle'> {
  multi: boolean;
  values: VariableOption[];
  selectedValues: VariableOption[];
  highlightIndex: number;
  onToggle: (option: VariableOption, clearOthers: boolean) => void;
  onToggleAll: () => void;
  /**
   * Used for aria-controls
   */
  id: string;
}

export const VariableOptions = memo(
  ({ multi, values, highlightIndex, selectedValues, onToggle, onToggleAll, ...restProps }: Props) => {
    const theme = useTheme2();
    const buttonReset = clearButtonStyles(theme);

    const handleEvent = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleToggle = (option: VariableOption) => (event: MouseEvent<HTMLButtonElement>) => {
      const clearOthers = event.shiftKey || event.ctrlKey || event.metaKey;
      handleEvent(event);
      onToggle(option, clearOthers);
    };

    const handleToggleAll = (event: MouseEvent<HTMLButtonElement>) => {
      handleEvent(event);
      onToggleAll();
    };

    const isAllOptionConfigured = values.some((option) => option.value === ALL_VARIABLE_VALUE);

    const renderMultiToggle = () => {
      if (!multi) {
        return null;
      }

      const tooltipContent = () => <Trans i18nKey="variable.picker.option-tooltip">Clear selections</Trans>;
      return (
        <Tooltip content={tooltipContent} placement={'top'}>
          <button
            {...mergeStylexClassName(stylex.props(variableOptionsStyles.noStyledButton, 
              buttonReset,
              variableOptionsStyles.variableOption,
              variableOptionsStyles.variableOptionColumnHeader,
              ,
              { ...(isAllOptionConfigured  ? stylex.props(variableOptionsStyles.noPaddingBotton) : {}) }
            ), undefined)}
            role="checkbox"
            aria-checked={selectedValues.length > 1 ? 'mixed' : 'false'}
            onClick={handleToggleAll}
            aria-label={t('variables.variable-options.aria-label-toggle-all-values', 'Toggle all values')}
            data-placement="top"
          >
            <span
              {...mergeStylexClassName(stylex.props(variableOptionsStyles.variableOption, Icon, { ...(selectedValues.length > 1,
               ? stylex.props(variableOptionsStyles.variableOptionIconManySelected) : {}) }), undefined)}
            ></span>
            <Trans i18nKey="variable.picker.option-selected-values" values={{ numSelected: selectedValues.length }}>
              Selected ({'{{numSelected}}'})
            </Trans>
          </button>
        </Tooltip>
      );
    };

    return (
      <div {...stylex.props(variableOptionsStyles.variableValueDropdown)}>
        <div {...stylex.props(variableOptionsStyles.variableOptionsWrapper)}>
          <ul
            {...stylex.props(variableOptionsStyles.variableOptionsColumn)}
            data-testid={selectors.pages.Dashboard.SubMenu.submenuItemValueDropDownDropDown}
            {...restProps}
          >
            {renderMultiToggle()}
            {values.map((option, index) => {
              const isAllOption = option.value === ALL_VARIABLE_VALUE;

              return (
                <li key={`${option.value}`}>
                  <button
                    data-testid={selectors.components.Variables.variableOption}
                    role="checkbox"
                    type="button"
                    aria-checked={option.selected}
                    {...mergeStylexClassName(stylex.props(variableOptionsStyles.highlighted, 
                      buttonReset,
                      variableOptionsStyles.variableOption,
                      {
                        []: index === highlightIndex,
                        [variableOptionsStyles.variableAllOption]: isAllOption,
                      },
                      variableOptionsStyles.noStyledButton
                    ), undefined)}
                    onClick={handleToggle(option)}
                  >
                    <span
                      {...mergeStylexClassName(stylex.props(variableOptionsStyles.hideVariableOptionIcon, variableOptionsStyles.variableOptionIcon, { ...(option.selected,
                        []: !multi,
                       ? stylex.props(variableOptionsStyles.variableOptionIconSelected) : {}) }), undefined)}
                    ></span>
                    <span
                      data-testid={selectors.pages.Dashboard.SubMenu.submenuItemValueDropDownOptionTexts(
                        `${option.text}`
                      )}
                    >
                      {isAllOption ? t('variable.picker.option-all', 'All') : option.text}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
);
VariableOptions.displayName = 'VariableOptions';

