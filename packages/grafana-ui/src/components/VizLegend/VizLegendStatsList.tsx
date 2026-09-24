import * as stylex from '@stylexjs/stylex';
import { capitalize } from 'lodash';

import { type DisplayValue, formattedValueToString } from '@grafana/data';

import { InlineList } from '../List/InlineList';

interface Props {
  stats: DisplayValue[];
}

/**
 * @internal
 */
export const VizLegendStatsList = ({ stats }: Props) => {
  if (stats.length === 0) {
    return null;
  }

  return (
    <InlineList
      className={stylex.props(styles.list).className}
      items={stats}
      renderItem={(stat) => (
        <div {...stylex.props(styles.item)} title={stat.description}>
          {stat.title && `${capitalize(stat.title)}:`} {formattedValueToString(stat)}
        </div>
      )}
    />
  );
};

VizLegendStatsList.displayName = 'VizLegendStatsList';

const styles = stylex.create({
  list: {
    flexGrow: 1,
    textAlign: 'right',
  },
  item: {
    marginLeft: '8px',
  },
});
