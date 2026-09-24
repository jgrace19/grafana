import * as stylex from '@stylexjs/stylex';
import { useId, useState } from 'react';
import * as React from 'react';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { IconButton } from '../IconButton/IconButton';

export interface Props {
  /** Expand or collapse te content */
  isOpen?: boolean;
  /** Element or text for the Collapse header */
  label: React.ReactNode;
  /** Indicates loading state of the content */
  loading?: boolean;
  /** Callback for the toggle functionality */
  onToggle?: (isOpen: boolean) => void;
  /** Additional class name for the root element */
  className?: string;
  /** @internal first-party StyleX overrides for the root element, applied last */
  xstyle?: stylex.StyleXStyles;
  /** @deprecated this prop is no longer used and will be removed in Grafana 13 */
  collapsible?: boolean;
}

export const ControlledCollapse = ({ isOpen, onToggle, ...otherProps }: React.PropsWithChildren<Props>) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <Collapse
      isOpen={open}
      {...otherProps}
      onToggle={() => {
        setOpen(!open);
        if (onToggle) {
          onToggle(!open);
        }
      }}
    />
  );
};

/**
 * A content area, which can be horizontally collapsed and expanded. Can be used to hide extra information on the page.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-collapse--docs
 */
export const Collapse = ({
  isOpen,
  label,
  loading,
  onToggle,
  className,
  xstyle,
  children,
}: React.PropsWithChildren<Props>) => {
  const labelId = useId();
  const contentId = useId();

  const onClickToggle = () => {
    if (onToggle) {
      onToggle(!isOpen);
    }
  };
  return (
    <div {...mergeStylexProps(stylex.props(styles.collapse, xstyle), { className })}>
      {/* the inner button handles keyboard a11y. this is a convenience for mouse users */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div {...stylex.props(styles.header)} onClick={onClickToggle}>
        <IconButton
          aria-describedby={labelId}
          aria-expanded={isOpen}
          aria-controls={contentId}
          xstyle={styles.button}
          aria-labelledby={labelId}
          name={isOpen ? 'angle-down' : 'angle-right'}
        />
        <div id={labelId} {...stylex.props(styles.headerLabel)}>
          {label}
        </div>
      </div>
      {isOpen && (
        <div {...stylex.props(styles.collapseBody)} id={contentId}>
          <div {...stylex.props(styles.loader, loading && styles.loaderActive)} />
          <div {...stylex.props(styles.bodyContentWrapper)}>{children}</div>
        </div>
      )}
    </div>
  );
};

Collapse.displayName = 'Collapse';

const loader = stylex.keyframes({
  from: {
    left: '-25%',
    opacity: 0.1,
  },
  to: {
    left: '100%',
    opacity: 1,
  },
});

const grid = spacing['--gf-spacing-grid-size'];

const styles = stylex.create({
  button: {
    marginRight: 0,
  },
  collapse: {
    marginBottom: grid,
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    position: 'relative',
    borderRadius: shape['--gf-shape-radius-default'],
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  collapseBody: {
    paddingTop: 0,
    paddingRight: `calc(${grid} * ${components['--gf-components-panel-padding']})`,
    paddingBottom: `calc(${grid} * ${components['--gf-components-panel-padding']})`,
    paddingLeft: `calc(${grid} * ${components['--gf-components-panel-padding']})`,
    flex: '1',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  bodyContentWrapper: {
    flex: '1',
  },
  loader: {
    height: '2px',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    margin: `calc(${grid} * 0.5)`,
  },
  loaderActive: {
    '::after': {
      content: "' '",
      display: 'block',
      width: '25%',
      top: 0,
      height: '250%',
      position: 'absolute',
      animationName: { default: null, [motion.noPreferenceOrReduce]: loader },
      animationDuration: { default: null, [motion.noPreference]: '2s', [motion.reduce]: '10s' },
      animationTimingFunction: {
        default: null,
        [motion.noPreferenceOrReduce]: 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      },
      animationDelay: { default: null, [motion.noPreferenceOrReduce]: '500ms' },
      animationIterationCount: { default: null, [motion.noPreference]: 100, [motion.reduce]: 20 },
      left: '-25%',
      backgroundColor: colors['--gf-colors-primary-main'],
    },
  },
  header: {
    cursor: 'pointer',
    padding: grid,
    display: 'flex',
    gap: grid,
  },
  headerLabel: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontSize: typography['--gf-typography-size-md'],
    display: 'flex',
    flex: '1',
  },
});
