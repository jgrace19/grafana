import * as stylex from '@stylexjs/stylex';
import { type AriaRole, type ReactNode } from 'react';
import * as React from 'react';
import SVG from 'react-inlinesvg';

import { spacing } from '../../themes/stylex/tokens.stylex';
import { Box } from '../Layout/Box/Box';
import { Stack } from '../Layout/Stack/Stack';
import { Text } from '../Text/Text';

import { GrotCTA } from './GrotCTA/GrotCTA';
import { GrotNotFound } from './GrotNotFound/GrotNotFound';
import GrotCompleted from './grot-completed.svg';

interface Props {
  /**
   * Provide a button to render below the message
   */
  button?: ReactNode;
  hideImage?: boolean;
  /**
   * Override the default image for the variant
   */
  image?: ReactNode;
  /**
   * Message to display to the user
   */
  message: string;
  /**
   * Which variant to use. Affects the default image shown.
   */
  variant: 'call-to-action' | 'not-found' | 'completed';
  /**
   * Use to set `alert` when needed. See documentation for the use case
   */
  role?: AriaRole;
}

/**
 * The EmptyState component consists of a message and optionally an image, button, and additional information.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-emptystate--docs
 */
export const EmptyState = ({
  button,
  children,
  image,
  message,
  hideImage = false,
  variant,
  role,
}: React.PropsWithChildren<Props>) => {
  const imageToShow = image ?? getDefaultImageForVariant(variant);

  return (
    <Box paddingY={4} display="flex" direction="column" alignItems="center" role={role}>
      <div {...stylex.props(styles.container)}>
        {!hideImage && imageToShow}
        <Stack direction="column" alignItems="center">
          <Text variant="h4" textAlignment="center">
            {message}
          </Text>
          {children && (
            <Text color="secondary" textAlignment="center">
              {children}
            </Text>
          )}
        </Stack>
        {button}
      </div>
    </Box>
  );
};

function getDefaultImageForVariant(variant: Props['variant']) {
  switch (variant) {
    case 'call-to-action': {
      return <GrotCTA width={300} />;
    }
    case 'not-found': {
      return <GrotNotFound width={300} />;
    }
    case 'completed': {
      return <SVG src={GrotCompleted} width={300} />;
    }
    default: {
      throw new Error(`Unknown variant: ${variant}`);
    }
  }
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x4'],
    maxWidth: '600px',
  },
});
