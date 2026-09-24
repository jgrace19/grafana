import { Source } from '@storybook/blocks';
import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { Children, isValidElement, type ReactNode, useMemo, useState } from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';

import { Stack } from '../../components/Layout/Stack/Stack';
import { useTheme2 } from '../../themes/ThemeContext';
import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';

import './ExampleFrame.css';

interface ExampleFrameProps {
  children: ReactNode;
}

/**
 * Wraps children with a border for nicer presentation in Storybook docs.
 * Includes a collapsible code block that shows the JSX source of the children.
 */
export function ExampleFrame(props: ExampleFrameProps) {
  const { children } = props;
  const theme = useTheme2();
  const [isExpanded, setIsExpanded] = useState(false);

  const sourceString = useMemo(() => {
    const opts = { sortProps: false };
    return Children.toArray(children)
      .filter(isValidElement)
      .map((child) => reactElementToJSXString(child, opts))
      .join('\n');
  }, [children]);

  return (
    <div className={clsx(stylex.props(styles.wrapper).className, 'sb-unstyled')}>
      <Stack gap={0} direction="column">
        <div {...stylex.props(styles.preview)}>{children}</div>
        {isExpanded && (
          <div className={clsx('gf-example-frame-source', stylex.props(styles.source).className)}>
            <Source dark={theme.isDark} code={sourceString} language="tsx" />
          </div>
        )}
        <button {...stylex.props(styles.toggle)} onClick={() => setIsExpanded(!isExpanded)}>
          {/* eslint-disable-next-line @grafana/i18n/no-untranslated-strings */}
          {isExpanded ? 'Hide code' : 'Show code'}
        </button>
      </Stack>
    </div>
  );
}

const grid = spacing['--gf-spacing-grid-size'];

const styles = stylex.create({
  wrapper: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    borderRadius: shape['--gf-shape-radius-default'],
    marginTop: `calc(${grid} * 2)`,
    marginRight: 0,
    marginBottom: `calc(${grid} * 2)`,
    marginLeft: 0,
    overflow: 'hidden',
  },
  preview: {
    padding: `calc(${grid} * 2)`,
  },
  source: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-medium'],
  },
  toggle: {
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    borderStyle: 'unset',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors['--gf-colors-border-medium'],
    paddingTop: `calc(${grid} * 0.5)`,
    paddingRight: `calc(${grid} * 1.5)`,
    paddingBottom: `calc(${grid} * 0.5)`,
    paddingLeft: `calc(${grid} * 1.5)`,
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
