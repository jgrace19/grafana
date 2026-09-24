import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { type TimeOption } from '@grafana/data';

import { motion } from '../../../themes/stylex/constants.stylex';
import { colors, shape, spacing } from '../../../themes/stylex/tokens.stylex';

interface Props {
  value: TimeOption;
  selected?: boolean;
  onSelect: (option: TimeOption) => void;
  /**
   *  Input identifier. This should be the same for all options in a group.
   */
  name: string;
}

export const TimeRangeOption = memo<Props>(({ value, onSelect, selected = false, name }) => {
  // In case there are more of the same timerange in the list
  const id = uuidv4();

  return (
    <li {...stylex.props(styles.container)}>
      <input
        {...stylex.props(styles.radio, stylex.defaultMarker())}
        checked={selected}
        name={name}
        type="checkbox"
        data-role="item"
        tabIndex={-1}
        id={id}
        onChange={() => onSelect(value)}
      />
      <label {...stylex.props(styles.label, selected && styles.labelSelected)} htmlFor={id}>
        {value.display}
      </label>
    </li>
  );
});

TimeRangeOption.displayName = 'TimeRangeOption';

const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    position: 'relative',
  },
  radio: {
    opacity: 0,
    width: 0,
  },
  // The input is the label's only earlier sibling, so `siblingBefore` matches what Emotion's `+` did.
  label: {
    cursor: 'pointer',
    flex: '1',
    padding: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: { default: null, ':hover': colors['--gf-colors-action-hover'] },
    outlineStyle: { default: null, [stylex.when.siblingBefore(':focus-visible')]: 'dotted' },
    outlineWidth: { default: null, [stylex.when.siblingBefore(':focus-visible')]: '2px' },
    outlineColor: { default: null, [stylex.when.siblingBefore(':focus-visible')]: 'transparent' },
    outlineOffset: { default: null, [stylex.when.siblingBefore(':focus-visible')]: '2px' },
    boxShadow: {
      default: null,
      [stylex.when.siblingBefore(':focus-visible')]:
        `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
    },
    transitionProperty: {
      default: null,
      [stylex.when.siblingBefore(':focus-visible')]: 'outline, outline-offset, box-shadow',
    },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: null, [stylex.when.siblingBefore(':focus-visible')]: '0.2s' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: {
        default: null,
        [stylex.when.siblingBefore(':focus-visible')]: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  // Emotion's `:hover` rule out-ranked the selected class, so the hover background still applies here.
  labelSelected: {
    backgroundColor: { default: colors['--gf-colors-action-selected'], ':hover': colors['--gf-colors-action-hover'] },
    '::before': {
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
      borderRadius: shape['--gf-shape-radius-default'],
      content: '" "',
      display: 'block',
      height: '100%',
      position: 'absolute',
      width: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
      left: 0,
      top: 0,
    },
  },
});
