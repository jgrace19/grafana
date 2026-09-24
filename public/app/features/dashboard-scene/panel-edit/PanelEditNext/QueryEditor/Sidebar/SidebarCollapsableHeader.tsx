import * as stylex from '@stylexjs/stylex';

import { CollapsableSection, Stack, Text } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

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
        <div {...stylex.props(styles.headerContent)}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Text color="maxContrast" variant="bodySmall" weight="light">
              {label}
            </Text>
            {headerAction && (
              <div
                {...stylex.props(styles.headerActionWrapper)}
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
      className={stylex.props(styles.collapsableSection).className}
      contentXstyle={styles.content}
    >
      <div {...stylex.props(styles.queryStackCardsContainer)}>{children}</div>
    </CollapsableSection>
  );
};

const styles = stylex.create({
  content: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  collapsableSection: {
    marginTop: spacing['--gf-spacing-x0-5'],
  },
  queryStackCardsContainer: {
    paddingTop: spacing['--gf-spacing-x1'],
  },
  headerActionWrapper: {
    // This is used so we can stop the header action from triggering the collapse of the header
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  headerContent: {
    width: '100%',
  },
});
