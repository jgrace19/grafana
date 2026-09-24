import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { metaInfoTextStyles } from './MetaInfoText.stylex';
import { memo, type JSX } from 'react';



export interface MetaItemProps {
  label?: string;
  value: string | JSX.Element;
}

const MetaInfoItem = memo(function MetaInfoItem(props: MetaItemProps) {
  const { label, value } = props;

  return (
    <div data-testid="meta-info-text-item" {...stylex.props(metaInfoTextStyles.metaItem)}>
      {label && <span {...stylex.props(metaInfoTextStyles.metaLabel)}>{label}:</span>}
      <span {...stylex.props(metaInfoTextStyles.metaValue)}>{value}</span>
    </div>
  );
});

interface MetaInfoTextProps {
  metaItems: MetaItemProps[];
}

export const MetaInfoText = memo(function MetaInfoText(props: MetaInfoTextProps) {
  const { metaItems } = props;

  return (
    <div {...stylex.props(metaInfoTextStyles.metaContainer)} data-testid="meta-info-text">
      {metaItems.map((item, index) => (
        <MetaInfoItem key={`${index}-${item.label}`} label={item.label} value={item.value} />
      ))}
    </div>
  );
});
