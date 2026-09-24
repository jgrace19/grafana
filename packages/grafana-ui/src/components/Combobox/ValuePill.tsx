import * as stylex from '@stylexjs/stylex';
import { forwardRef } from 'react';

import { t } from '@grafana/i18n';

import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { IconButton } from '../IconButton/IconButton';

interface ValuePillProps {
  children: string;
  onRemove: () => void;
  disabled?: boolean;
}

export const ValuePill = forwardRef<HTMLSpanElement, ValuePillProps>(
  ({ children, onRemove, disabled, ...rest }, ref) => {
    const removeButtonLabel = t('grafana-ui.value-pill.remove-button', 'Remove {{children}}', { children });
    return (
      <span {...stylex.props(styles.wrapper, disabled && styles.wrapperDisabled)} {...rest} ref={ref}>
        <span {...stylex.props(styles.text)}>{children}</span>
        {!disabled && (
          <>
            <span {...stylex.props(styles.separator)} />
            <IconButton
              name="times"
              size="md"
              aria-label={removeButtonLabel}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            />
          </>
        )}
      </span>
    );
  }
);
ValuePill.displayName = 'ValuePill';

const styles = stylex.create({
  wrapper: {
    display: 'inline-flex',
    borderRadius: shape['--gf-shape-radius-sm'],
    color: colors['--gf-colors-text-primary'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    padding: spacing['--gf-spacing-x0-25'],
    borderStyle: 'none',
    fontSize: typography['--gf-typography-body-small-font-size'],
    flexShrink: 1,
    minWidth: '50px',
    alignItems: 'center',
  },
  wrapperDisabled: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
  },

  text: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },

  separator: {
    backgroundColor: colors['--gf-colors-border-weak'],
    width: '1px',
    height: '100%',
    marginRight: spacing['--gf-spacing-x0-5'],
  },
});
