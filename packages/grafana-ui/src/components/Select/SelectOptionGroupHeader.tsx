import * as stylex from '@stylexjs/stylex';
import { type GroupHeadingProps } from 'react-select';

import { spacing } from '../../themes/stylex/tokens.stylex';
import { Text } from '../Text/Text';

export const SelectOptionGroupHeader = (props: GroupHeadingProps) => {
  return (
    <div {...stylex.props(styles.groupHeader)}>
      <Text weight="bold" variant="bodySmall" color="secondary">
        {props.children ?? ''}
      </Text>
    </div>
  );
};

const styles = stylex.create({
  groupHeader: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
  },
});
