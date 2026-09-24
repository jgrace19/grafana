import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';

import { isUnsignedPluginSignature, type PanelPluginMeta, PluginState } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { IconButton, PluginSignatureBadge, useTheme2 } from '@grafana/ui';
import { durations, easings, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shadows, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { type SkeletonComponent, attachSkeleton } from '@grafana/ui/unstable';
import { PluginStateInfo } from 'app/features/plugins/components/PluginStateInfo';

interface Props {
  isCurrent: boolean;
  plugin: PanelPluginMeta;
  title: string;
  onSelect: (withModKey?: boolean) => void;
  onDelete?: () => void;
  disabled?: boolean;
  showBadge?: boolean;
  description?: string;
  tabIndex?: number;
}

const IMAGE_SIZE = 38;

const PanelTypeCardComponent = ({
  isCurrent,
  title,
  plugin,
  onSelect,
  onDelete,
  disabled,
  showBadge,
  description,
  children,
  tabIndex = 0,
}: React.PropsWithChildren<Props>) => {
  const theme = useTheme2();

  const isDisabled = disabled || plugin.state === PluginState.deprecated;
  const background = isCurrent
    ? theme.colors.action.selected
    : isDisabled
      ? theme.colors.action.disabledBackground
      : theme.colors.background.secondary;
  const hoverBackground = isDisabled
    ? theme.colors.action.disabledBackground
    : theme.colors.emphasize(theme.colors.background.secondary, 0.03);

  return (
    <div
      {...stylex.props(styles.item, styles.background(background, hoverBackground), isCurrent && styles.current)}
      data-testid={selectors.components.PluginVisualization.item(plugin.name)}
      onClick={isDisabled ? undefined : (ev) => onSelect(ev.metaKey || ev.ctrlKey || ev.altKey)}
      role="button"
      tabIndex={0}
      onKeyDown={
        isDisabled
          ? undefined
          : (ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                onSelect(ev.metaKey || ev.ctrlKey || ev.altKey);
              }
            }
      }
      title={
        isCurrent ? t('panel.panel-type-card.title-click-to-close', 'Click again to close this section') : plugin.name
      }
    >
      <img
        {...stylex.props(styles.img, isDisabled && styles.disabled)}
        src={plugin.info.logos.small || undefined}
        alt=""
      />

      <div {...stylex.props(styles.itemContent, isDisabled && styles.disabled)}>
        <div {...stylex.props(styles.name)}>{title}</div>
        {description ? <span {...stylex.props(styles.description)}>{description}</span> : null}
        {children}
      </div>
      {showBadge && (
        <div {...stylex.props(styles.badge, isDisabled && styles.disabled)}>
          <PanelPluginBadge plugin={plugin} />
        </div>
      )}
      {onDelete && (
        <IconButton
          name="trash-alt"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={deleteButtonStyle}
          aria-label={t(
            'panel.panel-type-card.aria-label-delete-button-on-panel-type-card',
            'Delete button on panel type card'
          )}
          tooltip={t('panel.panel-type-card.tooltip-delete', 'Delete')}
        />
      )}
    </div>
  );
};
PanelTypeCardComponent.displayName = 'PanelTypeCard';

interface SkeletonProps {
  hasDescription?: boolean;
  hasDelete?: boolean;
}

const PanelTypeCardSkeleton: SkeletonComponent<React.PropsWithChildren<SkeletonProps>> = ({
  children,
  hasDescription,
  hasDelete,
  rootProps,
}) => {
  return (
    <div {...stylex.props(styles.item, styles.itemBackground)} {...rootProps}>
      <Skeleton
        className={stylex.props(styles.img, skeletonStyles.image).className}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
      />

      <div {...stylex.props(styles.itemContent)}>
        <div {...stylex.props(styles.name)}>
          <Skeleton width={160} />
        </div>
        {hasDescription ? (
          <Skeleton containerClassName={stylex.props(styles.description).className} width={80} />
        ) : null}
        {children}
      </div>
      {hasDelete && (
        <Skeleton
          containerClassName={stylex.props(styles.deleteButton, skeletonStyles.deleteButton).className}
          width={16}
          height={16}
        />
      )}
    </div>
  );
};

export const PanelTypeCard = attachSkeleton(PanelTypeCardComponent, PanelTypeCardSkeleton);

// IconButton is StyleX and sets its own margin: override it through its inline style.
const deleteButtonStyle: React.CSSProperties = {
  cursor: 'pointer',
  marginLeft: 'auto',
};

const skeletonStyles = stylex.create({
  deleteButton: {
    lineHeight: 1,
  },
  image: {
    lineHeight: 1,
  },
});

const styles = stylex.create({
  item: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    cursor: 'pointer',
    borderRadius: shape['--gf-shape-radius-default'],
    boxShadow: shadows['--gf-shadows-z1'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-background-secondary'],
    alignItems: 'center',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    width: '100%',
    overflow: 'hidden',
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'background' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.short },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
  },
  itemBackground: {
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
  background: (background: string, hover: string) => ({
    backgroundColor: { default: background, ':hover': hover },
  }),
  itemContent: {
    overflow: 'hidden',
    position: 'relative',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  current: {
    borderColor: colors['--gf-colors-primary-border'],
  },
  disabled: {
    opacity: 0.6,
    filter: 'grayscale(1)',
    cursor: 'default',
    pointerEvents: 'none',
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: typography['--gf-typography-size-sm'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    width: '100%',
  },
  description: {
    display: 'block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-light'],
    width: '100%',
    maxHeight: '4.5em',
  },
  img: {
    maxHeight: IMAGE_SIZE,
    width: IMAGE_SIZE,
    display: 'flex',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors['--gf-colors-background-primary'],
  },
  deleteButton: {
    cursor: 'pointer',
    marginLeft: 'auto',
  },
});

interface PanelPluginBadgeProps {
  plugin: PanelPluginMeta;
}

const PanelPluginBadge = ({ plugin }: PanelPluginBadgeProps) => {
  if (isUnsignedPluginSignature(plugin.signature)) {
    return <PluginSignatureBadge status={plugin.signature} />;
  }

  return <PluginStateInfo state={plugin.state} />;
};

PanelPluginBadge.displayName = 'PanelPluginBadge';
