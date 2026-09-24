import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Button, Icon, IconButton, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { getQueryEditorBannerColors } from './PanelEditNext/constants';
import { startIntercomSurvey, trackBannerDismiss, trackFeedbackClick } from './PanelEditNext/tracking';

import './QueryEditorBanner.css';

interface Props {
  useQueryExperienceNext: boolean;
  onToggle: () => void;
  onDismiss: () => void;
  className?: string;
}

export function QueryEditorBanner({ useQueryExperienceNext, onToggle, onDismiss, className }: Props) {
  const bannerColors = getQueryEditorBannerColors(useTheme2());

  return (
    <div
      {...mergeStylexProps(
        stylex.props(styles.banner, styles.bannerColors(bannerColors.background, bannerColors.border)),
        {
          className,
        }
      )}
    >
      <div {...stylex.props(styles.left)}>
        <Icon name="flask" size="md" xstyle={styles.accent(bannerColors.accent)} />
        <span {...stylex.props(styles.title, styles.accent(bannerColors.accent))}>
          {useQueryExperienceNext
            ? t('dashboard-scene.query-editor-banner.downgrade-title', 'New query editor')
            : t('dashboard-scene.query-editor-banner.upgrade-title', 'New editor available')}
        </span>
        <span {...stylex.props(styles.description)}>
          {useQueryExperienceNext
            ? t(
                'dashboard-scene.query-editor-banner.description-new',
                'Welcome to the improved query editing experience.'
              )
            : t(
                'dashboard-scene.query-editor-banner.description-classic',
                'Try the improved query editing experience.'
              )}
        </span>
      </div>
      <div {...stylex.props(styles.right)}>
        {useQueryExperienceNext && (
          <Button
            variant="primary"
            fill="text"
            size="sm"
            icon="comment-alt-message"
            onClick={() => {
              trackFeedbackClick();
              startIntercomSurvey();
            }}
          >
            {t('dashboard-scene.query-editor-banner.give-feedback', 'Give feedback')}
          </Button>
        )}
        {useQueryExperienceNext ? (
          <Button
            variant="secondary"
            fill="text"
            size="sm"
            icon="arrow-left"
            onClick={() => {
              startIntercomSurvey();
              onToggle();
            }}
          >
            {t('dashboard-scene.query-editor-banner.go-back', 'Back to classic')}
          </Button>
        ) : (
          <Button variant="primary" fill="text" size="sm" icon="rocket" onClick={onToggle}>
            {t('dashboard-scene.query-editor-banner.try-it', 'Try it out')}
          </Button>
        )}
        <IconButton
          name="times"
          size="md"
          tooltip={t('dashboard-scene.query-editor-banner.dismiss', 'Dismiss')}
          onClick={() => {
            trackBannerDismiss();
            onDismiss();
          }}
          className="gf-query-editor-banner-close"
          aria-label={t('dashboard-scene.query-editor-banner.dismiss', 'Dismiss')}
        />
      </div>
    </div>
  );
}

const styles = stylex.create({
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing['--gf-spacing-x0'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x0'],
    paddingLeft: spacing['--gf-spacing-x2'],
    height: spacing['--gf-spacing-x5'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: shape['--gf-shape-radius-default'],
    flexShrink: 0,
  },
  bannerColors: (backgroundColor: string, borderColor: string) => ({ backgroundColor, borderColor }),
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1-5'],
    minWidth: 0,
  },
  accent: (color: string) => ({ color }),
  title: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    whiteSpace: 'nowrap',
  },
  description: {
    color: colors['--gf-colors-text-secondary'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    flexShrink: 0,
    marginLeft: spacing['--gf-spacing-x2'], // minimum gap when left content is wide
  },
});
