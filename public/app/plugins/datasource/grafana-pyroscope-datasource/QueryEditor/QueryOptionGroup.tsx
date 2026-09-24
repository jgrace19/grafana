import * as stylex from '@stylexjs/stylex';
import { queryOptionGroupStyles } from './QueryOptionGroup.stylex';

import * as React from 'react';
import { useToggle } from 'react-use';

import { Collapse, Stack } from '@grafana/ui';

export interface Props {
  title: string;
  collapsedInfo: string[];
  children: React.ReactNode;
}

export function QueryOptionGroup({ title, children, collapsedInfo }: Props) {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div {...stylex.props(queryOptionGroupStyles.wrapper)}>
      <Collapse
        {...stylex.props(queryOptionGroupStyles.collapse)}
        isOpen={isOpen}
        onToggle={toggleOpen}
        label={
          <Stack gap={0}>
            <h6 {...stylex.props(queryOptionGroupStyles.title)}>{title}</h6>
            {!isOpen && (
              <div {...stylex.props(queryOptionGroupStyles.description)}>
                {collapsedInfo.map((x, i) => (
                  <span key={i}>{x}</span>
                ))}
              </div>
            )}
          </Stack>
        }
      >
        <div {...stylex.props(queryOptionGroupStyles.body)}>{children}</div>
      </Collapse>
    </div>
  );
}

;
