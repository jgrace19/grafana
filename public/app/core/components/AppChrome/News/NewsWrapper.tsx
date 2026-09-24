import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { newsWrapperStyles } from './NewsWrapper.stylex';
import { useEffect } from 'react';
import { useMeasure } from 'react-use';

import { t } from '@grafana/i18n';
import { News } from 'app/plugins/panel/news/component/News';
import { useNewsFeed } from 'app/plugins/panel/news/useNewsFeed';
import grotNewsSvg from 'img/grot-news.svg';

interface NewsWrapperProps {
  feedUrl: string;
}
export function NewsWrapper({ feedUrl }: NewsWrapperProps) {
  const { state, getNews } = useNewsFeed(feedUrl);
  const [widthRef, widthMeasure] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    getNews();
  }, [getNews]);

  if (state.error) {
    return <div {...stylex.props(newsWrapperStyles.innerWrapper)}>{state.error && state.error.message}</div>;
  }

  return (
    <div ref={widthRef}>
      {state.loading ? (
        <>
          <News.Skeleton showImage width={widthMeasure.width} />
          <News.Skeleton showImage width={widthMeasure.width} />
          <News.Skeleton showImage width={widthMeasure.width} />
          <News.Skeleton showImage width={widthMeasure.width} />
          <News.Skeleton showImage width={widthMeasure.width} />
        </>
      ) : (
        <>
          {widthMeasure.width > 0 &&
            state.value?.map((_, index) => (
              <News key={index} index={index} showImage width={widthMeasure.width} data={state.value} />
            ))}
        </>
      )}
      <div {...stylex.props(newsWrapperStyles.grot)}>
        <a
          href="https://grafana.com/blog/"
          target="_blank"
          rel="noreferrer"
          title={t('news.link-title', 'Go to Grafana labs blog')}
        >
          <img src={grotNewsSvg} alt="Grot reading news" />
        </a>
      </div>
    </div>
  );
}

