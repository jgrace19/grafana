import * as stylex from '@stylexjs/stylex';
import { type KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';

import { type IconName } from '@grafana/data';
import { Icon } from '@grafana/ui';
import { durations, easings, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

const ARROW_DIRECTION: Partial<Record<string, 1 | -1>> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

export interface SegmentedToggleOption<T> {
  value: T;
  label: string;
  icon?: IconName;
}

export interface SegmentedToggleProps<T> {
  options: [SegmentedToggleOption<T>, SegmentedToggleOption<T>, ...Array<SegmentedToggleOption<T>>];
  value: T;
  onChange: (value: T) => void;
  showBackground?: boolean;
  'aria-label'?: string;
}

export function SegmentedToggle<T>({
  options,
  value,
  onChange,
  showBackground = true,
  'aria-label': ariaLabel,
}: SegmentedToggleProps<T>) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number } | null>(null);

  const activeIndex = options.findIndex((o) => o.value === value);

  useLayoutEffect(() => {
    const tab = tabRefs.current[activeIndex];
    if (tab) {
      setSliderStyle({ left: tab.offsetLeft, width: tab.offsetWidth });
    }
  }, [activeIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = ARROW_DIRECTION[e.key];
    if (direction === undefined) {
      return;
    }
    e.preventDefault();
    const nextIndex = (index + direction + options.length) % options.length;
    tabRefs.current[nextIndex]?.focus();
    onChange(options[nextIndex].value);
  };

  const sliderInlineStyle = activeIndex !== -1 && sliderStyle ? sliderStyle : { opacity: 0 };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      {...stylex.props(styles.toggle, !showBackground && styles.noBackground)}
    >
      <div {...stylex.props(styles.slider)} style={sliderInlineStyle} aria-hidden="true" />

      {options.map((option, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={String(option.value)}
            ref={(el) => (tabRefs.current[index] = el)}
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            {...stylex.props(styles.tab, isActive && styles.tabActive)}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {option.icon && <Icon name={option.icon} size="xs" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const styles = stylex.create({
  toggle: {
    position: 'relative',
    display: 'inline-flex',
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: '2px',
    paddingRight: '2px',
    paddingBottom: '2px',
    paddingLeft: '2px',
  },
  noBackground: {
    backgroundColor: 'transparent',
    backgroundImage: 'none',
  },
  slider: {
    position: 'absolute',
    top: '2px',
    bottom: '2px',
    backgroundColor: colors['--gf-colors-background-canvas'],
    borderRadius: shape['--gf-shape-radius-default'],
    pointerEvents: 'none',
    transitionProperty: { default: null, [motion.noPreference]: 'left, width' },
    transitionDuration: { default: null, [motion.noPreference]: durations.shorter },
    transitionTimingFunction: { default: null, [motion.noPreference]: easings.easeInOut },
  },
  tab: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1.25)`,
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1.25)`,
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-text-disabled'],
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    // On :focus-visible the global `button:focus-visible` transition applies instead, as it did with Emotion.
    transitionProperty: { default: null, [motion.noPreference]: { default: null, ':not(:focus-visible)': 'color' } },
    transitionDuration: {
      default: null,
      [motion.noPreference]: { default: null, ':not(:focus-visible)': durations.shorter },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreference]: { default: null, ':not(:focus-visible)': easings.easeInOut },
    },
    outlineWidth: { default: null, ':focus-visible': '2px' },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': colors['--gf-colors-primary-main'] },
    outlineOffset: { default: null, ':focus-visible': '2px' },
  },
  tabActive: {
    color: colors['--gf-colors-primary-text'],
  },
});
