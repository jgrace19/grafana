import * as stylex from '@stylexjs/stylex';
import { type ReactNode } from 'react';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { Stepper } from './Stepper';

interface WizardLayoutProps {
  children: ReactNode;
}

/**
 * WizardLayout - provides the main layout structure for the wizard
 * with a sidebar (Stepper) and main content area
 */
export const WizardLayout = ({ children }: WizardLayoutProps) => {
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.sidebar)}>
        <Stepper />
      </div>
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  );
};

const styles = stylex.create({
  container: {
    display: 'flex',
    gap: spacing['--gf-spacing-x4'],
    minHeight: '600px',
  },
  sidebar: {
    flexShrink: 0,
    paddingTop: spacing['--gf-spacing-x1'],
  },
  content: {
    flex: '1',
    maxWidth: '800px',
  },
});
