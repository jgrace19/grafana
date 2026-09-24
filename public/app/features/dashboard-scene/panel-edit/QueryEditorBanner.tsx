import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { t } from '@grafana/i18n';
import { Button, Icon, IconButton, useTheme2 } from '@grafana/ui';

import { getQueryEditorBannerColors } from './PanelEditNext/constants';
import { startIntercomSurvey, trackBannerDismiss, trackFeedbackClick } from './PanelEditNext/tracking';

import { queryEditorBannerStyles } from './QueryEditorBanner.stylex';

interface Props {
  useQueryExperienceNext: boolean;
  onToggle: () => void;
  onDismiss: () => void;
  className?: string;
}

export function QueryEditorBanner({ useQueryExperienceNext, onToggle, onDismiss, className }: Props) {
  const theme = useTheme2();
  const bannerColors = getQueryEditorBannerColors(theme);

  return (
    <div
      {...mergeStylexClassName(stylex.props(queryEditorBannerStyles.banner), clsx(className))}
      style={{
        backgroundColor: bannerColors.background,
        border: `1px solid ${bannerColors.border}`,
      }}
    >
      <div {...stylex.props(queryEditorBannerStyles.left)}>
        <Icon name="flask" size="md" style={{ color: bannerColors.accent }} />
        <span {...stylex.props(queryEditorBannerStyles.title)} style={{ color: bannerColors.accent }}>
          {useQueryExperienceNext
            ? t('dashboard-scene.query-editor-banner.downgrade-title', 'New query editor')
            : t('dashboard-scene.query-editor-banner.upgrade-title', 'New editor available')}
        </span>
        <span {...stylex.props(queryEditorBannerStyles.description)}>
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
      <div {...stylex.props(queryEditorBannerStyles.right)}>
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
          {...stylex.props(queryEditorBannerStyles.closeButton)}
          aria-label={t('dashboard-scene.query-editor-banner.dismiss', 'Dismiss')}
        />
      </div>
    </div>
  );
}
