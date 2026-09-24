import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Drawer, Text } from '@grafana/ui';
import { DEFAULT_FEED_URL } from 'app/plugins/panel/news/constants';
import grotNewsSvg from 'img/grot-news.svg';

import { NewsWrapper } from './NewsWrapper';

interface NewsContainerProps {
  className?: string;
  onClose: () => void;
}

export function NewsContainer({ onClose }: NewsContainerProps) {

  return (
    <Drawer
      title={
        <div {...stylex.props(newsDrawerStyles.title)}>
          <Text element="h2">{t('news.title', 'Latest from the blog')}</Text>
          <a
            href="https://grafana.com/blog/"
            target="_blank"
            rel="noreferrer"
            title={t('news.link-title', 'Go to Grafana labs blog')}
            {...stylex.props(newsDrawerStyles.grot)}
          >
            <img src={grotNewsSvg} alt="Grot reading news" />
          </a>
        </div>
      }
      onClose={onClose}
      size="md"
    >
      <NewsWrapper feedUrl={DEFAULT_FEED_URL} />
    </Drawer>
  );
}

