// eslint-disable-next-line no-restricted-imports -- stylex: pending Card migration (see cardOverrides)
import { css, cx } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';

import { createAssistantContextItem, useAssistant } from '@grafana/assistant';
import { t, Trans } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Badge, Box, Button, Card, IconButton, Text, TextLink, Tooltip } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { attachSkeleton, type SkeletonComponent } from '@grafana/ui/unstable';
import { type PluginDashboard } from 'app/types/plugins';

import { CompatibilityBadge, type CompatibilityState } from './CompatibilityBadge';
import { thumbnailMarker } from './markers.stylex';
import { type GnetDashboard } from './types';
import { buildAssistantPrompt, buildTemplateContextData, buildTemplateContextTitle } from './utils/assistantHelpers';

interface Details {
  id: string;
  datasource: string;
  dependencies: string[];
  publishedBy: string;
  lastUpdate: string;
  grafanaComUrl?: string;
}

interface Props {
  title: string;
  imageUrl?: string;
  dashboard: PluginDashboard | GnetDashboard;
  details?: Details;
  onClick: (customizeWithAssistant?: boolean) => void;
  onClose?: () => void;
  isLogo?: boolean; // Indicates if imageUrl is a small logo vs full screenshot
  showDatasourceProvidedBadge?: boolean;
  showCommunityBadge?: boolean;
  dimThumbnail?: boolean; // Apply 50% opacity to thumbnail when badge is shown
  kind: 'template_dashboard' | 'suggested_dashboard';
  /** Show the compact compatibility badge (replaces showCompatibilityButton) */
  showCompatibilityBadge?: boolean;
  /** State for the compatibility badge (idle, loading, success, error) */
  compatibilityState?: CompatibilityState;
  /** Handler called when Check button is clicked in the badge */
  onCompatibilityCheck?: () => void;
  /** Whether to show the "Customize with assistant" button (caller must check relevant feature flags) */
  showAssistantButton?: boolean;
}

