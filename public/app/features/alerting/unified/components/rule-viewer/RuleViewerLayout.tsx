import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { ruleViewerLayoutStyles } from './RuleViewerLayout.stylex';
import * as React from 'react';
import type { JSX } from 'react';

import { type NavModelItem } from '@grafana/data';
import { themeSpacing } from '../../stylex/spacing';
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
        <div {...stylex.props(ruleViewerLayoutStyles.content)}>{wrapInContent ? <RuleViewerLayoutContent {...props} /> : children}</div>
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
    <div {...stylex.props(ruleViewerLayoutStyles.wrapper)} style={{ padding: themeSpacing(padding) }}>
      {children}
    </div>
  );
}
