import * as stylex from '@stylexjs/stylex';
import { type ButtonHTMLAttributes, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { type IconName, isIconName } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Button, Icon, Tooltip } from '@grafana/ui';
import { mergeStylexProps, type TooltipPlacement } from '@grafana/ui/internal';
import { colors, components, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

type CommonProps = {
  contentOutlineExpanded?: boolean;
  title?: string;
  icon?: IconName | React.ReactNode;
  tooltip?: string;
  tooltipPlacement?: TooltipPlacement;
  className?: string;
  /** @internal first-party StyleX overrides for the item button, applied after its own styles */
  xstyle?: stylex.StyleXStyles;
  /** @internal first-party StyleX styles for the item's container (indentation, highlight) */
  indentXstyle?: stylex.StyleXStyles;
  collapsible?: boolean;
  collapsed?: boolean;
  isActive?: boolean;
  extraHighlight?: boolean;
  sectionId?: string;
  toggleCollapsed?: () => void;
  color?: string;
  onRemove?: () => void;
};

export type ContentOutlineItemButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function ContentOutlineItemButton({
  contentOutlineExpanded,
  title,
  icon,
  tooltip,
  tooltipPlacement = 'bottom',
  className,
  xstyle,
  indentXstyle,
  collapsible,
  collapsed,
  isActive,
  extraHighlight,
  sectionId,
  toggleCollapsed,
  color,
  onRemove,
  ...rest
}: ContentOutlineItemButtonProps) {
  const textRef = useRef<HTMLElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current?.scrollWidth > textRef.current?.clientWidth);
    }
  }, [title]);

  const body = (
    <div {...stylex.props(styles.buttonContainer, indentXstyle)}>
      {collapsible && (
        <button
          {...stylex.props(styles.collapseButton)}
          onClick={toggleCollapsed}
          aria-label={t(
            'explore.content-outline-item-button.body.aria-label-content-outline-item-collapse-button',
            'Content outline item collapse button'
          )}
          aria-expanded={!collapsed}
          aria-controls={sectionId}
        >
          <OutlineIcon icon={collapsed ? 'angle-right' : 'angle-down'} />
        </button>
      )}
      <button
        {...mergeStylexProps(
          stylex.props(
            styles.button,
            xstyle,
            isActive && styles.active,
            extraHighlight && styles.extraHighlight,
            (isActive || extraHighlight) && (color !== undefined ? styles.markerColor(color) : styles.markerGradient)
          ),
          { className }
        )}
        aria-label={tooltip}
        {...rest}
      >
        <OutlineIcon icon={icon} />
        {title && (
          <span {...stylex.props(styles.textContainer)} ref={textRef}>
            {title}
          </span>
        )}
      </button>
      {onRemove && (
        <Button
          aria-label={t(
            'explore.content-outline-item-button.body.aria-label-content-outline-item-delete-button',
            'Delete item'
          )}
          variant="destructive"
          xstyle={styles.deleteButton}
          icon="times"
          onClick={() => onRemove()}
          data-testid="content-outline-item-delete-button"
        />
      )}
    </div>
  );

  // if there's a tooltip we want to show it if the text is overflowing
  const showTooltip = tooltip && (!contentOutlineExpanded || isOverflowing);

  return showTooltip ? (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      {body}
    </Tooltip>
  ) : (
    body
  );
}

function OutlineIcon({ icon }: { icon: IconName | React.ReactNode }) {
  if (!icon) {
    return null;
  }

  if (isIconName(icon)) {
    return <Icon name={icon} size={'lg'} title={icon} />;
  }

  return icon;
}

const styles = stylex.create({
  deleteButton: {
    width: spacing['--gf-spacing-x1'],
    height: spacing['--gf-spacing-x1'],
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    marginRight: spacing['--gf-spacing-x0-5'],
  },
  buttonContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    gap: spacing['--gf-spacing-x0-25'],
    width: '100%',
    overflow: 'hidden',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    gap: spacing['--gf-spacing-x0-5'],
    color: colors['--gf-colors-text-secondary'],
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderStyle: 'none',
  },
  collapseButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: spacing['--gf-spacing-x3'],
    height: spacing['--gf-spacing-x4'],
    borderRadius: shape['--gf-shape-radius-default'],
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-secondary-shade'] },
    borderStyle: 'none',
    overflow: 'hidden',
  },
  textContainer: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: typography['--gf-typography-body-small-font-size'],
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  active: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    position: 'relative',
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    '::before': {
      borderRadius: shape['--gf-shape-radius-default'],
      content: '" "',
      display: 'block',
      height: '100%',
      position: 'absolute',
      transform: 'translateX(-50%)',
      width: spacing['--gf-spacing-x0-5'],
      left: '2px',
    },
  },
  extraHighlight: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    position: 'relative',
    '::before': {
      borderRadius: shape['--gf-shape-radius-default'],
      content: '" "',
      display: 'block',
      height: '100%',
      position: 'absolute',
      transform: 'translateX(-50%)',
      width: spacing['--gf-spacing-x0-5'],
      left: '2px',
    },
  },
  // The active/highlighted marker: the item's colour, or the brand gradient when it has none.
  markerColor: (color: string) => ({
    '::before': {
      backgroundImage: 'none',
      backgroundColor: color,
    },
  }),
  markerGradient: {
    '::before': {
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
    },
  },
});
