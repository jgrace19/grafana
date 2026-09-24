import * as stylex from '@stylexjs/stylex';
import { useCallback, useState, useRef, memo, forwardRef } from 'react';
import SVG from 'react-inlinesvg';

import { isIconName } from '@grafana/data';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { type IconName, type IconType, type IconSize } from '../../types/icon';

import { iconStyles } from './Icon.stylex';
import { getIconPath, getSvgSize } from './utils';

export interface IconProps extends Omit<React.SVGProps<SVGElement>, 'onLoad' | 'onError' | 'ref'> {
  name: IconName;
  size?: IconSize;
  type?: IconType;
  title?: string;
}

function useIconWorkaround(name: IconName) {
  const [, setForceUpdate] = useState(0);
  const isLoadingRef = useRef(false);
  const currentNameRef = useRef(name);
  const bufferedNameRef = useRef<IconName | null>(null);

  let nameToUse = name;

  if (isLoadingRef.current && name !== currentNameRef.current) {
    nameToUse = currentNameRef.current;
    bufferedNameRef.current = name;
  } else if (!isLoadingRef.current && name !== currentNameRef.current) {
    currentNameRef.current = name;
    bufferedNameRef.current = null;
    isLoadingRef.current = true;
  }

  const handleLoad = useCallback(() => {
    isLoadingRef.current = false;
    if (bufferedNameRef.current) {
      currentNameRef.current = bufferedNameRef.current;
      bufferedNameRef.current = null;
      setForceUpdate((n) => n + 1);
    }
  }, []);

  return { nameToUse, handleLoad };
}

export const Icon = memo(
  forwardRef<SVGElement, IconProps>(
    ({ size = 'md', type = 'default', name: nameProp, className, style, title = '', ...rest }, ref) => {
      const { nameToUse: name, handleLoad } = useIconWorkaround(nameProp);

      if (!isIconName(name)) {
        console.warn('Icon component passed an invalid icon name', name);
      }

      const iconName: IconName = name === 'fa fa-spinner' ? 'spinner' : name;
      const svgSize = getSvgSize(size);
      const svgHgt = svgSize;
      const svgWid = name.startsWith('gf-bar-align') ? 16 : name.startsWith('gf-interp') ? 30 : svgSize;
      const svgPath = getIconPath(iconName, type);

      const iconProps = mergeStylexClassName(
        stylex.props(
          iconStyles.icon,
          type === 'mono' && name === 'favorite' && iconStyles.orange,
          iconName === 'spinner' && iconStyles.spin
        ),
        className
      );

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
          {...iconProps}
          style={style}
          loader={<svg {...iconProps} style={{ width: svgWid, height: svgHgt, ...style }} />}
          {...rest}
        />
      );
    }
  )
);

Icon.displayName = 'Icon';
