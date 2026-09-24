import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import * as React from 'react';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { SettingsBarHeader, type Props as SettingsBarHeaderProps } from './SettingsBarHeader';

export interface Props extends Pick<SettingsBarHeaderProps, 'headerElement' | 'title'> {
  children: React.ReactNode;
}

export function SettingsBar({ children, title, headerElement, ...rest }: Props) {
  const [isContentVisible, setIsContentVisible] = useState(false);

  function onRowToggle() {
    setIsContentVisible((prevState) => !prevState);
  }

  return (
    <>
      <SettingsBarHeader
        onRowToggle={onRowToggle}
        isContentVisible={isContentVisible}
        title={title}
        headerElement={headerElement}
        {...rest}
      />
      {isContentVisible && <div {...stylex.props(styles.content)}>{children}</div>}
    </>
  );
}

SettingsBar.displayName = 'SettingsBar';

const styles = stylex.create({
  content: {
    marginTop: spacing['--gf-spacing-x1'],
    marginLeft: spacing['--gf-spacing-x4'],
  },
});
