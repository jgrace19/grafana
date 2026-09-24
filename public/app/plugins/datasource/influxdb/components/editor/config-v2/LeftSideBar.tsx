import * as stylex from '@stylexjs/stylex';

import { Box, Icon, LinkButton, Space, Stack, Text } from '@grafana/ui';

import { CONFIG_SECTION_HEADERS, CONFIG_SECTION_HEADERS_WITH_PDC } from './constants';

interface LeftSideBarProps {
  pdcInjected: boolean;
}

export const LeftSideBar = ({ pdcInjected }: LeftSideBarProps) => {
  const headers = pdcInjected ? CONFIG_SECTION_HEADERS_WITH_PDC : CONFIG_SECTION_HEADERS;

  return (
    <Stack>
      <Box flex={1} marginY={1}>
        <Text element="h4">Connect data source</Text>
        <Box paddingTop={2}>
          {headers.map((header, index) => (
            <div key={index} data-testid={`${header.label}-sidebar`}>
              <Icon name="circle" size="xs" />
              <LinkButton
                style={header.isOptional ? { padding: '5px 15px', height: '50px', width: '225px' } : {}}
                variant="secondary"
                fill="text"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(header.id);
                  if (target) {
                    const y = target.getBoundingClientRect().top + window.scrollY - 60;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
              >
                <div {...stylex.props(styles.sidebarText)}>
                  <div {...stylex.props(styles.sidebarLabel)}>{header.label}</div>
                  {header.isOptional && (
                    <div {...stylex.props(styles.sidebarOptional)}>
                      <Text color="secondary" variant="bodySmall">
                        optional
                      </Text>
                    </div>
                  )}
                </div>
              </LinkButton>
              <Space v={1} />
            </div>
          ))}
        </Box>
      </Box>
    </Stack>
  );
};

const styles = stylex.create({
  sidebarText: {
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    lineHeight: 1,
  },
  sidebarOptional: {
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 1,
  },
});
