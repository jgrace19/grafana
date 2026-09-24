import * as stylex from '@stylexjs/stylex';

import { Tooltip } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type OptionPaneItemOverrideInfo } from './types';

export interface Props {
  overrides: OptionPaneItemOverrideInfo[];
}

export function OptionsPaneItemOverrides({ overrides }: Props) {
  return (
    <div {...stylex.props(styles.wrapper)}>
      {overrides.map((override, index) => (
        <Tooltip content={override.tooltip} key={index.toString()} placement="top">
          <div>
            <div aria-hidden="true" {...stylex.props(styles.common, typeStyles[override.type])} />
            <span className="sr-only">{override.description}</span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
  },
  common: {
    width: 8,
    height: 8,
    borderRadius: shape['--gf-shape-radius-circle'],
    marginLeft: spacing['--gf-spacing-x1'],
    top: '-1px',
    position: 'relative',
  },
});

const typeStyles = stylex.create({
  rule: {
    backgroundColor: colors['--gf-colors-primary-main'],
  },
  data: {
    backgroundColor: colors['--gf-colors-warning-main'],
  },
});