function DashboardCardComponent({
  title,
  imageUrl,
  onClick,
  onClose,
  dashboard,
  details,
  isLogo,
  showDatasourceProvidedBadge,
  showCommunityBadge,
  dimThumbnail,
  kind,
  showCompatibilityBadge,
  compatibilityState,
  onCompatibilityCheck,
  showAssistantButton,
}: Props) {
  const isCompatibilityAppEnabled = config.featureToggles.dashboardValidatorApp;

  const detailsButton = details && (
    <Tooltip interactive={true} content={<DetailsTooltipContent details={details} />} placement="right">
      <IconButton name="info-circle" size="md" aria-label={t('dashboard-library.card.details-tooltip', 'Details')} />
    </Tooltip>
  );

  const { isAvailable: assistantAvailable, openAssistant } = useAssistant();

  // Create structured context item with template metadata for the Assistant
  const templateContext = useMemo(
    () =>
      createAssistantContextItem('structured', {
        hidden: false,
        title: buildTemplateContextTitle(dashboard, kind),
        data: buildTemplateContextData(dashboard, kind),
      }),
    [dashboard, kind]
  );

  const onUseAssistantClick = () => {
    if (assistantAvailable) {
      openAssistant?.({
        origin: 'dashboard-library/use-dashboard',
        mode: 'dashboarding',
        prompt: buildAssistantPrompt(kind),
        context: [templateContext],
        autoSend: true,
      });
      // these both closes the modal and redirects the user the the template dashboard url
      onClose?.();
      onClick?.(true);
    }
  };

  const hasCompatActions = isCompatibilityAppEnabled && showCompatibilityBadge && onCompatibilityCheck;

  return (
    <Card className={cardOverrides.card} noMargin>
      <Card.Heading className={cardOverrides.title}>
        <span {...stylex.props(styles.titleWithInfo)} role="group" aria-label={title}>
          <span {...stylex.props(styles.titleText)}>{title}</span>
          {detailsButton}
        </span>
      </Card.Heading>
      <div {...stylex.props(isLogo ? styles.logoContainer : styles.thumbnailContainer, thumbnailMarker)}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            {...stylex.props(
              isLogo ? styles.logo : styles.thumbnail,
              dimThumbnail && showDatasourceProvidedBadge && styles.dimmedImage,
              kind === 'suggested_dashboard' ? styles.thumbnailCoverImage : styles.thumbnailContainImage
            )}
            onError={(e) => {
              console.error('Failed to load image for:', title, 'URL:', imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div {...stylex.props(styles.noImage)}>
            <Trans i18nKey="dashboard-library.card.no-preview">No preview available </Trans>
          </div>
        )}
        {showDatasourceProvidedBadge && (
          <div {...stylex.props(styles.badgeContainer)}>
            <Badge
              text={t('dashboard-library.card.datasource-provided-badge', 'Data source provided')}
              color="orange"
            />
          </div>
        )}
        {showCommunityBadge && (
          <div {...stylex.props(styles.badgeContainer)}>
            <Badge text={t('dashboard-library.card.community-badge', 'Community')} color="blue" />
          </div>
        )}
        <div {...stylex.props(styles.thumbnailOverlay)}>
          <Button
            variant="secondary"
            className={stylex.props(styles.overlayButton).className}
            onClick={() => onClick()}
            aria-label={
              kind === 'template_dashboard'
                ? t('dashboard-library.card.view-template-button-label', 'View template: {{title}}', { title })
                : t('dashboard-library.card.view-dashboard-button-label', 'View dashboard: {{title}}', { title })
            }
          >
            {kind === 'template_dashboard' ? (
              <Trans i18nKey="dashboard-library.card.view-template-button">View template</Trans>
            ) : (
              <Trans i18nKey="dashboard-library.card.view-dashboard-button">View dashboard</Trans>
            )}
          </Button>
          {assistantAvailable && showAssistantButton && (
            <Button
              variant="secondary"
              className={stylex.props(styles.overlayButton).className}
              onClick={onUseAssistantClick}
              icon="ai-sparkle"
              aria-label={t(
                'dashboard-library.card.customize-with-assistant-button-label',
                'Customize with Assistant: {{title}}',
                { title }
              )}
            >
              <Trans i18nKey="dashboard-library.card.customize-with-assistant-button">Customize with Assistant</Trans>
            </Button>
          )}
        </div>
      </div>
      <div {...stylex.props(styles.bottomSection)}>
        <div title={dashboard.description}>
          <Card.Description
            data-testid="dashboard-card-description"
            className={cx(cardOverrides.description, { [cardOverrides.noDescription]: !dashboard.description })}
          >
            {dashboard.description || t('dashboard-library.dashboard-card.no-description', 'No description available')}
          </Card.Description>
        </div>
        {hasCompatActions && (
          <div {...stylex.props(styles.actionsContainer)}>
            {isCompatibilityAppEnabled && showCompatibilityBadge && onCompatibilityCheck && (
              <CompatibilityBadge
                state={compatibilityState ?? { status: 'idle' }}
                onCheck={onCompatibilityCheck}
                onRetry={onCompatibilityCheck}
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

function DetailsTooltipContent({ details }: { details: Details }) {
  const Section = ({ label, value }: { label: string; value: string }) => {
    return (
      <Box display="flex" direction="column" gap={1}>
        <Text element="p">{label}</Text>
        <Text element="p" color="secondary">
          {value}
        </Text>
      </Box>
    );
  };

  return (
    <Box display="flex">
      <Box display="flex" direction="column" gap={1} width={{ xs: 'auto', md: 340 }}>
        <Section label={t('dashboard-library.dashboard-card.details.id', 'ID')} value={details.id} />
        <Section
          label={t('dashboard-library.dashboard-card.details.datasource', 'Datasource')}
          value={details.datasource}
        />
        <Section
          label={t('dashboard-library.dashboard-card.details.dependencies', 'Dependencies')}
          value={details.dependencies.join(' | ')}
        />
        <Section
          label={t('dashboard-library.dashboard-card.details.published-by', 'Published By')}
          value={details.publishedBy}
        />
        <Section
          label={t('dashboard-library.dashboard-card.details.last-update', 'Last Update')}
          value={details.lastUpdate}
        />
        {details.grafanaComUrl && (
          <Box display="flex" direction="column" gap={1}>
            <TextLink href={details.grafanaComUrl} external>
              {t('dashboard-library.dashboard-card.details.view-on-grafana-com', 'View on Grafana.com')}
            </TextLink>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// stylex: pending Card migration. Card, Card.Heading and Card.Description set their own Emotion grid, display,
// padding and margins, which would beat a StyleX override.
const cardOverrides = {
  card: css({
    gridTemplateAreas: `
          "Thumbnail Thumbnail"
          "Heading Heading"
          "Bottom Bottom"`,
    gridTemplateRows: 'auto auto 1fr',
    gridTemplateColumns: '1fr auto',
    width: '350px',
    height: '100%',
    background: 'transparent',
    border: `1px solid ${colors['--gf-colors-border-strong']}`,
    borderRadius: shape['--gf-shape-radius-default'],
    overflow: 'hidden',
    gridGap: 0,
    padding: spacing['--gf-spacing-x1'],
  }),
  title: css({
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  description: css({
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
    fontSize: typography['--gf-typography-body-small-font-size'],
  }),
  noDescription: css({
    fontStyle: 'italic',
  }),
};

const styles = stylex.create({
  thumbnailContainer: {
    gridColumnEnd: 'Thumbnail',
    gridColumnStart: 'Thumbnail',
    gridRowEnd: 'Thumbnail',
    gridRowStart: 'Thumbnail',
    marginBottom: spacing['--gf-spacing-x1'],
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: shape['--gf-shape-radius-default'],
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: colors['--gf-colors-background-canvas'],
    position: 'relative',
    '::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      backgroundImage: 'linear-gradient(to bottom, rgba(6, 6, 6, 0) 50%, #060606 100%)',
      pointerEvents: 'none',
      zIndex: 0,
    },
  },
  thumbnailOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['--gf-spacing-x1-5'],
    padding: spacing['--gf-spacing-x2'],
    opacity: {
      default: 0,
      [stylex.when.ancestor(':hover', thumbnailMarker)]: 1,
      [stylex.when.ancestor(':focus-within', thumbnailMarker)]: 1,
    },
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.15s' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease' },
  },
  overlayButton: {
    width: '80%',
    justifyContent: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailCoverImage: {
    objectFit: 'cover',
  },
  thumbnailContainImage: {
    objectFit: 'contain',
  },
  logoContainer: {
    gridColumnEnd: 'Thumbnail',
    gridColumnStart: 'Thumbnail',
    gridRowEnd: 'Thumbnail',
    gridRowStart: 'Thumbnail',
    marginBottom: spacing['--gf-spacing-x1'],
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: shape['--gf-shape-radius-default'],
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: colors['--gf-colors-background-secondary'],
    position: 'relative',
    '::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      backgroundImage: 'linear-gradient(to bottom, rgba(6, 6, 6, 0) 26%, #060606 100%)',
      pointerEvents: 'none',
      zIndex: 0,
    },
  },
  logo: {
    objectFit: 'fill',
  },
  noImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    height: '100%',
    width: '100%',
  },
  bottomSection: {
    gridColumnEnd: 'Bottom',
    gridColumnStart: 'Bottom',
    gridRowEnd: 'Bottom',
    gridRowStart: 'Bottom',
    display: 'flex',
    flexDirection: 'column',
    wordBreak: 'break-word',
    paddingTop: '2px',
  },
  titleWithInfo: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
    maxWidth: '100%',
  },
  titleText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flexShrink: 1,
    minWidth: 0,
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginTop: 'auto',
    paddingTop: spacing['--gf-spacing-x1'],
  },
  badgeContainer: {
    position: 'absolute',
    bottom: spacing['--gf-spacing-x1'],
    right: spacing['--gf-spacing-x1'],
    zIndex: 1,
  },
  dimmedImage: {
    opacity: 0.3,
  },
});

interface DashboardCardSkeletonProps {
  showCompatibilityBadge?: boolean;
}

const DashboardCardSkeleton: SkeletonComponent<DashboardCardSkeletonProps> = ({
  rootProps,
  showCompatibilityBadge,
}) => {
  return (
    <div {...stylex.props(skeletonStyles.card)} style={rootProps.style}>
      <Skeleton containerClassName={stylex.props(skeletonStyles.thumbnail).className} height="100%" />
      <Skeleton height={22} width="70%" />
      <Skeleton height={19} width="90%" />
      {showCompatibilityBadge && <Skeleton height={33} width={100} />}
    </div>
  );
};

const skeletonStyles = stylex.create({
  card: {
    width: '350px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-strong'],
    borderRadius: shape['--gf-shape-radius-default'],
    overflow: 'hidden',
    padding: spacing['--gf-spacing-x1'],
    display: 'flex',
    flexDirection: 'column',
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    lineHeight: 1,
  },
  thumbnail: {
    display: 'block',
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: shape['--gf-shape-radius-default'],
    overflow: 'hidden',
    lineHeight: 1,
  },
});

export const DashboardCard = attachSkeleton(DashboardCardComponent, DashboardCardSkeleton);
