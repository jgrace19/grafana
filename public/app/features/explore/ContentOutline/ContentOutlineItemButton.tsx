import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { contentOutlineItemButtonStyles } from './ContentOutlineItemButton.stylex';
import { type ButtonHTMLAttributes, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { type IconName, isIconName, type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Button, Icon, Tooltip, useTheme2 } from '@grafana/ui';
import { type TooltipPlacement } from '@grafana/ui/internal';

type CommonProps = {
  contentOutlineExpanded?: boolean;
  title?: string;
  icon?: IconName | React.ReactNode;
  tooltip?: string;
  tooltipPlacement?: TooltipPlacement;
  className?: string;
  indentStyle?: string;
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
  indentStyle,
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
  const theme = useTheme2();
  const styles = getStyles(theme, color);

  const buttonStyles = clsx(mergeStylexClassName(stylex.props(contentOutlineItemButtonStyles.button), undefined).className, className);

  const textRef = useRef<HTMLElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current?.scrollWidth > textRef.current?.clientWidth);
    }
  }, [title]);

  const body = (
    <div {...mergeStylexClassName(stylex.props(contentOutlineItemButtonStyles.buttonContainer, , indentStyle), undefined)}>
      {collapsible && (
        <button
          {...stylex.props(contentOutlineItemButtonStyles.collapseButton)}
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
        {...mergeStylexClassName(stylex.props(contentOutlineItemButtonStyles.active, buttonStyles, {
          []: isActive,
          [mergeStylexClassName(stylex.props(contentOutlineItemButtonStyles.extraHighlight), undefined).className]: extraHighlight,
        }), undefined)}
        aria-label={tooltip}
        {...rest}
      >
        <OutlineIcon icon={icon} />
        {title && (
          <span {...stylex.props(contentOutlineItemButtonStyles.textContainer)} ref={textRef}>
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
          {...stylex.props(contentOutlineItemButtonStyles.deleteButton)}
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

;
