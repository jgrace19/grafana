
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { optionsPaneItemOverridesStyles } from './OptionsPaneItemOverrides.stylex';
import { Tooltip, useStyles2 } from '@grafana/ui';

import { type OptionPaneItemOverrideInfo } from './types';

export interface Props {
  overrides: OptionPaneItemOverrideInfo[];
}

export function OptionsPaneItemOverrides({ overrides }: Props) {

  return (
    <div {...stylex.props(optionsPaneItemOverridesStyles.wrapper)}>
      {overrides.map((override, index) => (
        <Tooltip content={override.tooltip} key={index.toString()} placement="top">
          <div>
            <div aria-hidden="true" className={styles[override.type]} />
            <span className="sr-only">{override.description}</span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}

