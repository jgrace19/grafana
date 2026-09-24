import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { wizardLayoutStyles } from './WizardLayout.stylex';
import { type ReactNode } from 'react';


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
    <div {...stylex.props(wizardLayoutStyles.container)}>
      <div {...stylex.props(wizardLayoutStyles.sidebar)}>
        <Stepper />
      </div>
      <div {...stylex.props(wizardLayoutStyles.content)}>{children}</div>
    </div>
  );
};

