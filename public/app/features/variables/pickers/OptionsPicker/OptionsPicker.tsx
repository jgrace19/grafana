import { css } from '@emotion/css';
import { type ComponentType } from 'react';

import {
  LoadingState,
  type VariableOption,
  type VariableWithMultiSupport,
  type VariableWithOptions,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { ClickOutsideWrapper } from '@grafana/ui';
import { type StoreState, useDispatch, useSelector } from 'app/types/store';

import { VARIABLE_PREFIX } from '../../constants';
import { isMulti } from '../../guard';
import { getVariableQueryRunner } from '../../query/VariableQueryRunner';
import { formatVariableLabel } from '../../shared/formatVariable';
import { toKeyedAction } from '../../state/keyedVariablesReducer';
import { getVariablesState } from '../../state/selectors';
import { toKeyedVariableIdentifier } from '../../utils';
import { VariableInput } from '../shared/VariableInput';
import { VariableLink } from '../shared/VariableLink';
import { VariableOptions } from '../shared/VariableOptions';
import { type NavigationKey, type VariablePickerProps } from '../types';

import { commitChangesToVariable, filterOrSearchOptions, navigateOptions, openOptions } from './actions';
import { toggleAllOptions, toggleOption } from './reducer';

export const optionPickerFactory = <Model extends VariableWithOptions | VariableWithMultiSupport>(): ComponentType<
  VariablePickerProps<Model>
> => {
  function OptionsPicker({ variable, onVariableChange, readOnly }: VariablePickerProps<Model>) {
    const dispatch = useDispatch();

    const { rootStateKey } = variable;

    const picker = useSelector((state: StoreState) => {
      if (!rootStateKey) {
        return { id: '', queryValue: '', options: [], selectedValues: [], multi: false, highlightIndex: 0 };
      }
      return getVariablesState(rootStateKey, state).optionsPicker;
    });

    const showOptions = picker.id === variable.id;

    const onShowOptions = () => dispatch(openOptions(toKeyedVariableIdentifier(variable), onVariableChange));

    const onHideOptions = () => {
      if (!rootStateKey) {
        console.error('Variable has no rootStateKey');
        return;
      }
      dispatch(commitChangesToVariable(rootStateKey, onVariableChange));
    };

    const onToggleSingleValueVariable = (option: VariableOption, clearOthers: boolean) => {
      dispatch(toKeyedAction(toKeyedVariableIdentifier(variable).rootStateKey, toggleOption({ option, clearOthers, forceSelect: false })));
      onHideOptions();
    };

    const onToggleMultiValueVariable = (option: VariableOption, clearOthers: boolean) => {
      dispatch(toKeyedAction(toKeyedVariableIdentifier(variable).rootStateKey, toggleOption({ option, clearOthers, forceSelect: false })));
    };

    const onToggleOption = (option: VariableOption, clearOthers: boolean) => {
      const toggleFunc =
        isMulti(variable) && variable.multi ? onToggleMultiValueVariable : onToggleSingleValueVariable;
      toggleFunc(option, clearOthers);
    };

    const onToggleAllOptions = () => {
      dispatch(toKeyedAction(toKeyedVariableIdentifier(variable).rootStateKey, toggleAllOptions()));
    };

    const onFilterOrSearchOptions = (filter: string) => {
      dispatch(filterOrSearchOptions(toKeyedVariableIdentifier(variable), filter));
    };

    const onNavigate = (key: NavigationKey, clearOthers: boolean) => {
      if (!rootStateKey) {
        console.error('Variable has no rootStateKey');
        return;
      }
      dispatch(navigateOptions(rootStateKey, key, clearOthers));
    };

    const onCancel = () => {
      getVariableQueryRunner().cancelRequest(toKeyedVariableIdentifier(variable));
    };

    const styles = getStyles();

    const renderLink = (variable: VariableWithOptions) => {
      const linkText = formatVariableLabel(variable);
      const loading = variable.state === LoadingState.Loading;

      return (
        <VariableLink
          id={VARIABLE_PREFIX + variable.id}
          text={linkText}
          onClick={onShowOptions}
          loading={loading}
          onCancel={onCancel}
          disabled={readOnly}
        />
      );
    };

    const renderOptions = () => {
      const { id } = variable;
      return (
        <ClickOutsideWrapper onClick={onHideOptions}>
          <VariableInput
            id={VARIABLE_PREFIX + id}
            value={picker.queryValue}
            onChange={onFilterOrSearchOptions}
            onNavigate={onNavigate}
            aria-expanded={true}
            aria-controls={`options-${id}`}
          />
          <VariableOptions
            values={picker.options}
            onToggle={onToggleOption}
            onToggleAll={onToggleAllOptions}
            highlightIndex={picker.highlightIndex}
            multi={picker.multi}
            selectedValues={picker.selectedValues}
            id={`options-${id}`}
          />
        </ClickOutsideWrapper>
      );
    };

    return (
      <div className={styles.variableLinkWrapper} data-testid={selectors.components.Variables.variableLinkWrapper}>
        {showOptions ? renderOptions() : renderLink(variable)}
      </div>
    );
  }

  OptionsPicker.displayName = 'OptionsPicker';

  return OptionsPicker;
};

const getStyles = () => ({
  variableLinkWrapper: css({
    display: 'inline-block',
    position: 'relative',
  }),
});
