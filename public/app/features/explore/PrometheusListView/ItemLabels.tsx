
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { itemLabelsStyles } from './ItemLabels.stylex';
import { type Field, type GrafanaTheme2 } from '@grafana/data';
import { InstantQueryRefIdIndex } from '@grafana/prometheus';

import { rawListItemColumnWidth } from './RawListItem';

;

export const formatValueName = (name: string): string => {
  if (name.includes(InstantQueryRefIdIndex)) {
    return name.replace(InstantQueryRefIdIndex, '');
  }
  return name;
};

export const ItemLabels = ({ valueLabels, expanded }: { valueLabels: Field[]; expanded: boolean }) => {

  return (
    <div {...stylex.props(itemLabelsStyles.itemLabelsWrap)}>
      <div {...stylex.props(itemLabelsStyles.valueNavigationWrapper)}>
        {valueLabels.map((value, index) => (
          <span {...stylex.props(itemLabelsStyles.valueNavigation)} key={value.name}>
            {formatValueName(value.name)}
          </span>
        ))}
      </div>
    </div>
  );
};
