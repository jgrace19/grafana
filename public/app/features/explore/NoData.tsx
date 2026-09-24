import * as stylex from '@stylexjs/stylex';

import { PanelContainer } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import './NoData.css';

export const NoData = () => {
  return (
    <>
      <PanelContainer
        data-testid="explore-no-data"
        className={mergeStylexProps(stylex.props(styles.wrapper), { className: 'gf-explore-no-data' }).className}
      >
        <span {...stylex.props(styles.message)}>{'No data'}</span>
      </PanelContainer>
    </>
  );
};

const styles = stylex.create({
  wrapper: {
    padding: spacing['--gf-spacing-x3'],
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  message: {
    fontSize: typography['--gf-typography-h2-font-size'],
    padding: spacing['--gf-spacing-x4'],
    color: colors['--gf-colors-text-disabled'],
  },
});
