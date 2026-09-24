import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { spacing } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';

interface Props {
  /** @deprecated */
  icon?: IconName;
  /** @deprecated */
  iconClass?: string;
}

/** @internal */
export const ModalTabContent = ({ children }: React.PropsWithChildren<Props>) => {
  return (
    <div>
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.content)}>{children}</div>
      </div>
    </div>
  );
};

const styles = stylex.create({
  header: {
    display: 'flex',
    marginTop: 0,
    marginRight: 0,
    marginBottom: spacing['--gf-spacing-x3'],
    marginLeft: 0,
  },
  content: {
    flexGrow: 1,
  },
});
