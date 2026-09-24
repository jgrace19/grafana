import * as stylex from '@stylexjs/stylex';
import { memo, type CSSProperties } from 'react';
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeGrid as Grid } from 'react-window';

import { colors, shadows, shape, typography } from '@grafana/ui/stylex/tokens.stylex';
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
          {...stylex.props(styles.card, selected === card.value && styles.selected)}
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
            <SanitizedSVG src={card.imgUrl} className={stylex.props(styles.img).className} />
          ) : (
            <img src={card.imgUrl} alt="" {...stylex.props(styles.img)} />
          )}
          <span {...stylex.props(styles.text)}>{card.label.slice(0, -4)}</span>
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
            className={stylex.props(styles.grid).className}
          >
            {MemoizedCell}
          </Grid>
        );
      }}
    </AutoSizer>
  );
};

const styles = stylex.create({
  card: {
    display: 'inline-block',
    width: '90px',
    height: '90px',
    marginTop: '0.75rem',
    marginRight: '0.75rem',
    marginBottom: '0.75rem',
    marginLeft: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: '6px',
    boxShadow: { default: null, ':hover': shadows['--gf-shadows-z2'] },
  },
  selected: {
    borderWidth: '2px',
    borderColor: { default: colors['--gf-colors-primary-main'], ':hover': colors['--gf-colors-primary-main'] },
  },
  img: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    verticalAlign: 'middle',
    fill: colors['--gf-colors-text-primary'],
  },
  text: {
    fontFamily: typography['--gf-typography-h6-font-family'],
    fontWeight: typography['--gf-typography-h6-font-weight'],
    lineHeight: typography['--gf-typography-h6-line-height'],
    letterSpacing: typography['--gf-typography-h6-letter-spacing'],
    color: colors['--gf-colors-text-primary'],
    whiteSpace: 'nowrap',
    fontSize: '12px',
    textOverflow: 'ellipsis',
    display: 'block',
    overflow: 'hidden',
  },
  grid: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
  },
});
