import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { spacing } from '../../themes/stylex/tokens.stylex';
import { InlineFieldRow } from '../Forms/InlineFieldRow';
import { InlineLabel } from '../Forms/InlineLabel';

import { segmentStyles } from './styles';

/**
 * Horizontal section for editor components.
 *
 * @alpha
 */
export const SegmentSection = ({
  label,
  htmlFor,
  children,
  fill,
}: {
  // Name of the section
  label: string;
  // htmlFor for the label
  htmlFor?: string;
  // List of components in the section
  children: React.ReactNode;
  // Fill the space at the end
  fill?: boolean;
}) => {
  return (
    <>
      <InlineFieldRow>
        <InlineLabel htmlFor={htmlFor} width={12} xstyle={segmentStyles.sectionLabel}>
          {label}
        </InlineLabel>
        {children}
        {fill && (
          <div {...stylex.props(styles.fill)}>
            <InlineLabel>{''}</InlineLabel>
          </div>
        )}
      </InlineFieldRow>
    </>
  );
};

const styles = stylex.create({
  fill: {
    flexGrow: 1,
    marginBottom: spacing['--gf-spacing-x0-5'],
  },
});
