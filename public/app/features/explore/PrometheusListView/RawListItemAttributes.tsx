

import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { rawListItemAttributesStyles } from './RawListItemAttributes.stylex';
import { type RawListValue } from './RawListItem';


const RawListItemAttributes = ({
  value,
  index,
  length,
  isExpandedView,
}: {
  value: RawListValue;
  index: number;
  length: number;
  isExpandedView: boolean;
}) => {

  // From the beginning of the string to the start of the `=`
  const attributeName = value.key;

  // From after the `="` to before the last `"`
  const attributeValue = value.value;

  return (
    <span className={isExpandedView ? mergeStylexClassName(stylex.props(rawListItemAttributesStyles.expanded), undefined).className : ''} key={index}>
      <span {...stylex.props(rawListItemAttributesStyles.metricName)}>{attributeName}</span>
      <span>=</span>
      <span>&quot;</span>
      <span {...stylex.props(rawListItemAttributesStyles.metricValue)}>{attributeValue}</span>
      <span>&quot;</span>
      {index < length - 1 && <span>, </span>}
    </span>
  );
};

export default RawListItemAttributes;
