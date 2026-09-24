import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';

export interface Props {
  children: JSX.Element | string;
}

/**
 * @deprecated Use `<EmptyState variant="not-found" />` instead.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-deprecated-emptysearchresult--docs
 */
const EmptySearchResult = ({ children }: Props) => {
  return <div {...stylex.props(styles.container)}>{children}</div>;
};

const styles = stylex.create({
  container: {
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-info-main'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    minWidth: '350px',
    borderRadius: shape['--gf-shape-radius-default'],
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * 4)`,
  },
});
export { EmptySearchResult };
