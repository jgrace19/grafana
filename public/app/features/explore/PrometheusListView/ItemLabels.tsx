import * as stylex from '@stylexjs/stylex';

import { type Field } from '@grafana/data';
import { InstantQueryRefIdIndex } from '@grafana/prometheus';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

import { rawListLayout } from './rawListLayout.stylex';

export const formatValueName = (name: string): string => {
  if (name.includes(InstantQueryRefIdIndex)) {
    return name.replace(InstantQueryRefIdIndex, '');
  }
  return name;
};

export const ItemLabels = ({ valueLabels, expanded }: { valueLabels: Field[]; expanded: boolean }) => {
  return (
    <div {...stylex.props(expanded && styles.itemLabelsWrapExpanded)}>
      <div {...stylex.props(styles.valueNavigationWrapper)}>
        {valueLabels.map((value, index) => (
          <span {...stylex.props(styles.valueNavigation)} key={value.name}>
            {formatValueName(value.name)}
          </span>
        ))}
      </div>
    </div>
  );
};

const styles = stylex.create({
  valueNavigation: {
    width: rawListLayout.columnWidth,
    fontWeight: 'bold',
  },
  valueNavigationWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  itemLabelsWrapExpanded: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-medium'],
  },
});
