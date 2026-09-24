
import { vizTooltipContentStyleProps } from './VizTooltipContent.stylex'

import { type CSSProperties, type ReactNode } from 'react';



import { VizTooltipRow } from './VizTooltipRow';
import { type VizTooltipItem } from './types';

interface VizTooltipContentProps {
  items: VizTooltipItem[];
  children?: ReactNode;
  scrollable?: boolean;
  isPinned: boolean;
  maxHeight?: number;
}

export const VizTooltipContent = ({
  items,
  children,
  isPinned,
  scrollable = false,
  maxHeight,
}: VizTooltipContentProps) => {

  const scrollableStyle: CSSProperties = scrollable
    ? {
        maxHeight: maxHeight,
        overflowY: 'auto',
      }
    : {};

  return (
    <div {...vizTooltipContentStyleProps('wrapper')} style={scrollableStyle}>
      {items.map(({ label, value, color, colorIndicator, colorPlacement, isActive, lineStyle, isHiddenFromViz }, i) => (
        <VizTooltipRow
          key={i}
          label={label}
          value={value}
          color={color}
          colorIndicator={colorIndicator}
          colorPlacement={colorPlacement}
          isActive={isActive}
          isPinned={isPinned}
          lineStyle={lineStyle}
          showValueScroll={!scrollable}
          isHiddenFromViz={isHiddenFromViz}
        />
      ))}
      {children}
    </div>
  );
};

