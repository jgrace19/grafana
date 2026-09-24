import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { provisionedVariablesSectionStyles } from './ProvisionedVariablesSection.stylex';

import { type SceneVariable } from '@grafana/scenes';

import { ProvisionedControlsSection, SourceIcon } from '../ProvisionedControlsSection';

import { getDefinition } from './utils';

const VARIABLE_COLUMNS = [
  { i18nKey: 'dashboard-scene.variable-editor-list.variable', defaultText: 'Variable' },
  { i18nKey: 'dashboard-scene.variable-editor-list.definition', defaultText: 'Definition' },
];

export function ProvisionedVariablesSection({ variables }: { variables: SceneVariable[] }) {


  return (
    <ProvisionedControlsSection columns={VARIABLE_COLUMNS}>
      {variables.map((variable, index) => {
        const variableState = variable.state;

        return (
          <tr key={`${variableState.name}-${index}`}>
            <td role="gridcell" {...stylex.props(provisionedVariablesSectionStyles.nameCell)}>
              {variableState.name}
            </td>
            <td role="gridcell" {...stylex.props(provisionedVariablesSectionStyles.definitionColumn)}>
              {getDefinition(variable)}
            </td>
            <td role="gridcell" {...stylex.props(provisionedVariablesSectionStyles.sourceCell)}>
              <SourceIcon origin={variableState.origin} />
            </td>
          </tr>
        );
      })}
    </ProvisionedControlsSection>
  );
}

