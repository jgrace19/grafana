import * as stylex from '@stylexjs/stylex';

import { type SceneVariable } from '@grafana/scenes';
import { typography } from '@grafana/ui/stylex/tokens.stylex';

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
            <td role="gridcell" {...stylex.props(styles.nameCell)}>
              {variableState.name}
            </td>
            <td role="gridcell" {...stylex.props(styles.definitionColumn)}>
              {getDefinition(variable)}
            </td>
            <td role="gridcell" {...stylex.props(styles.sourceCell)}>
              <SourceIcon origin={variableState.origin} />
            </td>
          </tr>
        );
      })}
    </ProvisionedControlsSection>
  );
}

const styles = stylex.create({
  nameCell: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    width: '20%',
  },
  definitionColumn: {
    width: '70%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 0,
  },
  sourceCell: {
    width: '1%',
    textAlign: 'center',
  },
});
