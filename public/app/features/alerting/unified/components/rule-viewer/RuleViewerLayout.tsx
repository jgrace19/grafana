import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import type { JSX } from 'react';

import { type NavModelItem } from '@grafana/data';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { Page } from 'app/core/components/Page/Page';
import { type PageProps } from 'app/core/components/Page/types';

import { getAlertRulesNavId } from '../../navigation/useAlertRulesNav';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  title: string;
  renderTitle?: PageProps['renderTitle'];
  wrapInContent?: boolean;
};

const defaultPageNav: Partial<NavModelItem> = {
  icon: 'bell',
  id: 'alert-rule-view',
};

export function RuleViewerLayout(props: Props): JSX.Element | null {
  const { wrapInContent = true, children, title, renderTitle } = props;
  return (
    <Page pageNav={{ ...defaultPageNav, text: title }} renderTitle={renderTitle} navId={getAlertRulesNavId()}>
      <Page.Contents>
        <div {...stylex.props(styles.content)}>{wrapInContent ? <RuleViewerLayoutContent {...props} /> : children}</div>
      </Page.Contents>
    </Page>
  );
}

type ContentProps = {
  children: React.ReactNode | React.ReactNode[];
  padding?: number;
};

export function RuleViewerLayoutContent({ children, padding = 2 }: ContentProps): JSX.Element | null {
  return (
    <div {...stylex.props(styles.wrapper, styles.padding(`calc(${spacing['--gf-spacing-grid-size']} * ${padding})`))}>
      {children}
    </div>
  );
}

// theme.breakpoints.values.xxl
const MAX_CONTENT_WIDTH = '1440px';

const styles = stylex.create({
  content: {
    maxWidth: MAX_CONTENT_WIDTH,
  },
  wrapper: {
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
  padding: (padding: string) => ({
    padding,
  }),
});
