
import { tabbedContainerStyleProps } from './TabbedContainer.stylex'

import { useState } from 'react';
import * as React from 'react';

import { type SelectableValue, } from '@grafana/data';

import { IconButton } from '../../components/IconButton/IconButton';
import { Tab } from '../../components/Tabs/Tab';
import { TabContent } from '../../components/Tabs/TabContent';
import { TabsBar } from '../../components/Tabs/TabsBar';
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
    <div {...tabbedContainerStyleProps('container')} data-testid={testId}>
      <TabsBar {...tabbedContainerStyleProps('tabs')}>
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
        <TabContent {...tabbedContainerStyleProps('tabContent')}>{tabs.find((t) => t.value === activeTab)?.content}</TabContent>
      </ScrollContainer>
    </div>
  );
}

