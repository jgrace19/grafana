import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { segmentedToggleStyles } from './SegmentedToggle.stylex';
import { type KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';

import {Icon} from '@grafana/ui';

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
      {...stylex.props(segmentedToggleStyles.toggle, !showBackground  && segmentedToggleStyles.noBackground)}
    >
      <div {...stylex.props(segmentedToggleStyles.slider)} style={sliderInlineStyle} aria-hidden="true" />

      {options.map((option, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={String(option.value)}
            ref={(el) => (tabRefs.current[index] = el)}
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            {...stylex.props(segmentedToggleStyles.tab, isActive  && segmentedToggleStyles.tabActive)}
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


