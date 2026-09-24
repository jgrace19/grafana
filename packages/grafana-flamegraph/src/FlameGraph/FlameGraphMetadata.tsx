import * as stylex from '@stylexjs/stylex';
import { memo, type ReactNode } from 'react';

import { getValueFormat } from '@grafana/data';
import { Icon, IconButton, Tooltip } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { type ClickedItemData } from '../types';

import { type FlameGraphDataContainer } from './dataTransform';
import { flameGraphMetadataStyles } from './FlameGraphMetadata.stylex';

type Props = {
  data: FlameGraphDataContainer;
  totalTicks: number;
  onFocusPillClick: () => void;
  onSandwichPillClick: () => void;
  focusedItem?: ClickedItemData;
  sandwichedLabel?: string;
};

const FlameGraphMetadata = memo(
  ({ data, focusedItem, totalTicks, sandwichedLabel, onFocusPillClick, onSandwichPillClick }: Props) => {
    const parts: ReactNode[] = [];
    const ticksVal = getValueFormat('short')(totalTicks);

    const displayValue = data.valueDisplayProcessor(totalTicks);
    let unitValue = displayValue.text + displayValue.suffix;
    const unitTitle = data.getUnitTitle();
    if (unitTitle === 'Count') {
      if (!displayValue.suffix) {
        unitValue = displayValue.text;
      }
    }

    parts.push(
      <div {...stylex.props(flameGraphMetadataStyles.metadataPill)} key={'default'}>
        {unitValue} | {ticksVal.text}
        {ticksVal.suffix} samples ({unitTitle})
      </div>
    );

    if (sandwichedLabel) {
      parts.push(
        <Tooltip key={'sandwich'} content={sandwichedLabel} placement="top">
          <div>
            <Icon size={'sm'} name={'angle-right'} />
            <div {...stylex.props(flameGraphMetadataStyles.metadataPill)}>
              <Icon size={'sm'} name={'gf-show-context'} />{' '}
              <span {...stylex.props(flameGraphMetadataStyles.metadataPillName)}>
                {sandwichedLabel.substring(sandwichedLabel.lastIndexOf('/') + 1)}
              </span>
              <IconButton
                className={mergeStylexClassName(stylex.props(flameGraphMetadataStyles.pillCloseButton)).className}
                name={'times'}
                size={'sm'}
                onClick={onSandwichPillClick}
                tooltip={'Remove sandwich view'}
                aria-label={'Remove sandwich view'}
              />
            </div>
          </div>
        </Tooltip>
      );
    }

    if (focusedItem) {
      const percentValue = totalTicks > 0 ? Math.round(10000 * (focusedItem.item.value / totalTicks)) / 100 : 0;
      const iconName = percentValue > 0 ? 'eye' : 'exclamation-circle';

      parts.push(
        <Tooltip key={'focus'} content={focusedItem.label} placement="top">
          <div>
            <Icon size={'sm'} name={'angle-right'} />
            <div {...stylex.props(flameGraphMetadataStyles.metadataPill)}>
              <Icon size={'sm'} name={iconName} />
              &nbsp;{percentValue}% of total
              <IconButton
                className={mergeStylexClassName(stylex.props(flameGraphMetadataStyles.pillCloseButton)).className}
                name={'times'}
                size={'sm'}
                onClick={onFocusPillClick}
                tooltip={'Remove focus'}
                aria-label={'Remove focus'}
              />
            </div>
          </div>
        </Tooltip>
      );
    }

    return <div {...stylex.props(flameGraphMetadataStyles.metadata)}>{parts}</div>;
  }
);

FlameGraphMetadata.displayName = 'FlameGraphMetadata';

export default FlameGraphMetadata;
