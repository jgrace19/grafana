
import { segmentSectionStyleProps } from './SegmentSection.stylex'

import * as React from 'react';


import { InlineFieldRow } from '../Forms/InlineFieldRow';
import { InlineLabel } from '../Forms/InlineLabel';

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
        <InlineLabel htmlFor={htmlFor} width={12} {...segmentSectionStyleProps('label')}>
          {label}
        </InlineLabel>
        {children}
        {fill && (
          <div {...segmentSectionStyleProps('fill')}>
            <InlineLabel>{''}</InlineLabel>
          </div>
        )}
      </InlineFieldRow>
    </>
  );
};

