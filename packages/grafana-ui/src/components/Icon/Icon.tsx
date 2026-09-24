import * as stylex from '@stylexjs/stylex';
import { useCallback, useState, useRef, memo, forwardRef } from 'react';
import SVG from 'react-inlinesvg';

import { isIconName } from '@grafana/data';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { v1 } from '../../themes/stylex/tokens.stylex';
import { type IconName, type IconType, type IconSize } from '../../types/icon';

import { getIconPath, getSvgSize } from './utils';

export interface IconProps extends Omit<React.SVGProps<SVGElement>, 'onLoad' | 'onError' | 'ref'> {
  name: IconName;
  size?: IconSize;
  type?: IconType;
  /**
   * Give your icon a semantic meaning. The icon will be hidden from screen readers, unless this prop or an aria-label is provided.
   */
  title?: string;
  /** @internal First-party StyleX overrides, applied after the icon's own styles. */
  xstyle?: stylex.StyleXStyles;
}

// The SVG can become 'stuck' if it's changed quickly before the previous icon finished loading.
// See https://github.com/gilbarbara/react-inlinesvg/issues/247
// By using the svgPath as the key, we ensure that the component is re-mounted and the new icon is loaded correctly.
function useIconWorkaround(name: IconName) {
  // Buffer name changes while the icon is loading until it stops loading, then apply the most recent name change.
  // We use refs for state and a forceUpdate state to avoid needing to use the buffered name in the happy path
  // of when the icon changes when its not currently loading.
  // We want to avoid needless state updates to keep track of the lifecycle.

  const [, setForceUpdate] = useState(0);
  const isLoadingRef = useRef(false);
  const currentNameRef = useRef(name);
  const bufferedNameRef = useRef<IconName | null>(null);

  // Decide which name to render THIS render
  let nameToUse = name;

  if (isLoadingRef.current && name !== currentNameRef.current) {
    // Currently loading and name changed - buffer it, keep using current
    nameToUse = currentNameRef.current;
    bufferedNameRef.current = name;
  } else if (!isLoadingRef.current && name !== currentNameRef.current) {
    // Not loading - use new name immediately (happy path)
    currentNameRef.current = name;
    bufferedNameRef.current = null;
    isLoadingRef.current = true; // Mark as loading when we accept a new name
  }

  const handleLoad = useCallback(() => {
    isLoadingRef.current = false;

    // Apply buffered name if one exists
    if (bufferedNameRef.current) {
      currentNameRef.current = bufferedNameRef.current;
      bufferedNameRef.current = null;
      setForceUpdate((n) => n + 1); // Trigger re-render with buffered name
    }
  }, []);

  return { nameToUse, handleLoad };
}

/**
 * Grafana's icon wrapper component.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/iconography-icon--docs
 */
export const Icon = memo(
  forwardRef<SVGElement, IconProps>(
    ({ size = 'md', type = 'default', name: nameProp, className, style, title = '', xstyle, ...rest }, ref) => {
      const { nameToUse: name, handleLoad } = useIconWorkaround(nameProp);

      if (!isIconName(name)) {
        console.warn('Icon component passed an invalid icon name', name);
      }

      // handle the deprecated 'fa fa-spinner'
      const iconName: IconName = name === 'fa fa-spinner' ? 'spinner' : name;

      const svgSize = getSvgSize(size);
      const svgHgt = svgSize;
      const svgWid = name.startsWith('gf-bar-align') ? 16 : name.startsWith('gf-interp') ? 30 : svgSize;
      const svgPath = getIconPath(iconName, type);

      const iconStyles = [
        styles.icon,
        type === 'mono' && name === 'favorite' && styles.orange,
        iconName === 'spinner' && styles.spin,
        xstyle,
      ];
      const { className: composedClassName, style: composedStyle } = mergeStylexProps(stylex.props(iconStyles), {
        className,
        style,
      });

      return (
        <SVG
          data-testid={`icon-${iconName}`}
          aria-hidden={
            rest.tabIndex === undefined &&
            !title &&
            !rest['aria-label'] &&
            !rest['aria-labelledby'] &&
            !rest['aria-describedby']
          }
          onLoad={handleLoad}
          onError={handleLoad}
          innerRef={ref}
          src={svgPath}
          width={svgWid}
          height={svgHgt}
          title={title}
          className={composedClassName}
          style={composedStyle}
          // render an empty element with the correct dimensions while loading
          // this prevents content layout shift whilst the icon asynchronously loads
          // which happens even if the icon is in the cache(!)
          loader={
            <svg
              {...mergeStylexProps(stylex.props(styles.loaderSize(svgWid, svgHgt), iconStyles), {
                className,
                style,
              })}
            />
          }
          {...rest}
        />
      );
    }
  )
);

Icon.displayName = 'Icon';

const spin = stylex.keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(359deg)',
  },
});

const styles = stylex.create({
  icon: {
    display: 'inline-block',
    fill: 'currentColor',
    flexShrink: 0,
    // line-height: 0; is needed for correct icon alignment in Safari
    lineHeight: 0,
    verticalAlign: 'middle',
  },
  orange: {
    fill: v1['--gf-v1-palette-orange'],
  },
  spin: {
    animationName: { default: null, [motion.noPreferenceOrReduce]: spin },
    animationDuration: { default: null, [motion.noPreferenceOrReduce]: '2s' },
    animationIterationCount: { default: null, [motion.noPreferenceOrReduce]: 'infinite' },
    animationTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'linear' },
  },
  loaderSize: (width: number, height: number) => ({
    width,
    height,
  }),
});
