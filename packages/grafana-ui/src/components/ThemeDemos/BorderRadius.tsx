import * as stylex from '@stylexjs/stylex';

import { useTheme2 } from '../../themes/ThemeContext';
import { getInternalRadius, getExternalRadius } from '../../themes/mixins';
import { colors } from '../../themes/stylex/tokens.stylex';
import { Stack } from '../Layout/Stack/Stack';
import { Text } from '../Text/Text';

interface DemoBoxProps {
  referenceBorderRadius: number;
  referenceBorderWidth: number;
  offset: number;
  borderWidth: number;
}

export const BorderRadiusContainer = ({
  referenceBorderRadius,
  referenceBorderWidth,
  offset,
  borderWidth,
}: DemoBoxProps) => {
  const theme = useTheme2();
  const internalRadius = getInternalRadius(theme, offset, {
    parentBorderRadius: referenceBorderRadius,
    parentBorderWidth: referenceBorderWidth,
  });
  const externalRadius = getExternalRadius(theme, offset, {
    childBorderRadius: referenceBorderRadius,
    selfBorderWidth: borderWidth,
  });
  const reference = styles.reference(`${referenceBorderWidth}px`, `${referenceBorderRadius}px`);
  const outline = styles.outline(`${borderWidth}px`);
  return (
    <Stack direction="column" alignItems="center" gap={4}>
      <Stack alignItems="center">
        {/* eslint-disable-next-line @grafana/i18n/no-untranslated-strings */}
        <Text variant="code">getInternalRadius</Text>
        <div {...stylex.props(styles.baseForInternal, reference, styles.padding(`${offset}px`))}>
          <div {...stylex.props(styles.internalContainer, outline, styles.radius(internalRadius))} />
        </div>
      </Stack>
      <Stack alignItems="center">
        {/* eslint-disable-next-line @grafana/i18n/no-untranslated-strings */}
        <Text variant="code">getExternalRadius</Text>
        <div
          {...stylex.props(
            styles.externalContainer,
            outline,
            styles.radius(externalRadius),
            styles.padding(`${offset}px`)
          )}
        >
          <div {...stylex.props(styles.baseForExternal, reference)} />
        </div>
      </Stack>
    </Stack>
  );
};

const styles = stylex.create({
  reference: (borderWidth: string, borderRadius: string) => ({
    backgroundColor: colors['--gf-colors-action-disabled-background'],
    borderWidth,
    borderStyle: 'dashed',
    borderColor: colors['--gf-colors-action-disabled-text'],
    borderRadius,
  }),
  outline: (borderWidth: string) => ({
    borderWidth,
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-primary-main'],
  }),
  radius: (borderRadius: string) => ({
    borderRadius,
  }),
  padding: (padding: string) => ({
    padding,
  }),
  baseForInternal: {
    display: 'flex',
    height: '80px',
    width: '300px',
  },
  baseForExternal: {
    height: '80px',
    flex: '1',
    width: '300px',
  },
  internalContainer: {
    backgroundColor: colors['--gf-colors-background-primary'],
    flex: '1',
  },
  externalContainer: {
    display: 'flex',
    flex: '1',
  },
});
