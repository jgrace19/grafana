import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { useState } from 'react';

import { t } from '@grafana/i18n';

import { components, spacing } from '../../themes/stylex/tokens.stylex';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Box } from '../Layout/Box/Box';
import { Stack } from '../Layout/Stack/Stack';
import { TextArea } from '../TextArea/TextArea';

export type Props = React.ComponentProps<typeof TextArea> & {
  /** TRUE if the secret was already configured. (It is needed as often the backend doesn't send back the actual secret, only the information that it was configured) */
  isConfigured: boolean;
  /** Called when the user clicks on the "Reset" button in order to clear the secret */
  onReset: () => void;
  /** If true, the text area will grow to fill available width. */
  grow?: boolean;
};

export const CONFIGURED_TEXT = 'configured';
export const RESET_BUTTON_TEXT = 'Reset';

/**
 * Text area that does not disclose an already configured value but lets the user reset the current value and enter a new one.
 * Typically useful for asymmetric cryptography keys.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-secrettextarea--docs
 */
export const SecretTextArea = ({ isConfigured, onReset, grow, ...props }: Props) => {
  const [contentVisible, setContentVisible] = useState(false);
  const toggleLabel = contentVisible
    ? t('grafana-ui.secret-text-area.hide-content', 'Hide secret content')
    : t('grafana-ui.secret-text-area.show-content', 'Show secret content');

  return (
    <Stack>
      <Box grow={grow ? 1 : undefined}>
        {!isConfigured && (
          <div {...stylex.props(styles.textAreaWrapper)}>
            {/* IconButton positions itself, so the absolute positioning lives on a wrapper. */}
            <div {...stylex.props(styles.toggleButton)}>
              <IconButton
                name={contentVisible ? 'eye-slash' : 'eye'}
                onClick={() => setContentVisible(!contentVisible)}
                aria-label={toggleLabel}
                tooltip={toggleLabel}
                size="sm"
              />
            </div>
            {/* TextArea doesn't set -webkit-text-security, so the class can't conflict with its own styles. */}
            <TextArea
              {...props}
              className={clsx(!contentVisible && stylex.props(styles.maskedTextArea).className, props.className)}
            />
          </div>
        )}
        {isConfigured && (
          <TextArea
            {...props}
            rows={1}
            disabled={true}
            value={CONFIGURED_TEXT}
            className={undefined}
            xstyle={styles.configuredStyle}
          />
        )}
      </Box>
      {isConfigured && (
        <Button onClick={onReset} variant="secondary">
          {RESET_BUTTON_TEXT}
        </Button>
      )}
    </Stack>
  );
};

const styles = stylex.create({
  configuredStyle: {
    minHeight: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    paddingTop: spacing['--gf-spacing-x0-5'] /** Needed to mimic vertically centered text in an input box */,
    resize: 'none',
  },
  maskedTextArea: {
    // Non-standard (Chromium and WebKit only), so the StyleX lint doesn't know it; the compiler emits it as is.
    // eslint-disable-next-line @stylexjs/valid-styles
    WebkitTextSecurity: 'disc',
  },
  textAreaWrapper: {
    position: 'relative',
  },
  toggleButton: {
    display: 'flex',
    position: 'absolute',
    top: spacing['--gf-spacing-x1'],
    right: spacing['--gf-spacing-x3'],
    zIndex: 1,
  },
});
