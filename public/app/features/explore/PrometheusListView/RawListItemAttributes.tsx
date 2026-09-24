import * as stylex from '@stylexjs/stylex';

import { useTheme2 } from '@grafana/ui';

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
  const { isDark } = useTheme2();

  // From the beginning of the string to the start of the `=`
  const attributeName = value.key;

  // From after the `="` to before the last `"`
  const attributeValue = value.value;

  return (
    <span {...stylex.props(isExpandedView && styles.expanded)} key={index}>
      <span {...stylex.props(isDark ? styles.metricNameDark : styles.metricNameLight)}>{attributeName}</span>
      <span>=</span>
      <span>&quot;</span>
      <span {...stylex.props(isDark ? styles.metricValueDark : styles.metricValueLight)}>{attributeValue}</span>
      <span>&quot;</span>
      {index < length - 1 && <span>, </span>}
    </span>
  );
};

export default RawListItemAttributes;

// Borrowed from the monaco styles.
const styles = stylex.create({
  metricNameDark: {
    color: '#73bf69',
  },
  metricNameLight: {
    color: '#56a64b',
  },
  metricValueDark: {
    color: '#ce9178',
  },
  metricValueLight: {
    color: '#a31515',
  },
  expanded: {
    display: 'block',
    textIndent: '1em',
  },
});
