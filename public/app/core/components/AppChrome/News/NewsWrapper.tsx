import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { useMeasure } from 'react-use';

import { t } from '@grafana/i18n';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
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
    return <div {...stylex.props(styles.innerWrapper)}>{state.error && state.error.message}</div>;
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
      <div {...stylex.props(styles.grot)}>
        <a
          href="https://grafana.com/blog/"
          target="_blank"
          rel="noreferrer"
          title={t('news.link-title', 'Go to Grafana labs blog')}
        >
          <img {...stylex.props(styles.grotImg)} src={grotNewsSvg} alt="Grot reading news" />
        </a>
      </div>
    </div>
  );
}

const styles = stylex.create({
  innerWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  grot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['--gf-spacing-x5'],
    paddingRight: spacing['--gf-spacing-x0'],
    paddingBottom: spacing['--gf-spacing-x5'],
    paddingLeft: spacing['--gf-spacing-x0'],
  },
  grotImg: {
    width: '186px',
    height: '186px',
  },
});
