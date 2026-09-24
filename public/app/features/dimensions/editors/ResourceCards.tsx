import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { resourceCardsStyles } from './ResourceCards.stylex';
import { memo, type CSSProperties } from 'react';
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeGrid as Grid } from 'react-window';

import { SanitizedSVG } from 'app/core/components/SVG/SanitizedSVG';

import { type ResourceItem } from './FolderPickerTab';

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  data: {
    cards: ResourceItem[];
    columnCount: number;
    onChange: (value: string) => void;
    selected?: string;
  };
}

const MemoizedCell = memo(function Cell(props: CellProps) {
  const { columnIndex, rowIndex, style, data } = props;
  const { cards, columnCount, onChange, selected } = data;
  const singleColumnIndex = columnIndex + rowIndex * columnCount;
  const card = cards[singleColumnIndex];

  return (
    <div style={style}>
      {card && (
        <div
          key={card.value}
          className={selected === card.value ? cx(resourceCardsStyles.card, resourceCardsStyles.selected) : resourceCardsStyles.card}
          onClick={() => onChange(card.value)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
              onChange(card.value);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {card.imgUrl.endsWith('.svg') ? (
            <SanitizedSVG src={card.imgUrl} {...stylex.props(resourceCardsStyles.img)} />
          ) : (
            <img src={card.imgUrl} alt="" {...stylex.props(resourceCardsStyles.img)} />
          )}
          <span {...stylex.props(resourceCardsStyles.text)}>{card.label.slice(0, -4)}</span>
        </div>
      )}
    </div>
  );
}, areEqual);

interface CardProps {
  onChange: (value: string) => void;
  cards: ResourceItem[];
  value?: string;
}

export const ResourceCards = (props: CardProps) => {
  const { onChange, cards, value } = props;

  return (
    <AutoSizer defaultWidth={680}>
      {({ width, height }) => {
        const cardWidth = 90;
        const cardHeight = 90;
        const columnCount = Math.floor(width / cardWidth);
        const rowCount = Math.ceil(cards.length / columnCount);
        return (
          <Grid
            width={width}
            height={height}
            columnCount={columnCount}
            columnWidth={cardWidth}
            rowCount={rowCount}
            rowHeight={cardHeight}
            itemData={{ cards, columnCount, onChange, selected: value }}
            {...stylex.props(resourceCardsStyles.grid)}
          >
            {MemoizedCell}
          </Grid>
        );
      }}
    </AutoSizer>
  );
};

