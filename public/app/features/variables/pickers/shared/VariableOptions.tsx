import * as stylex from '@stylexjs/stylex';
import { memo, type MouseEvent, type HTMLProps } from 'react';

import { type VariableOption } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Tooltip, useTheme2 } from '@grafana/ui';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, shadows, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
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
    const checkboxImage = `url(${theme.isDark ? checkboxPng : checkboxWhitePng})`;

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
            {...stylex.props(
              styles.buttonReset,
              styles.variableOption,
              styles.variableOptionColumnHeader,
              styles.noStyledButton,
              isAllOptionConfigured && styles.noPaddingBotton
            )}
            role="checkbox"
            aria-checked={selectedValues.length > 1 ? 'mixed' : 'false'}
            onClick={handleToggleAll}
            aria-label={t('variables.variable-options.aria-label-toggle-all-values', 'Toggle all values')}
            data-placement="top"
          >
            <span
              {...stylex.props(
                styles.variableOptionIcon,
                styles.checkboxImage(checkboxImage),
                selectedValues.length > 1 && styles.variableOptionIconManySelected
              )}
            ></span>
            <Trans i18nKey="variable.picker.option-selected-values" values={{ numSelected: selectedValues.length }}>
              Selected ({'{{numSelected}}'})
            </Trans>
          </button>
        </Tooltip>
      );
    };

    return (
      <div {...stylex.props(styles.variableValueDropdown)}>
        <div {...stylex.props(styles.variableOptionsWrapper)}>
          <ul
            {...stylex.props(styles.variableOptionsColumn)}
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
                    {...stylex.props(
                      styles.buttonReset,
                      styles.variableOption,
                      index === highlightIndex && styles.highlighted,
                      isAllOption && styles.variableAllOption,
                      styles.noStyledButton
                    )}
                    onClick={handleToggle(option)}
                  >
                    <span
                      {...stylex.props(
                        styles.variableOptionIcon,
                        styles.checkboxImage(checkboxImage),
                        option.selected && styles.variableOptionIconSelected,
                        !multi && styles.hideVariableOptionIcon
                      )}
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

const styles = stylex.create({
  buttonReset: {
    backgroundColor: 'transparent',
    color: colors['--gf-colors-text-primary'],
    borderStyle: 'none',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  hideVariableOptionIcon: {
    display: 'none',
  },
  highlighted: {
    backgroundColor: { default: colors['--gf-colors-action-hover'], ':hover': colors['--gf-colors-action-hover'] },
  },
  noStyledButton: {
    width: '100%',
    textAlign: 'left',
  },
  variableOption: {
    display: 'block',
    paddingTop: '2px',
    paddingRight: '27px',
    paddingBottom: 0,
    paddingLeft: '8px',
    position: 'relative',
    whiteSpace: 'nowrap',
    minWidth: '115px',
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
  },
  variableOptionColumnHeader: {
    paddingTop: '5px',
    paddingBottom: '5px',
    marginBottom: '5px',
  },
  variableOptionIcon: {
    display: 'inline-block',
    width: '24px',
    height: '18px',
    position: 'relative',
    top: '4px',
    backgroundPosition: 'left top',
    backgroundRepeat: 'no-repeat',
  },
  // The sprite differs between dark and light themes.
  checkboxImage: (backgroundImage: string) => ({
    backgroundImage,
  }),
  variableOptionIconManySelected: {
    backgroundPosition: '0px -36px',
  },
  variableOptionIconSelected: {
    backgroundPosition: '0px -18px',
  },
  variableValueDropdown: {
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: `calc(${shape['--gf-shape-radius-default']} * 2)`,
    boxShadow: shadows['--gf-shadows-z2'],
    position: 'absolute',
    top: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    maxHeight: '400px',
    minHeight: '150px',
    minWidth: '150px',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: zIndex.typeahead,
  },
  variableOptionsColumn: {
    maxHeight: '350px',
    display: 'table-cell',
    lineHeight: '26px',
    listStyleType: 'none',
  },
  variableOptionsWrapper: {
    display: 'table',
    width: '100%',
  },
  variableAllOption: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    paddingBottom: spacing['--gf-spacing-x1'],
  },
  noPaddingBotton: {
    paddingBottom: 0,
  },
});
