import * as stylex from '@stylexjs/stylex';
import React from 'react';

import { Box, Stack, Text } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';

import { DatabaseConnectionSection } from './DatabaseConnectionSection';
import { LeftSideBar } from './LeftSideBar';
import { UrlAndAuthenticationSection } from './UrlAndAuthenticationSection';
import { CONTAINER_MIN_WIDTH } from './constants';
import { type Props } from './types';

export const ConfigEditor: React.FC<Props> = ({ onOptionsChange, options }: Props) => {
  return (
    <Stack justifyContent="space-between">
      <div {...stylex.props(styles.hideOnSmallScreen, styles.leftSticky)}>
        <Box width="100%" flex="1 1 auto">
          <LeftSideBar pdcInjected={options?.jsonData?.pdcInjected!!} />
        </Box>
      </div>
      <Box width="60%" flex="1 1 auto" minWidth={CONTAINER_MIN_WIDTH}>
        <Stack direction="column">
          <Text variant="bodySmall" color="secondary">
            Fields marked with * are required
          </Text>
          <UrlAndAuthenticationSection options={options} onOptionsChange={onOptionsChange} />
          <DatabaseConnectionSection options={options} onOptionsChange={onOptionsChange} />
        </Stack>
      </Box>
      <Box width="20%" flex="0 0 20%">
        {/* TODO: Right sidebar */}
      </Box>
    </Stack>
  );
};

const styles = stylex.create({
  hideOnSmallScreen: {
    width: '250px',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '250px',
    display: {
      default: null,
      [bp.smDown]: 'none',
    },
  },

  leftSticky: {
    position: 'sticky',
    top: '100px',
    alignSelf: 'flex-start',
    maxHeight: 'calc(100vh - 100px)',
    overflow: 'hidden',
  },
});
