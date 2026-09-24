import * as stylex from '@stylexjs/stylex';

import { spacing } from '../../themes/stylex/tokens.stylex';

import { VizTooltipRow } from './VizTooltipRow';
import { type VizTooltipItem } from './types';

interface Props {
  item: VizTooltipItem;
  isPinned: boolean;
}

export const VizTooltipHeader = ({ item: { label, value, color, colorIndicator }, isPinned }: Props) => {
  return (
    <div {...stylex.props(styles.wrapper)}>
      <VizTooltipRow
        label={label}
        value={value}
        color={color}
        colorIndicator={colorIndicator}
        marginRight={'22px'}
        isPinned={isPinned}
      />
    </div>
  );
};

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    lineHeight: 1,
  },
});
