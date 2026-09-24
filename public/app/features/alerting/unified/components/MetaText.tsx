import * as stylex from '@stylexjs/stylex';
import { type ComponentProps, type HTMLAttributes, forwardRef } from 'react';

import { Icon, type IconName, Stack, Text } from '@grafana/ui';

interface Props extends HTMLAttributes<HTMLDivElement> {
  icon?: IconName;
  direction?: 'row' | 'column';
  color?: ComponentProps<typeof Text>['color'];
}

const MetaText = forwardRef<HTMLDivElement, Props>(
  ({ children, icon, color = 'secondary', direction = 'row', ...rest }, ref) => {
    const interactive = typeof rest.onClick === 'function';

    const rowDirection = direction === 'row';
    const alignItems = rowDirection ? 'center' : 'flex-start';
    const gap = rowDirection ? 0.5 : 0;

    return (
      <div
        ref={ref}
        {...stylex.props(interactive && styles.interactive)}
        // allow passing ARIA and data- attributes
        {...rest}
      >
        <Text variant="bodySmall" color={color}>
          <Stack direction={direction} alignItems={alignItems} gap={gap} wrap={'wrap'}>
            {icon && <Icon size="xs" name={icon} />}
            {children}
          </Stack>
        </Text>
      </div>
    );
  }
);

MetaText.displayName = 'MetaText';

const styles = stylex.create({
  interactive: {
    cursor: 'pointer',
  },
});

export { MetaText };
