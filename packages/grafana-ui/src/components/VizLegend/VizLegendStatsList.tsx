
import { vizLegendStatsListStyleProps } from './VizLegendStatsList.stylex'

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
      {...vizLegendStatsListStyleProps('list')}
      items={stats}
      renderItem={(stat) => (
        <div {...vizLegendStatsListStyleProps('item')} title={stat.description}>
          {stat.title && `${capitalize(stat.title)}:`} {formattedValueToString(stat)}
        </div>
      )}
    />
  );
};


VizLegendStatsList.displayName = 'VizLegendStatsList';
