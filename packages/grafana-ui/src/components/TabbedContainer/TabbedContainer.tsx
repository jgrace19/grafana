import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import * as React from 'react';

import { type SelectableValue } from '@grafana/data';

import { IconButton } from '../../components/IconButton/IconButton';
import { Tab } from '../../components/Tabs/Tab';
import { TabContent } from '../../components/Tabs/TabContent';
import { TabsBar } from '../../components/Tabs/TabsBar';
import { colors, spacing } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { Box } from '../Layout/Box/Box';
import { ScrollContainer } from '../ScrollContainer/ScrollContainer';

export interface TabConfig {
  label: string;
  value: string;
  content: React.ReactNode;
  icon: IconName;
}

export interface TabbedContainerProps {
  tabs: TabConfig[];
  defaultTab?: string;
  closeIconTooltip?: string;
  onClose: () => void;
  testId?: string;
}

export function TabbedContainer({ tabs, defaultTab, closeIconTooltip, onClose, testId }: TabbedContainerProps) {
  const [activeTab, setActiveTab] = useState(tabs.some((tab) => tab.value === defaultTab) ? defaultTab : tabs[0].value);

  const onSelectTab = (item: SelectableValue<string>) => {
    setActiveTab(item.value!);
  };

  return (
    <div {...stylex.props(styles.container)} data-testid={testId}>
      <TabsBar xstyle={styles.tabs}>
        {tabs.map((t) => (
          <Tab
            key={t.value}
            label={t.label}
            active={t.value === activeTab}
            onChangeTab={() => onSelectTab(t)}
            icon={t.icon}
          />
        ))}
        <Box grow={1} display="flex" justifyContent="flex-end" paddingRight={1}>
          <IconButton size="lg" onClick={onClose} name="times" tooltip={closeIconTooltip ?? 'Close'} />
        </Box>
      </TabsBar>
      <ScrollContainer>
        <TabContent xstyle={styles.tabContent}>{tabs.find((t) => t.value === activeTab)?.content}</TabContent>
      </ScrollContainer>
    </div>
  );
}

const styles = stylex.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minHeight: 0,
  },
  tabContent: {
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    backgroundColor: colors['--gf-colors-background-primary'],
    flex: '1',
  },
  tabs: {
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    borderColor: colors['--gf-colors-border-weak'],
  },
});
