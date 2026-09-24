import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { sidebarCollapsableHeaderStyles } from './SidebarCollapsableHeader.stylex';

import {CollapsableSection, Stack, Text} from '@grafana/ui';

interface SidebarCollapsableHeaderProps {
  label: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export const SidebarCollapsableHeader = ({
  label,
  children,
  headerAction,
  isOpen,
  onToggle,
}: SidebarCollapsableHeaderProps) => {


  return (
    <CollapsableSection
      label={
        <div {...stylex.props(sidebarCollapsableHeaderStyles.headerContent)}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Text color="maxContrast" variant="bodySmall" weight="light">
              {label}
            </Text>
            {headerAction && (
              <div
                {...stylex.props(sidebarCollapsableHeaderStyles.headerActionWrapper)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="button"
                tabIndex={0}
              >
                {headerAction}
              </div>
            )}
          </Stack>
        </div>
      }
      isOpen={isOpen}
      onToggle={onToggle}
      {...stylex.props(sidebarCollapsableHeaderStyles.collapsableSection)}
      contentClassName={sidebarCollapsableHeaderStyles.contentArea}
    >
      <div {...stylex.props(sidebarCollapsableHeaderStyles.queryStackCardsContainer)}>{children}</div>
    </CollapsableSection>
  );
};

